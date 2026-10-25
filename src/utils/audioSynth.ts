// Web Audio API Synthesizer for serene Islamic ambient music & SFX
// No external mp3 or CDN dependencies - 100% resilient and offline-capable

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlayingBgm = false;
  private masterGain: GainNode | null = null;
  private timerId: number | null = null;
  private chordIndex = 0;

  // Gentle pentatonic / warm Lydian / peaceful Islamic contemplative chords (frequencies in Hz)
  // Peaceful meditation progression: Dm9, Gsus, Am7, Fmaj7
  private chordProgression: number[][] = [
    [146.83, 220.00, 261.63, 329.63, 392.00], // D minor 9
    [130.81, 196.00, 261.63, 293.66, 392.00], // C add 9 / Gsus
    [110.00, 164.81, 220.00, 261.63, 329.63], // A minor 7
    [174.61, 220.00, 261.63, 329.63, 440.00], // F maj 7
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume * 0.25)), this.ctx.currentTime, 0.05);
    }
  }

  public startBgm() {
    this.initContext();
    if (this.isPlayingBgm) return;
    this.isPlayingBgm = true;
    this.playNextChord();
  }

  private playNextChord() {
    if (!this.isPlayingBgm || !this.ctx || !this.masterGain) return;

    const chord = this.chordProgression[this.chordIndex];
    this.chordIndex = (this.chordIndex + 1) % this.chordProgression.length;

    const now = this.ctx.currentTime;
    const duration = 4.5; // seconds per chord

    chord.forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      // Low pass filter for soft acoustic warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + i * 120, now);
      filter.Q.setValueAtTime(1.5, now);

      // Gentle attack and slow decay
      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.06 / (i + 1), now + 1.2);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.5);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(now + i * 0.08);
      osc.stop(now + duration + 1.0);
    });

    this.timerId = window.setTimeout(() => {
      this.playNextChord();
    }, 4200);
  }

  public stopBgm() {
    this.isPlayingBgm = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  // Chime sound on scene transition
  public playSceneChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.35); // A5

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.7);
  }

  // Tactile sand tracing sound effect
  public playSandTraceSfx() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    // Pink noise burst simulation for sand ASMR
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.25;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
  }
}

export const audioEngine = new AmbientAudioEngine();

// Indonesian Voiceover Speech Synthesis Controller
export class IndonesianVoiceoverController {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;
  private static indonesianVoice: SpeechSynthesisVoice | null = null;

  private static getIndonesianVoice(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    if (this.indonesianVoice) return this.indonesianVoice;

    const voices = this.synth.getVoices();
    // Prefer id-ID voice (e.g. Indonesian Google or natural voice)
    const idVoice = voices.find(v => v.lang.startsWith('id') || v.lang.includes('ID'));
    if (idVoice) {
      this.indonesianVoice = idVoice;
      return idVoice;
    }
    // Fallback to any southeast asian or gentle default
    return voices[0] || null;
  }

  public static speak(text: string, rate: number = 0.95, onEnd?: () => void) {
    if (!this.synth) return;
    this.stop();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = rate; // Gentle warm maternal/paternal pace
      utterance.pitch = 1.05;

      const voice = this.getIndonesianVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    } catch {
      // Speech synthesis error handled gracefully
      if (onEnd) onEnd();
    }
  }

  public static stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }
}
