import { xpForDifficulty } from '../../lib/xp.js';
import { useGame } from '../../state/GameContext.jsx';
import { CategoryChip, DifficultyPips, XpBadge } from '../ui/Badges.jsx';
import { IconButton } from '../ui/Button.jsx';
import CheckButton from '../ui/CheckButton.jsx';
import Icon from '../ui/Icon.jsx';

export default function QuestItem({ task, onEdit, onDelete }) {
  const { actions } = useGame();
  const done = task.status === 'done';

  return (
    <li
      className={`group flex animate-fade-in items-start gap-3 rounded-xl border p-3 transition-colors sm:p-3.5 ${
        done ? 'border-transparent bg-ink-950/30' : 'border-white/[0.06] bg-ink-850/70 hover:border-white/[0.12]'
      }`}
    >
      <CheckButton
        done={done}
        onClick={() => (done ? actions.reopenTask(task.id) : actions.completeTask(task.id))}
        label={done ? `Reopen "${task.title}"` : `Complete "${task.title}"`}
      />

      <div className="min-w-0 flex-1 pt-0.5">
        <p
          className={`break-words text-[15px] leading-snug transition-colors ${
            done ? 'text-zinc-500 line-through decoration-zinc-600' : 'text-zinc-100'
          }`}
        >
          {task.title}
        </p>
        {task.notes && (
          <p className="mt-1 line-clamp-2 whitespace-pre-line break-words text-sm text-zinc-500">{task.notes}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <CategoryChip category={task.category} />
          <DifficultyPips difficulty={task.difficulty} />
          <XpBadge xp={done ? task.xpAwarded : xpForDifficulty(task.difficulty)} muted={done} />
        </div>
      </div>

      <div className="-mr-1 -mt-0.5 flex transition-opacity sm:opacity-50 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
        <IconButton label={`Edit "${task.title}"`} onClick={() => onEdit(task)}>
          <Icon name="pencil" />
        </IconButton>
        <IconButton label={`Delete "${task.title}"`} onClick={() => onDelete(task)} className="hover:text-rose-300!">
          <Icon name="trash" />
        </IconButton>
      </div>
    </li>
  );
}
