/* Room networking over Supabase Realtime.
   Star topology: the host owns the game state and guests only ever talk to it.

   Every client connects OUTBOUND to Supabase, so there is no NAT traversal and
   no peer-to-peer handshake. That is the whole point of this transport - the
   previous WebRTC one needed both a signalling broker and a TURN relay, and
   free public instances of each proved unreliable, so players on different
   networks frequently could not connect at all.

   The Net API is unchanged from that version, so the game code above it did
   not have to move. */
(function (global) {
  'use strict';

  // No I/O/0/1 — they get misread when a code is typed off someone's screen.
  var ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var CODE_LEN = 5;
  var ROOM = 'tenergy-room-';

  function makeCode() {
    var out = '';
    for (var i = 0; i < CODE_LEN; i++) {
      out += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return out;
  }

  function makeId() {
    return 'p' + Math.random().toString(36).slice(2, 10);
  }

  var client = null;    // Supabase client
  var channel = null;   // the room's realtime channel
  var myId = null;
  var guests = {};      // host side: id -> name
  var role = null;      // 'host' | 'guest' | null
  var code = null;
  var handlers = {};

  function fire(name, a, b) {
    if (typeof handlers[name] === 'function') handlers[name](a, b);
  }

  /* ── configuration ─────────────────────────────────────── */

  function settings() {
    try {
      var saved = localStorage.getItem('tenergy-supabase');
      if (saved) {
        var parsed = JSON.parse(saved);
        if (parsed && parsed.url && parsed.anonKey) return parsed;
      }
    } catch (e) { /* unreadable storage — fall through to the bundled config */ }
    var cfg = global.TENERGY_SUPABASE || {};
    return { url: cfg.url || '', anonKey: cfg.anonKey || '' };
  }

  function configured() {
    var s = settings();
    return !!(s.url && s.anonKey);
  }

  var NOT_CONFIGURED =
    'Multiplayer is not set up yet. Add your Supabase project URL and anon key ' +
    'to js/config.js, or run Net.setServer(url, key) in the browser console.';

  function getClient() {
    if (client) return client;
    if (!configured()) throw new Error(NOT_CONFIGURED);
    if (!global.supabase || !global.supabase.createClient) {
      throw new Error('The Supabase library did not load. Check your connection and reload.');
    }
    var s = settings();
    client = global.supabase.createClient(s.url, s.anonKey, {
      realtime: { params: { eventsPerSecond: 20 } }
    });
    return client;
  }

  /* ── channel plumbing ──────────────────────────────────── */

  /* One event carries every message. `to` addresses it: absent means everyone,
     'host' means the host, otherwise a specific guest id. Supabase echoes
     nothing back to the sender, so no self-filtering is needed. */
  function openChannel(roomCode, presence) {
    var sb = getClient();
    var ch = sb.channel(ROOM + roomCode, {
      config: {
        broadcast: { self: false, ack: false },
        presence: { key: myId }
      }
    });

    ch.on('broadcast', { event: 'msg' }, function (e) {
      var msg = e && e.payload;
      if (!msg || typeof msg.type !== 'string') return;
      var to = msg.to;
      if (to && to !== myId && !(to === 'host' && role === 'host')) return;
      fire('message', msg, msg.from || 'host');
    });

    return ch;
  }

  function post(payload) {
    if (!channel) return;
    try {
      channel.send({ type: 'broadcast', event: 'msg', payload: payload });
    } catch (e) { /* a dropped message is not worth tearing the room down for */ }
  }

  function presenceList(ch) {
    var state = {};
    try { state = ch.presenceState() || {}; } catch (e) { return []; }
    return Object.keys(state).map(function (key) {
      var entries = state[key] || [];
      var meta = entries[entries.length - 1] || {};
      return { id: key, role: meta.role, name: meta.name };
    });
  }

  /* ── host ──────────────────────────────────────────────── */

  function host(h, attempt) {
    handlers = h || {};
    role = 'host';
    myId = makeId();
    attempt = attempt || 0;

    return new Promise(function (resolve, reject) {
      var wanted = makeCode();
      var ch;
      try { ch = openChannel(wanted, true); } catch (e) { reject(e); return; }

      var settled = false;
      var timer = setTimeout(function () {
        if (settled) return;
        settled = true;
        try { getClient().removeChannel(ch); } catch (e) {}
        reject(new Error('Could not reach the game server. Check your connection and try again.'));
      }, 15000);

      ch.on('presence', { event: 'join' }, function (e) {
        (e.newPresences || []).forEach(function (p) {
          if (p.role !== 'guest' || guests[p.id]) return;
          guests[p.id] = p.name || 'Player';
          fire('peerOpen', p.id, guests[p.id]);
        });
      });

      ch.on('presence', { event: 'leave' }, function (e) {
        (e.leftPresences || []).forEach(function (p) {
          if (!guests[p.id]) return;
          delete guests[p.id];
          fire('peerClose', p.id);
        });
      });

      ch.subscribe(function (status) {
        if (status === 'SUBSCRIBED') {
          ch.track({ id: myId, role: 'host' }).then(function () {
            /* Two hosts could pick the same code. Presence settles a moment
               after tracking, so look then and stand down if someone was
               already there — the earlier host keeps the code. */
            setTimeout(function () {
              if (settled) return;
              var others = presenceList(ch).filter(function (p) {
                return p.role === 'host' && p.id !== myId;
              });
              if (others.length && attempt < 4) {
                settled = true;
                clearTimeout(timer);
                try { getClient().removeChannel(ch); } catch (e) {}
                resolve(host(handlers, attempt + 1));
                return;
              }
              settled = true;
              clearTimeout(timer);
              channel = ch;
              code = wanted;
              resolve(code);
            }, 700);
          });
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          if (settled) { fire('status', 'Connection to the game server was lost — retrying…'); return; }
          settled = true;
          clearTimeout(timer);
          reject(new Error('Could not open a room on the game server. Check your connection.'));
        } else if (status === 'CLOSED' && settled) {
          fire('status', 'Connection closed.');
        }
      });
    });
  }

  function broadcast(type, payload) {
    post(Object.assign({ type: type, from: myId }, payload || {}));
  }

  function sendTo(id, type, payload) {
    post(Object.assign({ type: type, from: myId, to: id }, payload || {}));
  }

  /* ── guest ─────────────────────────────────────────────── */

  function join(roomCode, name, h) {
    handlers = h || {};
    role = 'guest';
    myId = makeId();
    code = String(roomCode || '').trim().toUpperCase();

    return new Promise(function (resolve, reject) {
      if (code.length !== CODE_LEN) {
        reject(new Error('That room code should be ' + CODE_LEN + ' characters.'));
        return;
      }

      var ch;
      try { ch = openChannel(code, true); } catch (e) { reject(e); return; }

      var settled = false;
      var hostSeen = false;

      var timer = setTimeout(function () {
        if (settled) return;
        settled = true;
        try { getClient().removeChannel(ch); } catch (e) {}
        reject(new Error('No room called ' + code + '. Check the code, and that the host still has the tab open.'));
      }, 15000);

      var lookForHost = function () {
        if (settled || hostSeen) return;
        var found = presenceList(ch).some(function (p) { return p.role === 'host'; });
        if (!found) return;
        hostSeen = true;
        settled = true;
        clearTimeout(timer);
        channel = ch;
        resolve(ch);
      };

      ch.on('presence', { event: 'sync' }, lookForHost);
      ch.on('presence', { event: 'join' }, lookForHost);

      ch.on('presence', { event: 'leave' }, function (e) {
        var hostLeft = (e.leftPresences || []).some(function (p) { return p.role === 'host'; });
        if (hostLeft && hostSeen) fire('hostClose');
      });

      ch.subscribe(function (status) {
        if (status === 'SUBSCRIBED') {
          ch.track({ id: myId, role: 'guest', name: name }).then(lookForHost);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          if (settled) { fire('error', new Error('Connection lost.')); return; }
          settled = true;
          clearTimeout(timer);
          reject(new Error('Could not reach the game server. Check your connection and try again.'));
        }
      });
    });
  }

  function send(type, payload) {
    post(Object.assign({ type: type, from: myId, to: 'host' }, payload || {}));
  }

  /* ── diagnostics ───────────────────────────────────────── */

  /* Confirms the game server is reachable from this network, which is the only
     thing multiplayer now depends on. */
  function testConnectivity(ms) {
    return new Promise(function (resolve) {
      if (!configured()) {
        resolve({ ok: false, configured: false, error: NOT_CONFIGURED });
        return;
      }

      var sb, probe;
      try {
        sb = getClient();
        probe = sb.channel('tenergy-probe-' + makeId());
      } catch (e) {
        resolve({ ok: false, configured: true, error: e.message });
        return;
      }

      var done = false;
      var finish = function (ok, error) {
        if (done) return;
        done = true;
        try { sb.removeChannel(probe); } catch (e) {}
        resolve({ ok: ok, configured: true, error: error });
      };

      probe.subscribe(function (status) {
        if (status === 'SUBSCRIBED') finish(true);
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          finish(false, 'The game server refused the connection.');
        }
      });

      setTimeout(function () { finish(false, 'The game server did not respond.'); }, ms || 10000);
    });
  }

  /* ── teardown ──────────────────────────────────────────── */

  function close() {
    detach()();
  }

  /* Drop every reference now, but hand back a teardown to run later — a
     goodbye sent in this tick still needs a moment on the wire before the
     channel goes away. */
  function detach() {
    var oldChannel = channel;
    channel = null;
    guests = {};
    role = null;
    code = null;
    myId = null;
    handlers = {};
    return function () {
      if (!oldChannel) return;
      try { getClient().removeChannel(oldChannel); } catch (e) {}
    };
  }

  function closeSoon(ms) {
    setTimeout(detach(), ms || 300);
  }

  global.Net = {
    host: host,
    join: join,
    send: send,
    sendTo: sendTo,
    broadcast: broadcast,
    close: close,
    closeSoon: closeSoon,
    testConnectivity: testConnectivity,
    configured: configured,
    /* Point this device at a Supabase project without editing any files. */
    setServer: function (url, anonKey) {
      try {
        if (url && anonKey) {
          localStorage.setItem('tenergy-supabase', JSON.stringify({ url: url, anonKey: anonKey }));
        } else {
          localStorage.removeItem('tenergy-supabase');
        }
        client = null;
        return true;
      } catch (e) { return false; }
    },
    get role() { return role; },
    get code() { return code; },
    get peerCount() { return Object.keys(guests).length; }
  };
})(window);
