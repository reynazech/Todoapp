import { CATEGORY_STYLES } from '../lib/constants.js';
import { useGame } from '../state/GameContext.jsx';
import Card, { CardHeader } from './ui/Card.jsx';
import Icon from './ui/Icon.jsx';

function Stat({ label, value, suffix, sub }) {
  return (
    <div className="rounded-xl bg-ink-950/50 p-3 ring-1 ring-inset ring-white/[0.04]">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-zinc-100">
        {value}
        {suffix && value !== '—' && <span className="ml-0.5 text-base text-zinc-500">{suffix}</span>}
      </p>
      {sub && <p className="mt-0.5 text-xs text-zinc-500">{sub}</p>}
    </div>
  );
}

export default function StatsPanel() {
  const { stats } = useGame();

  return (
    <Card className="p-4 sm:p-5">
      <CardHeader icon={<Icon name="chart" className="size-4 text-lav-300" />} title="Adventure stats" />

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat label="Quests done" value={stats.completed} sub={`${stats.active} still active`} />
        <Stat
          label="Completion"
          value={stats.completionRate ?? '—'}
          suffix="%"
          sub={stats.total ? `${stats.completed} of ${stats.total} quests` : 'No quests yet'}
        />
        <Stat label="XP earned" value={stats.xpTotal.toLocaleString()} sub={`+${stats.xpThisWeek} in the last 7 days`} />
        <Stat label="Bosses beaten" value={stats.bossesDefeated} />
      </div>

      <h3 className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Completed by category</h3>
      {stats.completed === 0 ? (
        <p className="mt-2 text-sm text-zinc-500">Complete a quest to see where your XP comes from.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {stats.categories.map(({ category, count, percent }) => (
            <li key={category}>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-zinc-300">
                  <span className={`size-2 rounded-full ${CATEGORY_STYLES[category].bar}`} />
                  {category}
                </span>
                <span className="tabular-nums text-zinc-500">
                  {count} · {percent}%
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-950">
                <div
                  className={`h-full rounded-full transition-[width] duration-700 ease-out ${CATEGORY_STYLES[category].bar}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
