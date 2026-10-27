import { describe, expect, it } from 'vitest';
import { STORAGE_KEY, createInitialState, loadState, normalizeState, saveState } from './storage.js';

// A tiny in-memory stand-in for the browser's localStorage.
function fakeStorage(initial = {}, { failWrites = false } = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      if (failWrites) throw new Error('QuotaExceededError');
      data[key] = String(value);
    },
    removeItem: (key) => delete data[key],
  };
}

describe('storage', () => {
  it('starts fresh on first visit', () => {
    expect(loadState(fakeStorage())).toEqual({ state: createInitialState(), status: 'fresh' });
  });

  it('round-trips saved state', () => {
    const storage = fakeStorage();
    const state = {
      ...createInitialState(),
      tasks: [
        {
          id: 'a',
          title: 'Hello',
          notes: '',
          category: 'Health',
          difficulty: 'hard',
          status: 'done',
          createdAt: '2026-10-27T10:00:00Z',
          completedAt: '2026-10-27T11:00:00Z',
          xpAwarded: 50,
        },
      ],
    };
    expect(saveState(state, storage)).toBe(true);
    expect(loadState(storage)).toEqual({ state, status: 'ok' });
  });

  it('recovers from broken JSON and keeps a backup', () => {
    const storage = fakeStorage({ [STORAGE_KEY]: '{not json' });
    const result = loadState(storage);
    expect(result.status).toBe('recovered');
    expect(result.state).toEqual(createInitialState());
    const backupKey = Object.keys(storage.data).find((k) => k.startsWith(`${STORAGE_KEY}:backup-`));
    expect(storage.data[backupKey]).toBe('{not json');
  });

  it('reports unavailable storage', () => {
    expect(loadState(null).status).toBe('unavailable');
    expect(saveState(createInitialState(), null)).toBe(false);
    expect(saveState(createInitialState(), fakeStorage({}, { failWrites: true }))).toBe(false);
  });

  it('drops invalid tasks and repairs bad fields', () => {
    const state = normalizeState({
      tasks: [
        null,
        { id: 'no-title', title: '   ' },
        { id: 'ok', title: 'Fine', category: 'Wizardry', difficulty: 'epic', status: 'active', xpAwarded: 999 },
      ],
      mood: { date: '2026-10-27', energy: 'turbo' },
      player: { name: '' },
    });
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0]).toMatchObject({ category: 'Personal', difficulty: 'easy', xpAwarded: 0 });
    expect(state.mood).toBeNull();
    expect(state.player.name).toBe('Reyna');
  });

  it('rejects data that is not an object', () => {
    expect(() => normalizeState([])).toThrow();
    expect(loadState(fakeStorage({ [STORAGE_KEY]: '42' })).status).toBe('recovered');
  });
});
