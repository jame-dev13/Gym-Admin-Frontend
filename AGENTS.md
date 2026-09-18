# Gym-Admin Frontend — Agent Instructions

## 1. Repository Context

This directory (`.git`, `package.json`, `src/`, etc. at this level) **is the Git repository root**.

From this point forward:

* Run all commands from the repository root.
* Reference project paths relative to the repository root.
* Do not create files outside the repository unless explicitly requested.
* Inspect the existing implementation before introducing new abstractions, dependencies, patterns, or architectural changes.
* Prefer consistency with the existing codebase over introducing a theoretically superior but inconsistent pattern.

### Application

React 19 + TypeScript + Vite single-page application.

### Stack

* React 19
* TypeScript
* Vite
* React Router v7
* TanStack React Query v5
* Tailwind CSS v4
* `@tailwindcss/vite`
* Recharts
* lucide-react
* pnpm

---

# 2. Core Engineering Principles

All code you reason about, modify, or generate MUST follow these principles unless there is a documented reason not to.

## SOLID

### Single Responsibility Principle

Each module, component, hook, service, utility, and class should have one clear responsibility.

Avoid:

* Components responsible for UI, API communication, transformation, validation, and business logic simultaneously.
* Hooks that become general-purpose service layers.
* Utility modules containing unrelated functionality.

Prefer:

```text
Component
    ↓
Hook / Controller
    ↓
Service
    ↓
API / Infrastructure
```

Keep responsibilities separated according to the project's existing feature structure.

### Open/Closed Principle

Prefer extending behavior through composition, configuration, or well-defined abstractions rather than repeatedly modifying stable code.

Do not introduce abstraction merely to satisfy OCP.

### Liskov Substitution Principle

When using interfaces, unions, generics, or polymorphic components, implementations must preserve the behavioral contract of the abstraction.

Do not create abstractions whose implementations require consumers to know their concrete type.

### Interface Segregation Principle

Prefer small, focused interfaces and TypeScript types.

Avoid large "god interfaces" containing unrelated properties simply because several consumers happen to share them.

### Dependency Inversion Principle

High-level feature logic should depend on stable contracts rather than concrete infrastructure when doing so provides meaningful decoupling.

Do not introduce dependency injection frameworks or excessive abstraction unless the project actually benefits from it.

---

# 3. KISS, DRY, and YAGNI

## KISS

**Keep It Simple.**

Always prefer the simplest implementation that correctly solves the current requirement.

Before introducing:

* abstractions
* factories
* providers
* generic frameworks
* custom state managers
* complex design patterns
* additional dependencies

verify that the problem actually requires them.

A few explicit lines of code are preferable to an abstraction that makes simple behavior difficult to understand.

## DRY

Do not duplicate:

* business rules
* API contracts
* validation rules
* repeated transformations
* reusable UI behavior

However, **do not prematurely abstract code that only happens to look similar**.

Use the following rule:

> Duplicate first when the abstraction is unclear; abstract when the shared behavior and invariant are understood.

## YAGNI

Do not implement functionality because it might be needed later.

Implement the requirement that exists now.

Avoid speculative:

* configuration
* abstractions
* generic components
* API endpoints
* state
* hooks
* dependencies

---

# 4. Fail Fast

The application should fail as early and as explicitly as possible when encountering invalid state or invalid input.

Prefer:

* early returns
* explicit validation
* exhaustive handling of discriminated unions
* meaningful errors
* explicit API error handling
* narrow types

Avoid:

* silently ignoring invalid state
* unnecessary fallback values that hide bugs
* deeply nested conditional logic
* `try/catch` blocks that merely suppress errors
* returning `undefined` when absence represents an exceptional condition

Do not use defensive programming as an excuse to hide programming errors.

Example:

```ts
if (!user) {
  throw new Error("User is required");
}
```

is preferable to silently continuing with an invalid `user`.

---

# 5. TypeScript Standards

Use TypeScript as a tool for expressing domain constraints.

## Required

* Prefer precise types over `any`.
* Avoid `any` unless there is a documented technical reason.
* Prefer `unknown` when the type is genuinely unknown.
* Use discriminated unions for state machines and variant-dependent data.
* Use generics when they improve type safety without obscuring the code.
* Prefer `type` for unions, compositions, and aliases.
* Prefer `interface` when defining extensible object contracts.
* Keep domain types separate from component props according to the existing `Types.ts` / `Props.ts` convention.

