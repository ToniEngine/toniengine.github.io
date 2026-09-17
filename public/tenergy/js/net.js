/* Room networking over WebRTC data channels (PeerJS).
   Star topology: the host owns the game state and every guest holds exactly
   one connection to it. Guests never talk to each other. */
(function (global) {
  'use strict';

  // No I/O/0/1 — they get misread when a code is typed off someone's screen.
  var ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  // Namespaces our room ids on the shared public broker, so a code here can't
  // collide with some unrelated app's peer of the same name.
  var PREFIX = 'tenergygames-';
  var CODE_LEN = 5;

  /* ICE servers.
     STUN alone only works when both ends can be hole-punched. Behind symmetric
     NAT or CGNAT — the norm on mobile data and on plenty of home ISPs — that
     fails, and the only way through is a TURN relay that both sides can reach.
     Without TURN a same-wifi game connects fine while a cross-country one just
     times out, which is exactly the failure this list exists to prevent.

     The defaults below are a free, rate-limited public relay: fine for a casual
     game, not something to depend on. To use your own, set window.TENERGY_ICE
     (see README) — it replaces this list wholesale. */
  /* STUN only. There is deliberately no TURN server here.

     Free public TURN relays do not survive: the widely-cited
     openrelay.metered.ca endpoints stopped resolving in DNS, and shipping a
     dead relay is worse than shipping none - every join attempt then waits out
     the full timeout before failing. So the default is honest about what it is,
     and the app tells players plainly when no relay is configured.

     Supply your own with Net.setIceServers() or the in-app Connection setup
     (see README). Without one, players on restrictive networks cannot connect. */
  var DEFAULT_ICE = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun.cloudflare.com:3478' }
  ];

  function hasRelay(list) {
    return (list || []).some(function (s) {
      var u = s && s.urls;
      var all = Array.isArray(u) ? u.join(' ') : String(u || '');
      return /^turns?:/.test(all.trim()) || / turns?:/.test(all);
    });
  }

  function iceServers() {
    var custom = global.TENERGY_ICE;
    if (custom && custom.length) return custom;
    try {
      var saved = localStorage.getItem('tenergy-ice');
      if (saved) {
        var parsed = JSON.parse(saved);
        if (parsed && parsed.length) return parsed;
      }
    } catch (e) { /* unreadable storage — fall through to the defaults */ }
    return DEFAULT_ICE;
  }

  /* What the last connection attempt actually did, for diagnosis. */
  var lastDiag = { brokerOpen: false, hostFound: false, iceState: null, relayUsed: null };

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
        iceServers: iceServers(),
        // Gather candidates early so the offer is ready the moment it is needed.
        iceCandidatePoolSize: 4
      }
    });
  }

  /* Watch the underlying RTCPeerConnection so a stalled handshake can be
     reported as what it is, rather than as a bare timeout. */
  function watchIce(conn, onState) {
    var attach = function () {
      var pc = conn.peerConnection;
      if (!pc) return false;
      var report = function () {
        lastDiag.iceState = pc.iceConnectionState;
        if (onState) onState(pc.iceConnectionState);
      };
      pc.addEventListener('iceconnectionstatechange', report);
      report();
      return true;
    };

    // peerConnection is created asynchronously, so poll briefly for it.
    if (attach()) return;
    var tries = 0;
    var t = setInterval(function () {
      if (attach() || ++tries > 40) clearInterval(t);
    }, 250);
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
        watchIce(conn, null);
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

      /* The public PeerJS broker drops websockets fairly often. While it is
         down the room id is no longer registered, so nobody can find the room
         even though this tab is still open - which is why a dropped broker has
         to be retried rather than merely announced. */
      var retries = 0;
      p.on('disconnected', function () {
        if (p.destroyed) return;
        retries++;
        if (retries > 8) {
          fire('status', 'Lost the matchmaking server. Players cannot join until you reopen the room.');
          fire('brokerDown');
          return;
        }
        fire('status', 'Matchmaking server dropped — reconnecting (' + retries + ')…');
        // Back off a little so we are not hammering a service that is struggling.
        setTimeout(function () {
          try { p.reconnect(); } catch (e) {}
        }, Math.min(1000 * retries, 5000));
      });

      p.on('open', function () {
        if (retries) {
          retries = 0;
          fire('status', 'Reconnected. The room is open again.');
        }
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

      lastDiag = { brokerOpen: false, hostFound: false, iceState: null, relayUsed: null };

      var p = newPeer(undefined);
      var settled = false;

      /* Relaying through TURN across continents is slower than a direct hop,
         and the TCP fallback slower still, so allow a generous window. */
      var timer = setTimeout(function () {
        if (settled) return;
        settled = true;
        try { p.destroy(); } catch (e) {}

        var why;
        if (!lastDiag.brokerOpen) {
          why = 'Could not reach the matchmaking server. Check your internet connection and try again.';
        } else if (!lastDiag.hostFound) {
          why = 'No answer from room ' + code + '. Check the code, and that the host still has the tab open.';
        } else if (lastDiag.iceState === 'checking' || lastDiag.iceState === 'new') {
          why = 'Found room ' + code + ', but could not open a direct line to the host. ' +
                'This is usually a restrictive network — try mobile data, or a different network, on either side.';
        } else {
          why = 'Found room ' + code + ', but the connection failed (' +
                (lastDiag.iceState || 'unknown state') + '). Try again, or switch networks.';
        }
        reject(new Error(why));
      }, 40000);

      p.on('open', function () {
        peer = p;
        lastDiag.brokerOpen = true;
        fire('status', 'Looking for room ' + code + '…');

        var conn = p.connect(PREFIX + code, {
          reliable: true,
          metadata: { name: name }
        });

        watchIce(conn, function (state) {
          // ICE only leaves 'new' once the host has answered our offer, so this
          // is the first point at which we know the room actually exists.
          if (state && state !== 'new') lastDiag.hostFound = true;
          if (settled) return;
          if (state === 'checking') fire('status', 'Negotiating a connection…');
          else if (state === 'connected' || state === 'completed') fire('status', 'Connected.');
          else if (state === 'failed') {
            settled = true;
            clearTimeout(timer);
            try { p.destroy(); } catch (e) {}
            reject(new Error('Found room ' + code + ', but no usable network path to the host. ' +
              'One of you is on a network that blocks peer-to-peer traffic — try mobile data, or a different Wi-Fi.'));
          }
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

  /* Connectivity self-test. Gathers ICE candidates against the configured
     servers and reports what kinds came back:
       host  — your own machine, only useful on the same network
       srflx — STUN worked, so a direct hop may be possible
       relay — TURN worked, which is what rescues restrictive networks
     No relay candidate means a cross-network game is likely to fail. */
  function testConnectivity(ms) {
    return new Promise(function (resolve) {
      var found = { host: 0, srflx: 0, relay: 0 };
      var pc;
      try {
        pc = new RTCPeerConnection({ iceServers: iceServers() });
      } catch (e) {
        resolve({ ok: false, error: 'WebRTC is unavailable in this browser.', found: found });
        return;
      }

      var done = function () {
        try { pc.close(); } catch (e) {}
        resolve({
          ok: found.relay > 0 || found.srflx > 0,
          relay: found.relay > 0,
          found: found
        });
      };

      pc.onicecandidate = function (e) {
        if (!e.candidate) return done();
        var type = (e.candidate.candidate.match(/ typ (\w+)/) || [])[1];
        if (type && found[type] !== undefined) found[type]++;
      };

      // A data channel is needed or no candidates are gathered at all.
      try { pc.createDataChannel('probe'); } catch (e) {}
      pc.createOffer()
        .then(function (o) { return pc.setLocalDescription(o); })
        .catch(function () { done(); });

      setTimeout(done, ms || 8000);
    });
  }

  global.Net = {
    host: host,
    join: join,
    send: send,
    testConnectivity: testConnectivity,
    /* Store TURN credentials on this device. Pass null to clear them. */
    setIceServers: function (list) {
      try {
        if (list && list.length) localStorage.setItem('tenergy-ice', JSON.stringify(list));
        else localStorage.removeItem('tenergy-ice');
        return true;
      } catch (e) { return false; }
    },
    getIceServers: iceServers,
    get hasRelay() { return hasRelay(iceServers()); },
    get diagnostics() { return Object.assign({}, lastDiag); },
    sendTo: sendTo,
    broadcast: broadcast,
    close: close,
    closeSoon: closeSoon,
    get role() { return role; },
    get code() { return code; },
    get peerCount() { return Object.keys(conns).length; }
  };
})(window);
