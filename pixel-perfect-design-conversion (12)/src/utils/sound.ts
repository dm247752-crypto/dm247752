/**
 * One-shot payment success chime via Web Audio API.
 * - No audio file needed; two short sine tones (C6 → G6).
 * - Volume follows system media volume; fails silently if audio
 *   is unavailable (silent mode, no user gesture, etc.).
 */
let ctx: AudioContext | null = null;
let played = false;

function getCtx(): AudioContext | null {
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx ??= new AC();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** Call after a user gesture (e.g. PIN entry) to warm up the context. */
export function primeAudio() {
  getCtx();
}

function makeBus(c: AudioContext) {
  const master = c.createGain();
  const comp = c.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.knee.value = 20;
  comp.ratio.value = 5;
  comp.attack.value = 0.003;
  comp.release.value = 0.18;
  master.connect(comp);
  comp.connect(c.destination);
  return master;
}

function softTap(c: AudioContext, bus: AudioNode, start: number) {
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * 0.045), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const env = 1 - i / data.length;
    data[i] = (Math.random() * 2 - 1) * env * env;
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1900;
  bp.Q.value = 4;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.linearRampToValueAtTime(0.035, start + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.045);
  src.connect(bp);
  bp.connect(gain);
  gain.connect(bus);
  src.start(start);
  src.stop(start + 0.05);
}

/**
 * Copyright-safe PhonePe-inspired "tunnn" bell.
 * It is synthesized at runtime, not sampled from the real app.
 */
function bellTone(
  c: AudioContext,
  bus: AudioNode,
  start: number,
  freq: number,
  duration: number,
  peak: number
) {
  const master = c.createGain();
  master.gain.setValueAtTime(0.0001, start);
  master.gain.linearRampToValueAtTime(peak, start + 0.006);
  master.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(freq * 6.5, start);
  lp.frequency.exponentialRampToValueAtTime(freq * 2.2, start + duration);
  lp.Q.value = 1.1;

  master.connect(lp);
  lp.connect(bus);

  const partials: { mul: number; gain: number; type: OscillatorType }[] = [
    { mul: 1.0, gain: 1.0, type: "sine" },
    { mul: 1.99, gain: 0.42, type: "sine" },
    { mul: 2.98, gain: 0.18, type: "triangle" },
    { mul: 4.7, gain: 0.07, type: "sine" },
  ];

  for (const p of partials) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = p.type;
    osc.frequency.setValueAtTime(freq * p.mul, start);
    osc.frequency.exponentialRampToValueAtTime(freq * p.mul * 0.988, start + duration);
    g.gain.value = p.gain;
    osc.connect(g);
    g.connect(master);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  }
}

/**
 * Play a near-real payment-success chime — one time only per payment.
 * Shape: tiny tap + fast rising "tun" + ringing "nnn" tail.
 */
export function playSuccessChime() {
  if (played) return;
  played = true;
  const c = getCtx();
  if (!c) return;
  try {
    const bus = makeBus(c);
    const t0 = c.currentTime + 0.018;

    softTap(c, bus, t0);
    bellTone(c, bus, t0 + 0.018, 784.0, 0.17, 0.12); // G5 quick attack
    bellTone(c, bus, t0 + 0.095, 1174.66, 0.34, 0.26); // D6 lift
    bellTone(c, bus, t0 + 0.205, 1567.98, 0.78, 0.21); // G6 ringing tail
    bellTone(c, bus, t0 + 0.215, 2350.0, 0.5, 0.045); // airy shimmer

    navigator.vibrate?.([22, 16, 42]);
  } catch {
    /* ignore — never break the payment flow for audio */
  }
}

/** Reset the one-shot guard (e.g. before a new payment attempt). */
export function resetChime() {
  played = false;
}

/** Short "detected!" blip used when a QR code is found. */
export function playScanBeep() {
  const c = getCtx();
  if (!c) return;
  try {
    const t0 = c.currentTime + 0.01;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.value = 1318.5; // E6
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(0.22, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + 0.2);
  } catch {
    /* ignore */
  }
}
