
import { Clue, GameConfig } from './types';

export const GAME_CONFIG: GameConfig = {
  gameDurationMinutes: 90,
  bonusPointsForFirst: 5,
  pointsPerStep: 10,
};

export const INITIAL_CLUES: Clue[] = [
  {
    id: 'clue-1',
    title: 'The Burning Gates',
    question: 'I have keys but no locks. I have a space but no room. You can enter, but never leave. What am I?',
    answer: 'keyboard',
    qrCodeId: 'CLUE_1_QR',
    locationHint: 'Find the glowing screen in the main computer lab.'
  },
  {
    id: 'clue-2',
    title: 'Echoes of Wisdom',
    question: 'The more of me there is, the less you see. What am I?',
    answer: 'darkness',
    qrCodeId: 'CLUE_2_QR',
    locationHint: 'Search the dimmest corner of the library basement.'
  },
  {
    id: 'clue-3',
    title: 'Fluid Ambition',
    question: 'I can run but not walk. I have a mouth but never talk. I have a bed but never sleep. What am I?',
    answer: 'river',
    qrCodeId: 'CLUE_3_QR',
    locationHint: 'Near the campus fountain where students gather.'
  },
  {
    id: 'clue-4',
    title: 'Iron Resolve',
    question: 'What gets wetter and wetter the more it dries?',
    answer: 'towel',
    qrCodeId: 'CLUE_4_QR',
    locationHint: 'The locker rooms in the sports complex.'
  },
  {
    id: 'clue-5',
    title: 'Eternal Flame',
    question: 'I am not alive, but I grow; I don\'t have lungs, but I need air; I don\'t have a mouth, but water kills me. What am I?',
    answer: 'fire',
    qrCodeId: 'CLUE_5_QR',
    locationHint: 'The outdoor amphitheater, center stage.'
  }
];

export const INITIAL_TEAMS = [
  { id: 't1', name: 'Phoenix Squad', password: 'student' },
  { id: 't2', name: 'Blaze Runners', password: 'student' },
  { id: 't3', name: 'Inferno Kings', password: 'student' },
  { id: 't4', name: 'Ember Knights', password: 'student' },
  { id: 't5', name: 'Pyros', password: 'student' },
  { id: 't6', name: 'Solar Flare', password: 'student' },
  { id: 't7', name: 'Dragon Breath', password: 'student' },
  { id: 't8', name: 'Volcano Force', password: 'student' }
];
