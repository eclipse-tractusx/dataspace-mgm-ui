---
name: build-poc
description: Phase 2 of 3 (mockup → proof of concept → feature). Turn the decided views of a mockup in mockups/<feature>/ into a proof of concept inside the real portal - a feature module with stage 'poc' (routed only in mock mode), pages and components that reproduce the mockup, hooks that call use cases of the module's framework-free core package, and an in-memory adapter whose fixtures come from the mockup's data - runnable with VITE_USE_MOCKS=true npm start, without backend or BFF. Use for "build the POC of onboarding", "make the mockup clickable in the app", "start the feature on mock data", "the backend is not ready yet, build the UI anyway". Comes after create-mockup; next phase - build-feature.
---

<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation

 See the NOTICE file(s) distributed with this work for additional
 information regarding copyright ownership.

 This program and the accompanying materials are made available under the
 terms of the Apache License, Version 2.0 which is available at
 https://www.apache.org/licenses/LICENSE-2.0.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 License for the specific language governing permissions and limitations
 under the License.

 AI Disclosure: This file was entirely AI-generated.
 The AI-generated portions are made available under CC0-1.0 and not subject
 to the project's license. The human contributor has reviewed and verified
 that the code is correct.

 SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-opus-5-5)
-->

# Build the proof of concept (phase 2 of 3)

The proof of concept is the mockup rebuilt with the real parts of the portal: the shell, the theme of
`@dataspace-mgm/ui-mui`, the feature registry, the core packages. Only the data is fake, and it sits exactly where the
backend will plug in later: behind the port of the module's core package. Phase 3 (`build-feature`) then replaces the
in-memory adapter by the HTTP adapter, and the pages and hooks stay as they are.

**Start only when** `.claude/skills/create-mockup/scripts/mockup.py status <feature> --ready` exits 0. A view that is
still open in the mockup is decided there, not in React.

## What this phase produces

| Part | Where | Notes |
|---|---|---|
| Feature module | `apps/portal/src/features/<feature>/` | `routes.tsx` with one `FeatureConfig` and `stage: 'poc'`, `pages/`, `components/`, `hooks/`, `index.ts` |
| Registry entry | `apps/portal/src/features/main.tsx` | the feature replaces its `upcoming(...)` placeholder (same name, description, category, icon, path, version) |
| Core package | `packages/<module>-core/` | `domain/` (anemics, ports, result unions, in-memory adapter + fixtures), `application/useCases/`, `data/`, `index.ts`, `testing.ts` |
| Mock wiring | `apps/portal/src/core/mock-container.ts` | the module on its in-memory adapter; more test persons in `MOCK_PERSONS` when the views need them |
| Tests | next to the code | every use case and every result state of every page |

Not in this phase: the HTTP adapter, `create<Module>Module`, the generated types, the entry in `core/container.ts`. A
feature with `stage: 'poc'` is closed ("coming soon") outside mock mode, so a POC can be merged to `main` without
showing fake data to anyone (`isOpen()` in `features/main.tsx`).

## Workflow

### 1. Map the mockup to code (write it down before coding)

Read the hub (`mockups/<feature>/index.html`), every decided view and `shared/data.js`, then fill this table in the
core package's `README.md` (create it from `packages/c3-m1-core/README.md`):

| Mockup | Becomes |
|---|---|
| a view (`views/<view>.html`) | a page in `pages/` and a route in `routes.tsx` |
| the chosen combination of the view's configurator (the decision in the hub) | the only variant that is built; the other alternatives are not ported |
| a visual zone of a view (header card, table, filter bar, dialog) | a component in `components/`, one file each, under 150 lines |
| an operation under "Data from the spec" | one use case per operation, reads included (`get…`, `list…`, `approve…`) |
| the states of a view (`data-states`) | the `status` values of the use case's result union, plus `loading` and `signed-out` in the hook |
| an object in `data.js` | an anemic type (only the fields the views show, named like the spec schema) and its fixtures |
| a flag that decides a button | a field of the anemic, coming from the API; never a rule in the UI |
| a test person of the view | an entry in `MOCK_PERSONS` with the permissions of the operations (`x-permission`) |

