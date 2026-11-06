---
name: build-feature
description: Phase 3 of 3 (mockup → proof of concept → feature). Connect a proof of concept of the Dataspace Management UI to its backend module and open it for everyone - vendor the module's openapi.yaml, generate the types, write the HTTP adapter and mapper behind the port the POC already uses, wire create<Module>Module in core/container.ts, drop stage 'poc', test every result against the running backend through the dev BFF, and produce the prioritised open points for the backend team. Use for "connect onboarding to C1-M3", "take the POC live", "build the real feature from the mockup", "what does the backend still have to provide for this page", or "is this feature ready to merge". Comes after build-poc.
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

# Build the feature (phase 3 of 3)

The proof of concept already has the pages, the hooks, the use cases and the port; it runs on an in-memory adapter in
mock mode. This phase adds the other side of the port: the module's contract, the generated types, the HTTP adapter.
Then the feature opens for everyone. The pages and hooks do not change, except for removing the POC guard.

**Start only when** the feature runs with `VITE_USE_MOCKS=true npm start`, its tests are green and its core package
README lists the open points for the backend (skill `build-poc`).

## Two tracks, in parallel

| Track | Question | Tools |
|---|---|---|
| Frontend | How do the module's responses become the anemics the POC uses? | `contract-seam`, the generated types, `c3-m1-core` as the example |
| Backend | What do the views need that the module does not provide yet? | `portal-spec-sources`, `flow-trace`, the open points of the POC |

In Claude Code the two tracks can run as two agents on the same branch (one maps the adapter, one audits the spec
against the fixtures); the frontend track never invents a field the backend track has not confirmed.

## Workflow

### 1. The contract

1. Copy the module's spec: `cp <backend spec>/<MODULE-FOLDER>/openapi.yaml specs/<module>/openapi.yaml` and add
   `specs/<module>/openapi.yaml.license` like `specs/c3-m1/openapi.yaml.license` (source URL with the spec commit from
   `spec-src.py where`).
2. `contract-seam`: `seam-check.py vendored` (the copy equals the backend spec) and `seam-check.py summary`.
3. Walk the open points of the core package README. For each field of the fixtures find the schema field
   (`spec-src.py ops <module>`, the schema in `openapi.yaml`). A field the spec does not have is **not** added to the
   adapter: it stays an open point (P0 if a view cannot work without it), and the view shows what the spec has.

### 2. Generated types

1. Add the targets `generate-api` and `check-api` to `packages/<module>-core/project.json`, copied from
   `c3-m1-core/project.json` (pinned `openapi-typescript@7.13.0`, output `src/generated/<module>-api.d.ts`).
2. `npx nx run <module>-core:generate-api`; add the `.license` file of the generated file like
   `c3-m1-api.d.ts.license`. Never edit `src/generated/`.

### 3. The HTTP adapter

1. `src/infrastructure/data/<module>-infrastructure.data.ts`: `type <Module>Client = Client<paths>` as in `c3-m1-core`.
2. `src/infrastructure/mappers/<entity>.mapper.ts`: DTO (generated type) → anemic. Only here do wire shapes meet UI
   shapes (an address in parts becomes two lines, a list of `{companyRole, status}` becomes the active roles).
3. `src/infrastructure/repositories/<entity>-http.repository.ts`: implements the POC's port with the generated client:
   `ensureData(this.client.GET('/path/{id}', { params: { path: { id } } }))`, a 404 that the port defines as `null`
   caught as `CoreHttpException` with `HTTP.NOT_FOUND`, everything else rethrown for the use case's
   `CoreHttpErrorFactory`. Writes go through the same client; `createCoreClient` adds the CSRF token.
4. Test the adapter with a fake `fetch` and the wire format of the backend (copy `company-http.repository.test.ts`):
   the path and method sent, the mapping, 404, a Problem Details error.

### 4. Wire it and open the feature

