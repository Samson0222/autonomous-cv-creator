# CV Studio frontend

Vite, React, TypeScript, and shadcn/ui shell for CV Studio. WS04-A provides the
responsive application shell, route placeholders, dashboard states, and a typed
mock API backed by the frozen Phase 0 fixtures. No live backend, editor, build,
or assistant workflow is connected yet.

## Commands

Run from `app/frontend`:

```powershell
npm install
npm run dev
npm test
npm run typecheck
npm run lint
npm run build
npm run format
```

Tests live in `tests/frontend` so workstream fixtures and contract tests can be
shared across the application. The mock API supports `default`, `empty`, and
`unavailable` scenarios for dashboard state tests.

## Structure

- `src/api` — domain contracts, stable errors, fixture adapter, mock client
- `src/app` — route metadata, shell, sidebar, and header
- `src/features/dashboard` — fixture-backed dashboard data and states
- `src/pages` — WS04-A placeholders and shared state gallery
- `src/components/ui` — generated shadcn/ui components
