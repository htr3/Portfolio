(function () {
  "use strict";

  // ─── Procedural racing soundtrack (Web Audio API) ───────────────────
  // A looping electronic groove — kick, hat, bassline, and an arpeggiated
  // lead — synthesized in-browser. No audio files, so it ships cleanly to
  // GitHub Pages. Off by default; starts on user click (autoplay policy).

  const toggle = document.getElementById("sound-toggle");
  if (!toggle) return;

  let ctx = null;
  let master = null;
  let playing = false;
  let timer = null;

  // Scheduler state
  let current16th = 0;
  let nextNoteTime = 0;
  const TEMPO = 124; // BPM
  const LOOKAHEAD = 25; // ms
  const SCHEDULE_AHEAD = 0.12; // s

  // A minor pentatonic feel (A C D E G) across two octaves for the lead.
  const LEAD = [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 392.0,
                329.63, 293.66, 440.0, 392.0, 329.63, 293.66, 261.63, 220.0];
  const BASS = [110.0, 0, 110.0, 0, 146.83, 0, 110.0, 0,
                98.0, 0, 98.0, 0, 130.81, 0, 110.0, 0];

  function secondsPer16th() {
    return 60 / TEMPO / 4;
  }

  function setup() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.0001;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp);
    comp.connect(ctx.destination);
  }

  function kick(time) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);
    g.gain.setValueAtTime(0.9, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
    osc.connect(g);
    g.connect(master);
    osc.start(time);
    osc.stop(time + 0.24);
  }

  function hat(time) {
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.18, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
    noise.connect(hp);
    hp.connect(g);
    g.connect(master);
    noise.start(time);
    noise.stop(time + 0.05);
  }

  function tone(freq, time, dur, type, peak, filterFreq) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    let node = osc;
    if (filterFreq) {
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = filterFreq;
      lp.Q.value = 6;
      osc.connect(lp);
      node = lp;
    }
    node.connect(g);
    g.connect(master);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(peak, time + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  function scheduleStep(step, time) {
    if (step % 4 === 0) kick(time);
    if (step % 2 === 1) hat(time);
    const b = BASS[step];
    if (b) tone(b, time, 0.28, "sawtooth", 0.22, 600);
    if (step % 2 === 0) {
      const lead = LEAD[step];
      if (lead) tone(lead, time, 0.22, "square", 0.08, 2200);
    }
  }

  function scheduler() {
    while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD) {
      scheduleStep(current16th, nextNoteTime);
      nextNoteTime += secondsPer16th();
      current16th = (current16th + 1) % 16;
    }
  }

  function start() {
    if (!ctx) setup();
    if (ctx.state === "suspended") ctx.resume();
    current16th = 0;
    nextNoteTime = ctx.currentTime + 0.05;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 1.2);
    timer = setInterval(scheduler, LOOKAHEAD);
    playing = true;
    toggle.classList.add("is-playing");
    toggle.setAttribute("aria-pressed", "true");
    toggle.setAttribute("aria-label", "Mute soundtrack");
  }

  function stop() {
    if (!ctx) return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    clearInterval(timer);
    timer = null;
    playing = false;
    toggle.classList.remove("is-playing");
    toggle.setAttribute("aria-pressed", "false");
    toggle.setAttribute("aria-label", "Play soundtrack");
  }

  toggle.addEventListener("click", () => {
    if (playing) stop();
    else start();
  });

  // Pause when the tab is hidden; resume if it was playing.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && playing && ctx) ctx.suspend();
    else if (!document.hidden && playing && ctx) ctx.resume();
  });
})();
