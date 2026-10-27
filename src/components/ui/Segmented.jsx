// A row of mutually exclusive buttons (like radio buttons, but prettier).
export default function Segmented({ label, options, value, onChange, disabled = false, className = '' }) {
  return (
    <div role="radiogroup" aria-label={label} className={`flex rounded-xl bg-ink-950/60 p-1 ring-1 ring-inset ring-white/[0.06] ${className}`}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              selected ? 'bg-ink-700 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-200'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
