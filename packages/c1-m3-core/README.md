<!--
Copyright (c) 2026 Contributors to the Eclipse Foundation
SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
AI Disclosure: AI-generated with Codex (GPT-6); human review required.
-->

# C1-M3 Application Review mock

Start with Node >=24: `npm ci`, then `npm start`. Open http://localhost:4200/onboarding.
The Review workspace defaults to an explicitly labelled, in-memory demo. It works without a backend.
The portal shell still tries its existing session request; a missing backend does not prevent this demo.

## Work together

- **Rolf / Renate:** switch reviewers in the demo toolbar; a first approval survives switching accounts.
- **OSP Admin:** read-only. **Erika:** no review access. These are simulated review identities only;
  the portal's real profile/session is not changed.
- Change status, kind and verification filters; the default is the oldest open cases first.
- **Reset demo** restores fixtures and the queue, preserving the selected reviewer.
- **Simulate service outage** exercises error handling. Disable it or reset to recover.
- Refreshing the browser resets all simulated decisions. No localStorage or backend persistence.
- The module uses English only, with no language selector (explicit product decision).

## Scenarios

Fixtures are ordered by creation time in `src/mocks/review-fixtures.ts`:

| Fixture | Scenario |
|---|---|
| 1 | clean EBW onboarding; one approval |
| 2 | company name mismatch; comment and two different reviewers |
| 3 | documents; two different reviewers; sample document download |
| 4 | pending first approval from Rolf; switch to Renate |
| 5 | unavailable duplicate check; approval blocked, decline allowed |
| 6 | transfer with expected CSP match |
| 7 | reactivation with expected CSP match |
| 8 | Rolf's own application; only another reviewer may decide |
| 9–11 | approved, declined, withdrawn/closed history |
| 12 | transfer matching by name only; approval blocked |
| 13 | automatically approved history |
| 14 | withdrawal happened before review closure; decision returns 409 |
| 15–18 | local duplicate, missing consent, invalid signature, representation mismatch |

The PNG download is a tiny, valid placeholder, not a commercial register extract.
Automatic approval and withdrawal closure are represented by fixtures; this UI does not run orchestration steps.
No invented return-for-correction, retract-approval, or reviewer retry-check endpoint is included.

## Structure and API replacement

`packages/c1-m3-core` is framework-free. Each user action is a use case with constructor-injected
`ReviewRepository`: `list`, `get`, `approve`, `decline`, `document`.
Expected failures are plain `{ error: Problem }` outcomes; successes are `{ data }`.
`mocks/mock-review.repository.ts` simulates the server's rules at that repository boundary, rather than
intercepting unrelated network requests or adding a service worker. Both transports use the same RTK Query endpoints.
The UI does not derive decision eligibility or conditional comment requirements from application kind,
check results, applicant identity, status, or previous approvals. It sends the requested action and displays
the API response. Only permission-based visibility, request-in-progress state, and basic form validation
remain client-side. The API currently provides no action flags; none are invented in the frontend.

`libs/c1-m3/state` owns RTK Query, tag invalidation, filters, dialogs and demo controls.
`libs/c1-m3/feature` owns pages and the English text dictionary. App wiring lives under `apps/portal/src/features/review`
and `apps/portal/src/core/review-container.ts`. No shared libraries or other modules were modified.
Until shared state-core/i18n libraries exist, the registry, store and translation hook are module-local.

For real calls, set `VITE_REVIEW_API=live` in `apps/portal/.env.local` and restart Vite (or set it when building).
The same pages then use `createHttpReviewModule`, session permissions and the existing BFF cookies/CSRF mechanism.
The mock identity selector/reset/outage controls disappear. This requires a working BFF and completed backend:
the current stand-in lacks four-eyes approval, filters, full checks and embedded application data.

| Operation | Actual HTTP path |
|---|---|
| list | GET /api/c1-m3/review-cases |
| details | GET /api/c1-m3/review-cases/{reviewCaseId} |
| approve | POST /api/c1-m3/review-cases/{reviewCaseId}/approve |
| decline | POST /api/c1-m3/review-cases/{reviewCaseId}/decline |
| document | GET /api/c1-m2/osp/applications/{applicationId}/documents/{documentId} |

List filters support repeated status/kind/verification, applicationId, zero-based page and size <=100.
Mutations invalidate the detail and list queries; the UI reloads `application` because POST responses omit it.
Error extensions (`pendingChecks`, `failedChecks`, `cspOutcome`, `errors`) are preserved.
Document download separately requires `view_applications`. The UI creates and revokes an object URL;
binary document content is never stored in Redux.

## Contract seams and scope

- Backend C1-M3 v0.2.0 uses **camelCase**, overriding AGENTS.md's generic snake_case rule.
  Types are generated unchanged; no redundant case conversion is needed.
- The C1-M2 contract is copied as `specs/c1-m3/registration.openapi.yaml` solely to type the embedded
  ApplicationInternal and document adapter. C1-M2 implementation files remain untouched.
- Schemas mark `application` optional even though the GET behavior describes its presence. UI tolerates
  missing data (current stand-in), without assuming a POST result includes it.
- C1-M3 has no SSE endpoint. No polling or fabricated review stream is added. After mutations the RTK
  cache is invalidated; an optional C12 process monitor/notification integration remains outside this mock.
- The mock uses default four-eyes policy CHECK_FAILED,DOCUMENTS and all six enabled checks. It does not
  expose configuration for ALWAYS or dynamically enabled checks. Existing auto-approved cases are shown.
- Application kind and CSP matching are backend decisions. React only renders returned findings.
- Approval is distinct from completed onboarding. Downstream activation remains C12's job.

## Checks

`nx run c1-m3-core:generate-api` regenerates both copied contracts; `nx run c1-m3-core:check-api`
compares generated bytes in a temporary directory, including files not yet tracked by Git.
The generator is pinned at 7.13.0, executed through npx in isolation because its TS5 peer dependency
conflicts with this workspace's TS6 pin. Initial generation may need registry access.

Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, plus
`nx run-many -t test --projects=c1-m3-core,c1-m3-state,c1-m3-feature` and
`nx run c1-m3-core:check-api`. Core coverage: run `vitest run --coverage` in packages/c1-m3-core.
Domain/application coverage thresholds are 90% for lines, statements, functions and branches.

Before committing, review AI-generated changes and use the commit trailer:

```
Assisted-by: Codex (GPT-6)
```
