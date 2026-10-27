import Icon from './ui/Icon.jsx';

export function Header() {
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] lg:pb-6 lg:pt-8">
      <div className="flex items-center gap-3">
        <div className="grid size-9 place-items-center rounded-xl bg-lav-400/15 text-lav-300 ring-1 ring-inset ring-lav-400/25">
          <Icon name="sparkles" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold leading-none tracking-[0.1em] text-zinc-100">
            REYNA <span className="text-lav-400">OS</span>
          </h1>
          <p className="mt-1 hidden text-xs text-zinc-500 sm:block">Your to-do list, now with loot.</p>
        </div>
      </div>
      <p className="text-xs text-zinc-500">{today}</p>
    </header>
  );
}

export const TABS = [
  { id: 'quests', label: 'Quests', icon: 'list' },
  { id: 'boss', label: 'Boss', icon: 'flame' },
  { id: 'stats', label: 'Stats', icon: 'chart' },
];

// Bottom tab bar for phones and tablets. Hidden on large screens, where
// everything fits on one dashboard.
export function BottomNav({ tab, onChange }) {
  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.06] bg-ink-950/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-3">
        {TABS.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => onChange(item.id)}
              className={`relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                active ? 'text-lav-300' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-lav-400" />}
              <Icon name={item.icon} className="size-5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
