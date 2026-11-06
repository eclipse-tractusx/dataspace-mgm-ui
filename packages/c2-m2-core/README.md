<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation

 AI Disclosure: This file was entirely AI-generated.
 The AI-generated portions are made available under CC0-1.0 and not subject
 to the project's license. The human contributor has reviewed and verified
 that the content is correct.

 SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-opus-5-5)
-->

# @dataspace-mgm/c2-m2-core

Framework-free core package of the backend module **C2-M2 Users and App Access**
([spec](../../specs/c2-m2/openapi.yaml), copied from
`portal-backend-spec` `C2-M2-AppAccess` at commit `76587a6`).

## Use cases

| Use case | Operation | Permission (`scope`) | Result |
|---|---|---|---|
| `listCompanyUsers.execute(companyId, options)` | `GET /companies/{companyId}/users` (`listCompanyUsers`) | `view_company_users` (`company`) | `success` (`CompanyUserPage`), `not-found`, `forbidden`, `conflict`, `failed` |
| `getCompanyUser.execute(companyId, userId)` | `GET /companies/{companyId}/users/{userId}` (`getCompanyUser`) | `view_company_users` (`company`) | `success` (`CompanyUserDetailAnemic`), `not-found`, `forbidden`, `conflict`, `failed` |
| `setCompanyUserPortalRoles.execute(companyId, userId, roles)` | `PUT /companies/{companyId}/users/{userId}/portal-roles` (`setCompanyUserPortalRoles`) | `manage_company_users` (`company`) | `success` (`CompanyUserAnemic`), `not-found`, `forbidden`, `conflict`, `failed` |
| `removeCompanyUser.execute(companyId, userId)` | `DELETE /companies/{companyId}/users/{userId}` (`removeCompanyUser`) | `manage_company_users` (`company`) | `success` (`true`), `not-found`, `forbidden`, `conflict`, `failed` |
| `listInvitations.execute(companyId, options)` | `GET /companies/{companyId}/invitations` (`listInvitations`) | `manage_company_users` (`company`) | `success` (`readonly Invitation[]`), `not-found`, `forbidden`, `conflict`, `failed` |
| `createInvitation.execute(companyId, input)` | `POST /companies/{companyId}/invitations` (`createInvitation`) | `manage_company_users` (`company`) | `success` (`InvitationWithCode`), `not-found`, `forbidden`, `conflict`, `failed` |
| `revokeInvitation.execute(companyId, invitationId)` | `DELETE /companies/{companyId}/invitations/{invitationId}` (`revokeInvitation`) | `manage_company_users` (`company`) | `success` (`true`), `not-found`, `forbidden`, `conflict`, `failed` |
| `acceptInvitation.execute(code)` | `POST /invitations/accept` (`acceptInvitation`) | `accept_invitation` (`own`) | `success` (`AcceptInvitationResult`), `not-found`, `forbidden`, `conflict`, `failed` |
| `getCompanyAppRoles.execute(companyId, appId, lang)` | `GET /companies/{companyId}/apps/{appId}/roles` (`getCompanyAppRoles`) | `view_app_roles` (`company`) | `success` (`CompanyAppRoles`), `not-found`, `forbidden`, `conflict`, `failed` |
| `setUserAppRoles.execute(companyId, userId, appId, roles)` | `PUT /companies/{companyId}/users/{userId}/apps/{appId}/roles` (`setUserAppRoles`) | `assign_app_roles` (`company`) | `success` (`AppRolesResult`), `not-found`, `forbidden`, `conflict`, `failed` |

## Use it

```ts
import { C2_M2_BASE_PATH, createC2M2Module } from '@dataspace-mgm/c2-m2-core';

const c2m2 = createC2M2Module({ baseUrl: `${apiBaseUrl}${C2_M2_BASE_PATH}` });
const result = await c2m2.listCompanyUsers.execute(companyId, { page: 0 });
```

In-memory adapters and fixtures (`InMemoryCompanyUserRepository`, `InMemoryInvitationRepository`, `COMPANY_USERS`, `COMPANY_APP_ROLES`) are exported from `@dataspace-mgm/c2-m2-core/testing`.

## Update the spec

```bash
cp ../dataspace-mgm-services/spec/C2-M2-AppAccess/openapi.yaml specs/c2-m2/openapi.yaml
npx nx run c2-m2-core:generate-api
npx nx run c2-m2-core:check-api
```
