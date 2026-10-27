import { useMemo } from 'react';
import { ENERGY_LEVELS, ENERGY_ORDER } from '../lib/constants.js';
import { recommendQuests } from '../lib/recommend.js';
import { xpForDifficulty } from '../lib/xp.js';
import { useGame } from '../state/GameContext.jsx';
import { CategoryChip, DifficultyPips, XpBadge } from './ui/Badges.jsx';
import Card, { CardHeader } from './ui/Card.jsx';
import CheckButton from './ui/CheckButton.jsx';
import Icon from './ui/Icon.jsx';

const EMPTY_HINTS = {
  low: "No easy quests waiting. Add a tiny one — 'drink water' absolutely counts.",
  medium: 'Nothing easy or medium on the board. Add a quest that fits today.',
  high: 'No hard or medium quests to fight. Add a big one while the energy lasts!',
};

function EnergyMeter({ bars, active }) {
  return (
    <span className="flex h-5 items-end gap-0.5" aria-hidden="true">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          style={{ height: `${n * 33}%` }}
          className={`w-1.5 rounded-sm transition-colors ${n <= bars ? (active ? 'bg-lav-300' : 'bg-zinc-500') : 'bg-ink-700'}`}
        />
      ))}
    </span>
  );
}

export default function MoodPanel() {
  const { state, energy, actions } = useGame();
  const suggestions = useMemo(() => recommendQuests(state.tasks, energy), [state.tasks, energy]);

  return (
    <Card className="p-4 sm:p-5">
      <CardHeader
        icon={<Icon name="bolt" className="size-4 text-lav-300" />}
        title="Today's energy"
        subtitle={energy ? ENERGY_LEVELS[energy].hint : "How are you feeling? I'll pick quests to match."}
      />

      <div role="radiogroup" aria-label="Energy level" className="mt-4 grid grid-cols-3 gap-2">
        {ENERGY_ORDER.map((level) => {
          const selected = energy === level;
          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => actions.setEnergy(level)}
              className={`flex h-16 flex-col items-center justify-center gap-1.5 rounded-xl border text-xs font-medium transition-colors ${
                selected
                  ? 'border-lav-400/50 bg-lav-400/10 text-lav-200'
                  : 'border-white/[0.06] bg-ink-950/40 text-zinc-400 hover:border-white/15 hover:text-zinc-200'
              }`}
            >
              <EnergyMeter bars={ENERGY_LEVELS[level].bars} active={selected} />
              {ENERGY_LEVELS[level].label}
            </button>
          );
        })}
      </div>

      {energy && (
        <div className="mt-5">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Suggested for you</h3>
          {suggestions.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {suggestions.map((task) => (
                <li
                  key={task.id}
                  className="flex animate-fade-in items-center gap-2.5 rounded-xl bg-ink-950/40 py-2 pl-2.5 pr-3 ring-1 ring-inset ring-white/[0.04]"
                >
                  <CheckButton small done={false} onClick={() => actions.completeTask(task.id)} label={`Complete "${task.title}"`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-zinc-200">{task.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <CategoryChip category={task.category} />
                      <DifficultyPips difficulty={task.difficulty} showLabel={false} />
                    </div>
                  </div>
                  <XpBadge xp={xpForDifficulty(task.difficulty)} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 rounded-xl border border-dashed border-white/10 p-3 text-sm text-zinc-500">{EMPTY_HINTS[energy]}</p>
          )}
        </div>
      )}
    </Card>
  );
}
