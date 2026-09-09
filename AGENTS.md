# Gym-Admin Frontend

Git repo root is `GymAdminFront/`. **All app code and tooling live in the `gym-admin/` subdirectory** — run commands and reference paths from `gym-admin/`.

React 19 + TypeScript + Vite single-page app. Package manager is **pnpm** (pnpm-lock.yaml). Stack: React Router v7, TanStack React Query v5, Tailwind CSS v4 (via `@tailwindcss/vite`), Recharts, lucide-react.

## Commands (run from `gym-admin/`)

- `pnpm dev` — Vite dev server
- `pnpm build` — `tsc -b && vite build` (typecheck + build; no separate typecheck script)
- `pnpm lint` — `eslint .`
- `pnpm preview`

There is **no `test` script** even though vitest, jsdom, @testing-library, and msw are installed as devDependencies. If you add tests, wire up a `test` script and vitest config (none exists in `vite.config.ts`); don't assume one is present.

## Gotchas

- **`@/*` path alias breaks at build/runtime.** `tsconfig.app.json` declares `"@/*": ["./src/*"]`, but `vite.config.ts` has no `resolve.alias`. `@/` imports pass `tsc` but fail under Vite. Currently nothing uses `@/`; either add the Vite alias or use relative imports.
- **`src/types/` splits types into `Types.ts` and `Props.ts`** (domain types vs component props) — keep that split when adding new ones.
- **Tailwind v4 theme is defined in `src/index.css`** via the `@theme` block (custom colors like `surface`, `accent`, `danger`, breakpoint `tab: 942px`, animations). Extend the theme there, not in `tailwind.config.js` (there is none).
- **`pnpm-workspace.yaml` is a broken placeholder**: it contains `allowBuilds: msw: set this to true or false` (left unresolved). If pnpm complains about build scripts or `msw`, set this properly (`allowBuilds: msw: true` or false) before installing.
- **Dark theme is the default.** `.light` class on a root element opts into light mode (`color-scheme` + CSS variables swap in `index.css`).

## Structure

Feature-domain-style folder layout under `src/`, mostly scaffolding (empty as of now):
- `pages/`, `features/`, `hooks/`, `layouts/`, `components/`, `context/`, `services/`, `utils/`, `types/`

Put feature-scoped code in `features/`, shared/global components in `components/`, data fetching in `services/` (React Query is available for this), props/types in `types/`.

## Toolchain versions

TypeScript `~6.0.2`, Vite 8, ESLint 10 (flat config, `eslint.config.js`), Node 22.

## Pull request process

Follow this exact workflow when opening a PR (works for both `git` CLI + the GitHub MCP server, since `gh` is not installed):

1. **Inspect the change against `main` first.** Run `git diff main --stat` (and review the full `git diff main`) so you have a clear, complete picture of what is changing before staging anything.
2. **Stage explicitly, never blindly.** Prefer `git add <files changed>` (list the specific modified files). Avoid `git add .` / `git add -A` unless the user explicitly asks — staging only the intended files is the safer, more professional option.
3. **Ask the user for the commit message.** Do not invent it. Request it (you may suggest one following the repo style: imperative, `refactor:`/`feat:`/`fix:` prefix) and use exactly what the user provides for `git commit`.
4. **Push, then open the PR.** `git push -u origin <branch>` (set upstream on first push), then create the PR via the GitHub MCP server (`github_create_pull_request`, owner `jame-dev13`, repo `GymAppViewReact`, base `main`).

### PR description structure

The PR body must be clear and split into concrete sections:

- **Description** — what this PR introduces / its purpose.
- **Main Changes** — the most relevant, substantive changes made.
- **Minimal Changes** — minor edits only: formatting, typos, style tweaks, whitespace, etc.
- **Notes** — future improvements or anything worth flagging only inside the scope of the application project.

> **Important:** if the PR does **not** contain several distinct changes, collapse `Main Changes` + `Minimal Changes` into a single section called **`Changes`** instead.