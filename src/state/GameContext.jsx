import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { computeStats } from '../lib/analytics.js';
import { BOSS_DEFEAT_BONUS, BOSS_SUBTASK_XP, STARTER_QUESTS } from '../lib/constants.js';
import { pickMessage } from '../lib/messages.js';
import { localDateKey, makeId } from '../lib/utils.js';
import { levelProgress, totalXp, xpForDifficulty } from '../lib/xp.js';
import { gameReducer } from './reducer.js';
import { loadState, saveState } from './storage.js';

const GameContext = createContext(null);

const TOAST_MS = 4000;

export function GameProvider({ children }) {
  const [boot] = useState(loadState);
  const [state, dispatch] = useReducer(gameReducer, boot.state);
  const [storageStatus, setStorageStatus] = useState(boot.status);
  const [noticeDismissed, setNoticeDismissed] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [levelUp, setLevelUp] = useState(null);

  // Always-current copy of state, so actions can check it (e.g. "is this
  // quest already done?") even before React re-renders.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Save on every change.
  useEffect(() => {
    if (storageStatus === 'unavailable') return;
    if (!saveState(state)) setStorageStatus('unavailable');
  }, [state, storageStatus]);

  // ---- Derived values (calculated, never stored) ----
  const xp = useMemo(() => totalXp(state), [state]);
  const progress = useMemo(() => levelProgress(xp), [xp]);
  const stats = useMemo(() => computeStats(state), [state]);
  const today = localDateKey();
  const energy = state.mood?.date === today ? state.mood.energy : null;

  // Celebrate when the level goes up (but not when the app first loads).
  const lastLevel = useRef(progress.level);
  useEffect(() => {
    if (progress.level > lastLevel.current) setLevelUp(progress);
    lastLevel.current = progress.level;
  }, [progress]);

  // ---- Toasts ----
  const toastCounter = useRef(0);
  const lastMessage = useRef(null);

  const dismissToast = useCallback((id) => {
    setToasts((list) => list.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast) => {
      const id = ++toastCounter.current;
      setToasts((list) => [...list.slice(-2), { id, ...toast }]);
      setTimeout(() => dismissToast(id), TOAST_MS);
    },
    [dismissToast],
  );

  // ---- Actions: the only way components change data ----
  const actions = useMemo(() => {
    const run = (action) => {
      stateRef.current = gameReducer(stateRef.current, action);
      dispatch(action);
    };
    const now = () => new Date().toISOString();
    const findTask = (id) => stateRef.current.tasks.find((task) => task.id === id);
    const cheer = (kind, extra) => {
      const message = pickMessage(kind, { avoid: lastMessage.current });
      lastMessage.current = message;
      pushToast({ message, ...extra });
    };

    return {
      addTask: (fields) => run({ type: 'task/add', id: makeId(), now: now(), ...fields }),
      updateTask: (id, changes) => run({ type: 'task/update', id, changes }),
      deleteTask: (id) => run({ type: 'task/delete', id }),

      completeTask: (id) => {
        const task = findTask(id);
        if (!task || task.status === 'done') return;
        run({ type: 'task/complete', id, now: now() });
        cheer(task.difficulty, { xp: xpForDifficulty(task.difficulty), tone: 'success' });
      },

      reopenTask: (id) => {
        const task = findTask(id);
        if (!task || task.status !== 'done') return;
        run({ type: 'task/reopen', id });
        pushToast({ message: 'Quest reopened. The XP went back in the chest.', xp: -task.xpAwarded, tone: 'neutral' });
      },

      seedStarterQuests: () =>
        run({ type: 'tasks/seed', now: now(), ids: STARTER_QUESTS.map(() => makeId()) }),

      setEnergy: (value) => run({ type: 'mood/set', energy: value, date: localDateKey() }),
      renamePlayer: (name) => run({ type: 'player/rename', name }),

      createBoss: (title) => run({ type: 'boss/create', id: makeId(), title, now: now() }),
      renameBoss: (title) => run({ type: 'boss/rename', title }),
      addBossStep: (title) => run({ type: 'boss/addStep', id: makeId(), title }),
      abandonBoss: () => run({ type: 'boss/abandon' }),

      toggleBossStep: (id) => {
        const boss = stateRef.current.boss;
        const step = boss?.subtasks.find((s) => s.id === id);
        if (!step || boss.defeatedAt) return;
        run({ type: 'boss/toggleStep', id, now: now() });
        if (stateRef.current.boss.defeatedAt) {
          cheer('bossDefeated', { xp: BOSS_SUBTASK_XP + BOSS_DEFEAT_BONUS, tone: 'epic' });
        } else if (!step.done) {
          cheer('bossHit', { xp: BOSS_SUBTASK_XP, tone: 'success' });
        } else {
          pushToast({ message: 'Step un-ticked. The boss regains a sliver of HP.', xp: -BOSS_SUBTASK_XP, tone: 'neutral' });
        }
      },

      deleteBossStep: (id) => {
        if (!stateRef.current.boss || stateRef.current.boss.defeatedAt) return;
        run({ type: 'boss/deleteStep', id, now: now() });
        if (stateRef.current.boss?.defeatedAt) {
          cheer('bossDefeated', { xp: BOSS_DEFEAT_BONUS, tone: 'epic' });
        }
      },

      dismissToast,
      closeLevelUp: () => setLevelUp(null),
      dismissStorageNotice: () => setNoticeDismissed(true),
    };
  }, [pushToast, dismissToast]);

  const storageNotice =
    !noticeDismissed && (storageStatus === 'recovered' || storageStatus === 'unavailable') ? storageStatus : null;

  const value = { state, xp, progress, stats, energy, storageNotice, toasts, levelUp, actions };
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const game = useContext(GameContext);
  if (!game) throw new Error('useGame must be used inside <GameProvider>');
  return game;
}
