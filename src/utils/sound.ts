let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedCtx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    sharedCtx = new AudioCtx();
  }
  if (sharedCtx.state === 'suspended') {
    sharedCtx.resume().catch(() => {});
  }
  return sharedCtx;
}

function tone(freq: number, duration: number, type: OscillatorType = 'sine', delay = 0, volume = 0.07): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = ctx.currentTime + delay;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration);
  } catch {
    // Ignore audio errors when blocked by autoplay policies
  }
}

export function playSound(kind: 'success' | 'error' | 'click' | 'fanfare', enabled: boolean): void {
  if (!enabled) return;
  if (kind === 'click') {
    tone(520, 0.05, 'triangle', 0, 0.04);
  } else if (kind === 'success') {
    tone(523.25, 0.1, 'sine', 0, 0.07);
    tone(659.25, 0.14, 'sine', 0.09, 0.07);
  } else if (kind === 'error') {
    tone(240, 0.14, 'triangle', 0, 0.07);
    tone(190, 0.16, 'triangle', 0.1, 0.06);
  } else if (kind === 'fanfare') {
    tone(523.25, 0.11, 'sine', 0, 0.07);
    tone(659.25, 0.11, 'sine', 0.1, 0.07);
    tone(783.99, 0.11, 'sine', 0.2, 0.07);
    tone(1046.5, 0.24, 'sine', 0.3, 0.08);
  }
}
