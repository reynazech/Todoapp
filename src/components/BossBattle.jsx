import { useState } from 'react';
import { BOSS_DEFEAT_BONUS, BOSS_SUBTASK_XP, TITLE_MAX_LENGTH } from '../lib/constants.js';
import { bossXp } from '../lib/xp.js';
import { useGame } from '../state/GameContext.jsx';
import Button, { IconButton } from './ui/Button.jsx';
import Card, { CardHeader } from './ui/Card.jsx';
import CheckButton from './ui/CheckButton.jsx';
import ConfirmDialog from './ui/ConfirmDialog.jsx';
import Icon from './ui/Icon.jsx';

const inputClass =
  'h-11 min-w-0 flex-1 rounded-xl bg-ink-950/60 px-3.5 text-[15px] text-zinc-100 ring-1 ring-inset ring-white/[0.08] placeholder:text-zinc-600 focus:outline-none focus:ring-lav-400/60 sm:text-sm';

// A one-field form used for summoning a boss and adding steps.
function InlineForm({ id, label, placeholder, buttonLabel, buttonIcon, onSubmit, autoFocus = false }) {
  const [value, setValue] = useState('');
  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!value.trim()) return;
        onSubmit(value);
        setValue('');
      }}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        value={value}
        autoFocus={autoFocus}
        maxLength={TITLE_MAX_LENGTH}
        autoComplete="off"
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
      <Button type="submit" variant="secondary" disabled={!value.trim()} aria-label={label}>
        {buttonIcon && <Icon name={buttonIcon} strokeWidth={2.5} />}
        {buttonLabel && <span className={buttonIcon ? 'hidden sm:inline' : ''}>{buttonLabel}</span>}
      </Button>
    </form>
  );
}

function SummonBoss({ onSummon, onCancel }) {
  return (
    <Card className="p-4 sm:p-5">
      <CardHeader
        icon={<Icon name="flame" className="size-4 text-rose-300" />}
        title="Boss battle"
        subtitle="Turn one big, scary goal into a boss you defeat step by step."
      />
      <div className="mt-4">
        <InlineForm
          id="boss-title"
          label="Summon boss"
          placeholder="e.g. Launch my portfolio site"
          buttonLabel="Summon"
          onSubmit={onSummon}
          autoFocus={Boolean(onCancel)}
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-xs text-zinc-500">
          +{BOSS_SUBTASK_XP} XP per step · +{BOSS_DEFEAT_BONUS} XP victory bonus
        </p>
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </Card>
  );
}

