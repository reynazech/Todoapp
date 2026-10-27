import { useEffect, useId, useRef } from 'react';

// Bottom sheet on phones, centered dialog on larger screens.
// Closes on Escape or a click on the backdrop, and returns focus afterwards.
export default function Modal({ open, onClose, title, children, className = '' }) {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    const firstField = panelRef.current?.querySelector('input, textarea, select, button[data-autofocus]');
    (firstField ?? panelRef.current)?.focus();

    const onKey = (event) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 animate-fade-in bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative max-h-[92dvh] w-full animate-rise overflow-y-auto rounded-t-3xl border border-white/[0.08] bg-ink-900 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl outline-none sm:max-w-lg sm:rounded-3xl sm:p-6 ${className}`}
      >
        <h2 id={titleId} className="font-display text-lg font-semibold text-zinc-100">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
