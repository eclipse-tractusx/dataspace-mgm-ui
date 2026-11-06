<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation

 AI Disclosure: This file was entirely AI-generated.
 The AI-generated portions are made available under CC0-1.0 and not subject
 to the project's license. The human contributor has reviewed and verified
 that the content is correct.

 SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-opus-5-5)
-->

# @dataspace-mgm/c3-m1-core

Framework-free core package of the backend module **C3-M1 Company Profile**
([spec](../../specs/c3-m1/openapi.yaml), copied from
[portal-backend-spec](https://github.com/tx-arena-events/portal-backend-spec/tree/main/C3-M1-CompanyProfile)).
It is the example of [docs/developers/integrate-a-backend-module.md](../../docs/developers/integrate-a-backend-module.md)
and the core of the participant management (mockups/participants, views 1 to 9).

## Use cases

`getOwnCompany` returns its own union (`found`, `no-company`, `not-found`, `failed`). Every other use case returns an
`OperationResult<T>`: `success` with the data, `invalid` (local pre-check, nothing sent; errors are i18n keys),
`not-found` (404), `forbidden` (403), `rejected` (400/409 with the name of the Problem Details type, e.g. `same-person`)
or `failed` (401, 5xx incl. 501 of a stand-in and 502 of the BFF, network).

| Use case | Operation | Permission, scope | View |
|---|---|---|---|
| `getOwnCompany` | `GET /companies/{companyId}` (`getCompany`) | `view_company`, company | 1 |
| `updateShortName` | `PATCH /companies/{companyId}` (`updateCompany`), `{ shortName }` only | `edit_company`, company | 1 |
| `listOwnChangeRequests` | `GET /companies/{companyId}/change-requests` | `view_company`, company | 1, 3 |
| `createChangeRequest` | `POST /companies/{companyId}/change-requests` (multipart: `data` + `documents`) | `edit_company`, company | 2 |
| `withdrawChangeRequest` | `POST /companies/{companyId}/change-requests/{id}/withdraw` | `edit_company`, company | 3 |
| `listCompanyRoles` | `GET /companies/{companyId}/company-roles?lang=` | `view_company`, company | 4 |
| `addCompanyRole` | `POST /companies/{companyId}/company-roles` with all terms as consents | `edit_company_roles`, company | 4 |
| `removeCompanyRole` | `DELETE /companies/{companyId}/company-roles/{companyRole}` | `edit_company_roles`, company | 4 |
| `listCompanies` | `GET /osp/companies` (status, name, bpn, hasBpn, companyRole, coreDataSource, page, size) | `view_companies`, osp | 5 |
| `getCompanyDetail` | `GET /osp/companies/{companyId}` | `view_companies`, osp | 6, 7 |
| `correctCompany` | `PATCH /osp/companies/{companyId}` (only changed parts + `reason`) | `manage_companies`, osp | 6 |
| `deactivateCompany` | `POST /osp/companies/{companyId}/deactivate` | `manage_companies`, osp | 6 |
| `listChangeRequests` | `GET /osp/change-requests` (status, companyId, page, size) | `review_company_changes`, osp | 8 |
| `getChangeRequest` | `GET /osp/change-requests/{id}` | `review_company_changes`, osp | 9 |
| `downloadChangeRequestDocument` | `GET /osp/change-requests/{id}/documents/{documentId}` (Blob) | `review_company_changes`, osp | 9 |
| `approveChangeRequest` | `POST /osp/change-requests/{id}/approve` | `review_company_changes`, osp | 9 |
| `declineChangeRequest` | `POST /osp/change-requests/{id}/decline` | `review_company_changes`, osp | 9 |

Not built: `updateCompanyFromAttestation` (`POST /companies/{companyId}/attestation-updates`). The UI cannot obtain the
verification attestation: the BFF flow to the EBW-Connector (C5-M1) is not specified. View 2 shows the wallet path as
"not available yet".

`domain/domains` holds only UX pre-checks that the API enforces again (`CompanyDomain.canEdit`, `canCorrect`,
`canDeactivate`, `canRequestCoreDataChange`, `ChangeRequestDomain.isOpen`, `CompanyRoleDomain.canAdd/canRemove`) and the
input limits of the spec. The four-eyes principle is never checked in the UI: the API answers 409 `same-person`.

## Use it

```ts
import { C3M1_BASE_PATH, createC3M1Module } from '@dataspace-mgm/c3-m1-core';

const c3m1 = createC3M1Module({ baseUrl: `${apiBaseUrl}${C3M1_BASE_PATH}` });
const result = await c3m1.getOwnCompany.execute(session.companyId);
```

Tests and mock mode use `@dataspace-mgm/c3-m1-core/testing`: `createInMemoryC3M1Module({ actorId })` serves the fixtures
of `mockups/participants/shared/data.js` and the success answers of the operations. It holds **no rule of the module**
(permissions, scope `company`, four-eyes principle, last role, open change request, locked fields): those are C3-M1's.
A test shows an answer of the module by injecting it, e.g. `failures: { approveChangeRequest: c3m1Problem(409, 'same-person') }`.
`InMemoryCompanyRepository` and `OSP_A_COMPANY` stay for the first page.

## State of the backend

C3-M1 is implemented by Team 2 on branch `team/2` of dataspace-mgm-services (PR #29, merge `3a902aa`); `main` still has
the stand-in, which answers 501 for everything but `getCompany` and `getCompanyDetail`.

Verified on 2026-11-06 against `team/2`:

- **Code review** of `modules/c3_m1/router.py` and `interface.py` against every HTTP adapter: paths, methods, query
  parameters (repeated `status`), bodies, the multipart part `data`, page shape `{ items, page, size, total }`, the
  document download (`Content-Disposition`), permissions (`standin.perm` from `x-permission`) and Problem Details types.
- **End to end**: the real adapters of this package (generated client, CSRF middleware, mappers) against the Team 2
  FastAPI app with its in-memory test IAM and seed (as `tests/test_c3_m1_api.py`), every use case above except
  `updateCompanyFromAttestation`, with Erika, Max, Hans, Rolf and Otto: success paths, 403, 404 (scope `company`) and
  409 `last-role`, `change-request-open`, `invalid-state`, `field-locked`. The transport was an in-process bridge
  instead of TCP (the agent sandbox cannot open ports), so the dev BFF and Keycloak were **not** part of that run.
- Not verified against a running stack: the dev BFF (`npm start` → `/api/**`), Keycloak tokens, Postgres
  (`store_postgres.py`), SSE.

Differences found and fixed in the UI:

| What | Spec | team/2 | Fix |
|---|---|---|---|
| multipart part `data` of `createChangeRequest` | `encoding: data: application/json` | `data: str = Form(...)`: a part with a file name is refused (400 `body.data`) | sent as a plain text field |
| `CompanyRoleState.assignableBy`, `AgreementConsent.name`, `documentUrl` | required | `None` when the catalogue or terms lack an entry | mapper defaults (`SEED`, the key, no link) |

Differences the UI tolerates (open points below): `Company` for people has no `activatedAt` and `changedAt` (the
"Member since" shows "–"); a repeated `deactivate` of an INACTIVE company answers 200 (idempotent), not 409.

## Open points for the backend (from the participant management UI)

| # | Priority | Operation / schema | What the UI needs | In the spec? |
|---|---|---|---|---|
| 1 | P0 | deployment | `team/2` of C3-M1 and C3-M2 merged to `main` (the stand-in answers 501) | – |
| 2 | P1 | `Company` | the actions allowed now (e.g. `allowedActions`), so the UI does not read them from `status` and `coreDataSource` | no |
| 3 | P1 | `Company` | `openChangeRequestId` (only in `CompanyDetail`), so view 1 needs one call instead of two | no |
| 4 | P1 | `ChangeRequest` | a display name of `requestedBy` (today a `sub`; view 9 shows its short id) | no |
| 5 | P1 | BFF / C5-M1 | the flow that fetches a verification attestation for `updateCompanyFromAttestation` | no |
| 6 | P1 | `GET /config` or a flag | `CHANGE_REQUESTS_ENABLED`, `CHANGE_REQUEST_MAX_DOCUMENTS`, `CHANGE_REQUEST_MAX_DOCUMENT_BYTES` (the UI assumes 3 / 10 MB) | no |
| 7 | P1 | `Company` (team/2 `company_view`) | `activatedAt` for people of the company (in the spec, not in the answer) | yes |
| 8 | P2 | spec vs team/2 | `createChangeRequest`: the spec should say that `data` is a text field, or team/2 should accept a JSON part | – |
| 9 | P2 | `ChangeRequest` (OSP list) | `coreDataSource` of the company, for the queue (view 8) without one call per row | no |
| 10 | P2 | `Company` | `deactivationReason` for people of the company | no |
| 11 | P2 | catalogue | the list of company roles for the filter of view 5 (the UI offers the four roles of the test data) | partly (`/internal/company-roles`, not for the UI) |
| 12 | P2 | Problem Details | `fields`, `missing`, `errors` are dropped by `ensureData` of core-http, so the UI cannot name the locked field | yes (core-http change, not this module) |

## Update the spec

```bash
cp ../portal-backend-spec/C3-M1-CompanyProfile/openapi.yaml specs/c3-m1/openapi.yaml   # and the commit in .license
npx nx run c3-m1-core:generate-api     # rewrites src/generated/, never edit it by hand
npx nx run c3-m1-core:check-api        # fails when the generated types are not up to date
```

## Layout

`domain/` (anemics, value sets, ports, result unions, pre-checks, in-memory adapters) ← `application/` (use cases) and
`infrastructure/` (generated client, mappers, HTTP adapters); `c3-m1-module.factory.ts` wires the use cases to either
set of adapters, and only `index.ts` imports `infrastructure/`.
