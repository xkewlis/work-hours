# work-hours

Simple TypeScript service to track work days and time marks.

## Summary
Lightweight back-end project (WIP) for recording user work days and clock-in/clock-out marks.

## Tech
- Node.js + TypeScript
- Hono (server)
- Sequelize + PostgreSQL

## Quick start
1. Install dependencies:

```bash
npm install
```

2. Copy and fill `.env` (see `src/shared/env.ts` for keys).

3. Run in development:

```bash
npm run dev
```

4. Build and run for production:

```bash
npm run build
npm run start
```

## Important scripts (from package.json)
- `dev` — development server (ts-node-dev)
- `build` — compile TypeScript to `dist`
- `start` — build + run production bundle
- `test` / `test:ci` — run Jest tests

## Database
Models and DB init live under `src/infrastructure/database/`. Ensure your `.env` contains valid Postgres connection values before running.

## Project layout (relevant)
- `src/app.ts` — app entry
- `src/presentation/server.ts` — HTTP server
- `src/infrastructure/database/` — DB config, init, models
- `src/shared/` — shared helpers (env, enums)

## Next steps
- Add an `.env.example` file
- Add basic tests and CI (GitHub Actions)
- Provide API docs or example requests

---
If you want, I can add a concise `.env.example`, a CI workflow, or short API examples next.