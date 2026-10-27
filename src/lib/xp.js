import { BOSS_DEFEAT_BONUS, BOSS_SUBTASK_XP, DIFFICULTIES } from './constants.js';

export function xpForDifficulty(difficulty) {
  return DIFFICULTIES[difficulty]?.xp ?? 0;
}

// Total XP needed to *reach* a level. Going from level n to n+1 costs 100 × n,
// so the totals are 0, 100, 300, 600, 1000, ... (50 × (level-1) × level).
export function xpToReachLevel(level) {
  return 50 * (level - 1) * level;
}

export function levelFromXp(xp) {
  const safeXp = Math.max(0, Math.floor(Number(xp) || 0));
  let level = 1;
  while (xpToReachLevel(level + 1) <= safeXp) level++;
  return level;
}

const TITLES = [
  'Fresh Recruit',
  'Apprentice Doer',
  'Errand Knight',
  'Inbox Ranger',
  'Deadline Duelist',
  'Procrastination Slayer',
  'Focus Sorcerer',
  'Chaos Tamer',
  'Legend of the List',
  'Grandmaster of Getting Things Done',
];

export function titleForLevel(level) {
  return TITLES[Math.min(Math.max(level, 1), TITLES.length) - 1];
}

// Everything the XP bar needs, in one object.
export function levelProgress(xp) {
  const totalXp = Math.max(0, Math.floor(Number(xp) || 0));
  const level = levelFromXp(totalXp);
  const start = xpToReachLevel(level);
  const end = xpToReachLevel(level + 1);
  const current = totalXp - start;
  const needed = end - start;
  return {
    level,
    title: titleForLevel(level),
    totalXp,
    current,
    needed,
    toNext: end - totalXp,
    percent: (current / needed) * 100,
  };
}

export function bossXp(boss) {
  if (!boss) return 0;
  const hits = boss.subtasks.filter((step) => step.done).length * BOSS_SUBTASK_XP;
  return hits + (boss.defeatedAt ? BOSS_DEFEAT_BONUS : 0);
}

// XP is never stored as a running total. It is always recalculated from the
// quests and bosses, so it can never drift out of sync with them.
export function totalXp(state) {
  const questXp = state.tasks.reduce(
    (sum, task) => (task.status === 'done' ? sum + (task.xpAwarded || 0) : sum),
    0,
  );
  const pastBossXp = state.bossHistory.reduce((sum, boss) => sum + bossXp(boss), 0);
  return questXp + bossXp(state.boss) + pastBossXp;
}