## Avoid

```ts
const data: any = ...
```

Prefer:

```ts
const data: unknown = ...
```

and validate/narrow it before use.

Do not use TypeScript assertions (`as SomeType`) simply to silence compiler errors.

A type assertion should represent a verified invariant, not wishful typing.

---

# 6. TDD — RED → GREEN → REFACTOR

When implementing non-trivial behavior, follow this cycle:

## RED

Write a failing test that describes the required behavior.

The test must fail for the expected reason.

## GREEN

Implement the minimum amount of production code required to make the test pass.

Do not prematurely optimize or generalize.

## REFACTOR

Improve:

* naming
* structure
* duplication
* readability
* coupling
* abstractions

while keeping all tests passing.

### Testing priorities

Test behavior, not implementation details.

Prefer:

```text
User interaction
    ↓
Visible behavior
    ↓
Application behavior
    ↓
API interaction
```

over tests that assert internal implementation details.

Do not test:

* React internals
* implementation-specific state variables
* private helper implementation details
* exact component structure unless it is part of observable behavior

### React testing

Use:

* Vitest
* React Testing Library
* MSW

when appropriate.

Prefer MSW for HTTP mocking instead of mocking `fetch`, Axios, or service implementations directly.

Test:

* successful requests
* loading states
* error states
* empty states
* user interactions
* important conditional rendering
* accessibility-relevant behavior

Avoid snapshot tests as the default testing strategy.

---

# 7. Testing Infrastructure

There is currently **no `test` script** even though Vitest, jsdom, React Testing Library, and MSW are installed as development dependencies.

If tests are introduced:

1. Add the required Vitest configuration.
2. Add the `test` script to `package.json`.
3. Configure the appropriate jsdom environment.
4. Configure MSW handlers/server where required.
5. Ensure tests run successfully.
6. Run the test suite before considering the implementation complete.

Do not assume that `pnpm test` currently works.

When modifying existing behavior, prefer adding or updating a regression test before changing the implementation.

---

# 8. React Architecture

Use React's composition model instead of unnecessary abstractions.

## Components

Components should primarily be responsible for:

* rendering UI
* receiving props
* composing child components
* handling user-facing interaction

Avoid placing substantial business logic directly inside JSX.

Prefer extracting complex logic into:

* feature hooks
* services
* domain utilities

when the extraction provides a meaningful separation of responsibility.

## Hooks

Custom hooks should encapsulate reusable React behavior.

A hook should not become a dumping ground for:

* API logic
* business rules
* unrelated UI state
* global application state

Keep hooks focused.

## State

Choose the smallest state scope that solves the problem.

Prefer:

```text
local UI state
    ↓
feature state
    ↓
URL state
    ↓
server state
```

Use TanStack React Query for server state.

Do not duplicate server state in React Context or local component state without a concrete reason.

Avoid storing derived state when it can be calculated from existing state.

Prefer:

```ts
const total = items.reduce(...)
```

over maintaining:

```ts
const [items, setItems] = ...
const [total, setTotal] = ...
```

unless there is a demonstrated reason to persist the derived value.

---

# 9. React Query

TanStack React Query is the standard mechanism for server state.

Use it for:

* fetching
* caching
* invalidation
* mutations
* request lifecycle state
* server synchronization

Avoid manually reproducing React Query behavior with:

* `useEffect`
* `useState`
* custom loading flags
* manual request caches

unless there is a specific requirement React Query cannot satisfy.

Keep query keys stable and predictable.

Prefer feature/domain-specific query key factories when query-key complexity justifies them.

Mutations should invalidate or update the relevant queries explicitly.

Do not blindly invalidate the entire cache.

---

# 10. React Performance

Optimize based on actual rendering behavior, not assumptions.

Do not automatically use:

* `React.memo`
* `useMemo`
* `useCallback`

for every component or function.

Use memoization when:

1. there is a meaningful render-cost problem, or
2. referential stability is required by a memoized child or dependency.

Prefer reducing unnecessary state and component coupling before adding memoization.

Avoid:

* unnecessary Context providers
* Context values recreated on every render
* large components with unrelated state
* unnecessary global state

---

# 11. React Rendering and Lists

Every dynamic list must have a stable and meaningful `key`.

Prefer:

```tsx
items.map(item => (
  <Row key={item.id} />
))
```

Avoid:

