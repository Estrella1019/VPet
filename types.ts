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


// types.ts
export interface UserProfile {
  name: string;      // 用户昵称
  mood: string;      // 用户最近的心情 (e.g. "开心", "焦虑")
  coins: number;     // 金币数量 (用于游戏化)
  historySummary: string; // 简短的对话历史总结
}
