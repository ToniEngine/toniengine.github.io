/* Room networking over WebRTC data channels (PeerJS).
   Star topology: the host owns the game state and every guest holds exactly
   one connection to it. Guests never talk to each other.

   No accounts, no backend, no setup - browsers connect directly to each other.
   That works on the same network and on most home connections. Between
   networks that block a direct path (often mobile data, or two different
   countries) a connection may not be possible at all; the join error says so
   rather than leaving players guessing. */
(function (global) {
  'use strict';

  // No I/O/0/1 — they get misread when a code is typed off someone's screen.
  var ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  // Namespaces our room ids on the shared public broker, so a code here cannot
  // collide with some unrelated app's peer of the same name.
  var PREFIX = 'tenergygames-';
  var CODE_LEN = 5;

  function makeCode() {
    var out = '';
    for (var i = 0; i < CODE_LEN; i++) {
      out += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return out;
  }

  var peer = null;      // our PeerJS peer
  var conns = {};       // host side: peerId -> DataConnection
  var hostConn = null;  // guest side: connection to the host
  var role = null;      // 'host' | 'guest' | null
  var code = null;
  var handlers = {};

  function fire(name, a, b) {
    if (typeof handlers[name] === 'function') handlers[name](a, b);
  }

  function newPeer(id) {
    return new Peer(id, {
      debug: 0,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun.cloudflare.com:3478' }
        ],
        iceCandidatePoolSize: 4
      }
    });
  }

  function wireData(conn, fromId) {
    conn.on('data', function (msg) {
      if (msg && typeof msg.type === 'string') fire('message', msg, fromId);
    });
  }

  /* ── host ──────────────────────────────────────────────── */

  function host(h, attempt) {
    handlers = h || {};
    role = 'host';
    attempt = attempt || 0;

    return new Promise(function (resolve, reject) {
      var wanted = makeCode();
      var p = newPeer(PREFIX + wanted);
      var settled = false;

      p.on('open', function () {
        if (!settled) {
          settled = true;
          peer = p;
          code = wanted;
          resolve(code);
        } else if (retries) {
          retries = 0;
          fire('status', 'Reconnected. The room is open again.');
        }
      });

      p.on('connection', function (conn) {
        conn.on('open', function () {
          conns[conn.peer] = conn;
          wireData(conn, conn.peer);
          fire('peerOpen', conn.peer, (conn.metadata && conn.metadata.name) || 'Player');
        });
        var drop = function () {
          if (conns[conn.peer]) { delete conns[conn.peer]; fire('peerClose', conn.peer); }
        };
        conn.on('close', drop);
        conn.on('error', drop);
      });

      p.on('error', function (err) {
        // Code collision: pick another one and try again.
        if (!settled && err && err.type === 'unavailable-id' && attempt < 4) {
          try { p.destroy(); } catch (e) {}
          resolve(host(handlers, attempt + 1));
          return;
        }
        if (!settled) { settled = true; reject(err); return; }
        fire('error', err);
      });

      /* While the broker is down the room id is no longer registered, so
         nobody can find the room even though this tab is still open - which is
         why a drop has to be retried rather than merely announced. */
      var retries = 0;
      p.on('disconnected', function () {
        if (p.destroyed) return;
        retries++;
        if (retries > 8) {
          fire('status', 'Lost the matchmaking server. Reopen the room so players can join.');
          return;
        }
        fire('status', 'Matchmaking dropped — reconnecting (' + retries + ')…');
        // Back off so we are not hammering a service that is struggling.
        setTimeout(function () {
          try { p.reconnect(); } catch (e) {}
        }, Math.min(1000 * retries, 5000));
      });
    });
  }

  function broadcast(type, payload) {
    var msg = Object.assign({ type: type }, payload || {});
    Object.keys(conns).forEach(function (id) {
      try { conns[id].send(msg); } catch (e) {}
    });
  }

  function sendTo(id, type, payload) {
    var conn = conns[id];
    if (!conn) return;
    try { conn.send(Object.assign({ type: type }, payload || {})); } catch (e) {}
  }

  /* ── guest ─────────────────────────────────────────────── */

  function join(roomCode, name, h) {
    handlers = h || {};
    role = 'guest';
    code = String(roomCode || '').trim().toUpperCase();

    return new Promise(function (resolve, reject) {
      if (code.length !== CODE_LEN) {
        reject(new Error('That room code should be ' + CODE_LEN + ' characters.'));
        return;
      }

      var p = newPeer(undefined);
      var settled = false;
      var reachedHost = false;

      var timer = setTimeout(function () {
        if (settled) return;
        settled = true;
        try { p.destroy(); } catch (e) {}
        reject(new Error(reachedHost
          ? 'Found room ' + code + ', but could not open a direct line to the host. ' +
            'One of you is on a network that blocks this — try the same Wi-Fi, or mobile data.'
          : 'No answer from room ' + code + '. Check the code, and that the host still has the tab open.'));
      }, 25000);

      p.on('open', function () {
        peer = p;
        var conn = p.connect(PREFIX + code, {
          reliable: true,
          metadata: { name: name }
        });

        /* Watch the handshake so a stalled connection can be reported as what
           it is, rather than as a bare timeout. */
        var watch = setInterval(function () {
          var pc = conn.peerConnection;
          if (!pc) return;
          clearInterval(watch);
          if (pc.iceConnectionState && pc.iceConnectionState !== 'new') reachedHost = true;
          pc.addEventListener('iceconnectionstatechange', function () {
            var state = pc.iceConnectionState;
            if (state !== 'new') reachedHost = true;
            if (settled) return;
            if (state === 'checking') fire('status', 'Connecting…');
            else if (state === 'failed') {
              settled = true;
              clearTimeout(timer);
              try { p.destroy(); } catch (e) {}
              reject(new Error('Found room ' + code + ', but no usable connection to the host. ' +
                'Try the same Wi-Fi, or mobile data on one side.'));
            }
          });
        }, 250);
        setTimeout(function () { clearInterval(watch); }, 12000);

        conn.on('open', function () {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          clearInterval(watch);
          hostConn = conn;
          wireData(conn, 'host');
          resolve(conn);
        });

        conn.on('close', function () {
          hostConn = null;
          fire('hostClose');
        });

        conn.on('error', function (err) {
          if (!settled) { settled = true; clearTimeout(timer); reject(err); }
        });
      });

      p.on('error', function (err) {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          var msg = (err && err.type === 'peer-unavailable')
            ? 'No room called ' + code + '. Double-check the code with the host.'
            : (err && err.message) || 'Could not reach the room.';
          reject(new Error(msg));
          return;
        }
        fire('error', err);
      });
    });
  }

  function send(type, payload) {
    if (!hostConn) return;
    try { hostConn.send(Object.assign({ type: type }, payload || {})); } catch (e) {}
  }

  /* ── diagnostics ───────────────────────────────────────── */

  /* Gathers ICE candidates to see whether this network can sustain a direct
     connection at all. A srflx candidate means a peer-to-peer link has a
     chance; none means this network will very likely block it. */
  function testConnectivity(ms) {
    return new Promise(function (resolve) {
      var found = { host: 0, srflx: 0, relay: 0 };
      var pc;
      try {
        pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
      } catch (e) {
        resolve({ ok: false, error: 'WebRTC is unavailable in this browser.', found: found });
        return;
      }

      var done = false;
      var finish = function () {
        if (done) return;
        done = true;
        try { pc.close(); } catch (e) {}
        resolve({ ok: found.srflx > 0, found: found });
      };

      pc.onicecandidate = function (e) {
        if (!e.candidate) return finish();
        var type = (e.candidate.candidate.match(/ typ (\w+)/) || [])[1];
        if (type && found[type] !== undefined) found[type]++;
      };

      // A data channel is needed or no candidates are gathered at all.
      try { pc.createDataChannel('probe'); } catch (e) {}
      pc.createOffer()
        .then(function (o) { return pc.setLocalDescription(o); })
        .catch(finish);

      setTimeout(finish, ms || 8000);
    });
  }

  /* ── teardown ──────────────────────────────────────────── */

  function close() {
    detach()();
  }

  /* Drop every reference now, but hand back a teardown to run later — a
     goodbye sent in this tick still needs a moment on the wire before the
     data channel goes away. */
  function detach() {
    var oldPeer = peer, oldConns = conns;
    conns = {};
    hostConn = null;
    peer = null;
    role = null;
    code = null;
    handlers = {};
    return function () {
      Object.keys(oldConns).forEach(function (id) {
        try { oldConns[id].close(); } catch (e) {}
      });
      if (oldPeer) { try { oldPeer.destroy(); } catch (e) {} }
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
    get role() { return role; },
    get code() { return code; },
    get peerCount() { return Object.keys(conns).length; }
  };
})(window);
