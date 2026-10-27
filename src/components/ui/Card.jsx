export default function Card({ as: Tag = 'section', className = '', children, ...props }) {
  return (
    <Tag
      className={`rounded-2xl border border-white/[0.06] bg-ink-900/80 shadow-[0_1px_0_0_rgb(255_255_255/0.04)_inset,0_20px_40px_-24px_rgb(0_0_0/0.8)] backdrop-blur ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ icon, title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 font-display text-[15px] font-semibold tracking-tight text-zinc-100">
          {icon}
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 text-sm text-zinc-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
