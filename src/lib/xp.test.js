import { describe, expect, it } from 'vitest';
import { bossXp, levelFromXp, levelProgress, totalXp, xpForDifficulty, xpToReachLevel } from './xp.js';

describe('xp', () => {
  it('awards XP by difficulty', () => {
    expect(xpForDifficulty('easy')).toBe(10);
    expect(xpForDifficulty('medium')).toBe(25);
    expect(xpForDifficulty('hard')).toBe(50);
    expect(xpForDifficulty('nonsense')).toBe(0);
  });

  it('follows the 100 × level curve', () => {
    expect([1, 2, 3, 4, 5].map(xpToReachLevel)).toEqual([0, 100, 300, 600, 1000]);
  });

  it('computes levels at and around the thresholds', () => {
    expect(levelFromXp(0)).toBe(1);
    expect(levelFromXp(99)).toBe(1);
    expect(levelFromXp(100)).toBe(2);
    expect(levelFromXp(299)).toBe(2);
    expect(levelFromXp(300)).toBe(3);
    expect(levelFromXp(1000)).toBe(5);
  });

  it('never goes below level 1 for bad input', () => {
    expect(levelFromXp(-50)).toBe(1);
    expect(levelFromXp(NaN)).toBe(1);
    expect(levelFromXp(undefined)).toBe(1);
  });

  it('reports progress within the current level', () => {
    const p = levelProgress(450);
    expect(p).toMatchObject({ level: 3, current: 150, needed: 300, toNext: 150, percent: 50 });
    expect(p.title).toBe('Errand Knight');
  });

  it('handles very high XP with a capped title', () => {
    const p = levelProgress(1_000_000);
    expect(p.level).toBeGreaterThan(100);
    expect(p.title).toBe('Grandmaster of Getting Things Done');
  });

  it('sums quests, the current boss and past bosses', () => {
    const state = {
      tasks: [
        { status: 'done', xpAwarded: 25 },
        { status: 'active', xpAwarded: 0 },
        { status: 'done', xpAwarded: 50 },
      ],
      boss: { subtasks: [{ done: true }, { done: false }], defeatedAt: null },
      bossHistory: [{ subtasks: [{ done: true }, { done: true }], defeatedAt: '2026-10-01' }],
    };
    expect(bossXp(state.boss)).toBe(15);
    expect(bossXp(state.bossHistory[0])).toBe(130);
    expect(totalXp(state)).toBe(75 + 15 + 130);
  });
});
