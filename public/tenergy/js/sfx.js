/* Tiny WebAudio blip generator — no audio files to ship or load. */
(function (global) {
  'use strict';

  var ctx = null;
  var enabled = true;
  try { enabled = localStorage.getItem('get323-sound') !== 'off'; } catch (e) {}

  function audio() {
    var AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, gain, type) {
    var ac = audio();
    if (!ac) return;
    var t0 = ac.currentTime + start;
    var osc = ac.createOscillator();
    var amp = ac.createGain();
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(freq, t0);
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(amp).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  var CUES = {
    click:    [[520, 0, 0.07, 0.05]],
    pick:     [[660, 0, 0.09, 0.07], [880, 0.06, 0.12, 0.06]],
    join:     [[600, 0, 0.1, 0.06], [900, 0.09, 0.14, 0.05]],
    tick:     [[1000, 0, 0.05, 0.035]],
    countdown:[[700, 0, 0.12, 0.06]],
    go:       [[900, 0, 0.16, 0.08], [1200, 0.12, 0.22, 0.07]],
    correct:  [[660, 0, 0.12, 0.07], [880, 0.1, 0.12, 0.07], [1320, 0.2, 0.3, 0.07]],
    wrong:    [[300, 0, 0.18, 0.07], [190, 0.14, 0.34, 0.07]],
    timeup:   [[420, 0, 0.14, 0.06], [300, 0.12, 0.26, 0.06]],
    finish:   [[523, 0, 0.14, 0.07], [659, 0.13, 0.14, 0.07], [784, 0.26, 0.16, 0.07], [1046, 0.4, 0.42, 0.08]]
  };

  function play(name) {
    if (!enabled) return;
    var cue = CUES[name];
    if (!cue) return;
    try {
      cue.forEach(function (n) { tone(n[0], n[1], n[2], n[3], n[4]); });
    } catch (e) {}
  }

  function setEnabled(on) {
    enabled = !!on;
    try { localStorage.setItem('get323-sound', enabled ? 'on' : 'off'); } catch (e) {}
    if (enabled) play('click');
  }

  global.Sfx = {
    play: play,
    setEnabled: setEnabled,
    get enabled() { return enabled; },
    unlock: function () { audio(); }
  };
})(window);