### 2. The core package (framework-free)

Follow the layout of `packages/c3-m1-core` (the example of `docs/developers/integrate-a-backend-module.md`); add to the
package if the module already has one.

1. `project.json` (name `<module>-core`, tags `type:core`, `scope:<module>`, targets `typecheck`, `test`, `lint`),
   `tsconfig.json`, `vitest.config.ts`, copied from `c3-m1-core`. `generate-api` and `check-api` come in phase 3 with
   the vendored spec.
2. Aliases in `tsconfig.base.json` (`paths`) and `workspace.aliases.ts`: `@dataspace-mgm/<module>-core/testing` before
   `@dataspace-mgm/<module>-core`.
3. `src/domain/anemics/<entity>.anemic.ts`: `Readonly<{…}>` with the spec's field names and enum values.
4. `src/domain/repositories/<entity>.repository.ts`: the port, only the methods the use cases call (`null` = 404).
5. `src/domain/data/<use-case>-result.data.ts`: one interface per outcome, joined in a union
   (`found | not-found | failed`, `forbidden` when the operation has a permission, `conflict` for a 409).
6. `src/domain/testing/in-memory-<entity>.repository.ts`: the in-memory adapter (records its calls, can be built with
   a failure) and the fixtures, copied from `mockups/<feature>/shared/data.js`, exported from `src/testing.ts`.
7. `src/application/useCases/<use-case>.use-case.ts`: expected outcomes as results, not exceptions;
   `CoreHttpErrorFactory.from(error)` for the rest, as in `get-own-company.use-case.ts`. A test per outcome, with the
   in-memory adapter.
8. `src/data/<module>-module.data.ts`: `interface <Module>Module { <useCase>: <UseCase>UseCase; … }`.
9. `src/index.ts`: the types, the use case classes and `<MODULE>_BASE_PATH` (`servers.url` of the spec without
   `/api`). No React, no MUI, no HTTP client in the package (ESLint and `merge-guard` stop it).

### 3. Mock mode

1. `apps/portal/src/core/container.ts`: add the module to `CoreModules` as an **optional** member
   (`c1m3?: C1M3Module`), documented as a proof of concept. Nothing in `createCoreModules` yet.
