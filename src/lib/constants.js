// Game rules and fixed lists live here, so tuning the game means editing one file.

export const CATEGORIES = ['Career', 'Health', 'Learning', 'Personal'];

// Full class strings (not built dynamically) so Tailwind can find them.
export const CATEGORY_STYLES = {
  Career: {
    icon: 'briefcase',
    chip: 'bg-sky-400/10 text-sky-300 ring-sky-400/20',
    bar: 'bg-sky-400',
  },
  Health: {
    icon: 'heart',
    chip: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20',
    bar: 'bg-emerald-400',
  },
  Learning: {
    icon: 'book',
    chip: 'bg-amber-400/10 text-amber-300 ring-amber-400/20',
    bar: 'bg-amber-400',
  },
  Personal: {
    icon: 'user',
    chip: 'bg-pink-400/10 text-pink-300 ring-pink-400/20',
    bar: 'bg-pink-400',
  },
};

export const DIFFICULTIES = {
  easy: { label: 'Easy', xp: 10, pips: 1 },
  medium: { label: 'Medium', xp: 25, pips: 2 },
  hard: { label: 'Hard', xp: 50, pips: 3 },
};

export const DIFFICULTY_ORDER = ['easy', 'medium', 'hard'];

export const ENERGY_LEVELS = {
  low: { label: 'Low', bars: 1, hint: 'Small wins count. Hydrate, then conquer.' },
  medium: { label: 'Medium', bars: 2, hint: 'Steady pace, solid gains.' },
  high: { label: 'High', bars: 3, hint: 'Main-character energy. Go fight something big.' },
};

export const ENERGY_ORDER = ['low', 'medium', 'high'];

export const BOSS_SUBTASK_XP = 15;
export const BOSS_DEFEAT_BONUS = 100;

export const TITLE_MAX_LENGTH = 120;
export const NOTES_MAX_LENGTH = 500;
export const NAME_MAX_LENGTH = 30;

export const DEFAULT_PLAYER_NAME = 'Reyna';

export const STARTER_QUESTS = [
  { title: 'Drink a glass of water', category: 'Health', difficulty: 'easy' },
  { title: 'Tidy your desk for 10 minutes', category: 'Personal', difficulty: 'easy' },
  { title: 'Read one article about something you are curious about', category: 'Learning', difficulty: 'medium' },
  { title: 'Update one section of your CV', category: 'Career', difficulty: 'medium' },
  { title: '30-minute workout', category: 'Health', difficulty: 'hard' },
];
