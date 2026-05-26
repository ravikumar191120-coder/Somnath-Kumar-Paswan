// Shared type definitions for Pyaar Bhari Subha application

export interface RomanticTrack {
  id: string;
  name: string;
  artist: string;
  url: string;      // Fallback MP3 URL or synthesized settings
  duration: string;
  isSynth: boolean; // True if it triggers our gorgeous Web Audio Music Box Synthesizer
  color: string;    // Accent theme for the player background
}

export interface CountdownConfig {
  meetingDate: string; // ISO / YYYY-MM-DD
  eventName: string;   // e.g. "Hamaari Agli Mulaqat"
  specialMessage: string;
}

export interface LoveMood {
  key: string;
  emoji: string;
  title: string;
  hindiTitle: string;
  reply: string;
}

export interface LoveNoteConfig {
  mood: string;
  recipientName: string;
  senderName: string;
}
