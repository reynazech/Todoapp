# REYNA OS

A gamified to-do list. Tasks are **quests**, finishing them earns **XP**, XP raises your **level**, and one big goal at a time becomes a **Boss Battle**.

Built with React, Vite, Tailwind CSS and localStorage. There is no backend and no login: everything is saved in your browser.

## Running it

You need [Node.js](https://nodejs.org) (version 20 or newer). In this folder:

```bash
npm install        # once, downloads the libraries into node_modules/
npm run dev        # starts the app at http://localhost:5173
```

Other commands:

| Command | What it does |
|---|---|
| `npm test` | Runs the automated tests once |
| `npm run test:watch` | Re-runs tests every time you save a file |
| `npm run build` | Creates an optimized version in `dist/`, ready to host |
| `npm run preview` | Serves that `dist/` build locally to check it |

## How the code is organized

```
src/
  main.jsx               Starts React and wraps the app in <GameProvider>
  App.jsx                Page layout: 3 columns on desktop, tabs on mobile
  index.css              Tailwind + theme colours (ink = backgrounds, lav = lavender)

  lib/                   Plain JavaScript "rules of the game" (no React)
    constants.js         XP values, categories, starter quests… tune the game here
    xp.js                XP per difficulty, level curve, level titles, total XP
    recommend.js         Energy level → suggested quests
    analytics.js         Numbers for the stats panel
    filters.js           Quest list filtering and sorting
    messages.js          Witty completion lines
    utils.js             Dates, ids, text cleanup
    *.test.js            Tests for the files above

  state/                 Where the data lives
    reducer.js           Every change to the data, in one function
    storage.js           Load/save to localStorage, repairs broken data
    GameContext.jsx      Connects it all to React; toasts and level-ups

  components/            What you see
    PlayerCard, MoodPanel, BossBattle, StatsPanel, Toasts, LevelUpModal…
    quests/              Quest log: quick add, filters, list items, edit dialog
    ui/                  Reusable pieces: Card, Button, Modal, Icon…
```

### The data flow

1. You click something, for example the circle next to a quest.
2. The component calls an **action** from `useGame()`, such as `actions.completeTask(id)`.
3. The action sends a message like `{ type: 'task/complete', id }` to the **reducer** (`state/reducer.js`).
4. The reducer returns the new data. React re-draws whatever changed.
5. `GameContext` saves the new data to localStorage automatically.

If something behaves oddly, look in `reducer.js` first, since every change passes through it.

### Design decisions worth knowing

- **XP is calculated, not stored.** Total XP is always the sum of completed quests plus boss progress (`totalXp` in `lib/xp.js`), so it can never get out of sync.
- **XP is fixed when a quest is completed** (`xpAwarded`). Changing XP values later won't change past rewards.
- **Reopening or deleting a completed quest removes its XP.** This stops XP farming. Difficulty is locked once a quest is done.
- **Levels:** going from level *n* to *n+1* costs `100 × n` XP (100, 200, 300…).
- **Boss:** +15 XP per step and +100 when every step is done. A defeated boss is locked. Summoning a new boss moves the old one to history, so its XP is kept.
- **Energy** resets each day at your local midnight.
- **Saved data** lives under the localStorage key `reyna-os:v1`. If it's ever unreadable, the app starts fresh, keeps a `…:backup-<time>` copy, and shows a notice.

## Resetting your data

Open the browser DevTools console on the app and run:

```js
localStorage.removeItem('reyna-os:v1'); location.reload();
```

## Known limitations (MVP)

- Data stays in one browser, with no sync between devices.
- If the app is open in two tabs, whichever tab saves last wins.
- One active boss at a time.
