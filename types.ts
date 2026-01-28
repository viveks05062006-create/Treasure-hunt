
export interface Team {
  id: string;
  name: string;
  password: string;
  currentClueIndex: number; // 0 to N
  points: number;
  clueStep: 'QUESTION' | 'SCAN';
  startTime?: number;
  finishTime?: number;
  isFinished: boolean;
  progress: TeamProgress[];
}

export interface TeamProgress {
  clueId: string;
  questionSolvedAt?: number;
  qrScannedAt?: number;
}

export interface Clue {
  id: string;
  title: string;
  question: string;
  answer: string;
  qrCodeId: string;
  locationHint: string;
}

export interface GameConfig {
  gameDurationMinutes: number;
  bonusPointsForFirst: number;
  pointsPerStep: number;
}

export enum AppView {
  LOGIN = 'LOGIN',
  INSTRUCTIONS = 'INSTRUCTIONS',
  GAME = 'GAME',
  LEADERBOARD = 'LEADERBOARD',
  FINISHED = 'FINISHED',
  ADMIN = 'ADMIN'
}
