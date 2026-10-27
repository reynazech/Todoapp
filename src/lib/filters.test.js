import { describe, expect, it } from 'vitest';
import { filterQuests } from './filters.js';

const tasks = [
  { id: 'a', status: 'active', category: 'Career', difficulty: 'easy', createdAt: '2026-10-01', completedAt: null },
  { id: 'b', status: 'done', category: 'Health', difficulty: 'hard', createdAt: '2026-10-02', completedAt: '2026-10-05' },
  { id: 'c', status: 'active', category: 'Health', difficulty: 'hard', createdAt: '2026-10-03', completedAt: null },
  { id: 'd', status: 'done', category: 'Career', difficulty: 'easy', createdAt: '2026-10-04', completedAt: '2026-10-06' },
];

const ids = (list) => list.map((t) => t.id);

describe('filterQuests', () => {
  it('shows active first (newest first), then done (latest completed first)', () => {
    expect(ids(filterQuests(tasks))).toEqual(['c', 'a', 'd', 'b']);
  });

  it('combines status, category and difficulty filters', () => {
    expect(ids(filterQuests(tasks, { status: 'active' }))).toEqual(['c', 'a']);
    expect(ids(filterQuests(tasks, { category: 'Health' }))).toEqual(['c', 'b']);
    expect(ids(filterQuests(tasks, { status: 'done', difficulty: 'easy' }))).toEqual(['d']);
    expect(filterQuests(tasks, { category: 'Learning' })).toEqual([]);
  });

  it('does not mutate the original list', () => {
    const copy = [...tasks];
    filterQuests(tasks);
    expect(tasks).toEqual(copy);
  });
});