```tsx
items.map((item, index) => (
  <Row key={index} />
))
```

unless the list is truly static and order cannot change.

Do not use randomly generated keys during render.

---

# 12. Forms and User Input

Forms must:

* use semantic HTML
* associate labels with controls
* expose validation errors accessibly
* prevent invalid submissions
* provide meaningful loading/submission states
* preserve user input when appropriate

Prefer native HTML validation where it provides sufficient behavior.

Do not rely exclusively on visual indicators for validation.

Errors must be understandable to screen-reader users.

---

# 13. HTML Semantics

Use semantic HTML before ARIA.

Prefer:

```html
<header>
<nav>
<main>
<section>
<article>
<aside>
<footer>
<button>
<form>
<label>
```

instead of using generic `<div>` elements for everything.

### Buttons

Use `<button>` for actions.

Do not use:

```html
<div onClick={...}>
```

for interactive behavior.

### Links

Use `<a>` / React Router links for navigation.

Do not use buttons for navigation unless there is a genuine action rather than navigation.

### Headings

Maintain a logical heading hierarchy.

Do not choose heading elements merely because of their visual size.

Use CSS/Tailwind to control presentation.

---

# 14. Accessibility

Accessibility is a functional requirement, not a visual enhancement.

Follow WCAG-oriented practices.

## Keyboard accessibility

Every interactive element must be usable with a keyboard.

Ensure:

* visible focus states
* logical tab order
* no keyboard traps
* appropriate keyboard interaction

Do not remove browser focus indicators without providing an equivalent accessible replacement.

## Screen readers

Interactive elements must have meaningful accessible names.

Images must use appropriate `alt` text.

Decorative images should use:

```html
alt=""
```

Do not add redundant ARIA attributes when semantic HTML already provides the required semantics.

Prefer native HTML semantics over ARIA.

> No ARIA is better than incorrect ARIA.

## Dynamic content

Important asynchronous changes should be exposed appropriately.

Examples:

* form errors
* authentication failures
* successful mutations
* important notifications
* loading state changes

Use appropriate ARIA live regions when necessary.

---

# 15. SEO

Although this is a React SPA, SEO must be considered for all publicly indexable routes.

Use:

* meaningful `<title>`
* useful meta descriptions
* canonical URLs when appropriate
* semantic HTML
* descriptive headings
* descriptive link text
* crawlable navigation
* meaningful URLs

Avoid:

* keyword stuffing
* meaningless page titles
* generic headings such as "Page"
* links such as "Click here"

For pages that are authenticated/private administrative interfaces, SEO is generally irrelevant. Do not add unnecessary SEO infrastructure to private application routes.

When SEO requirements become substantial, evaluate whether the current SPA architecture requires SSR, SSG, or another rendering strategy rather than attempting to solve everything through client-side effects.

---

# 16. Routing

Use React Router v7 consistently.

Routes should reflect application/domain structure.

Prefer route-level organization over large conditional rendering blocks.

Example:

```text
/administration
/administration/users
/administration/subscriptions
/settings
/profile
```

Keep authorization concerns explicit.

Do not rely solely on hiding navigation elements for authorization.

Client-side route protection is a UX/security boundary, not a replacement for backend authorization.

---

# 17. API and Services

Keep API communication inside `services/` or feature-specific service modules according to the existing architecture.

Components should not directly perform HTTP requests.

Prefer:

```text
Component
    ↓
Hook
    ↓
Service
    ↓
HTTP client
```

Services should not contain UI concerns.

Do not couple services to React.

---

# 18. Error Handling

Every asynchronous feature should explicitly consider:

```text
idle
loading
success
empty
error
```

Where relevant, also handle:

```text
unauthorized
forbidden
rate limited
locked / temporarily unavailable
network failure
validation failure
```

Do not treat all errors as the same error.

Preserve useful information from the API while presenting appropriate user-facing messages.

Never expose sensitive backend details directly to users.

---

# 19. Tailwind CSS

Tailwind CSS v4 is configured through `src/index.css`.

The theme is defined using the `@theme` block.

There is **no `tailwind.config.js`**.

Therefore:

* Add theme tokens to `src/index.css`.
* Do not create a Tailwind config solely to extend the existing theme.
* Reuse existing design tokens before creating new ones.
* Avoid arbitrary values when an existing design token can express the requirement.
* Keep responsive behavior consistent with the existing `tab: 942px` breakpoint.

