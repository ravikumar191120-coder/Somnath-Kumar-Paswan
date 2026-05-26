// Web Audio API Romantic Music Box / Chime Synthesizer
// Generates beautiful, organic physical-box bell sounds in a beautiful major-seventh progression

class RomanticSynth {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private timerId: any = null;
  private volumeNode: GainNode | null = null;
  private currentVolume: number = 0.5;
  private currentNoteCallback: ((freq: number, noteName: string) => void) | null = null;

  // Romantic Pentatonic Major progression (Key of E Major for warm, dreamy mood)
  // Notes corresponding to E major chords: Emaj7 - Amajor7 - C#minor - Bsus4
  private progressions = [
    // Emaj7 plucks
    [164.81, 196.00, 246.94, 329.63, 440.00, 493.88, 659.25], // E3, G#3, B3, E4, A4, B4, E5
    // Amaj7 plucks
    [220.00, 277.18, 329.63, 440.00, 554.37, 659.25, 880.00], // A3, C#4, E4, A4, C#5, E5, A5
    // C#m9 plucks
    [130.81, 277.18, 311.13, 392.00, 523.25, 622.25, 830.61], // C#3, C#4, D#4, G#4, C5, D#5, G#5
    // B6/9 plucks
    [246.94, 311.13, 369.99, 440.00, 493.88, 622.25, 739.99]  // B3, D#4, F#4, A4, B4, D#5, F#5
  ];

  private noteNames = ["Sur", "Prem", "Subha", "Ehsas", "Sapna", "Dhadkan", "Sath"];
  private step = 0;
  private chordIndex = 0;

  constructor() {
    // Lazy initialized
  }

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.volumeNode = this.ctx.createGain();
      this.volumeNode.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
      this.volumeNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setVolume(volume: number) {
    this.currentVolume = volume;
    if (this.volumeNode && this.ctx) {
      this.volumeNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    }
  }

  public start(onNote: (freq: number, noteLabel: string) => void) {
    if (this.isRunning) return;
    this.initCtx();
    this.isRunning = true;
    this.currentNoteCallback = onNote;
    this.step = 0;
    this.chordIndex = 0;

    // Loop trigger for romantic bells
    const playTick = () => {
      if (!this.isRunning) return;
      this.playPluck();
      // Schedule next note randomly for organic physical windchime / musicbox timing (between 250ms and 550ms)
      const nextDelay = 300 + Math.random() * 350;
      this.timerId = setTimeout(playTick, nextDelay);
    };

    playTick();
  }

  private playPluck() {
    if (!this.ctx || !this.volumeNode) return;

    // Chord rotation
    if (this.step % 8 === 0 && this.step > 0) {
      this.chordIndex = (this.chordIndex + 1) % this.progressions.length;
    }

    const currentChord = this.progressions[this.chordIndex];
    // Randomly pluck notes from current scale
    const noteIdx = Math.floor(Math.random() * currentChord.length);
    const freq = currentChord[noteIdx];
    const label = `${this.noteNames[noteIdx % this.noteNames.length]} ${this.chordIndex + 1}`;

    const now = this.ctx.currentTime;
    
    // Create twin oscillators: one pure sine for glass chime feel, one triangle 1 octave higher for wooden warmth
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const pluckGain = this.ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 1.5, now); // Sweet absolute perfect fifth coloring

    // Pluck Envelope
    pluckGain.gain.setValueAtTime(0, now);
    pluckGain.gain.linearRampToValueAtTime(0.18, now + 0.015); // Fast gentle attack
    pluckGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8); // Long beautiful ceramic ring down

    // Connect nodes
    osc1.connect(pluckGain);
    osc2.connect(pluckGain);
    pluckGain.connect(this.volumeNode);

    // Play now and schedule stop
    osc1.start(now);
    osc1.stop(now + 2.0);
    osc2.start(now);
    osc2.stop(now + 2.0);

    // Trigger visual updates via callback
    if (this.currentNoteCallback) {
      this.currentNoteCallback(freq, label);
    }

    this.step++;
  }

  public stop() {
    this.isRunning = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }
}

export const romanticSynth = new RomanticSynth();
