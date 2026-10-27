export default function Select({ label, value, onChange, options, className = '' }) {
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full cursor-pointer rounded-lg bg-ink-950/60 pl-3 pr-8 text-xs font-medium text-zinc-300 ring-1 ring-inset ring-white/[0.08] transition-colors hover:ring-white/15 focus:outline-none focus:ring-lav-400/60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