2. `apps/portal/src/core/mock-container.ts`: wire it, `c1m3: { listReviewCases: new ListReviewCasesUseCase(new
   InMemoryReviewCaseRepository(REVIEW_CASES)) }`, and add the persons the views need to `MOCK_PERSONS` (a
   `SessionAnemic` with the person's `sub`, company and permission keys from FRAMEWORK 7a and the spec).
3. `apps/portal/src/core/testing.tsx`: let `testCoreModules()` take the module's fixtures and failure, like
   `companies` and `companyFailure`.

### 4. The feature module

1. `routes.tsx`: the `FeatureConfig` of the `upcoming(...)` entry (same `id`), now with `disabled: false`,
   `stage: 'poc'`, `translations: <feature>Translations` and a route per page (`meta.title` = the i18n key of the view
   title). In `features/main.tsx` replace the `upcoming(...)` call by the import.
2. `i18n/`: copy `features/participants/i18n/` and rename it (namespace = the feature folder). Every text of the
   mockup becomes a key in `locales/en/<feature>.json` **and** in every other supported language
   (`locales/de/<feature>.json`, formal *Sie*) in the same commit; the feature's name and description stay
   `features.<id>` in `src/i18n/locales/*/common.json`, updated in every language if the mockup changed them. Guide:
   `docs/developers/translations.md`.
3. `hooks/use<Thing>.ts`: reads the session (`useSession()`), calls the use case through `useCoreModules()`, returns a
   state union (`loading`, `signed-out`, then the use case's results). The module is optional while it is a POC:
   `if (!c1m3) return { status: 'not-connected' }`, and the page shows a translated text for it.
   Pages never call a use case or `fetch` themselves.
4. `pages/` and `components/`: reproduce the mockup. Everything visual comes from `@dataspace-mgm/ui-mui` (a missing
   MUI component or icon is re-exported there, never imported from `@mui/*`); colours from the theme
   (`palette.ui.*`, `tractusx.*`, `alpha(tractusx.orange, 0.15)`), never hex. The mockup's `tx-*` blocks map to MUI:
   `tx-card` → `Card`, `tx-btn` → `Button` (variants `contained`, `outlined`, `color="secondary"`), `tx-chip` →
   `Chip`, `tx-status--*` → `Chip variant="outlined" color=…`, `tx-alert--*` → `Alert severity=…`, `tx-label` +
   value → the `Field` pattern of `CompanyProfile.tsx`, `tx-table` → a `Table` (re-export it), `dialog.tx-dialog` →
   `Dialog`.
5. Every state of the mockup is a branch of the page (`switch (state.status)`), with the same texts. No strings
   that decide anything, and no string in the JSX: `const { t } = useTranslation(<FEATURE>_NS)` and `t('key')` for
   every text, `aria-label`, `title`, chip and alert, values by interpolation, API values (status, roles) as keys.
6. Accessible as the existing pages: headings in order, `aria-label` on icon buttons, `role="status"` while loading.

### 5. Prove it

1. `VITE_USE_MOCKS=true npm start` (or `VITE_USE_MOCKS=true` in `apps/portal/.env.local`), then open
   `http://localhost:4200<path>`. The environment chip says **mock data**; `VITE_MOCK_PERSON=<key>` signs in another
   person of `MOCK_PERSONS`, an unknown key (`none`) starts signed out.
2. Put the page and the mockup side by side at desktop and phone width, dark and light: same order, same words, same
   states, same actions. Every difference is either fixed or written into the hub as a decision.
3. Tests: each use case with the in-memory adapter, each page per state with `TestCoreModules` (like
   `CompanyProfile.test.tsx`, which loads its namespace in `beforeAll`), and the registry (`features/main.test.tsx`)
   still green. The tests fail on a rendered key without a text and on a language that misses a key.
   Switch the language in the header once and look at every view in German too. `npm start` without mock mode
   still shows the feature as "coming soon".
4. Gates: `npm run lint && npm run typecheck && npm test && npm run build`, then
   `.claude/skills/merge-guard/scripts/merge-guard.py --strict`.

### 6. Hand over to phase 3

In the core package `README.md`, under "Open points for the backend", list per use case the operation, every field the
fixtures carry and whether the spec has it, with a priority:

| # | Priority | Operation | What the UI needs | In the spec? | Notes |
|---|---|---|---|---|---|
| 1 | P0 (blocks the feature) | `GET /api/c1-m3/review-cases` | `checkCounts.failed` | yes | |
| 2 | P1 (needed for the full feature) | `GET /api/c1-m3/review-cases/{id}` | `canApprove` flag | no | the UI must not decide the four-eyes rule |

Pull request: `feat(<feature>): proof of concept on mock data`, with screenshots of the POC next to the mockup.

## Common pitfalls

| Pitfall | Fix |
|---|---|
| Fixtures with fields the spec does not have, unnoticed | Name fields like the schema; every other field is an open point in the README |
| A page that imports the in-memory adapter or `@dataspace-mgm/<module>-core/testing` | Only `mock-container.ts` and tests import `testing` |
| Logic in the component ("approve if I am not the first approver") | A flag in the anemic, from the API; the rule stays in the backend |
| A string in the JSX, or a text only in English | A key in `i18n/locales/en` and in every other language, in the same commit |
| `stage: 'poc'` forgotten | the feature would open on production builds with no module behind it |
| One big page component | One component per visual zone of the mockup; logic in the hook |
| Adding the module to `createCoreModules` with a fake | The real container gets the module only with its HTTP adapter (phase 3) |

## Done when

- [ ] Every decided view of the mockup is a page; every state of it renders
- [ ] `VITE_USE_MOCKS=true npm start` shows the feature with the mockup's data; without mock mode it is "coming soon"
- [ ] Every operation is a use case of `packages/<module>-core` with a test per outcome
- [ ] Every text is an i18n key of the feature's namespace, with its text in every supported language
- [ ] Pages are tested per state; lint, typecheck, test, build and `merge-guard --strict` are green
- [ ] The core package README has the use cases and the open points for the backend
