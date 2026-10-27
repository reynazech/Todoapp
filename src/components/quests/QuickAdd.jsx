import { useRef, useState } from 'react';
import { CATEGORIES, DIFFICULTIES, DIFFICULTY_ORDER, TITLE_MAX_LENGTH } from '../../lib/constants.js';
import { useGame } from '../../state/GameContext.jsx';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import Segmented from '../ui/Segmented.jsx';
import Select from '../ui/Select.jsx';

const difficultyOptions = DIFFICULTY_ORDER.map((value) => ({
  value,
  label: (
    <>
      {DIFFICULTIES[value].label}
      <span className="text-[10px] text-zinc-500">{DIFFICULTIES[value].xp}</span>
    </>
  ),
}));

const categoryOptions = CATEGORIES.map((category) => ({ value: category, label: category }));

export default function QuickAdd() {
  const { actions } = useGame();
  const inputRef = useRef(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personal');
  const [difficulty, setDifficulty] = useState('easy');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!title.trim()) {
      setError('Give your quest a name first.');
      inputRef.current?.focus();
      return;
    }
    actions.addTask({ title, category, difficulty });
    setTitle('');
    setError('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-2">
      <div className="flex gap-2">
        <label htmlFor="quick-add" className="sr-only">
          New quest
        </label>
        <input
          id="quick-add"
          ref={inputRef}
          value={title}
          maxLength={TITLE_MAX_LENGTH}
          onChange={(event) => {
            setTitle(event.target.value);
            if (error) setError('');
          }}
          placeholder="Add a quest… e.g. Book the dentist"
          autoComplete="off"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'quick-add-error' : undefined}
          className="h-11 min-w-0 flex-1 rounded-xl bg-ink-950/60 px-3.5 text-[15px] text-zinc-100 ring-1 ring-inset ring-white/[0.08] transition-shadow placeholder:text-zinc-600 focus:outline-none focus:ring-lav-400/60 aria-invalid:ring-rose-400/50 sm:text-sm"
        />
        <Button type="submit" aria-label="Add quest" className="px-3 sm:px-4">
          <Icon name="plus" className="size-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">Add</span>
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Select label="Category for new quest" value={category} onChange={setCategory} options={categoryOptions} className="w-32" />
        <Segmented
          label="Difficulty for new quest"
          options={difficultyOptions}
          value={difficulty}
          onChange={setDifficulty}
          className="min-w-56 flex-1 p-0.5"
        />
      </div>
      {error && (
        <p id="quick-add-error" className="text-xs text-rose-300">
          {error}
        </p>
      )}
    </form>
  );
}
