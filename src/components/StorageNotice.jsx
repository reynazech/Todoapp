import { useGame } from '../state/GameContext.jsx';
import { IconButton } from './ui/Button.jsx';
import Icon from './ui/Icon.jsx';

const TEXT = {
  recovered:
    "Your saved progress couldn't be read, so REYNA OS started fresh. A backup copy of the old data was kept in this browser.",
  unavailable: "This browser is blocking storage (or it's full), so progress won't survive a refresh.",
};

export default function StorageNotice() {
  const { storageNotice, actions } = useGame();
  if (!storageNotice) return null;

  return (
    <div role="status" className="mx-auto max-w-7xl px-4">
      <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-100">
        <Icon name="alert" className="mt-0.5 size-4 shrink-0 text-amber-300" />
        <p className="flex-1">{TEXT[storageNotice]}</p>
        <IconButton label="Dismiss notice" className="-my-2 -mr-2 size-9 text-amber-200/70" onClick={actions.dismissStorageNotice}>
          <Icon name="x" className="size-3.5" />
        </IconButton>
      </div>
    </div>
  );
}
