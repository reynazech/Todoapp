export const DEFAULT_FILTERS = { status: 'active', category: 'all', difficulty: 'all' };

// Filters the quest list, then sorts: active before done, newest active first,
// most recently completed first.
export function filterQuests(tasks, { status = 'all', category = 'all', difficulty = 'all' } = {}) {
  return tasks
    .filter(
      (task) =>
        (status === 'all' || task.status === status) &&
        (category === 'all' || task.category === category) &&
        (difficulty === 'all' || task.difficulty === difficulty),
    )
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
      if (a.status === 'done') return (b.completedAt ?? '').localeCompare(a.completedAt ?? '');
      return b.createdAt.localeCompare(a.createdAt);
    });
}
