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
| `acceptInvitationWithMandate.execute(returnTo?)` | wallet step of the BFF (`/ebw/attestation/start?purpose=representation`, `POST /ebw/attestation`), then `POST /invitations/accept` with `attestation` | `accept_invitation` (`own`) | `joined` (`AcceptInvitationResult`), `cancelled`, `refused` (`reason`: the Problem name of the backend), `wallet-failed`, `failed` |
| `getCompanyAppRoles.execute(companyId, appId, lang)` | `GET /companies/{companyId}/apps/{appId}/roles` (`getCompanyAppRoles`) | `view_app_roles` (`company`) | `success` (`CompanyAppRoles`), `not-found`, `forbidden`, `conflict`, `failed` |
| `setUserAppRoles.execute(companyId, userId, appId, roles)` | `PUT /companies/{companyId}/users/{userId}/apps/{appId}/roles` (`setUserAppRoles`) | `assign_app_roles` (`company`) | `success` (`AppRolesResult`), `not-found`, `forbidden`, `conflict`, `failed` |

## Use it

```ts
import { C2_M2_BASE_PATH, createC2M2Module } from '@dataspace-mgm/c2-m2-core';

const c2m2 = createC2M2Module({ baseUrl: `${apiBaseUrl}${C2_M2_BASE_PATH}` });
const result = await c2m2.listCompanyUsers.execute(companyId, { page: 0 });
```

In-memory adapters and fixtures (`InMemoryCompanyUserRepository`, `InMemoryInvitationRepository`, `COMPANY_USERS`, `COMPANY_APP_ROLES`) are exported from `@dataspace-mgm/c2-m2-core/testing`.

## Joining with a mandate

`acceptInvitationWithMandate` lets a person join the company that invited them by showing a mandate of that company in
their wallet, in place of the invitation code. It has two steps behind one call:

1. The port `MandateAttestationRepository` yields a verification attestation. Its adapter
   (`mandate-attestation-bff.repository.ts`) asks the BFF: `POST /ebw/attestation` collects the outcome of a wallet
   step; when there is none, the browser leaves the portal for `GET /ebw/attestation/start?purpose=representation`
   and comes back to `returnTo` with `wallet=returned`. The call never settles then; the page calls again after the
   return.
2. `InvitationRepository.acceptWithMandate(attestation)` posts it to `POST /invitations/accept`.

A refusal of the backend ends as `refused` with its `reason`, the name of the Problem Details. For
`representation-not-confirmed` the adapter also keeps the field `reasons` of the answer (`MandateNotConfirmedException`),
and the result carries the ones the page has words for as `causes`: `EXPIRED`, `PERSON_MISMATCH`, `COMPANY_MISMATCH`,
`TYPE_NOT_ACCEPTED`, `ISSUER_NOT_TRUSTED` (C5-M1 6.5). `causes` is empty for every other refusal.

`createC2M2Module(config, wallet)` takes the place of the BFF as its second argument (`MandateStepOptions`; default:
the origin of the portal). The use case is missing where no wallet step is connected (mock mode); the page then
offers the code only. The adapter has the same shape as the wallet step of `c1-m2-core`; core packages do not import
each other.

## Update the spec

```bash
cp ../dataspace-mgm-services/spec/C2-M2-AppAccess/openapi.yaml specs/c2-m2/openapi.yaml
npx nx run c2-m2-core:generate-api
npx nx run c2-m2-core:check-api
```