Prefer composition of utility classes over large amounts of custom CSS.

Use custom CSS when it genuinely improves maintainability or is required by the browser/platform.

---

# 20. Dark / Light Theme

The application is dark by default.

A `.light` class on the root element enables light mode through CSS variable changes defined in `index.css`.

When adding UI:

* ensure both themes remain usable
* use theme variables/tokens where possible
* do not hard-code colors that break either theme
* verify sufficient contrast in both modes

---

# 21. Project Structure

The current structure is feature-domain oriented:

```text
src/
├── pages/
├── features/
├── hooks/
├── layouts/
├── components/
├── context/
├── services/
├── utils/
└── types/
```

### Rules

`features/`

Contains feature/domain-specific code.

`components/`

Contains genuinely shared/global UI components.

`services/`

Contains API/data-access services.

`hooks/`

Contains shared React hooks.

`context/`

Contains application-wide React context only when Context is actually appropriate.

`pages/`

Contains route/page composition.

`layouts/`

Contains shared page layouts.

`utils/`

Contains small, pure, domain-agnostic utilities.

`types/`

Keep the existing distinction:

```text
Types.ts  → domain/application types
Props.ts  → component props
```

Do not place every interface in a global `types/` directory. Feature-specific types should remain close to their feature when appropriate.

---

# 22. Path Aliases

`@/*` is configured in both:

* `tsconfig.app.json`
* `vite.config.ts`

Use:

```ts
import { Something } from "@/features/...";
```

for absolute project imports when appropriate.

Do not introduce another alias system.

---

# 23. File and Naming Conventions

Follow the conventions already established by the repository.

Use descriptive names.

Avoid vague names such as:

```text
data
helper
manager
misc
common
stuff
```

unless the module genuinely represents that concept.

Prefer domain-specific names:

```text
subscriptionService
useCurrentSubscription
SubscriptionStatus
SubscriberNotification
```

A name should communicate the responsibility of the code without requiring the reader to inspect its implementation.

---

# 24. Dependency Management

Use `pnpm`.

Before adding a dependency, determine whether the requirement can reasonably be implemented using the existing stack.

Do not add dependencies for trivial functionality.

When adding a dependency:

1. Explain why it is necessary.
2. Verify that an existing dependency does not already solve the problem.
3. Prefer mature, focused libraries.
4. Keep the dependency surface minimal.

Do not modify package versions unnecessarily.

---

# 25. Existing Toolchain

Current versions:

* TypeScript `~6.0.2`
* Vite 8
* ESLint 10
* Node 22

ESLint uses flat configuration through:

```text
eslint.config.js
```

Do not introduce legacy ESLint configuration.

---

# 26. Commands

Run commands from the repository root.

```bash
pnpm dev
pnpm build
pnpm lint
pnpm preview
```

`pnpm build` performs:

```text
tsc -b
    ↓
vite build
```

Therefore a successful build is also a TypeScript validation.

After meaningful code changes, run at minimum:

```bash
pnpm lint
pnpm build
```

If tests exist or are introduced, also run:

```bash
pnpm test
```

Do not claim that a change is validated if the relevant validation commands were not executed.

---

# 27. MSW

`pnpm-workspace.yaml` allows MSW build scripts:

```yaml
allowBuilds:
  msw: true
```

Leave this configuration unchanged unless pnpm reports a concrete issue involving MSW build scripts.

Use MSW to mock network boundaries in tests.

Do not couple tests directly to implementation-specific HTTP mocking.

---

# 28. Change Discipline

Before modifying code:

1. Inspect the relevant files.
2. Understand the existing architecture.
3. Identify existing reusable components, hooks, services, and utilities.
4. Determine the smallest change that satisfies the requirement.
5. Consider edge cases and failure states.
6. Implement.
7. Test.
8. Refactor.
9. Run lint/build/tests as applicable.

Do not rewrite unrelated code.

Do not perform opportunistic refactors unless they are required to safely implement the requested change.

Keep diffs focused.

---

# 29. Code Review Mindset

Before considering a change complete, verify:

### Correctness

* Does it satisfy the requested behavior?
* Are edge cases handled?
* Does invalid input fail appropriately?

### Architecture

* Is responsibility located in the correct layer?
* Is there unnecessary coupling?
* Is a new abstraction actually justified?

### Maintainability

