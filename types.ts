export enum UserMode {
  STUDENT = 'Student',
  WORK = 'Work',
  LEISURE = 'Leisure'
}

export enum PetState {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  HAPPY = 'HAPPY',
  SLEEPING = 'SLEEPING',
  WORRIED = 'WORRIED',
  CRYING = 'CRYING'
}

export type Species = 'bear' | 'cat' | 'rabbit';
export type Outfit = 'everyday' | 'pajama' | 'hero';
export type ColorTheme = 'pink' | 'blue' | 'yellow' | 'purple';

export interface PetAppearance {
  name: string;
  species: Species;
  outfit: Outfit;
  primaryColor: ColorTheme;
}

export interface Attachment {
  mimeType: string;
  data: string; // Base64 string (Data URL)
  name: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  attachments?: Attachment[];
}

export interface UserStats {
  intimacy: number;
  level: number;
  sessionTimeMinutes: number;
  healthScore: number;
}