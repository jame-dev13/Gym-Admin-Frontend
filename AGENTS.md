# Gym-Admin Frontend — Agent Instructions

Client-only SPA at the repository root (no server code). React 19, TypeScript 6, Vite 8, Tailwind v4, React Router v7 (`react-router-dom`), TanStack Query v5, axios, pnpm.

## Commands

Run everything from the repository root.

```bash
pnpm install
pnpm dev
pnpm lint
pnpm test              # vitest run
pnpm test:watch
pnpm test:coverage
pnpm build             # tsc -b && vite build
```

There is no separate typecheck script: `pnpm build` runs `tsc -b`, and `tsconfig.app.json` includes all of `src` (tests too), so type errors in test files also fail the build.

Focused runs:

```bash
pnpm test src/components/badge/Badge.test.tsx
pnpm exec vitest run src/components/badge/Badge.test.tsx -t "renders"
```

There are no CI workflows (only Dependabot), so validation is local. Run `pnpm lint`, `pnpm test`, and `pnpm build` before finishing.

## Environment (required for API and tests)

No `.env*` file is committed (`.env` is gitignored). Endpoint URLs are read from `import.meta.env` at module load; a missing value becomes the literal string `undefined` in request URLs. Several test suites build their MSW handlers from the same variables, so without a local `.env` those tests fail on unmatched requests.

Required variables:

- Base: `VITE_BASE`
- Auth: `VITE_LOGIN`, `VITE_REGISTER`, `VITE_VERIFICATION`, `VITE_PASSWORD_RESET`, `VITE_RECOVERY`, `VITE_AUTH_REFRESH`, `VITE_AUTH_LOGOUT`
- Administration: `VITE_ADMINISTRATION_V1`, `VITE_ADMINISTRATION_V2`
- Customer: `VITE_CUSTOMER_CURRENT_V1`, `VITE_CUSTOMER_CURRENT_V2`

`vitest.config.ts` only supplies a default for `VITE_RECOVERY`; provide the rest yourself. For env-dependent unit tests, `vi.stubEnv` before dynamically importing the module (see `src/test/services/api.interceptor.test.ts`). Rediscover all names with `grep -rho "VITE_[A-Z0-9_]*" src | sort -u`.

## Testing

- Vitest + jsdom + React Testing Library + MSW; config lives in `vitest.config.ts` (not `vite.config.ts`).
- The `setupFiles` order is load-bearing: `setup.polyfills.ts` must stay before `setup.ts`. The `vmThreads` pool lacks web-stream globals, and MSW touches `TransformStream` at import time.
- MSW runs with `onUnhandledRequest: "error"`; every request needs a handler. Add per-test handlers with `server.use(...)`; `resetHandlers()` runs automatically.
- Helpers:
  - `renderWithProviders` (`src/test/test-utils.tsx`) provides QueryClient + MemoryRouter (`route` option) + ThemeProvider. Add `ToastProvider` or administration providers yourself when the component needs them.
  - `renderClientHook` (`src/test/hooks/test-utils.ts`) provides the shared app QueryClient and clears it between tests; use it for hook tests, not component tests.
- Test placement: components and feature services are colocated (`Foo.tsx` + `Foo.test.tsx`); hook tests and the axios interceptor test are centralized in `src/test/hooks/` and `src/test/services/`.
- The `@` alias is declared separately in `vite.config.ts`, `vitest.config.ts`, and `tsconfig.app.json`; keep all three in sync.

## Architecture

- Boot chain: `src/main.tsx` (`BrowserRouter`) → `src/App.tsx` (QueryClient, ErrorBoundary, ThemeProvider, ToastProvider) → `src/router/AppRouter.tsx`.
- There is no `pages/` directory. Domain code lives in `src/features/<domain>/` with `components/`, `hooks/`, `services/`, `layouts/`, `types.ts`, and an `index.ts` barrel. Shared UI lives in `src/components/<component>/` with a co-located `*Types.ts`.
- Route elements are lazy-loaded and registered through feature router objects (`features/*/services/*Router.ts`) assembled in `AppRouter.tsx`.
- Administration routes are data-driven: add the path/title/description (and optional lazy `Element`) to `AdministrationPanels.ts`, and the sidebar link to `AdministrationSections.ts`. Keep the two paths identical.
- HTTP goes only through the axios instance in `src/services/api.ts`, via the generic hooks in `src/hooks`:
  - Reads: `useFetchMapping`, `usePageFetchMapping`
  - Writes: `useMutationMapping`, with `invalidateKey` or `options.meta.clearAll` / `options.meta.clearAudit`
  - Do not import axios directly in components or feature services.
- Endpoint paths come from `VITE_*` values (sometimes with `/users`, `/customers` appended). Use `pathBuilder` for `/:id` and `/:id/:action` suffixes.
- Auth refresh is single-flight in `src/services/api.ts`. `authClient` in `src/services/api/api.instance.ts` intentionally has no interceptor so refresh/logout cannot loop; do not attach the interceptor to it or use it for normal requests.
- Query keys: `getQueryKeyProvider()` holds the root keys (`administration`, `current`); each domain builds a factory on top (see `features/customer/services/customer-query-keys.ts`).
- Contexts are split into `XContext.ts` / `XProvider.tsx` / `useXContext.ts`. `AdministrationLayout.tsx` mounts `AdministrationProvider` (drawer, modal, entity-domain, action, selection, popover); `ThemeProvider` and `ToastProvider` are mounted in `App.tsx`.

## TypeScript and styling

- `verbatimModuleSyntax` is on: use `import type` for type-only imports.
- `erasableSyntaxOnly` is on: TS enums, namespaces, and constructor parameter properties are compile errors.
- `noUnusedLocals` / `noUnusedParameters` are on: unused code fails `pnpm build`.
- Tailwind v4, with no `tailwind.config.js`. Theme tokens and breakpoints live in the `@theme` block of `src/index.css`; the project breakpoint is `tab` = 942px.
- Dark theme is the default; adding `.light` to the root switches CSS variables. Prefer the existing tokens (`surface`, `text-primary`, `accent`, `border`, …) so both themes keep working.
- A few CSS files exist for effects utilities cannot express (`App.css`, `Table.css`, landing CSS); prefer utilities otherwise.

## Git and PRs

- Ask the user for the commit message; do not invent it. Stage only files belonging to the change (never `git add .`).
- `gh` is not installed. Create PRs with the GitHub MCP server: repository `jame-dev13/Gym-Admin-Frontend`, base `main`.
- PR body sections: `Description`, `Changes` (split into `Main Changes` / `Minimal Changes` only when both genuinely exist), `Notes`.
- Dependencies: pnpm only. Justify additions against the existing stack, and do not bump versions or touch the lockfile casually. `pnpm-workspace.yaml` only allowlists MSW build scripts; it is not a workspace definition.
