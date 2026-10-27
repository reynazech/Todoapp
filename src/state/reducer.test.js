import { describe, expect, it } from 'vitest';
import { gameReducer } from './reducer.js';
import { createInitialState } from './storage.js';
import { totalXp } from '../lib/xp.js';

const NOW = '2026-10-27T10:00:00.000Z';

function run(state, ...actions) {
  return actions.reduce(gameReducer, state);
}

const add = (id, fields = {}) => ({
  type: 'task/add',
  id,
  now: NOW,
  title: 'Write report',
  category: 'Career',
  difficulty: 'medium',
  ...fields,
});

describe('quests', () => {
  it('adds a trimmed quest to the top', () => {
    const state = run(createInitialState(), add('a'), add('b', { title: '   Go   for a run  ' }));
    expect(state.tasks.map((t) => t.id)).toEqual(['b', 'a']);
    expect(state.tasks[0].title).toBe('Go for a run');
  });

  it('ignores empty or whitespace-only titles', () => {
    const start = createInitialState();
    expect(run(start, add('a', { title: '    ' }))).toBe(start);
  });

  it('cuts titles to 120 characters', () => {
    const state = run(createInitialState(), add('a', { title: 'x'.repeat(500) }));
    expect(state.tasks[0].title).toHaveLength(120);
  });

  it('falls back to safe category and difficulty values', () => {
    const state = run(createInitialState(), add('a', { category: 'Nope', difficulty: 'legendary' }));
    expect(state.tasks[0]).toMatchObject({ category: 'Personal', difficulty: 'easy' });
  });

  it('awards XP once, even if completed twice', () => {
    const state = run(
      createInitialState(),
      add('a'),
      { type: 'task/complete', id: 'a', now: NOW },
      { type: 'task/complete', id: 'a', now: NOW },
    );
    expect(state.tasks[0]).toMatchObject({ status: 'done', xpAwarded: 25, completedAt: NOW });
    expect(totalXp(state)).toBe(25);
  });

  it('removes XP when a quest is reopened', () => {
    const state = run(
      createInitialState(),
      add('a'),
      { type: 'task/complete', id: 'a', now: NOW },
      { type: 'task/reopen', id: 'a' },
    );
    expect(state.tasks[0]).toMatchObject({ status: 'active', xpAwarded: 0, completedAt: null });
    expect(totalXp(state)).toBe(0);
  });

  it('locks difficulty after completion but allows other edits', () => {
    const state = run(
      createInitialState(),
      add('a'),
      { type: 'task/complete', id: 'a', now: NOW },
      { type: 'task/update', id: 'a', changes: { difficulty: 'hard', title: 'Renamed', category: 'Health' } },
    );
    expect(state.tasks[0]).toMatchObject({ difficulty: 'medium', title: 'Renamed', category: 'Health', xpAwarded: 25 });
  });

  it('keeps the old title when an edit would blank it', () => {
    const state = run(createInitialState(), add('a'), { type: 'task/update', id: 'a', changes: { title: '  ' } });
    expect(state.tasks[0].title).toBe('Write report');
  });

  it('deleting a completed quest removes its XP', () => {
    const state = run(
      createInitialState(),
      add('a'),
      { type: 'task/complete', id: 'a', now: NOW },
      { type: 'task/delete', id: 'a' },
    );
    expect(state.tasks).toEqual([]);
    expect(totalXp(state)).toBe(0);
  });

  it('seeds starter quests only into an empty log', () => {
    const seed = { type: 'tasks/seed', now: NOW, ids: ['1', '2', '3', '4', '5'] };
    expect(run(createInitialState(), seed).tasks).toHaveLength(5);
    expect(run(createInitialState(), add('a'), seed).tasks).toHaveLength(1);
  });

  it('ignores actions for unknown ids', () => {
    const start = run(createInitialState(), add('a'));
    expect(gameReducer(start, { type: 'task/complete', id: 'missing', now: NOW })).toBe(start);
  });
});

describe('mood and player', () => {
  it('stores mood with its date and rejects unknown energy', () => {
    const state = run(createInitialState(), { type: 'mood/set', energy: 'high', date: '2026-10-27' });
    expect(state.mood).toEqual({ energy: 'high', date: '2026-10-27' });
    expect(gameReducer(state, { type: 'mood/set', energy: 'turbo', date: 'x' })).toBe(state);
  });

  it('renames the player but not to an empty name', () => {
    const state = run(createInitialState(), { type: 'player/rename', name: '  Rey  ' });
    expect(state.player.name).toBe('Rey');
    expect(gameReducer(state, { type: 'player/rename', name: '' })).toBe(state);
  });
});

describe('boss battle', () => {
  const create = { type: 'boss/create', id: 'boss1', title: 'Launch portfolio', now: NOW };
  const step = (id) => ({ type: 'boss/addStep', id, title: `Step ${id}` });
  const toggle = (id) => ({ type: 'boss/toggleStep', id, now: NOW });

  it('cannot be defeated with no steps', () => {
    const state = run(createInitialState(), create);
    expect(state.boss.defeatedAt).toBeNull();
    expect(totalXp(state)).toBe(0);
  });

  it('pays 15 XP per step and is defeated when all steps are done (+100)', () => {
    let state = run(createInitialState(), create, step('s1'), step('s2'), toggle('s1'));
    expect(state.boss.defeatedAt).toBeNull();
    expect(totalXp(state)).toBe(15);

    state = gameReducer(state, toggle('s2'));
    expect(state.boss.defeatedAt).toBe(NOW);
    expect(totalXp(state)).toBe(130);
  });

  it('un-ticking a step removes its XP', () => {
    const state = run(createInitialState(), create, step('s1'), step('s2'), toggle('s1'), toggle('s1'));
    expect(totalXp(state)).toBe(0);
  });

  it('locks a defeated boss', () => {
    const defeated = run(createInitialState(), create, step('s1'), toggle('s1'));
    expect(gameReducer(defeated, toggle('s1'))).toBe(defeated);
    expect(gameReducer(defeated, step('s2'))).toBe(defeated);
    expect(gameReducer(defeated, { type: 'boss/abandon' })).toBe(defeated);
  });

  it('deleting the last unfinished step defeats the boss', () => {
    const state = run(
      createInitialState(),
      create,
      step('s1'),
      step('s2'),
      toggle('s1'),
      { type: 'boss/deleteStep', id: 's2', now: NOW },
    );
    expect(state.boss.defeatedAt).toBe(NOW);
  });

  it('only one active boss at a time', () => {
    const state = run(createInitialState(), create);
    expect(gameReducer(state, { ...create, id: 'boss2' })).toBe(state);
  });

  it('a new boss archives the defeated one and keeps its XP', () => {
    const state = run(createInitialState(), create, step('s1'), toggle('s1'), {
      ...create,
      id: 'boss2',
      title: 'Run a 10k',
    });
    expect(state.boss.id).toBe('boss2');
    expect(state.bossHistory.map((b) => b.id)).toEqual(['boss1']);
    expect(totalXp(state)).toBe(115);
  });

  it('abandoning an active boss removes it', () => {
    const state = run(createInitialState(), create, step('s1'), step('s2'), toggle('s1'), { type: 'boss/abandon' });
    expect(state.boss).toBeNull();
    expect(totalXp(state)).toBe(0);
  });
});
