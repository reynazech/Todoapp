import { useRef, useState } from 'react';
import { NAME_MAX_LENGTH } from '../lib/constants.js';
import { useGame } from '../state/GameContext.jsx';
import Card from './ui/Card.jsx';
import Icon from './ui/Icon.jsx';

export default function PlayerCard() {
  const { state, progress, actions } = useGame();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const cancelled = useRef(false);
  const name = state.player.name;

  const startEditing = () => {
    setDraft(name);
    setEditing(true);
  };

  // Called by Enter and by clicking away. Escape cancels instead.
  const saveName = (event) => {
    event.preventDefault();
    if (!cancelled.current) actions.renamePlayer(draft);
    cancelled.current = false;
    setEditing(false);
  };

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="grid size-14 place-items-center rounded-2xl bg-linear-to-br from-lav-300 to-lav-600 font-display text-2xl font-bold text-ink-950 shadow-[0_10px_30px_-10px_rgb(148_121_247/0.8)]">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="absolute -bottom-1.5 -right-2 rounded-md bg-ink-950 px-1.5 py-0.5 font-display text-[10px] font-bold text-lav-300 ring-1 ring-lav-400/40">
            Lv {progress.level}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          {editing ? (
            <form onSubmit={saveName} className="flex items-center gap-1">
              <label htmlFor="player-name" className="sr-only">
                Player name
              </label>
              <input
                id="player-name"
                autoFocus
                value={draft}
                maxLength={NAME_MAX_LENGTH}
                onChange={(event) => setDraft(event.target.value)}
                onBlur={saveName}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    cancelled.current = true;
                    event.currentTarget.blur();
                  }
                }}
                className="h-8 w-full min-w-0 rounded-lg bg-ink-950/70 px-2 font-display text-base font-semibold text-zinc-100 ring-1 ring-inset ring-lav-400/50 focus:outline-none"
              />
            </form>
          ) : (
            <button
              type="button"
              onClick={startEditing}
              className="group flex max-w-full items-center gap-1.5 text-left"
              title="Rename your hero"
            >
              <span className="truncate font-display text-lg font-semibold text-zinc-100">{name}</span>
              <Icon name="pencil" className="size-3.5 shrink-0 text-zinc-600 transition-colors group-hover:text-lav-300" />
            </button>
          )}
          <p className="truncate text-sm text-lav-300">{progress.title}</p>
        </div>

        <div className="shrink-0 text-right">
          <p className="font-display text-xl font-semibold tabular-nums text-zinc-100">{progress.totalXp.toLocaleString()}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Total XP</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between text-xs">
          <span className="font-medium text-zinc-400">Level {progress.level}</span>
          <span className="tabular-nums text-zinc-500">
            {progress.current} / {progress.needed} XP
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="XP toward next level"
          aria-valuemin={0}
          aria-valuemax={progress.needed}
          aria-valuenow={progress.current}
          className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-ink-950 ring-1 ring-inset ring-white/5"
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-lav-600 via-lav-400 to-lav-200 transition-[width] duration-700 ease-out"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-zinc-500">
          <span className="tabular-nums text-zinc-400">{progress.toNext} XP</span> to Level {progress.level + 1}
        </p>
      </div>
    </Card>
  );
}
