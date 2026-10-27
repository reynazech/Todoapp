import { useGame } from '../state/GameContext.jsx';
import Button from './ui/Button.jsx';
import Modal from './ui/Modal.jsx';

export default function LevelUpModal() {
  const { levelUp, actions } = useGame();
  if (!levelUp) return null;

  return (
    <Modal open onClose={actions.closeLevelUp} title="Level up!" className="text-center">
      <div className="mx-auto mt-2 size-24 animate-glow rounded-3xl">
        <div className="grid size-24 animate-pop place-items-center rounded-3xl bg-linear-to-br from-lav-200 via-lav-400 to-lav-600 font-display text-5xl font-bold text-ink-950">
          {levelUp.level}
        </div>
      </div>
      <p className="mt-5 font-display text-xl font-semibold text-zinc-100">
        You are now a <span className="text-lav-300">{levelUp.title}</span>
      </p>
      <p className="mt-2 text-sm text-zinc-400">
        New level, same you, slightly more legendary. Next stop: Level {levelUp.level + 1} in {levelUp.toNext} XP.
      </p>
      <Button className="mt-6 w-full" onClick={actions.closeLevelUp} data-autofocus>
        Onward
      </Button>
    </Modal>
  );
}
