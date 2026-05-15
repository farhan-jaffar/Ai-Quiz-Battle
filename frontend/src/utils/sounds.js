/**
 * Sound effects system using Web Audio API.
 * No external audio files needed — all sounds are synthesized.
 */

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(frequency, duration, type = 'sine', volume = 0.15, delay = 0) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
  gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

function playNoise(duration, volume = 0.08, delay = 0) {
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, ctx.currentTime + delay);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  source.start(ctx.currentTime + delay);
  source.stop(ctx.currentTime + delay + duration);
}

// ─── Individual Sound Effects ───────────────────────

/** Bright ascending chime for correct answers */
export function playCorrect() {
  playTone(523.25, 0.12, 'sine', 0.12, 0);      // C5
  playTone(659.25, 0.12, 'sine', 0.12, 0.08);    // E5
  playTone(783.99, 0.25, 'sine', 0.14, 0.16);    // G5
}

/** Low descending buzz for wrong answers */
export function playWrong() {
  playTone(311.13, 0.15, 'square', 0.06, 0);     // Eb4
  playTone(233.08, 0.3, 'square', 0.05, 0.12);   // Bb3
  playNoise(0.15, 0.04, 0.05);
}

/** Quick tick for timer countdown */
export function playTick() {
  playTone(880, 0.05, 'sine', 0.06, 0);
}

/** Urgent tick for critical timer (< 5s) */
export function playCriticalTick() {
  playTone(1046.5, 0.06, 'square', 0.08, 0);     // C6
  playTone(880, 0.06, 'square', 0.06, 0.07);      // A5
}

/** Sparkle sound for power-up activation */
export function playPowerUp() {
  playTone(880, 0.08, 'sine', 0.1, 0);
  playTone(1108.73, 0.08, 'sine', 0.1, 0.06);    // C#6
  playTone(1318.51, 0.15, 'sine', 0.12, 0.12);   // E6
  playTone(1760, 0.2, 'sine', 0.08, 0.18);       // A6
}

/** Victory fanfare — ascending triumphant notes */
export function playVictory() {
  playTone(523.25, 0.15, 'sine', 0.12, 0);       // C5
  playTone(659.25, 0.15, 'sine', 0.12, 0.12);    // E5
  playTone(783.99, 0.15, 'sine', 0.12, 0.24);    // G5
  playTone(1046.5, 0.4, 'sine', 0.15, 0.36);     // C6
  playTone(783.99, 0.12, 'triangle', 0.06, 0.36); // harmony
  playTone(659.25, 0.12, 'triangle', 0.04, 0.36); // harmony
}

/** Defeat sound — descending minor notes */
export function playDefeat() {
  playTone(392, 0.2, 'sine', 0.1, 0);            // G4
  playTone(349.23, 0.2, 'sine', 0.1, 0.15);      // F4
  playTone(311.13, 0.2, 'sine', 0.1, 0.3);       // Eb4
  playTone(261.63, 0.5, 'sine', 0.08, 0.45);     // C4
}

/** Draw sound — neutral resolution */
export function playDraw() {
  playTone(440, 0.15, 'sine', 0.1, 0);           // A4
  playTone(523.25, 0.15, 'sine', 0.1, 0.12);     // C5
  playTone(440, 0.3, 'sine', 0.08, 0.24);        // A4
}

/** Soft click for UI interactions */
export function playClick() {
  playTone(660, 0.04, 'sine', 0.06, 0);
}

/** Whoosh for page transitions / quiz start */
export function playWhoosh() {
  playNoise(0.2, 0.06, 0);
  playTone(200, 0.15, 'sine', 0.04, 0);
  playTone(400, 0.1, 'sine', 0.03, 0.08);
}

/** Timer expired — timeout buzz */
export function playTimeout() {
  playTone(220, 0.12, 'sawtooth', 0.06, 0);
  playTone(185, 0.2, 'sawtooth', 0.05, 0.1);
  playNoise(0.12, 0.05, 0.05);
}

/** Submit/confirm sound */
export function playSubmit() {
  playTone(440, 0.08, 'sine', 0.08, 0);
  playTone(554.37, 0.08, 'sine', 0.08, 0.06);    // C#5
  playTone(659.25, 0.15, 'sine', 0.1, 0.12);     // E5
}
