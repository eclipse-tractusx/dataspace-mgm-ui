<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation

 AI Disclosure: This file was entirely AI-generated.
 The AI-generated portions are made available under CC0-1.0 and not subject
 to the project's license. The human contributor has reviewed and verified
 that the content is correct.

 SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-opus-5-5)
-->

# @dataspace-mgm/c3-m2-core

Framework-free core package of the backend module **C3-M2 CSP Connection**
([spec](../../specs/c3-m2/openapi.yaml), copied from
[portal-backend-spec](https://github.com/tx-arena-events/portal-backend-spec/tree/main/C3-M2-CSPConnection)).
The UI only reads; the steps of the module run from Process Orchestration.

## Use cases

| Use case | Operation | Permission, scope | Result |
|---|---|---|---|
| `getCspRegistration.execute(companyId)` | `GET /companies/{companyId}` (`getCspRegistration`) | `view_csp_registration`, osp | `found` with the registration, `not-registered` (404), `forbidden` (403), `failed` (401, 501, 502, network) |

## Use it

```ts
import { C3M2_BASE_PATH, createC3M2Module } from '@dataspace-mgm/c3-m2-core';

const c3m2 = createC3M2Module({ baseUrl: `${apiBaseUrl}${C3M2_BASE_PATH}` });
const result = await c3m2.getCspRegistration.execute(companyId);
```

Tests and mock mode use `@dataspace-mgm/c3-m2-core/testing` (`InMemoryCspRegistrationRepository`, `CSP_REGISTRATIONS`): fixtures and
an injected failure, no permission check (that is C3-M2's).

## State of the backend

C3-M2 is implemented by Team 2 on branch `team/2` of dataspace-mgm-services (PR #28); `main` still has the stand-in
(501 for `getCspRegistration`). team/2 `registration_view` leaves out empty fields, which the mapper turns into null; a
malformed `companyId` answers 400 `validation` (`failed` in the UI).

Verified on 2026-11-06 end to end against the Team 2 app (in-process bridge, no BFF): 404 `not-registered` for a
company without registration and 403 `forbidden` for the OSP Reviewer. The 200 answer was checked against
`schemas.CspRegistration` and with the wire format in `c3-m2.test.ts`, but **not** end to end: a registration needs
the steps of Process Orchestration and the CSP (`CSP_URL`), which the run did not start.

## Update the spec

```bash
cp ../portal-backend-spec/C3-M2-CSPConnection/openapi.yaml specs/c3-m2/openapi.yaml   # and the commit in .license
npx nx run c3-m2-core:generate-api
npx nx run c3-m2-core:check-api
```
