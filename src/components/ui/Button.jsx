const VARIANTS = {
  primary:
    'bg-lav-400 text-ink-950 hover:bg-lav-300 shadow-[0_8px_24px_-12px_rgb(176_155_255/0.7)] disabled:bg-ink-700 disabled:text-zinc-500 disabled:shadow-none',
  secondary: 'bg-white/[0.06] text-zinc-200 hover:bg-white/10 ring-1 ring-inset ring-white/[0.08]',
  ghost: 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]',
  danger: 'bg-rose-500/90 text-white hover:bg-rose-500',
};

const SIZES = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-4 text-sm gap-2',
};

export default function Button({ variant = 'primary', size = 'md', className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex shrink-0 items-center justify-center rounded-xl font-semibold transition-colors duration-150 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}

// Square icon-only button. Always give it a label for screen readers.
export function IconButton({ label, className = '', children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
