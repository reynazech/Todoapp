import { describe, expect, it } from 'vitest';
import { recommendQuests } from './recommend.js';

const task = (id, difficulty, category = 'Career', createdAt = '2026-10-01', status = 'active') => ({
  id,
  difficulty,
  category,
  createdAt,
  status,
});

const tasks = [
  task('e-career', 'easy', 'Career', '2026-10-01'),
  task('e-health', 'easy', 'Health', '2026-10-05'),
  task('m-old', 'medium', 'Learning', '2026-10-02'),
  task('m-new', 'medium', 'Learning', '2026-10-09'),
  task('h1', 'hard', 'Career', '2026-10-03'),
  task('h-done', 'hard', 'Career', '2026-09-01', 'done'),
];

const ids = (list) => list.map((t) => t.id);

describe('recommendQuests', () => {
  it('low energy: only easy quests, Health/Personal first', () => {
    expect(ids(recommendQuests(tasks, 'low'))).toEqual(['e-health', 'e-career']);
  });

  it('medium energy: medium first (oldest first), then easy', () => {
    expect(ids(recommendQuests(tasks, 'medium'))).toEqual(['m-old', 'm-new', 'e-career']);
  });

  it('high energy: hard first, never completed quests', () => {
    expect(ids(recommendQuests(tasks, 'high'))).toEqual(['h1', 'm-old', 'm-new']);
  });

  it('returns nothing when no energy is set or nothing matches', () => {
    expect(recommendQuests(tasks, null)).toEqual([]);
    expect(recommendQuests([task('m', 'medium')], 'low')).toEqual([]);
  });

  it('respects the limit', () => {
    expect(recommendQuests(tasks, 'medium', 1)).toHaveLength(1);
  });
});