* Is the code easy to understand?
* Are names precise?
* Is duplication meaningful or accidental?

### Type safety

* Are types precise?
* Are unsafe assertions justified?
* Are nullable states handled explicitly?

### React

* Is state scoped correctly?
* Is server state handled through React Query?
* Are effects actually necessary?
* Are components unnecessarily re-rendering?

### Accessibility

* Is semantic HTML used?
* Can the feature be operated with a keyboard?
* Are accessible names and labels present?
* Are errors and important dynamic changes accessible?

### SEO

For public pages:

* Is the title meaningful?
* Are headings semantic?
* Is navigation crawlable?
* Are links descriptive?
* Is the page content semantically structured?

### Testing

* Is the behavior covered?
* Does the test verify behavior rather than implementation?
* Are loading, success, empty, and error states covered where relevant?

---

# 30. Definition of Done

A feature or change is considered complete only when:

* The requested behavior is implemented.
* Existing functionality has not been unnecessarily affected.
* TypeScript passes.
* ESLint passes.
* Relevant tests pass or have been added.
* Error and empty states are handled where applicable.
* Accessibility requirements are satisfied.
* Public-facing pages follow basic SEO requirements.
* No unnecessary dependency or abstraction was introduced.
* The implementation follows SOLID, KISS, DRY, YAGNI, and fail-fast principles.
* The final diff contains only relevant changes.

---

# 31. Git and Pull Request Process

Follow this exact workflow when opening a PR.

## Step 1 — Inspect the change

Compare against `main` before staging anything:

```bash
git diff main --stat
git diff main
```

Review the complete diff to understand exactly what is changing.

## Step 2 — Stage explicitly

Prefer:

```bash
git add <specific-files>
```

Do **not** use:

```bash
git add .
git add -A
```

unless explicitly requested by the user.

Only stage files belonging to the intended change.

## Step 3 — Commit message

Ask the user for the commit message.

Do not invent the final commit message.

You may suggest a message following the repository convention:

```text
feat:
fix:
refactor:
test:
docs:
chore:
```

Once the user provides the message, use it exactly for:

```bash
git commit -m "<user-provided-message>"
```

## Step 4 — Push

Push the branch:

```bash
git push -u origin <branch>
```

Use `-u` when setting the upstream for the first time.

## Step 5 — Create the PR

Create the PR using the GitHub MCP server.

Repository:

```text
owner: jame-dev13
repo: Gym-Admin-Frontend
base: main
```

`gh` is not installed. Do not assume GitHub CLI is available.

---

# 32. Pull Request Description

The PR body must use the following structure.

## Description

Briefly explain:

* what the PR introduces
* why the change exists

## Main Changes

List the most relevant substantive changes.

## Minimal Changes

List minor changes such as:

* formatting
* naming
* whitespace
* small style adjustments
* typo corrections

## Notes

Mention future improvements or relevant project-specific considerations.

### Simplification rule

If the PR does not contain several distinct categories of changes, replace:

```text
Main Changes
Minimal Changes
```

with:

```text
Changes
```

Do not artificially split a small PR into multiple sections.

---

# 33. Agent Behavior

When reasoning about a task:

1. Understand the requirement.
2. Inspect existing code and conventions.
3. Identify the affected feature/domain.
4. Determine the minimum viable change.
5. Consider failure states and edge cases.
6. Prefer test-first development for non-trivial behavior.
7. Implement the simplest correct solution.
8. Validate with tests/lint/build.
9. Refactor only after behavior is correct.
10. Review the final diff for unnecessary changes.

When requirements are ambiguous and the ambiguity can materially change the implementation, ask a focused clarification question rather than making a large assumption.

When the intended behavior is sufficiently clear, proceed without unnecessary questions.

---

# 34. Priority Order

When instructions conflict, use this priority order:

1. Explicit user requirements.
2. Existing project behavior and established architecture.
3. Correctness and security.
4. Accessibility and semantic HTML.
5. Type safety.
6. Maintainability.
7. Performance optimization.
8. Code style and cosmetic preferences.

Do not sacrifice correctness for architectural purity.

Do not sacrifice accessibility for visual convenience.

Do not sacrifice maintainability for premature optimization.

---

# 35. Guiding Principle

> **Build the smallest correct solution, prove its behavior with tests, keep responsibilities explicit, fail fast on invalid states, and make the resulting UI accessible, semantic, maintainable, and understandable.**
