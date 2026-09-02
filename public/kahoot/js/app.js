/* UI wiring and game flow.

   The host is authoritative: it owns the deck, the clock and every score, and
   guests are thin renderers that report a choice plus how long they took.
   Solo practice reuses the exact same host loop with nobody connected. */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var REVEAL_MS = 5000;    // how long the answer stays up
  var SCORE_MS = 4000;     // how long the scoreboard stays up
  var GRACE_MS = 1200;     // slack for answers still in flight when time runs out

  /* ── state ─────────────────────────────────────────────── */

  var S = {
    mode: null,          // 'host' | 'guest' | 'solo'
    myId: 'host',
    myName: 'You',
    players: {},         // id -> { name, score, streak, gain, answered, choice, elapsed, correct }
    order: [],           // player ids in join order
    deck: [],
    idx: -1,
    limitMs: 20000,
    qStartedAt: 0,
    answered: false,
    settings: { count: 20, time: 20, topics: [] },
    endedByHost: false,
    review: [],          // this client's own answer history
    pendingQ: null,      // guest: question currently on screen
    rafId: 0,
    timers: []
  };

  function clearTimers() {
    S.timers.forEach(clearTimeout);
    S.timers = [];
    if (S.rafId) { cancelAnimationFrame(S.rafId); S.rafId = 0; }
  }

  function later(fn, ms) {
    var h = setTimeout(fn, ms);
    S.timers.push(h);
    return h;
  }

  var isDriver = function () { return S.mode === 'host' || S.mode === 'solo'; };

  /* ── screens ───────────────────────────────────────────── */

  var SCREENS = ['home', 'host-setup', 'lobby', 'join', 'wait', 'countdown',
                 'question', 'reveal', 'scoreboard', 'podium', 'review'];
  var current = 'home';

  function show(name) {
    SCREENS.forEach(function (s) {
      var el = $('screen-' + s);
      if (el) el.hidden = (s !== name);
    });
    current = name;
    window.scrollTo(0, 0);
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ── setup screen ──────────────────────────────────────── */

  var topicBoxes = [];

  function buildTopics() {
    var host = $('topic-list');
    host.innerHTML = '';
    topicBoxes = Engine.topics().map(function (t) {
      var label = document.createElement('label');
      label.className = 'topic';
      label.innerHTML = '<input type="checkbox" checked>' +
        '<span>' + esc(t.name) + '</span>' +
        '<span class="count">' + t.count + '</span>';
      var box = label.querySelector('input');
      box.value = t.name;
      box.addEventListener('change', updatePool);
      host.appendChild(label);
      return box;
    });
    updatePool();
  }

  function selectedTopics() {
    return topicBoxes.filter(function (b) { return b.checked; }).map(function (b) { return b.value; });
  }

  function updatePool() {
    var topics = selectedTopics();
    var available = Engine.pool(topics).length;
    var want = parseInt($('opt-count').value, 10);
    var note = $('pool-note');
    var startBtn = $('btn-create');

    if (!topics.length) {
      note.textContent = 'Pick at least one topic.';
      note.className = 'pool-note warn';
      startBtn.disabled = true;
      return;
    }
    startBtn.disabled = false;
    if (want === 0 || want >= available) {
      note.textContent = available + ' questions in the pool — the round will use all of them.';
      note.className = 'pool-note' + (want > available ? ' warn' : '');
    } else {
      note.textContent = want + ' of ' + available + ' questions in the pool, picked at random.';
      note.className = 'pool-note';
    }
  }

  /* ── players ───────────────────────────────────────────── */

  function addPlayer(id, name) {
    if (S.players[id]) { S.players[id].name = name; return; }
    S.players[id] = { name: name, score: 0, streak: 0, gain: 0, answered: false, choice: -1, elapsed: 0, correct: false };
    S.order.push(id);
  }

  function removePlayer(id) {
    delete S.players[id];
    S.order = S.order.filter(function (p) { return p !== id; });
  }

  function roster() {
    return S.order.map(function (id) { return { id: id, name: S.players[id].name }; });
  }

  function renderChips(el, list) {
    el.innerHTML = list.map(function (p) {
      var cls = 'player-chip' + (p.id === 'host' ? ' is-host' : '') + (p.id === S.myId ? ' is-you' : '');
      return '<span class="' + cls + '">' + esc(p.name) + '</span>';
    }).join('');
  }

  function refreshLobby() {
    var list = roster();
    renderChips($('lobby-players'), list);
    var guests = list.length - 1;
    $('lobby-status').className = 'lobby-status';
    $('lobby-status').textContent = guests
      ? guests + (guests === 1 ? ' player has' : ' players have') + ' joined.'
      : 'Waiting for someone to join with the code above…';
    var btn = $('btn-start');
    btn.disabled = guests < 1;
    btn.textContent = guests < 1 ? 'Waiting for players…' : 'Start game';
  }

  /* ── host: run the round ───────────────────────────────── */

  function startRound() {
    S.deck = Engine.buildDeck({
      topics: S.settings.topics,
      count: S.settings.count
    });
    S.limitMs = S.settings.time * 1000;
    S.idx = -1;
    S.review = [];
    S.order.forEach(function (id) {
      var p = S.players[id];
      p.score = 0; p.streak = 0; p.gain = 0;
    });
    nextQuestion();
  }

  function nextQuestion() {
    clearTimers();
    S.idx++;
    if (S.idx >= S.deck.length) { finish(); return; }

    var q = S.deck[S.idx];
    S.order.forEach(function (id) {
      var p = S.players[id];
      p.answered = false; p.choice = -1; p.elapsed = S.limitMs; p.correct = false; p.gain = 0;
    });

    var payload = {
      index: S.idx,
      total: S.deck.length,
      section: q.section,
      question: q.question,
      options: q.options,
      limitMs: S.limitMs
    };
    Net.broadcast('countdown', { section: q.section, index: S.idx, total: S.deck.length });
    runCountdown(q.section, S.idx, S.deck.length, function () {
      Net.broadcast('question', payload);
      askQuestion(payload);
      later(closeQuestion, S.limitMs + (Net.peerCount ? GRACE_MS : 0));
    });
  }

  function runCountdown(section, index, total, done) {
    show('countdown');
    $('count-topic').textContent = 'Question ' + (index + 1) + ' of ' + total + ' · ' + section;
    var n = 3;
    var step = function () {
      if (n === 0) {
        $('count-number').textContent = 'GO';
        $('count-label').textContent = '';
        Sfx.play('go');
        later(done, 550);
        return;
      }
      $('count-number').textContent = n;
      $('count-label').textContent = 'Get ready…';
      // restart the zoom animation
      var el = $('count-number');
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
      Sfx.play('countdown');
      n--;
      later(step, 800);
    };
    step();
  }

  /* Everyone in? Cut the question short. */
  function maybeCloseEarly() {
    var all = S.order.every(function (id) { return S.players[id].answered; });
    if (all) { clearTimers(); later(closeQuestion, 350); }
  }

  function recordAnswer(id, choice, elapsedMs) {
    var p = S.players[id];
    if (!p || p.answered) return;
    var q = S.deck[S.idx];
    if (!q) return;

    p.answered = true;
    p.choice = (choice === 0 || choice > 0) ? choice : -1;
    p.elapsed = Math.max(0, Math.min(S.limitMs, elapsedMs));
    p.correct = p.choice === q.answer;

    var res = Engine.score(p.correct, p.elapsed, S.limitMs, p.streak);
    p.gain = res.points;
    p.streak = res.streak;
    p.score += res.points;

    maybeCloseEarly();
  }

  function closeQuestion() {
    clearTimers();
    var q = S.deck[S.idx];
    if (!q) return;

    // Anyone who never answered scores nothing and loses their streak.
    S.order.forEach(function (id) {
      var p = S.players[id];
      if (!p.answered) { p.answered = true; p.choice = -1; p.correct = false; p.gain = 0; p.streak = 0; }
    });

    var results = S.order.map(function (id) {
      var p = S.players[id];
      return { id: id, name: p.name, choice: p.choice, correct: p.correct, gain: p.gain, score: p.score, streak: p.streak };
    });

    var payload = { answer: q.answer, note: q.note, results: results };
    Net.broadcast('reveal', payload);
    showReveal(payload);

    // In a live game the round has to keep moving. Practising alone, there is
    // nobody to keep waiting, so hold the answer up until she is ready.
    if (S.mode === 'solo') return;

    later(function () {
      var rows = ranked();
      var last = S.idx >= S.deck.length - 1;
      if (last) {
        Net.broadcast('final', { rows: rows });
        showPodium(rows);
        return;
      }
      Net.broadcast('scoreboard', { rows: rows });
      showScoreboard(rows, true);
      later(nextQuestion, SCORE_MS);
    }, REVEAL_MS);
  }

  function ranked() {
    return S.order.map(function (id) {
      var p = S.players[id];
      return { id: id, name: p.name, score: p.score, gain: p.gain };
    }).sort(function (a, b) { return b.score - a.score; });
  }

  function finish() {
    var rows = ranked();
    Net.broadcast('final', { rows: rows });
    showPodium(rows);
  }

  /* ── question screen (all roles) ───────────────────────── */

  function askQuestion(q) {
    S.pendingQ = q;
    S.answered = false;
    S.limitMs = q.limitMs;

    $('q-progress').textContent = 'Q' + (q.index + 1) + '/' + q.total;
    $('q-topic').textContent = q.section;
    $('q-text').textContent = q.question;
    $('q-foot').textContent = '';

    var tiles = document.querySelectorAll('#answers .answer');
    for (var i = 0; i < tiles.length; i++) {
      tiles[i].querySelector('.atext').textContent = q.options[i];
      tiles[i].className = 'answer a' + i;
      tiles[i].disabled = false;
    }
    $('answers').classList.remove('locked');

    show('question');
    S.qStartedAt = Date.now();
    runTimer();
  }

  function runTimer() {
    var fill = $('timer-fill');
    var num = $('timer-num');
    var lastTick = -1;

    var frame = function () {
      var elapsed = Date.now() - S.qStartedAt;
      var left = Math.max(0, S.limitMs - elapsed);
      var frac = left / S.limitMs;
      fill.style.transform = 'scaleX(' + frac + ')';

      var secs = Math.ceil(left / 1000);
      if (secs !== lastTick) {
        num.textContent = secs;
        num.classList.toggle('low', secs <= 5 && secs > 0);
        if (secs <= 5 && secs > 0 && lastTick !== -1 && !S.answered) Sfx.play('tick');
        lastTick = secs;
      }

      if (left <= 0) {
        S.rafId = 0;
        if (!S.answered) {
          S.answered = true;
          lockAnswers(-1);
          $('q-foot').textContent = "Time! No answer from you.";
          Sfx.play('timeup');
          if (isDriver()) recordAnswer(S.myId, -1, S.limitMs);
        }
        return;
      }
      S.rafId = requestAnimationFrame(frame);
    };
    S.rafId = requestAnimationFrame(frame);
  }

  function lockAnswers(picked) {
    var tiles = document.querySelectorAll('#answers .answer');
    for (var i = 0; i < tiles.length; i++) {
      tiles[i].disabled = true;
      if (i === picked) tiles[i].classList.add('picked');
      else tiles[i].classList.add('dim');
    }
    $('answers').classList.add('locked');
  }

  function pickAnswer(choice) {
    if (S.answered || current !== 'question') return;
    var elapsed = Math.max(0, Math.min(S.limitMs, Date.now() - S.qStartedAt));
    S.answered = true;
    lockAnswers(choice);
    Sfx.play('pick');
    $('q-foot').textContent = 'Locked in — waiting for everyone else…';

    if (isDriver()) recordAnswer(S.myId, choice, elapsed);
    else Net.send('answer', { index: S.pendingQ.index, choice: choice, elapsed: elapsed });
  }

  /* ── reveal ────────────────────────────────────────────── */

  function showReveal(data) {
    clearTimers();
    var q = S.pendingQ;
    var mine = null;
    data.results.forEach(function (r) { if (r.id === S.myId) mine = r; });

    var got = mine && mine.correct;
    var v = $('verdict');
    v.textContent = got ? 'Correct!' : (mine && mine.choice === -1 ? "Time's up" : 'Not quite');
    v.className = 'verdict ' + (got ? 'good' : 'bad');

    var pts = $('verdict-points');
    if (got) {
      var streakText = mine.streak > 1 ? '  ·  ' + mine.streak + ' in a row' : '';
      pts.textContent = '+' + mine.gain + ' points' + streakText;
    } else {
      pts.textContent = mine && mine.choice === -1 ? 'No points this round.' : '+0 points';
    }

    $('correct-text').textContent = String.fromCharCode(65 + data.answer) + '.  ' + q.options[data.answer];

    var note = $('reveal-note');
    if (data.note) { note.textContent = data.note; note.hidden = false; }
    else { note.hidden = true; }

    // Per-player tally, only worth showing when there is more than one player.
    var tally = $('tally');
    if (data.results.length > 1) {
      tally.innerHTML = data.results.map(function (r) {
        return '<div class="tally-row"><span class="mark">' + (r.correct ? '✅' : '❌') + '</span>' +
               '<span>' + esc(r.name) + '</span>' +
               '<span class="pts">+' + r.gain + '</span></div>';
      }).join('');
      tally.hidden = false;
    } else {
      tally.innerHTML = '';
      tally.hidden = true;
    }

    S.review.push({
      question: q.question,
      section: q.section,
      options: q.options,
      answer: data.answer,
      picked: mine ? mine.choice : -1,
      note: data.note || ''
    });

    Sfx.play(got ? 'correct' : 'wrong');

    var next = $('btn-next');
    next.hidden = !isDriver();
    if (S.mode === 'solo') {
      var last = S.idx >= S.deck.length - 1;
      next.textContent = last ? 'See my results' : 'Next question';
      $('reveal-wait').textContent = 'Take your time — read it over, then carry on.';
    } else {
      next.textContent = 'Next question';
      $('reveal-wait').textContent = isDriver() ? '' : 'Next question coming up…';
    }
    show('reveal');
  }

  /* ── scoreboard & podium ───────────────────────────────── */

  function renderRows(el, rows, showDelta) {
    el.innerHTML = rows.map(function (r, i) {
      var you = r.id === S.myId ? ' is-you' : '';
      var delta = (showDelta && r.gain) ? '<span class="delta">+' + r.gain + '</span>' : '';
      return '<li class="' + you.trim() + '"><span class="rank">' + (i + 1) + '</span>' +
             '<span class="name">' + esc(r.name) + '</span>' + delta +
             '<span class="pts">' + r.score + '</span></li>';
    }).join('');
  }

  function showScoreboard(rows, driver) {
    clearTimers();
    renderRows($('scoreboard'), rows, true);
    $('score-wait').textContent = driver ? '' : 'Waiting for the host…';
    $('btn-continue').hidden = !driver;
    show('scoreboard');
  }

  function showPodium(rows) {
    clearTimers();
    renderRows($('podium'), rows, false);

    var mine = null, myRank = 0;
    rows.forEach(function (r, i) { if (r.id === S.myId) { mine = r; myRank = i + 1; } });

    var total = S.review.length;
    var right = S.review.filter(function (r) { return r.picked === r.answer; }).length;
    var pct = total ? Math.round((right / total) * 100) : 0;

    var line = 'You got ' + right + ' of ' + total + ' right (' + pct + '%).';
    if (rows.length > 1 && mine) {
      var tied = rows.filter(function (r) { return r.score === mine.score; }).length > 1;
      line += myRank === 1 && !tied ? '  🏆 You win!' : (tied && myRank === 1 ? '  🤝 Dead heat!' : '  You placed ' + myRank + ' of ' + rows.length + '.');
    }
    $('podium-summary').textContent = line;
    $('podium-title').textContent = rows.length > 1 ? 'Final scores' : 'Round complete';
    $('btn-again').hidden = !isDriver();
    Sfx.play('finish');
    show('podium');
  }

  function showReview() {
    var list = $('review-list');
    if (!S.review.length) {
      list.innerHTML = '<p class="review-empty">Nothing to review yet.</p>';
    } else {
      list.innerHTML = S.review.map(function (r, i) {
        var ok = r.picked === r.answer;
        var yours = r.picked >= 0
          ? '<p class="review-line ' + (ok ? 'good' : 'bad') + '">Your answer: <b>' +
            String.fromCharCode(65 + r.picked) + '. ' + esc(r.options[r.picked]) + '</b></p>'
          : '<p class="review-line bad">Your answer: <b>ran out of time</b></p>';
        var correct = ok ? '' :
          '<p class="review-line good">Correct: <b>' + String.fromCharCode(65 + r.answer) + '. ' +
          esc(r.options[r.answer]) + '</b></p>';
        var note = r.note ? '<p class="note">' + esc(r.note) + '</p>' : '';
        return '<article class="review-item' + (ok ? ' ok' : '') + '">' +
               '<p class="review-q">' + (i + 1) + '. ' + esc(r.question) + '</p>' +
               yours + correct + note + '</article>';
      }).join('');
    }
    show('review');
  }

  /* ── guest: handle host messages ───────────────────────── */

  function onHostMessage(msg) {
    switch (msg.type) {
      case 'welcome':
        S.myId = msg.you;
        S.players = {};
        S.order = [];
        msg.players.forEach(function (p) { addPlayer(p.id, p.name); });
        renderChips($('wait-players'), roster());
        show('wait');
        break;

      case 'lobby':
        S.players = {};
        S.order = [];
        msg.players.forEach(function (p) { addPlayer(p.id, p.name); });
        renderChips($('wait-players'), roster());
        $('wait-title').textContent = "You're in!";
        $('wait-text').textContent = 'Hang tight — the host starts the game.';
        show('wait');
        Sfx.play('join');
        break;

      case 'countdown':
        S.review = msg.index === 0 ? [] : S.review;
        runCountdown(msg.section, msg.index, msg.total, function () {});
        break;

      case 'question':
        clearTimers();
        askQuestion(msg);
        break;

      case 'reveal':
        showReveal(msg);
        break;

      case 'scoreboard':
        showScoreboard(msg.rows, false);
        break;

      case 'final':
        showPodium(msg.rows);
        break;

      case 'bye':
        clearTimers();
        S.endedByHost = true;
        Net.close();
        $('join-status').className = 'lobby-status error';
        $('join-status').textContent = 'The host ended the game.';
        show('join');
        break;
    }
  }

  /* ── host: handle guest messages ───────────────────────── */

  function onGuestMessage(msg, fromId) {
    if (msg.type === 'answer') {
      if (msg.index !== S.idx) return;   // stale answer from a previous question
      recordAnswer(fromId, msg.choice, msg.elapsed);
    }
  }

  /* ── entry points ──────────────────────────────────────── */

  function readSettings() {
    S.settings = {
      count: parseInt($('opt-count').value, 10),
      time: parseInt($('opt-time').value, 10),
      topics: selectedTopics()
    };
  }

  function startSolo() {
    readSettings();
    if (!S.settings.topics.length) return;
    Sfx.unlock();
    S.mode = 'solo';
    S.myId = 'host';
    S.myName = 'You';
    S.players = {};
    S.order = [];
    addPlayer('host', 'You');
    startRound();
  }

  function createRoom() {
    readSettings();
    if (!S.settings.topics.length) return;
    Sfx.unlock();
    S.mode = 'host';
    S.myId = 'host';
    S.myName = 'Host';
    S.players = {};
    S.order = [];
    addPlayer('host', 'Host');

    show('lobby');
    $('lobby-code').textContent = '·····';
    $('lobby-status').textContent = 'Opening the room…';
    $('btn-start').disabled = true;

    Net.host({
      peerOpen: function (id, name) {
        addPlayer(id, uniqueName(name));
        Net.sendTo(id, 'welcome', { you: id, players: roster() });
        Net.broadcast('lobby', { players: roster() });
        refreshLobby();
        Sfx.play('join');
      },
      peerClose: function (id) {
        removePlayer(id);
        Net.broadcast('lobby', { players: roster() });
        if (current === 'lobby') refreshLobby();
      },
      message: onGuestMessage,
      status: function (text) { $('lobby-status').textContent = text; },
      error: function () {}
    }).then(function (code) {
      $('lobby-code').textContent = code;
      refreshLobby();
    }).catch(function (err) {
      $('lobby-status').className = 'lobby-status error';
      $('lobby-status').textContent = 'Could not open a room: ' + (err && err.message ? err.message : 'network error') +
        '. Check your connection and try again.';
    });
  }

  function uniqueName(name) {
    var base = String(name || 'Player').trim().slice(0, 14) || 'Player';
    var taken = {};
    S.order.forEach(function (id) { taken[S.players[id].name.toLowerCase()] = true; });
    var out = base, n = 2;
    while (taken[out.toLowerCase()]) { out = base + ' ' + n++; }
    return out;
  }

  function joinRoom(e) {
    e.preventDefault();
    var code = $('join-code').value.trim().toUpperCase();
    var name = $('join-name').value.trim().slice(0, 14) || 'Player';
    Sfx.unlock();

    $('btn-join').disabled = true;
    $('join-status').className = 'lobby-status';
    $('join-status').textContent = 'Connecting to ' + code + '…';

    S.mode = 'guest';
    S.myName = name;
    S.endedByHost = false;

    Net.join(code, name, {
      message: onHostMessage,
      hostClose: function () {
        if (S.endedByHost) return;   // the 'bye' handler already said what happened
        clearTimers();
        $('btn-join').disabled = false;
        $('join-status').className = 'lobby-status error';
        $('join-status').textContent = 'Lost the connection to the host.';
        show('join');
      },
      error: function () {}
    }).then(function () {
      $('btn-join').disabled = false;
      $('join-status').textContent = '';
      $('wait-title').textContent = "You're in!";
      show('wait');
    }).catch(function (err) {
      $('btn-join').disabled = false;
      $('join-status').className = 'lobby-status error';
      $('join-status').textContent = err && err.message ? err.message : 'Could not join that room.';
      Net.close();
      S.mode = null;
    });
  }

  function goHome() {
    clearTimers();
    if (S.mode === 'host') {
      Net.broadcast('bye', {});
      Net.closeSoon(400);   // let the goodbye reach everyone before the channel dies
    } else {
      Net.close();
    }
    S.mode = null;
    S.players = {};
    S.order = [];
    S.deck = [];
    S.review = [];
    S.idx = -1;
    show('home');
  }

  function playAgain() {
    if (!isDriver()) return;
    if (S.mode === 'host' && !Net.peerCount) {
      // Everyone left — drop back to the lobby rather than starting alone.
      refreshLobby();
      show('lobby');
      return;
    }
    startRound();
  }

  /* ── copy helpers ──────────────────────────────────────── */

  function joinLink() {
    var base = location.origin + location.pathname;
    return base + '?room=' + (Net.code || '');
  }

  function copy(text, btn, done) {
    var restore = btn.textContent;
    var ok = function () {
      btn.textContent = done;
      setTimeout(function () { btn.textContent = restore; }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, function () { prompt('Copy this:', text); });
    } else {
      prompt('Copy this:', text);
    }
  }

  /* ── events ────────────────────────────────────────────── */

  function wire() {
    document.querySelectorAll('[data-go]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-go');
        Sfx.play('click');
        if (target === 'home') { goHome(); return; }
        if (target === 'solo-setup') {
          $('setup-title').textContent = 'Practice solo';
          $('btn-create').textContent = 'Start practice';
          $('btn-create').dataset.solo = '1';
          show('host-setup');
          return;
        }
        if (target === 'host-setup') {
          $('setup-title').textContent = 'Host a game';
          $('btn-create').textContent = 'Create room';
          delete $('btn-create').dataset.solo;
          show('host-setup');
          return;
        }
        show(target);
      });
    });

    $('btn-create').addEventListener('click', function () {
      if ($('btn-create').dataset.solo) startSolo();
      else createRoom();
    });

    $('opt-count').addEventListener('change', updatePool);
    $('btn-topics-all').addEventListener('click', function () {
      topicBoxes.forEach(function (b) { b.checked = true; });
      updatePool();
    });
    $('btn-topics-none').addEventListener('click', function () {
      topicBoxes.forEach(function (b) { b.checked = false; });
      updatePool();
    });

    $('join-form').addEventListener('submit', joinRoom);
    $('join-code').addEventListener('input', function () {
      this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    });

    $('btn-start').addEventListener('click', function () {
      Sfx.play('click');
      startRound();
    });

    $('btn-copy-code').addEventListener('click', function () { copy(Net.code || '', this, 'Copied!'); });
    $('btn-copy-link').addEventListener('click', function () { copy(joinLink(), this, 'Link copied!'); });

    $('btn-next').addEventListener('click', function () {
      if (!isDriver()) return;
      Sfx.play('click');
      clearTimers();
      var rows = ranked();
      if (S.mode === 'solo') {
        if (S.idx >= S.deck.length - 1) showPodium(rows);
        else nextQuestion();
        return;
      }
      if (S.idx >= S.deck.length - 1) {
        Net.broadcast('final', { rows: rows });
        showPodium(rows);
      } else {
        Net.broadcast('scoreboard', { rows: rows });
        showScoreboard(rows, true);
        later(nextQuestion, SCORE_MS);
      }
    });

    $('btn-continue').addEventListener('click', function () {
      if (!isDriver()) return;
      clearTimers();
      nextQuestion();
    });

    $('btn-again').addEventListener('click', function () { Sfx.play('click'); playAgain(); });
    $('btn-review').addEventListener('click', function () { Sfx.play('click'); showReview(); });
    $('btn-review-back').addEventListener('click', function () { show('podium'); });

    document.querySelectorAll('#answers .answer').forEach(function (tile) {
      tile.addEventListener('click', function () {
        pickAnswer(parseInt(tile.dataset.choice, 10));
      });
    });

    // Keys 1-4 / A-D answer the question.
    document.addEventListener('keydown', function (e) {
      if (current !== 'question' || e.metaKey || e.ctrlKey || e.altKey) return;
      var k = e.key.toUpperCase();
      var idx = '1234'.indexOf(k);
      if (idx === -1) idx = 'ABCD'.indexOf(k);
      if (idx !== -1) { e.preventDefault(); pickAnswer(idx); }
    });

    var sound = $('btn-sound');
    var paintSound = function () {
      sound.textContent = Sfx.enabled ? '🔊' : '🔇';
      sound.classList.toggle('muted', !Sfx.enabled);
    };
    sound.addEventListener('click', function () { Sfx.setEnabled(!Sfx.enabled); paintSound(); });
    paintSound();

    // Warn the host before a refresh nukes the room mid-game.
    window.addEventListener('beforeunload', function (e) {
      if (S.mode === 'host' && Net.peerCount) { e.preventDefault(); e.returnValue = ''; }
    });
  }

  /* ── boot ──────────────────────────────────────────────── */

  function boot() {
    if (!window.QUESTIONS || !window.QUESTIONS.length) {
      document.body.innerHTML = '<p style="padding:40px;font:16px sans-serif;color:#fff">' +
        'Question bank failed to load — check that js/questions.js is present.</p>';
      return;
    }
    buildTopics();
    wire();

    var room = new URLSearchParams(location.search).get('room');
    if (room) {
      $('join-code').value = room.toUpperCase().slice(0, 5);
      show('join');
      $('join-name').focus();
    } else {
      show('home');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
