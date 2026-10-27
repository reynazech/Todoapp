import { BOSS_DEFEAT_BONUS, BOSS_SUBTASK_XP, CATEGORIES } from './constants.js';
import { totalXp } from './xp.js';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function computeStats(state, now = new Date()) {
  const total = state.tasks.length;
  const completed = state.tasks.filter((task) => task.status === 'done');
  const weekStart = now.getTime() - WEEK_MS;
  const isRecent = (iso) => Boolean(iso) && new Date(iso).getTime() >= weekStart;

  const bosses = [...state.bossHistory, ...(state.boss ? [state.boss] : [])];

  const xpThisWeek =
    completed
      .filter((task) => isRecent(task.completedAt))
      .reduce((sum, task) => sum + (task.xpAwarded || 0), 0) +
    bosses.reduce(
      (sum, boss) =>
        sum +
        boss.subtasks.filter((step) => step.done && isRecent(step.doneAt)).length * BOSS_SUBTASK_XP +
        (isRecent(boss.defeatedAt) ? BOSS_DEFEAT_BONUS : 0),
      0,
    );

  const categories = CATEGORIES.map((category) => {
    const count = completed.filter((task) => task.category === category).length;
    return {
      category,
      count,
      percent: completed.length ? Math.round((count / completed.length) * 100) : 0,
    };
  });

  return {
    total,
    completed: completed.length,
    active: total - completed.length,
    // null (not 0 or NaN) when there is nothing to measure yet.
    completionRate: total ? Math.round((completed.length / total) * 100) : null,
    xpTotal: totalXp(state),
    xpThisWeek,
    bossesDefeated: bosses.filter((boss) => boss.defeatedAt).length,
    categories,
  };
}
