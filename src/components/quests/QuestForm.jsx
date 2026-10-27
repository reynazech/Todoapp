import { useState } from 'react';
import {
  CATEGORIES,
  CATEGORY_STYLES,
  DIFFICULTIES,
  DIFFICULTY_ORDER,
  NOTES_MAX_LENGTH,
  TITLE_MAX_LENGTH,
} from '../../lib/constants.js';
import { useGame } from '../../state/GameContext.jsx';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import Modal from '../ui/Modal.jsx';
import Segmented from '../ui/Segmented.jsx';

const fieldClass =
  'w-full rounded-xl bg-ink-950/60 px-3.5 text-[15px] text-zinc-100 ring-1 ring-inset ring-white/[0.08] placeholder:text-zinc-600 focus:outline-none focus:ring-lav-400/60 sm:text-sm';

function Label({ htmlFor, children, extra }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between">
      <label htmlFor={htmlFor} className="text-xs font-semibold text-zinc-400">
        {children}
      </label>
      {extra}
    </div>
  );
}

// Edit dialog for a quest. Rendered only while editing, so its fields start
// fresh from the quest each time.
export default function QuestForm({ task, onClose }) {
  const { actions } = useGame();
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes);
  const [category, setCategory] = useState(task.category);
  const [difficulty, setDifficulty] = useState(task.difficulty);
  const [error, setError] = useState('');
  const done = task.status === 'done';

  const submit = (event) => {
    event.preventDefault();
    if (!title.trim()) {
      setError('A quest needs a name.');
      return;
    }
    actions.updateTask(task.id, { title, notes, category, difficulty });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="Edit quest">
      <form onSubmit={submit} noValidate className="space-y-5">
        <div>
          <Label
            htmlFor="quest-title"
            extra={<span className="text-[11px] tabular-nums text-zinc-600">{title.length}/{TITLE_MAX_LENGTH}</span>}
          >
            Quest name
          </Label>
          <input
            id="quest-title"
            value={title}
            maxLength={TITLE_MAX_LENGTH}
            onChange={(event) => {
              setTitle(event.target.value);
              setError('');
            }}
            aria-invalid={Boolean(error)}
            className={`${fieldClass} h-11 aria-invalid:ring-rose-400/50`}
          />
          {error && <p className="mt-1.5 text-xs text-rose-300">{error}</p>}
        </div>

        <div>
          <Label htmlFor="quest-notes" extra={<span className="text-[11px] text-zinc-600">optional</span>}>
            Notes
          </Label>
          <textarea
            id="quest-notes"
            value={notes}
            rows={3}
            maxLength={NOTES_MAX_LENGTH}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Details, links, battle plans…"
            className={`${fieldClass} resize-none py-2.5`}
          />
        </div>

        <fieldset>
          <legend className="mb-1.5 text-xs font-semibold text-zinc-400">Category</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CATEGORIES.map((option) => {
              const selected = option === category;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setCategory(option)}
                  className={`flex h-10 items-center justify-center gap-1.5 rounded-xl text-xs font-medium ring-1 ring-inset transition-colors ${
                    selected ? CATEGORY_STYLES[option].chip : 'text-zinc-500 ring-white/[0.08] hover:text-zinc-200'
                  }`}
                >
                  <Icon name={CATEGORY_STYLES[option].icon} className="size-3.5" />
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-1.5 text-xs font-semibold text-zinc-400">Difficulty</legend>
          <Segmented
            label="Difficulty"
            value={difficulty}
            onChange={setDifficulty}
            disabled={done}
            options={DIFFICULTY_ORDER.map((value) => ({
              value,
              label: `${DIFFICULTIES[value].label} · ${DIFFICULTIES[value].xp} XP`,
            }))}
          />
          {done && (
            <p className="mt-1.5 text-xs text-zinc-500">Locked: this quest already paid out its XP. Reopen it to change difficulty.</p>
          )}
        </fieldset>

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </Modal>
  );
}
