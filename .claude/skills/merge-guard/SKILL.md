---
name: merge-guard
description: Check a branch of the Dataspace Management UI before its pull request to eclipse-tractusx/dataspace-mgm-ui against the frontend architecture (portal-frontend-spec) - no tokens or Keycloak in the browser, framework-free core packages, MUI only in ui-mui, openapi-fetch only in core infrastructure, no fetchBaseQuery, no WebSockets, generated code untouched, no new legacy shared components, no deep imports - plus license headers, DEPENDENCIES when the lock file changes, commits and secrets; optionally run the Nx CI gate. Use for "is my UI branch ready", "review this UI PR", "why does the architecture lint fail", "write the PR description".
---

<!--
 Copyright (c) 2026 Catena-X Automotive Network e.V.
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

# Merge guard (UI)

The frontend is as dumb as possible (frontend architecture 01): business decisions and tokens live in the backend and
the BFF, the little logic that is left lives in framework-free core packages, and tooling enforces the boundaries. Until
the ESLint boundaries of chapter 02 exist in this workspace, and in addition to them, this skill checks the added lines
of a branch.

```bash
G=.claude/skills/merge-guard/scripts/merge-guard.py
$G                 # against origin/main (upstream/main if that remote exists)
$G --run           # also: npx nx affected -t lint typecheck test build check-api
$G --strict        # exit 1 on a blocker or high finding
```

## What it checks

| Check | Severity | Rule |
|---|---|---|
| `keycloak-js`, a token in local/session storage, an `Authorization` header built in the UI | blocker | 01.1, 05, decision 2 |
| a framework (React, Redux, MUI, React Router, Vue, Angular, MSW) imported in `packages/` | blocker | 01.2, 01.6 |
| `.tsx` in `packages/` | high | 01.7 |
| `@mui/*` outside `libs/shared/ui-mui`; `openapi-fetch` outside `packages/*/src/infrastructure` | high | 01.6, decision 15 |
| `fetchBaseQuery` | high | decision 17 (RTK Query `queryFn` calls core use cases) |
| `new WebSocket(` | high | 01.8 (SSE only) |
| `src/generated/` changed without a change in `specs/` | high | 01.7 (never edit generated code) |
| new import of `@catena-x/portal-shared-components`, deep import `@portal/<x>/src/…` | high | 12, 01.7 |
| `package.json` / `package-lock.json` changed without `DEPENDENCIES` | high | TRG 7.04 |
| secrets in added lines; license headers on new files; AI co-author instead of `Assisted-by`; Conventional Commits | as in the service | TRG 7.02, 1.03 |

Test files (`*.spec.*`, `*.test.*`), `mocks/` and `testing/` are exempt from the architecture rules.

When `specs/` changed, also run `contract-seam vendored`: a copy that differs from the backend spec breaks on the first
integration.
