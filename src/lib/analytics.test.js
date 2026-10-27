import { describe, expect, it } from 'vitest';
import { computeStats } from './analytics.js';

const empty = { tasks: [], boss: null, bossHistory: [] };
const now = new Date('2026-10-27T12:00:00Z');

describe('computeStats', () => {
  it('shows no completion rate (not NaN) when there are no quests', () => {
    const stats = computeStats(empty, now);
    expect(stats.completionRate).toBeNull();
    expect(stats.completed).toBe(0);
    expect(stats.xpTotal).toBe(0);
    expect(stats.categories.every((c) => c.count === 0 && c.percent === 0)).toBe(true);
  });

  it('counts completion, categories, and XP this week', () => {
    const state = {
      ...empty,
      tasks: [
        { status: 'done', category: 'Health', xpAwarded: 10, completedAt: '2026-10-26T10:00:00Z' },
        { status: 'done', category: 'Health', xpAwarded: 50, completedAt: '2026-09-01T10:00:00Z' },
        { status: 'done', category: 'Career', xpAwarded: 25, completedAt: '2026-10-25T10:00:00Z' },
        { status: 'active', category: 'Learning', xpAwarded: 0, completedAt: null },
      ],
      boss: {
        subtasks: [
          { done: true, doneAt: '2026-10-26T09:00:00Z' },
          { done: false, doneAt: null },
        ],
        defeatedAt: null,
      },
    };
    const stats = computeStats(state, now);
    expect(stats.total).toBe(4);
    expect(stats.completed).toBe(3);
    expect(stats.completionRate).toBe(75);
    expect(stats.xpTotal).toBe(10 + 50 + 25 + 15);
    expect(stats.xpThisWeek).toBe(10 + 25 + 15);
    expect(stats.categories.find((c) => c.category === 'Health')).toEqual({
      category: 'Health',
      count: 2,
      percent: 67,
    });
  });

  it('counts defeated bosses from history and the current boss', () => {
    const state = {
      ...empty,
      boss: { subtasks: [{ done: true }], defeatedAt: '2026-10-20' },
      bossHistory: [{ subtasks: [{ done: true }], defeatedAt: '2026-09-20' }],
    };
    expect(computeStats(state, now).bossesDefeated).toBe(2);
  });
});
