/* Pure game rules: deck building, option shuffling and scoring.
   No DOM, no network — so it can be reasoned about (and tested) on its own. */
(function (global) {
  'use strict';

  var BANK = global.QUESTIONS || [];

  /* Small seeded PRNG so a deck can be reproduced from its seed. */
  function rng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(arr, rand) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* Topics in bank order, with question counts. */
  function topics() {
    var seen = [], counts = {};
    BANK.forEach(function (q) {
      if (counts[q.section] === undefined) { counts[q.section] = 0; seen.push(q.section); }
      counts[q.section]++;
    });
    return seen.map(function (name) { return { name: name, count: counts[name] }; });
  }

  function pool(selectedTopics) {
    if (!selectedTopics || !selectedTopics.length) return BANK.slice();
    var want = {};
    selectedTopics.forEach(function (t) { want[t] = true; });
    return BANK.filter(function (q) { return want[q.section]; });
  }

  /* Build the round's deck.
     The source bank answers land on "B" 146 times out of 200, so options are
     shuffled per question and the correct index remapped — otherwise a player
     could just hammer the second tile all game. */
  function buildDeck(opts) {
    opts = opts || {};
    var seed = opts.seed === undefined ? (Math.random() * 4294967296) >>> 0 : opts.seed;
    var rand = rng(seed);
    var picked = shuffle(pool(opts.topics), rand);
    var count = opts.count > 0 ? Math.min(opts.count, picked.length) : picked.length;
    picked = picked.slice(0, count);

    return picked.map(function (q) {
      var order = shuffle([0, 1, 2, 3], rand);
      return {
        id: q.id,
        section: q.section,
        question: q.question,
        options: order.map(function (i) { return q.options[i]; }),
        answer: order.indexOf(q.answer),
        note: q.note || ''
      };
    });
  }

  /* Kahoot-style scoring: full marks for an instant answer, halved at the
     buzzer, zero when wrong or unanswered. A run of correct answers adds a
     streak bonus of +100 each, capped at +500. */
  var MAX_POINTS = 1000;
  var STREAK_STEP = 100;
  var STREAK_CAP = 500;

  function score(correct, elapsedMs, limitMs, streakBefore) {
    if (!correct) return { points: 0, base: 0, bonus: 0, streak: 0 };
    var frac = Math.max(0, Math.min(1, elapsedMs / limitMs));
    var base = Math.round(MAX_POINTS * (1 - frac / 2));
    var streak = (streakBefore || 0) + 1;
    var bonus = Math.min(STREAK_CAP, Math.max(0, streak - 1) * STREAK_STEP);
    return { points: base + bonus, base: base, bonus: bonus, streak: streak };
  }

  global.Engine = {
    bank: BANK,
    topics: topics,
    pool: pool,
    buildDeck: buildDeck,
    score: score,
    shuffle: shuffle,
    rng: rng,
    MAX_POINTS: MAX_POINTS
  };
})(window);
