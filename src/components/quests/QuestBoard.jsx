import { useMemo, useState } from 'react';
import { DEFAULT_FILTERS, filterQuests } from '../../lib/filters.js';
import { useGame } from '../../state/GameContext.jsx';
import Button from '../ui/Button.jsx';
import Card, { CardHeader } from '../ui/Card.jsx';
import ConfirmDialog from '../ui/ConfirmDialog.jsx';
import Icon from '../ui/Icon.jsx';
import FilterBar from './FilterBar.jsx';
import QuestForm from './QuestForm.jsx';
import QuestItem from './QuestItem.jsx';
import QuickAdd from './QuickAdd.jsx';

function EmptyState({ icon, title, body, action }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center">
      <div className="grid size-12 place-items-center rounded-2xl bg-lav-400/10 text-lav-300">
        <Icon name={icon} className="size-5" />
      </div>
      <p className="mt-3 font-display font-semibold text-zinc-200">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-zinc-500">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default function QuestBoard() {
  const { state, actions } = useGame();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [editingId, setEditingId] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const tasks = state.tasks;
  const counts = useMemo(() => {
    const done = tasks.filter((task) => task.status === 'done').length;
    return { all: tasks.length, done, active: tasks.length - done };
  }, [tasks]);
  const visible = useMemo(() => filterQuests(tasks, filters), [tasks, filters]);
  const editingTask = tasks.find((task) => task.id === editingId);
  const onlyStatusFilter = filters.category === 'all' && filters.difficulty === 'all';

  let content;
  if (tasks.length === 0) {
    content = (
      <EmptyState
        icon="target"
        title="Your quest log is suspiciously empty."
        body="Add your first quest above, or grab a few starter quests to warm up."
        action={
          <Button variant="secondary" size="sm" onClick={actions.seedStarterQuests}>
            <Icon name="sparkles" /> Add starter quests
          </Button>
        }
      />
    );
  } else if (visible.length === 0 && filters.status === 'active' && onlyStatusFilter) {
    content = (
      <EmptyState
        icon="crown"
        title="All clear. Every quest is done."
        body="Take a victory sip of something nice, then add the next adventure."
      />
    );
  } else if (visible.length === 0) {
    content = (
      <EmptyState
        icon="list"
        title="No quests match these filters."
        body="Try another category or difficulty."
        action={
          <Button variant="secondary" size="sm" onClick={() => setFilters({ ...DEFAULT_FILTERS, status: 'all' })}>
            Clear filters
          </Button>
        }
      />
    );
  } else {
    content = (
      <ul className="space-y-2">
        {visible.map((task) => (
          <QuestItem key={task.id} task={task} onEdit={(t) => setEditingId(t.id)} onDelete={setDeleting} />
        ))}
      </ul>
    );
  }

  return (
    <Card className="p-4 sm:p-5">
      <CardHeader
        icon={<Icon name="target" className="size-4 text-lav-300" />}
        title="Quest log"
        subtitle={`${counts.active} active · ${counts.done} completed`}
      />
      <div className="mt-4">
        <QuickAdd />
      </div>
      <div className="mt-4 border-t border-white/[0.05] pt-4">
        <FilterBar filters={filters} counts={counts} onChange={setFilters} />
      </div>
      <div className="mt-3">{content}</div>

      {editingTask && <QuestForm key={editingTask.id} task={editingTask} onClose={() => setEditingId(null)} />}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this quest?"
        message={
          deleting?.status === 'done'
            ? `"${deleting.title}" will be deleted, and its ${deleting.xpAwarded} XP goes with it. Tip: completed quests can simply stay in the Done tab.`
            : `"${deleting?.title}" will be deleted. This can't be undone.`
        }
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          actions.deleteTask(deleting.id);
          setDeleting(null);
        }}
      />
    </Card>
  );
}
