// Simple, readable rules: each energy level allows some difficulties (in order
// of preference) and may prefer some categories.
const RULES = {
  low: { difficulties: ['easy'], preferredCategories: ['Health', 'Personal'] },
  medium: { difficulties: ['medium', 'easy'], preferredCategories: [] },
  high: { difficulties: ['hard', 'medium'], preferredCategories: [] },
};

export function recommendQuests(tasks, energy, limit = 3) {
  const rule = RULES[energy];
  if (!rule) return [];

  const score = (task) =>
    rule.difficulties.indexOf(task.difficulty) * 10 +
    (rule.preferredCategories.includes(task.category) ? 0 : 1);

  return tasks
    .filter((task) => task.status === 'active' && rule.difficulties.includes(task.difficulty))
    .sort((a, b) => score(a) - score(b) || a.createdAt.localeCompare(b.createdAt))
    .slice(0, limit);
}
