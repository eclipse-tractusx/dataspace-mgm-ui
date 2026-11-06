<!--
 Copyright (c) 2026 Fraunhofer ISST
 Copyright (c) 2026 Contributors to the Eclipse Foundation

 AI Disclosure: This file was entirely AI-generated.
 The AI-generated portions are made available under CC0-1.0 and not subject
 to the project's license. The human contributor has reviewed and verified
 that the content is correct.

 SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
-->

# Instructions for coding agents

For coding agents (Claude Code, Codex, GitHub Copilot) and the people who use them.
`CLAUDE.md` is a link to this file. `.github/copilot-instructions.md` (the Dataspace Captain) defers to the rules of
this file.

## What this repository is

The Eclipse Tractus-X Dataspace Management UI, the frontend of the new portal (Nx workspace, Node >= 24, React 19,
MUI, Redux Toolkit, TypeScript, Vite, Vitest). It talks to the Dataspace Management Service
(`dataspace-mgm-service`, next to this repository), one backend module at a time.

The frontend is **dumb**: it shows what the API returns and sends what the user enters. Business decisions and
everything OSP-specific live in the backend. Each backend module gets a framework-free **core package**
(`packages/<module>-core`) with one use case per user action, and a UI on top.

The frontend spec lives next to this repository in `../portal-frontend-spec` (read-only): start with
`HACKATHON-FRONTEND.md`, then `architecture/README.md` and `architecture/01` to `14`. The backend contract is the
`openapi.yaml` of each module in `../dataspace-mgm-service/spec/` (read-only), copied to `specs/<module>/`.

Green tests of your module are not enough: it must work with the other modules on the first merge. Merges break on
changed generated types, deep imports, business logic in the UI and own error or text formats. The rules below
prevent this.

## Layout

| What | Where |
|------|-------|
| App (composition root only: `main.tsx`, router, providers, config) | `apps/portal/` (dev BFF stand-in in `apps/portal/dev-bff/`) |
| Core package per backend module (framework-free) | `packages/<module>-core/` (example: `packages/c3-m1-core/`) |
| Shared HTTP setup (cookies, CSRF, 401) | `packages/core-http/` |
| Identity / session core | `packages/identity-core/` |
| Shared React UI (the only place that imports `@mui/*`) | `libs/shared/ui-mui/` |
| Backend API specs | `specs/<module>/openapi.yaml` |
| Docs | `docs/` (how to add a module: `docs/developers/integrate-a-backend-module.md`) |

Per module the spec asks for `libs/<module>/state` (RTK Query, slices) and `libs/<module>/feature` (pages). Today the
skeleton keeps features in `apps/portal/src/features/`; follow the spec layout for new modules when the libs exist,
otherwise follow the existing pattern and say so in the PR.

Import aliases are `@dataspace-mgm/<name>` and are kept in sync in `tsconfig.base.json` (`paths`) and
`workspace.aliases.ts` (Vite/Vitest). Add both when you add a package.

## Rules

1. Work only in your module's files: `packages/<module>-core/`, `specs/<module>/`, and its state, feature, locale and
   app wiring. Do not change another team's module, `packages/core-http/`, `libs/shared/`, `charts/`, `docker/`,
   `.github/` or `../portal-frontend-spec`. If something there is wrong or missing, open an issue, or propose the
   change in the PR, and work with the current state.
2. The specs are the contract. Paths, methods, field names, permissions, error types and events come from
   `specs/<module>/openapi.yaml`. Do not invent names. Where the frontend spec and the backend spec disagree, the
   backend spec wins for the API; write down the difference (PR description, or the `contract-seam` skill).
3. **No business decisions in the UI.** No "is this allowed?", no "which step is next?". Ask the backend for a flag
   (for example `can_subscribe`) or a step key. Only UX pre-checks that the API enforces again may live in a core
   package's `domain/domains`.
4. **The UI never calls the API directly.** Every operation a UI may trigger, reads included, is a use case of a
   core package. No `fetch`, `openapi-fetch` or `@dataspace-mgm/core-http` in components, state or `domain`.
5. **No tokens, no Keycloak in the browser.** Sign-in and session are handled by the backend (BFF); the browser only
   has a session cookie. The frontend gets permission keys from `GET /me` and uses them only to hide UI; the API
   enforces them. Branding and feature flags come from `GET /config`.
6. **Redux Toolkit is the only state mechanism.** RTK Query endpoints use `queryFn` calling core use cases
   (`toQueryResult(() => getUseCases(api).<module>.<useCase>.execute(...))`); no `fetchBaseQuery`, no handwritten
   URLs. Slices hold client state only (filters, wizard progress, dialogs), never server data. No React context for
   business state. Core packages never depend on Redux.
7. **Live updates via SSE**, never WebSockets and never polling.
8. **Texts are i18n keys** (`de` and `en`). API errors and validation messages are keys; the UI translates them.
   Add the core package's validation keys to the locale files.
9. **Generated code** in `packages/<module>-core/src/generated/` is never edited by hand. Update the spec, run
   `nx run <module>-core:generate-api`, and commit the result; `check-api` must pass.
10. **API JSON is `snake_case`**; generated DTO types mirror it. A mapper in the core package converts to `camelCase`
    anemics (and back for requests).
11. `zod` for runtime validation (`config.json`, API responses where needed); never class-validator.
12. No secrets (passwords, tokens, client secrets, API keys) in code, logs, tests or the `config.json` of the repo.
13. If the spec is unclear or contradicts itself, do not guess silently. Implement the reading the spec supports most
    directly, and name the question and that reading in the PR description.