1. `src/index.ts`: `create<Module>Module(config: CoreModuleConfig)` builds the HTTP adapter and the use cases.
2. `apps/portal/src/core/container.ts`: `<module>: create<Module>Module(moduleConfig(<MODULE>_BASE_PATH))`; make the
   member of `CoreModules` required. `mock-container.ts` keeps the in-memory wiring, so mock mode still works.
3. Remove the POC guard from the hook (`if (!<module>) …`) and `stage: 'poc'` from `routes.tsx`.
4. `apps/portal/src/core/testing.tsx` stays on the in-memory adapters.

### 5. Against the backend

Run the backend and the UI as in `docs/developers/integrate-a-backend-module.md` (backend OSP A on :8000, `npm start`
with the dev BFF), then for every view:

| Check | How |
|---|---|
| The happy path with the right person | `http://localhost:4200/auth/login?person=<key>&return_to=<path>` (FRAMEWORK 7a persons) |
| Empty | a person or an installation without data (start state, before `demo.py` scenarios) |
| 403 | a person without the operation's `x-permission` (e.g. `lieschen`); `portal-token-inspect` explains it |
| 404 in scope `company` | another company's object |
| Validation 400 | a write with a wrong value: the Problem Details `type` is shown, not swallowed |
| Backend down / stand-in not implemented | stop the backend (502 from the dev BFF), or a 501 from the stand-in |
| Live updates | if the module has an SSE stream, it arrives through the dev BFF |

Then compare once more with the mockup at desktop and phone width, dark and light.

### 6. Gates

```bash
npm run lint && npm run typecheck && npm test && npm run build
npx nx run <module>-core:check-api                                   # generated types match the vendored spec
.claude/skills/contract-seam/scripts/seam-check.py ui-calls          # every call of the UI exists in the backend spec
.claude/skills/merge-guard/scripts/merge-guard.py --strict           # architecture rules, headers, commits, secrets
.claude/skills/dependencies-and-dash/scripts/dash-check.sh --list-only   # only if package-lock.json changed
```

Plus: a `CHANGELOG.md` line, the core package README (use cases, how to create the module, open points), screenshots
of the feature in the pull request.

### 7. The backend's backlog

Turn the open points that are left into the module team's backlog. Format, in the PR description and in an issue on
portal-backend-spec (or the module's `OPEN-QUESTIONS.md` in the service):

```markdown
## Open points for <module> from the <feature> UI

### P0: blocks the feature
| # | What the UI needs | Operation / schema | Today | Notes |
|---|---|---|---|---|

### P1: needed for the full feature
| # | What the UI needs | Operation / schema | Today | Notes |
|---|---|---|---|---|

### P2: enhancement
| # | What the UI needs | Operation / schema | Today | Notes |
|---|---|---|---|---|

### Proposed contract changes
(the schema or operation as YAML, in the style of the module's openapi.yaml)
```

Proposals are proposals: the backend team decides the contract, and the UI follows the spec it publishes.

## Common pitfalls

| Pitfall | Fix |
|---|---|
| The adapter fills a field the spec lacks with a default | Leave it out and keep the open point; a guessed value hides the gap |
| Snake_case or `/api/<name>` paths from the frontend architecture | The vendored spec wins: camelCase, `/api/<module id>` (`contract-seam`) |
| A 422 handler | Validation is 400 Problem Details with `urn:<module>:problem:<name>` |
| The page changed while connecting | Only the adapter, the mapper, the wiring and the POC guard change |
| Tested only as Pia | Every result state, with the persons that produce it |
| Mock mode broken after the switch | `mock-container.ts` keeps the in-memory wiring; run it once more |

## Done when

- [ ] `specs/<module>/openapi.yaml` equals the backend spec (`seam-check.py vendored`) and the types are generated
- [ ] The HTTP adapter and mapper are tested with the wire format; `create<Module>Module` is wired in `container.ts`
- [ ] `stage: 'poc'` and the hook's POC guard are gone; mock mode still works
- [ ] Every result state was seen against the running backend with the right test person
- [ ] Lint, typecheck, test, build, `check-api`, `ui-calls` and `merge-guard --strict` are green
- [ ] The remaining open points are with the backend team, prioritised P0, P1, P2
