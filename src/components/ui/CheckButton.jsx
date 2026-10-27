import Icon from './Icon.jsx';

// Round checkbox with a 44px tap area (comfortable on phones).
export default function CheckButton({ done, onClick, label, disabled = false, small = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={done}
      disabled={disabled}
      className={`group/check -m-1.5 grid shrink-0 place-items-center rounded-full disabled:cursor-default ${small ? 'size-10' : 'size-11'}`}
    >
      <span
        className={`grid place-items-center rounded-full border-2 transition-all duration-200 ${small ? 'size-5' : 'size-6'} ${
          done
            ? 'border-lav-400 bg-lav-400 text-ink-950'
            : 'border-ink-600 text-transparent group-hover/check:border-lav-400 group-hover/check:text-lav-400/70 group-disabled/check:border-ink-700'
        }`}
      >
        <Icon name="check" strokeWidth={3} className={`${small ? 'size-3' : 'size-3.5'} ${done ? 'animate-pop' : ''}`} />
      </span>
    </button>
  );
}