## Layers (dependencies point inward only)

`app → feature → state → core (application → domain)`. Inside a core package, `infrastructure` implements the ports
defined in `domain`; only the package's `index.ts` wires them.

**Where does my code go?**

| Code | Place |
|------|-------|
| A shape or rule (plain, immutable) | `domain/` (`anemics/`, `valueObjects/`, `factories/`, `data/`, `domains/`, `events/`, `repositories/` ports, `testing/` in-memory adapters) |
| A user action (read or write) | `application/useCases/<name>.use-case.ts` |
| HTTP, DTO aliases, mappers, adapters | `infrastructure/` (`data/`, `mappers/`, `repositories/`) |
| MSW handlers | `mocks/` |
| RTK Query endpoints calling use cases | `libs/<module>/state/src/<module>.api.ts` |
| UI-only state | `.../state/src/slices/` (initial state in its own file) |
| Combined data for display | `.../state/src/selectors/` |
| Long-running use case with progress | `.../state/src/thunks/` |
| Page / container | `.../feature/src/pages/`, `containers/` |
| Reusable visual component | `libs/shared/ui-mui` |

Still unsure? "Would a different UI need this too?" → core package. "Is it a business decision?" → backend.
"Does it need React or Redux?" → `libs/` or app. "Is it a rule or a shape?" → `domain`. "Is it a user action?" →
`application`.

Core package rules:

- No imports from any framework (React, Redux, MUI) and no `.tsx` in `packages/`.
- Entities are anemic, immutable types. Domain folders are organised by type, not by entity.
- Use cases take ports by constructor injection, stay thin, return plain data. Expected outcomes are result unions
  (`found`, `not-found`, `failed`, ...), not exceptions. Workflows with several steps report progress via an options
  callback.
- Use `createCoreClient`, `ensureData`, `ensureOk` from `@dataspace-mgm/core-http` in repository adapters.
- Only `index.ts` imports `infrastructure/`. It exposes `create<Module>Module(config)` and the public types.
  `testing.ts` exposes in-memory adapters and fixtures as `@dataspace-mgm/<module>-core/testing`.
- Never deep-import into another package or lib; use its barrel (`index.ts`). Package boundaries are enforced by
  `@nx/enforce-module-boundaries` with the tags `type:*` and `scope:*` in `project.json`.
- UI code uses only `@dataspace-mgm/ui-mui`; no `@mui/*`, no `openapi-fetch`, no `create<Module>Module` outside the
  app's container.

## Code style

- One class or type per file; only `data/` folders may group related interfaces.
- `if` always with braces and the body on its own line (`curly: ['error', 'all']`).
- File names are `kebab-case` with a type suffix: `app.anemic.ts`, `bpn.value-object.ts`, `bpn.factory.ts`,
  `list-active-apps.use-case.ts`, `app-http.repository.ts`, `app.mapper.ts`.
- A value object's type is in `valueObjects/`, its creation and validation class in `factories/`.
- Unit tests sit next to the file (`*.test.ts`, `*.test.tsx`).
- ESLint and Prettier decide the formatting; do not fight them.
- New files need the license header used by the neighbouring files (REUSE). AI-written files carry the AI disclosure
  and `Assisted-By` line as in existing files.

## Adding a module (short form)

Full steps: `docs/developers/integrate-a-backend-module.md` and `architecture/12-adding-a-module.md` of the frontend
spec.

1. Copy the module's `openapi.yaml` to `specs/<module>/`; create `packages/<module>-core/` (copy the shape of
   `c3-m1-core`, including `project.json` tags and the `generate-api` and `check-api` targets); add the aliases.
2. Core: domain (anemics, value objects, factories, ports, in-memory repositories) → use cases → infrastructure
   (mappers, adapters, MSW handlers) → `index.ts`, `testing.ts`, README listing the use cases.
3. State: `UseCaseRegistry` augmentation, `<module>.api.ts` with `providesTags` / `invalidatesTags`, hooks, thunks
   only for workflows with progress, slices for UI state only.
4. Feature: pages with a `PageDefinition` (each page has a permission, or is explicitly open to every logged-in
   user), lazy components, translations.
5. Wire it into the app: use case container, store, page registry, menu config, listeners.

## Commands

```bash
npm ci
npm start                                  # nx serve portal → http://localhost:4200
npm run lint && npm run typecheck && npm test
npm run build                              # nx build portal
npx nx affected -t lint typecheck test build check-api
npx nx run <module>-core:generate-api      # regenerate types from specs/<module>/openapi.yaml
npx nx run <module>-core:check-api         # fails if generated types are stale
```

Runtime configuration comes from `/config.json` (copy `apps/portal/config.example.json` to
`apps/portal/public/config.json`, ignored by git).

## Done when

- [ ] `nx affected -t lint typecheck test build check-api` is green
- [ ] Coverage ≥ 90 % for the core package's `domain` and `application`
- [ ] Every UI operation is a use case; no component or state lib talks HTTP
- [ ] Every page has a permission (or is explicitly open to every logged-in user)
- [ ] No business rules, tokens or hard-coded texts in the UI
- [ ] The core package README explains its use cases and how to create the module
- [ ] Open questions and spec differences are written in the PR description

## Not here

No CQRS or event sourcing in the frontend, no micro-frontends during the hackathon, no WebSockets, no new state
libraries, no code importing `@catena-x/portal-shared-components`. Legacy repositories are read-only references.
