/* Room networking over WebRTC data channels (PeerJS).
   Star topology: the host owns the game state and every guest holds exactly
   one connection to it. Guests never talk to each other. */
(function (global) {
  'use strict';

  // No I/O/0/1 — they get misread when a code is typed off someone's screen.
  var ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var PREFIX = 'get323quiz-';
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
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
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
        settled = true;
        peer = p;
        code = wanted;
        resolve(code);
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

      p.on('disconnected', function () {
        fire('status', 'Signalling server dropped — reconnecting…');
        try { p.reconnect(); } catch (e) {}
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
      if (code.length !== CODE_LEN) { reject(new Error('That room code should be ' + CODE_LEN + ' characters.')); return; }

      var p = newPeer(undefined);
      var settled = false;
      var timer = setTimeout(function () {
        if (!settled) {
          settled = true;
          try { p.destroy(); } catch (e) {}
          reject(new Error('No answer from room ' + code + '. Check the code, and that the host still has the tab open.'));
        }
      }, 20000);

      p.on('open', function () {
        peer = p;
        var conn = p.connect(PREFIX + code, {
          reliable: true,
          metadata: { name: name }
        });

        conn.on('open', function () {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
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
    get role() { return role; },
    get code() { return code; },
    get peerCount() { return Object.keys(conns).length; }
  };
})(window);
