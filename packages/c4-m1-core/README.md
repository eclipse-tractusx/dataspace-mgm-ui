<!--
 Copyright (c) 2026 Catena-X Automotive Network e.V.
 Copyright (c) 2026 Contributors to the Eclipse Foundation

 AI Disclosure: This file was entirely AI-generated.
 The AI-generated portions are made available under CC0-1.0 and not subject
 to the project's license. The human contributor has reviewed and verified
 that the content is correct.

 SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-opus-5-5)
-->

# @dataspace-mgm/c4-m1-core

Framework-free core package of the backend module **C4-M1 Credentials** (version 0.2 of the
[portal-backend-spec](https://github.com/tx-arena-events/portal-backend-spec/tree/main/C4-M1-Credentials)): the status
of the BPN credential and the membership credential of a company, the credentials of all companies for OSP staff, and
the confirmation of a revocation done by hand at the Credential Issuer.

**Proof of concept (phase 2 of 3).** The package has the domain, the use cases and in-memory adapters with the
fixtures of the mockup `mockups/wallets/` (feature "Wallets as a service"). There is no vendored spec, no generated
types, no HTTP adapter and no `createC4M1Module` yet; they come with the skill `build-feature`, behind the same ports.

## Use cases

| Use case | Operation | Result |
|---|---|---|
| `listCompanyCredentials.execute(companyId)` | `GET /companies/{companyId}/credentials` (`listCompanyCredentials`, permission `view_credentials`, scope `company`) | `found` with the `CredentialStatusView[]`, `no-company` (session without `companyId`, no call), `forbidden` (403), `not-found` (404, not the own company), `failed` |
| `listCredentials.execute(query)` | `GET /credentials` (`listCredentials`, `manage_credentials`, scope `osp`) with `status[]`, `credentialType`, `companyId`, `route`, `requestedBefore`, `page`, `size` | `found` with the `CredentialPage`, `invalid` (400), `forbidden`, `failed` |
| `countCredentialsByStatus.execute(statuses)` | `GET /credentials?status=<s>&size=1` once per status, reads `total` | `found` with `counts` in the order asked, `forbidden`, `failed` |
| `getCredential.execute(credentialId)` | none in 0.2 (see open point 1); in-memory only | `found`, `forbidden`, `not-found`, `failed` |
| `confirmRevocation.execute(credentialId, note)` | `POST /credentials/{credentialId}/confirm-revocation` (`confirmRevocation`, `manage_credentials`, scope `osp`) with `{ note }` | `confirmed` with the credential, `invalid` with an i18n `key` (pre-check: no call; or 400: with `error`), `conflict` (409 `invalid-state`), `forbidden`, `not-found`, `failed` |
| `listOpenItems.execute()` | three `GET /credentials`: `status=FAILED`, `status=REVOCATION_PENDING`, `status=REQUESTED&requestedBefore=now−24 h` | `found` with the joined `items` (sorted by `changedAt` descending), `total`, `requestedBefore`, `openOrderHours`; `forbidden`, `failed` |

`failed` carries `CoreHttpErrorData` (HTTP status and Problem Details `type`, `urn:c4-m1:problem:<name>`, README 12);
the UI maps the `type` to an i18n key. Expected outcomes are results, never exceptions.

The validation keys of the note (feature namespace `wallets`, texts in every locale of the feature):
`validation.revocationNoteRequired`, `validation.revocationNoteTooLong`, `validation.revocationNoteRejected`.
`RevocationNoteFactory.create(input)` is the UX pre-check (trimmed, 1 to 500 characters); the API checks again.

## Use it

```ts
import { createInMemoryC4M1Module, C4M1_FIXTURES_NOW } from '@dataspace-mgm/c4-m1-core/testing';

// mock mode (apps/portal/src/core/mock-container.ts) and tests; the real container gets the module in phase 3
const c4m1 = createInMemoryC4M1Module({ clock: () => new Date(C4M1_FIXTURES_NOW) });
const result = await c4m1.listCompanyCredentials.execute(session.companyId);
```

`createInMemoryC4M1Module(options)` takes `companyCredentials` (per company ID), `credentials`,
`companyCredentialFailure`, `credentialFailure` (e.g. `c4m1Problem(403, 'forbidden')`), `clock` and `openOrderHours`;
the defaults are the mockup's data. Mock mode (`apps/portal/src/core/mock-container.ts`) gives Beispiel Maschinenbau
GmbH `COMPANY_CREDENTIALS.twoDataspaces`, so the passes show the logo slots of two dataspaces. Tests use the adapters directly (`InMemoryCompanyCredentialRepository`,
`InMemoryCredentialRepository`, both record their `calls`) and the fixtures: `COMPANY_CREDENTIALS.issued`, `requested`,
`failed`, `revoked`, `none`, `twoDataspaces` (Beispiel Maschinenbau GmbH), `CREDENTIALS_OF_ALL_COMPANIES` (the 16
credentials, sorted by `changedAt` descending) and the named examples `REVOCATION_PENDING_CREDENTIAL`,
`FAILED_CREDENTIAL`, `REQUESTED_CREDENTIAL`, `OVERDUE_REQUESTED_CREDENTIAL`, `ISSUED_CREDENTIAL`.

The in-memory credential repository answers like the API: it filters and pages `listCredentials` (400 for a page or
size out of range), and `confirmRevocation` turns `REVOCATION_PENDING` into `REVOKED` (`revokedAt` = `changedAt` =
now), answers a `REVOKED` credential unchanged (README 7.3: 200 without a change), any other status with 409
`invalid-state` and a note outside 1 to 500 characters with 400.

## Mockup → code

| Mockup (`mockups/wallets/`) | Becomes |
|---|---|
| `views/wallet.html`, the credential passes on the right (stack) | `listCompanyCredentials`; a pass per `CredentialStatusAnemic`, the logo slot from its `dataspace` (`logoUrl`, else `mark`) |
| `views/credentials.html` (layout passes) | `listCompanyCredentials`; states issued, being-issued, failed, revoked, not-requested = `COMPANY_CREDENTIALS.*`; forbidden = 403. Page `features/wallets/pages/YourCredentials.tsx` at `/wallets/credentials`, one `CredentialPass` per credential |
| `views/credential-monitor.html` (layout attention, filters chips) | `listOpenItems` (the "Needs attention" queue), `listCredentials` (the list and its filters), `countCredentialsByStatus` (the counts on the chips). Page `AllCredentials.tsx` at `/wallets/all-credentials` |
| `views/credential-detail.html` (sections, confirm dialog, timeline) | `getCredential`, `confirmRevocation`; the timeline from `requestedAt`, `failedAt`, `issuedAt`, `revokedAt`, `changedAt`. Page `Credential.tsx` at `/wallets/all-credentials/:credentialId` (`?confirm=1` opens the dialog) |
| `shared/data.js` `companyCredentials` | `COMPANY_CREDENTIALS` (without the mockup-only `key`) |
| `shared/data.js` `credentials` (`detail()`) | `CREDENTIALS_OF_ALL_COMPANIES` with `companyName` from the mockup's `companies` (null for the C4-M2 test companies) |
| `shared/data.js` `CATENA_X`, `SEMICONDUCTOR` | `CATENA_X_DATASPACE`, `SEMICONDUCTOR_DATASPACE` (`logoUrl` null: the slot shows the mark) |
| `installation.resendAfterHours` | `DEFAULT_OPEN_ORDER_HOURS` (24), see open point 6 |
| "now" of the mockup (2026-11-06T12:00:00Z) | `C4M1_FIXTURES_NOW`, injected as the clock |
| Enum labels (`wx.labels.*`) | `CREDENTIAL_TYPES`, `CREDENTIAL_STATUSES`, `CREDENTIAL_VIEW_STATUSES`, `ROUTES`, `WALLET_PROVIDERS`, `REVOCATION_REASONS`: API values, used as i18n keys |
| "Confirm revocation" shown on `REVOCATION_PENDING` | the UI reads `status` of the anemic; the API decides (409); see open point 9 |

## Open points for the backend

| # | Priority | Operation | What the UI needs | In the spec? | Notes |
|---|---|---|---|---|---|
| 1 | P0 (blocks the feature) | `GET /credentials/{credentialId}` | one credential by id, for the detail page and a direct link (notification) | no | `getCredential` is in-memory only; the HTTP adapter could only search `GET /credentials` page by page |
| 2 | P1 (needed for the full feature) | `GET /credentials/{credentialId}` | the history (`credential_history`: every status change with `attempt` and `note`) | no (table only, README 5) | the timeline shows only the times of the last attempt |
| 3 | P1 | `GET /credentials` | counts per status (e.g. `GET /credentials/summary`) | no | `countCredentialsByStatus` makes one call per status (`size=1`, `total`) |
| 4 | P1 | `GET /credentials` | a `bpn` filter | no (`companyId` only) | the search by BPN or name needs C3-M1 first |
| 5 | P1 | `GET /credentials` | `companyName` per `CredentialDetail` | no | fixtures carry `companyName`; without it every row needs C3-M1 `listCompanies` |
| 6 | P1 | `GET /credentials` or `GET /config` | the age of an open order (`RESEND_AFTER_HOURS`), or an `overdue` flag per credential | no (installation setting) | `DEFAULT_OPEN_ORDER_HOURS` = 24 is a stand-in; the UI must not own it |
| 7 | P1 | `GET /companies/{companyId}/credentials` | `dataspace` per credential (`id`, `name`, `mark`, logo address) | no | the logo slot of a pass; today only `dataspace.memberOf` of the installation, one dataspace |
| 8 | P2 (nice to have) | `GET /companies/{companyId}/credentials` | `revocationReason` per credential, and the last round (`run.status`) as in the internal query 9.1 | no | a revoked pass cannot say why; an overall status would otherwise be a UI decision |
| 9 | P2 | `GET /credentials`, `POST …/confirm-revocation` | `allowedActions` (e.g. `CONFIRM_REVOCATION`) per `CredentialDetail` | no | the button shows on `status` `REVOCATION_PENDING` today; the API enforces it with 409 |
| 10 | P2 | events | an SSE event for the UI when a status changes (`CredentialsIssued`, `CredentialIssuanceFailed`, `CredentialRevoked` are outbox events for modules) | no | live updates without polling (AGENTS rule 7) |
| 11 | P2 | `GET /companies/{companyId}/credentials` | the `bpn` the BPN credential proves, per `CredentialStatusView` | no | the BPN pass shows the `bpn` of the session (`GET /me`) today |
| 12 | P2 | `GET /credentials` | a filter for open orders (e.g. `overdue=true`), or `requestedBefore` that combines with several statuses | no | "Open for more than 24 h" sends `status=REQUESTED` with the `requestedBefore` of `listOpenItems`, so the UI clears the status chips while it is on |

The UI shows the "Confirm revocation" button while `status` is `REVOCATION_PENDING` and greys out a pass whose
`status` is `FAILED`, `REVOKED` or `NONE`; it decides nothing else (open point 9 replaces the first with
`allowedActions`).

Fields of the fixtures and whether the spec has them: `CredentialStatusView` `credentialType`, `status`,
`requestedAt`, `issuedAt`, `revokedAt` (yes), `dataspace` (no, 7); `CredentialDetail` all fields (yes; `bpn`,
`holderDid`, `walletProvider` are optional in the schema and null when absent), `companyName` (no, 5).

## Differences from the spec, in this package

- `confirmRevocation` on a `REVOKED` credential: the in-memory adapter answers 200 without a change, as README 7.3
  says (not 409).
- The note is trimmed before it is sent, so a note of blanks is caught by the pre-check (the API accepts any 1 to 500
  characters).

## Layout

`domain/` (anemics, value objects, factory, ports, result unions, in-memory adapters and fixtures in `testing/`) ←
`application/` (use cases). `index.ts` exports the types and use cases, `testing.ts` the adapters, fixtures and
`createInMemoryC4M1Module`. `infrastructure/` (generated client, mappers, HTTP adapters) comes in phase 3.
