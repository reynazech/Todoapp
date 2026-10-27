# REYNA OS: notes for Claude

Gamified to-do app: React 19 + Vite + Tailwind CSS v4, plain JavaScript (no TypeScript), localStorage only. No backend, auth or external APIs.

The owner is a beginner learning Claude Code: explain changes in plain language and keep the code simple.

## Commands
- `npm run dev`: dev server on :5173
- `npm test`: Vitest (pure logic + reducer + storage)
- `npm run build`: must pass before calling work done

## Architecture rules
- Game rules live in `src/lib/` as pure functions with tests. React components only display them.
- All data changes go through `src/state/reducer.js`. Ids and timestamps are created in `GameContext` actions, never in the reducer.
- Components read data and actions via `useGame()`.
- Never store derived values (total XP, level, stats). Compute them.
- Changing the saved data shape: bump `CURRENT_VERSION` in `state/storage.js` and upgrade old data in `normalizeState`.
- Styling: Tailwind classes with theme tokens `ink-*` (backgrounds) and `lav-*` (lavender) from `src/index.css`. Write full class strings, not built from pieces, so Tailwind can find them.
- Keep tap targets at least 40px, label icon-only buttons, and respect reduced motion.