export default function BossBattle() {
  const { state, actions } = useGame();
  const boss = state.boss;
  const [summoning, setSummoning] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [confirmAbandon, setConfirmAbandon] = useState(false);

  if (!boss || summoning) {
    return (
      <SummonBoss
        onSummon={(title) => {
          actions.createBoss(title);
          setSummoning(false);
        }}
        onCancel={boss ? () => setSummoning(false) : null}
      />
    );
  }

  const defeated = Boolean(boss.defeatedAt);
  const total = boss.subtasks.length;
  const doneCount = boss.subtasks.filter((step) => step.done).length;
  const hpLeft = total - doneCount;
  const hpPercent = total === 0 ? 100 : (hpLeft / total) * 100;

  return (
    <Card className={`relative overflow-hidden p-4 sm:p-5 ${defeated ? 'animate-glow' : ''}`}>
      <div
        className={`pointer-events-none absolute -right-12 -top-12 size-44 rounded-full blur-3xl ${defeated ? 'bg-lav-400/15' : 'bg-rose-500/10'}`}
      />

      <div className="relative flex items-center gap-3">
        <div
          className={`grid size-11 shrink-0 place-items-center rounded-xl ring-1 ring-inset ${
            defeated ? 'bg-lav-400/15 text-lav-200 ring-lav-400/30' : 'bg-rose-500/10 text-rose-300 ring-rose-400/20'
          }`}
        >
          <Icon name={defeated ? 'crown' : 'flame'} className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${defeated ? 'text-lav-300' : 'text-rose-300/80'}`}>
            {defeated ? 'Boss defeated' : 'Boss battle'}
          </p>
          {renaming ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                actions.renameBoss(event.currentTarget.elements.bossName.value);
                setRenaming(false);
              }}
            >
              <label htmlFor="boss-rename" className="sr-only">
                Boss name
              </label>
              <input
                id="boss-rename"
                name="bossName"
                autoFocus
                defaultValue={boss.title}
                maxLength={TITLE_MAX_LENGTH}
                onBlur={(event) => {
                  actions.renameBoss(event.target.value);
                  setRenaming(false);
                }}
                onKeyDown={(event) => {
                  if (event.key !== 'Escape') return;
                  event.currentTarget.value = boss.title; // cancel: the blur below saves the original
                  event.currentTarget.blur();
                }}
                className="mt-0.5 h-8 w-full rounded-lg bg-ink-950/70 px-2 font-display text-sm font-semibold text-zinc-100 ring-1 ring-inset ring-lav-400/50 focus:outline-none"
              />
            </form>
          ) : (
            <h2 className="break-words font-display text-base font-semibold leading-snug text-zinc-100">{boss.title}</h2>
          )}
        </div>
        {!defeated && !renaming && (
          <IconButton label="Rename boss" onClick={() => setRenaming(true)}>
            <Icon name="pencil" />
          </IconButton>
        )}
      </div>

      {/* HP bar: shrinks as steps are completed */}
      <div className="relative mt-4">
        <div className="flex items-baseline justify-between text-xs">
          <span className="font-display font-semibold tabular-nums text-zinc-300">
            HP {total === 0 ? '??' : `${hpLeft}/${total}`}
          </span>
          <span className="tabular-nums text-zinc-500">
            {total === 0 ? 'No steps yet' : `${doneCount} of ${total} steps · ${Math.round(100 - hpPercent)}%`}
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Boss progress"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={doneCount}
          className="mt-1.5 h-3 overflow-hidden rounded-full bg-ink-950 ring-1 ring-inset ring-white/5"
        >
          <div
            className={`h-full rounded-full transition-[width] duration-700 ease-out ${
              total === 0 ? 'bg-rose-500/25' : 'bg-linear-to-r from-rose-500 via-rose-400 to-orange-300'
            }`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {total === 0 && (
        <p className="relative mt-3 text-sm text-zinc-500">Add the steps it takes to beat this boss. Each one is a hit.</p>
      )}

      {total > 0 && (
        <ul className="relative mt-3 space-y-0.5">
          {boss.subtasks.map((step) => (
            <li key={step.id} className="group flex items-center gap-2 rounded-lg py-0.5 pl-1.5 pr-0.5 hover:bg-white/[0.03]">
              <CheckButton
                small
                done={step.done}
                disabled={defeated}
                onClick={() => actions.toggleBossStep(step.id)}
                label={step.done ? `Un-tick "${step.title}"` : `Complete step "${step.title}"`}
              />
              <span className={`min-w-0 flex-1 break-words text-sm ${step.done ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                {step.title}
              </span>
              <span className="text-[11px] tabular-nums text-zinc-600">+{BOSS_SUBTASK_XP}</span>
              {!defeated && (
                <IconButton
                  label={`Remove step "${step.title}"`}
                  onClick={() => actions.deleteBossStep(step.id)}
                  className="size-8 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                >
                  <Icon name="x" className="size-3.5" />
                </IconButton>
              )}
            </li>
          ))}
        </ul>
      )}

      {defeated ? (
        <div className="relative mt-4 rounded-xl bg-lav-400/10 p-3 ring-1 ring-inset ring-lav-400/20">
          <p className="text-sm text-lav-100">
            Victory! <span className="font-semibold">+{bossXp(boss)} XP</span> earned, including the {BOSS_DEFEAT_BONUS} XP bonus.
          </p>
          <Button className="mt-3 w-full" onClick={() => setSummoning(true)}>
            <Icon name="flame" /> Summon a new boss
          </Button>
        </div>
      ) : (
        <>
          <div className="relative mt-3">
            <InlineForm
              id="boss-step"
              label="Add step"
              placeholder="Add a step…"
              buttonIcon="plus"
              buttonLabel="Add"
              onSubmit={actions.addBossStep}
            />
          </div>
          <div className="relative mt-2 flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => setConfirmAbandon(true)} className="text-xs text-zinc-500">
              Abandon boss
            </Button>
          </div>
        </>
      )}

      <ConfirmDialog
        open={confirmAbandon}
        title="Abandon this boss?"
        message={`"${boss.title}" and its steps will be removed${doneCount ? `, along with the ${doneCount * BOSS_SUBTASK_XP} XP from completed steps` : ''}. Sometimes a strategic retreat is wise.`}
        confirmLabel="Abandon"
        onCancel={() => setConfirmAbandon(false)}
        onConfirm={() => {
          actions.abandonBoss();
          setConfirmAbandon(false);
        }}
      />
    </Card>
  );
}
