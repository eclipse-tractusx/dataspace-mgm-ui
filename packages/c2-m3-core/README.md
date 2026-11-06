<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation

 AI Disclosure: This file was entirely AI-generated.
 The AI-generated portions are made available under CC0-1.0 and not subject
 to the project's license. The human contributor has reviewed and verified
 that the content is correct.

 SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-opus-5-5)
-->

# @dataspace-mgm/c2-m3-core

Framework-free core package of the backend module **C2-M3 Technical Users**
([spec](../../specs/c2-m3/openapi.yaml), copied from
`portal-backend-spec` `C2-M3-TechnicalUser` at commit `76587a6`).

## Use cases

| Use case | Operation | Permission (`scope`) | Result |
|---|---|---|---|
| `listTechnicalUsers.execute(companyId, filters)` | `GET /companies/{companyId}/technical-users` (`listTechnicalUsers`) | `view_technical_users` (`company`) | `success` (`TechnicalUserPage`), `not-found`, `forbidden`, `conflict`, `failed` |
| `getTechnicalUser.execute(companyId, id)` | `GET /companies/{companyId}/technical-users/{technicalUserId}` (`getTechnicalUser`) | `view_technical_users` (`company`) | `success` (`TechnicalUser`), `not-found`, `forbidden`, `conflict`, `failed` |
| `listAssignableRoles.execute(companyId, lang)` | `GET /companies/{companyId}/assignable-roles` (`listAssignableRoles`) | `view_technical_users` (`company`) | `success` (`readonly AssignableRole[]`), `not-found`, `forbidden`, `conflict`, `failed` |
| `createTechnicalUser.execute(companyId, input)` | `POST /companies/{companyId}/technical-users` (`createTechnicalUser`) | `manage_technical_users` (`company`) | `success` (`CreatedTechnicalUser`), `not-found`, `forbidden`, `conflict`, `failed` |
| `updateTechnicalUser.execute(companyId, id, input)` | `PATCH /companies/{companyId}/technical-users/{technicalUserId}` (`updateTechnicalUser`) | `manage_technical_users` (`company`) | `success` (`TechnicalUser`), `not-found`, `forbidden`, `conflict`, `failed` |
| `rotateCredentials.execute(companyId, id)` | `POST /companies/{companyId}/technical-users/{technicalUserId}/credentials/rotate` (`rotateCredentials`) | `manage_technical_users` (`company`) | `success` (`{ credentials }`), `not-found`, `forbidden`, `conflict`, `failed` |
| `deleteTechnicalUser.execute(companyId, id)` | `DELETE /companies/{companyId}/technical-users/{technicalUserId}` (`deleteTechnicalUser`) | `delete_technical_users` (`company`) | `success` (`DeleteOutcome`: `deleted` on 204 or `pending` on 202), `not-found`, `forbidden`, `conflict`, `failed` |

## Use it

```ts
import { C2_M3_BASE_PATH, createC2M3Module } from '@dataspace-mgm/c2-m3-core';

const c2m3 = createC2M3Module({ baseUrl: `${apiBaseUrl}${C2_M3_BASE_PATH}` });
const result = await c2m3.listTechnicalUsers.execute(companyId, { page: 0 });
```

In-memory adapters and fixtures (`InMemoryTechnicalUserRepository`, `TECHNICAL_USERS`, `ASSIGNABLE_ROLES`, `FIXTURE_COMPANY_ID`) are exported from `@dataspace-mgm/c2-m3-core/testing`.

## Update the spec

```bash
cp ../dataspace-mgm-services/spec/C2-M3-TechnicalUser/openapi.yaml specs/c2-m3/openapi.yaml
npx nx run c2-m3-core:generate-api
npx nx run c2-m3-core:check-api
```
