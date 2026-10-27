import {
  CATEGORIES,
  DIFFICULTIES,
  ENERGY_LEVELS,
  NAME_MAX_LENGTH,
  NOTES_MAX_LENGTH,
  STARTER_QUESTS,
  TITLE_MAX_LENGTH,
} from '../lib/constants.js';
import { cleanLine, cleanText } from '../lib/utils.js';
import { xpForDifficulty } from '../lib/xp.js';

// Every change to the app's data goes through this one function.
// It never generates ids or timestamps itself (those arrive in the action),
// which keeps it predictable and easy to test.

function newTask({ id, title, notes, category, difficulty, now }) {
  return {
    id,
    title,
    notes: cleanText(notes, NOTES_MAX_LENGTH),
    category: CATEGORIES.includes(category) ? category : 'Personal',
    difficulty: difficulty in DIFFICULTIES ? difficulty : 'easy',
    status: 'active',
    createdAt: now,
    completedAt: null,
    xpAwarded: 0,
  };
}

function updateTaskById(state, id, update) {
  let changed = false;
  const tasks = state.tasks.map((task) => {
    if (task.id !== id) return task;
    const next = update(task);
    if (next !== task) changed = true;
    return next;
  });
  return changed ? { ...state, tasks } : state;
}

// The boss falls automatically once every step is done.
function withDefeatCheck(boss, now) {
  const allDone = boss.subtasks.length > 0 && boss.subtasks.every((step) => step.done);
  return allDone ? { ...boss, defeatedAt: now } : boss;
}

const bossIsActive = (state) => Boolean(state.boss) && !state.boss.defeatedAt;

export function gameReducer(state, action) {
  switch (action.type) {
    case 'task/add': {
      const title = cleanLine(action.title, TITLE_MAX_LENGTH);
      if (!title) return state;
      return { ...state, tasks: [newTask({ ...action, title }), ...state.tasks] };
    }

    case 'task/update':
      return updateTaskById(state, action.id, (task) => {
        const changes = action.changes ?? {};
        const next = { ...task };
        if ('title' in changes) {
          const title = cleanLine(changes.title, TITLE_MAX_LENGTH);
          if (title) next.title = title;
        }
        if ('notes' in changes) next.notes = cleanText(changes.notes, NOTES_MAX_LENGTH);
        if (CATEGORIES.includes(changes.category)) next.category = changes.category;
        // Difficulty is locked once XP has been paid out.
        if (changes.difficulty in DIFFICULTIES && task.status === 'active') {
          next.difficulty = changes.difficulty;
        }
        return next;
      });

    case 'task/complete':
      return updateTaskById(state, action.id, (task) =>
        task.status === 'done'
          ? task // already done: completing twice must not pay twice
          : {
              ...task,
              status: 'done',
              completedAt: action.now,
              xpAwarded: xpForDifficulty(task.difficulty),
            },
      );

    case 'task/reopen':
      return updateTaskById(state, action.id, (task) =>
        task.status === 'active' ? task : { ...task, status: 'active', completedAt: null, xpAwarded: 0 },
      );

    case 'task/delete':
      return { ...state, tasks: state.tasks.filter((task) => task.id !== action.id) };

    case 'tasks/seed':
      if (state.tasks.length > 0) return state;
      return {
        ...state,
        tasks: STARTER_QUESTS.map((quest, i) => newTask({ ...quest, id: action.ids[i], now: action.now })),
      };

    case 'mood/set':
      if (!(action.energy in ENERGY_LEVELS)) return state;
      return { ...state, mood: { date: action.date, energy: action.energy } };

    case 'player/rename': {
      const name = cleanLine(action.name, NAME_MAX_LENGTH);
      return name ? { ...state, player: { ...state.player, name } } : state;
    }

    case 'boss/create': {
      const title = cleanLine(action.title, TITLE_MAX_LENGTH);
      if (!title || bossIsActive(state)) return state;
      // A defeated boss moves into history so its XP is kept.
      const bossHistory = state.boss ? [state.boss, ...state.bossHistory] : state.bossHistory;
      return {
        ...state,
        bossHistory,
        boss: { id: action.id, title, subtasks: [], createdAt: action.now, defeatedAt: null },
      };
    }

    case 'boss/rename': {
      const title = cleanLine(action.title, TITLE_MAX_LENGTH);
      if (!title || !state.boss) return state;
      return { ...state, boss: { ...state.boss, title } };
    }

    case 'boss/addStep': {
      const title = cleanLine(action.title, TITLE_MAX_LENGTH);
      if (!title || !bossIsActive(state)) return state;
      const step = { id: action.id, title, done: false, doneAt: null };
      return { ...state, boss: { ...state.boss, subtasks: [...state.boss.subtasks, step] } };
    }

    case 'boss/toggleStep': {
      if (!bossIsActive(state)) return state;
      const subtasks = state.boss.subtasks.map((step) =>
        step.id === action.id
          ? { ...step, done: !step.done, doneAt: step.done ? null : action.now }
          : step,
      );
      return { ...state, boss: withDefeatCheck({ ...state.boss, subtasks }, action.now) };
    }

    case 'boss/deleteStep': {
      if (!bossIsActive(state)) return state;
      const subtasks = state.boss.subtasks.filter((step) => step.id !== action.id);
      return { ...state, boss: withDefeatCheck({ ...state.boss, subtasks }, action.now) };
    }

    case 'boss/abandon':
      return bossIsActive(state) ? { ...state, boss: null } : state;

    default:
      return state;
  }
}
