import { CATEGORIES, DIFFICULTIES, DIFFICULTY_ORDER } from '../../lib/constants.js';
import Segmented from '../ui/Segmented.jsx';
import Select from '../ui/Select.jsx';

const categoryOptions = [
  { value: 'all', label: 'All categories' },
  ...CATEGORIES.map((category) => ({ value: category, label: category })),
];

const difficultyOptions = [
  { value: 'all', label: 'Any difficulty' },
  ...DIFFICULTY_ORDER.map((value) => ({ value, label: DIFFICULTIES[value].label })),
];

function Count({ n }) {
  return <span className="rounded bg-white/[0.06] px-1 text-[10px] tabular-nums text-zinc-400">{n}</span>;
}

export default function FilterBar({ filters, counts, onChange }) {
  const set = (key) => (value) => onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Segmented
        label="Show quests"
        value={filters.status}
        onChange={set('status')}
        className="sm:w-72"
        options={[
          { value: 'active', label: <>Active <Count n={counts.active} /></> },
          { value: 'done', label: <>Done <Count n={counts.done} /></> },
          { value: 'all', label: <>All <Count n={counts.all} /></> },
        ]}
      />
      <div className="flex flex-1 gap-2">
        <Select label="Filter by category" value={filters.category} onChange={set('category')} options={categoryOptions} className="flex-1" />
        <Select label="Filter by difficulty" value={filters.difficulty} onChange={set('difficulty')} options={difficultyOptions} className="flex-1" />
      </div>
    </div>
  );
}
