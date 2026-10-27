import { useGame } from '../state/GameContext.jsx';
import { IconButton } from './ui/Button.jsx';
import Icon from './ui/Icon.jsx';

const TONES = {
  success: { icon: 'sparkles', badge: 'bg-lav-400/15 text-lav-300' },
  epic: { icon: 'crown', badge: 'bg-amber-400/15 text-amber-300' },
  neutral: { icon: 'undo', badge: 'bg-white/[0.06] text-zinc-400' },
};

export default function Toasts() {
  const { toasts, actions } = useGame();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 flex flex-col items-center gap-2 sm:items-end lg:bottom-6 lg:left-auto lg:right-6"
    >
      {toasts.map((toast) => {
        const tone = TONES[toast.tone] ?? TONES.success;
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-2xl border border-white/[0.08] bg-ink-800/95 p-3 shadow-2xl shadow-black/50 backdrop-blur"
          >
            <div className={`grid size-9 shrink-0 place-items-center rounded-xl ${tone.badge}`}>
              <Icon name={tone.icon} />
            </div>
            <div className="min-w-0 flex-1 py-0.5">
              <p className="text-sm leading-snug text-zinc-100">{toast.message}</p>
              {toast.xp ? (
                <p className={`mt-0.5 font-display text-xs font-semibold tabular-nums ${toast.xp > 0 ? 'text-lav-300' : 'text-zinc-500'}`}>
                  {toast.xp > 0 ? '+' : '−'}
                  {Math.abs(toast.xp)} XP
                </p>
              ) : null}
            </div>
            <IconButton label="Dismiss" className="-my-1 -mr-1 size-8" onClick={() => actions.dismissToast(toast.id)}>
              <Icon name="x" className="size-3.5" />
            </IconButton>
          </div>
        );
      })}
    </div>
  );
}
