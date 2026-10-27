import {
  CATEGORIES,
  DEFAULT_PLAYER_NAME,
  DIFFICULTIES,
  ENERGY_LEVELS,
  NAME_MAX_LENGTH,
  NOTES_MAX_LENGTH,
  TITLE_MAX_LENGTH,
} from '../lib/constants.js';
import { cleanLine, cleanText } from '../lib/utils.js';

export const STORAGE_KEY = 'reyna-os:v1';
export const CURRENT_VERSION = 1;

export function createInitialState() {
  return {
    version: CURRENT_VERSION,
    player: { name: DEFAULT_PLAYER_NAME },
    tasks: [],
    boss: null,
    bossHistory: [],
    mood: null,
  };
}

// Returns localStorage, or null if the browser blocks it (e.g. some private modes).
export function getStorage() {
  try {
    const storage = globalThis.localStorage;
    if (!storage) return null;
    const probe = `${STORAGE_KEY}:probe`;
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
}

const isString = (value) => typeof value === 'string' && value.length > 0;

function normalizeTask(raw) {
  if (!raw || !isString(raw.id)) return null;
  const title = cleanLine(raw.title, TITLE_MAX_LENGTH);
  if (!title) return null;
  const done = raw.status === 'done';
  return {
    id: raw.id,
    title,
    notes: cleanText(raw.notes, NOTES_MAX_LENGTH),
    category: CATEGORIES.includes(raw.category) ? raw.category : 'Personal',
    difficulty: raw.difficulty in DIFFICULTIES ? raw.difficulty : 'easy',
    status: done ? 'done' : 'active',
    createdAt: isString(raw.createdAt) ? raw.createdAt : new Date(0).toISOString(),
    completedAt: done && isString(raw.completedAt) ? raw.completedAt : null,
    xpAwarded: done ? Math.max(0, Number(raw.xpAwarded) || 0) : 0,
  };
}

function normalizeBoss(raw) {
  if (!raw || !isString(raw.id)) return null;
  const title = cleanLine(raw.title, TITLE_MAX_LENGTH);
  if (!title) return null;
  const subtasks = Array.isArray(raw.subtasks)
    ? raw.subtasks
        .filter((step) => step && isString(step.id) && cleanLine(step.title, TITLE_MAX_LENGTH))
        .map((step) => ({
          id: step.id,
          title: cleanLine(step.title, TITLE_MAX_LENGTH),
          done: Boolean(step.done),
          doneAt: step.done && isString(step.doneAt) ? step.doneAt : null,
        }))
    : [];
  return {
    id: raw.id,
    title,
    subtasks,
    createdAt: isString(raw.createdAt) ? raw.createdAt : new Date(0).toISOString(),
    defeatedAt: isString(raw.defeatedAt) ? raw.defeatedAt : null,
  };
}

// Turns whatever was saved into a valid state, dropping anything broken.
// If the data format ever changes, upgrade old versions here.
export function normalizeState(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('Saved data is not an object');
  }
  const base = createInitialState();
  const mood =
    raw.mood && isString(raw.mood.date) && raw.mood.energy in ENERGY_LEVELS
      ? { date: raw.mood.date, energy: raw.mood.energy }
      : null;
  return {
    ...base,
    player: { name: cleanLine(raw.player?.name, NAME_MAX_LENGTH) || base.player.name },
    tasks: Array.isArray(raw.tasks) ? raw.tasks.map(normalizeTask).filter(Boolean) : [],
    boss: normalizeBoss(raw.boss),
    bossHistory: Array.isArray(raw.bossHistory)
      ? raw.bossHistory.map(normalizeBoss).filter((boss) => boss?.defeatedAt)
      : [],
    mood,
  };
}

// status: 'ok' (loaded), 'fresh' (first visit), 'recovered' (data was broken,
// a backup copy was kept), or 'unavailable' (storage is blocked).
export function loadState(storage = getStorage()) {
  if (!storage) return { state: createInitialState(), status: 'unavailable' };

  let rawText;
  try {
    rawText = storage.getItem(STORAGE_KEY);
  } catch {
    return { state: createInitialState(), status: 'unavailable' };
  }
  if (rawText == null) return { state: createInitialState(), status: 'fresh' };

  try {
    return { state: normalizeState(JSON.parse(rawText)), status: 'ok' };
  } catch {
    try {
      storage.setItem(`${STORAGE_KEY}:backup-${Date.now()}`, rawText);
    } catch {
      // Nothing more we can do; start fresh anyway.
    }
    return { state: createInitialState(), status: 'recovered' };
  }
}

// Returns false if saving failed (storage blocked or full).
export function saveState(state, storage = getStorage()) {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
