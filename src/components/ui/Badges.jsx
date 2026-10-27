import { CATEGORY_STYLES, DIFFICULTIES } from '../../lib/constants.js';
import Icon from './Icon.jsx';

export function CategoryChip({ category }) {
  const style = CATEGORY_STYLES[category];
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${style.chip}`}>
      <Icon name={style.icon} className="size-3" />
      {category}
    </span>
  );
}

export function DifficultyPips({ difficulty, showLabel = true }) {
  const { label, pips } = DIFFICULTIES[difficulty];
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-400" title={`${label} quest`}>
      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span key={n} className={`size-1.5 rotate-45 rounded-[1px] ${n <= pips ? 'bg-lav-400' : 'bg-ink-600'}`} />
        ))}
      </span>
      {showLabel ? label : <span className="sr-only">{label}</span>}
    </span>
  );
}

export function XpBadge({ xp, muted = false }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-1.5 py-0.5 font-display text-[11px] font-semibold tabular-nums ${
        muted ? 'bg-white/[0.04] text-zinc-500' : 'bg-lav-400/10 text-lav-300'
      }`}
    >
      +{xp} XP
    </span>
  );
}
