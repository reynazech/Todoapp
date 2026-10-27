const MESSAGES = {
  easy: [
    'Quick win secured. Momentum: acquired.',
    'Small quest, real XP. The economy of champions.',
    'Done before it could become a whole thing.',
    'Easy? Sure. But you still did it.',
    'Another one off the board. Smooth.',
  ],
  medium: [
    'Solid hit. Your future self sends regards.',
    'Medium quest cleared. Respectably heroic.',
    'That was a real task and you just ate it for breakfast.',
    'Progress bar goes brrr.',
    'Look at you, being reliable on purpose.',
  ],
  hard: [
    'Hard quest down. Somewhere, a bard is writing about you.',
    'That one had teeth. You pulled them.',
    'Legendary effort. Take a sip of water, champion.',
    'You just did the thing you were avoiding. Iconic.',
    'Big quest, bigger energy. Well played.',
  ],
  bossHit: [
    'Direct hit! The boss looks nervous.',
    'One step closer. The boss felt that.',
    'Critical damage. Keep swinging.',
    'The boss is losing HP and confidence.',
  ],
  bossDefeated: [
    'BOSS DEFEATED. Loot acquired, legend updated.',
    'The big goal has fallen. Take a victory lap.',
    'Boss down! Frame this moment.',
  ],
};

// Picks a random line for the given kind, avoiding an immediate repeat.
export function pickMessage(kind, { random = Math.random, avoid = null } = {}) {
  const pool = MESSAGES[kind] ?? MESSAGES.easy;
  const options = pool.length > 1 ? pool.filter((line) => line !== avoid) : pool;
  return options[Math.floor(random() * options.length)];
}

export const MESSAGE_KINDS = Object.keys(MESSAGES);
