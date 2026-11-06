<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation

 AI Disclosure: This file was entirely AI-generated.
 The AI-generated portions are made available under CC0-1.0 and not subject
 to the project's license. The human contributor has reviewed and verified
 that the content is correct.

 SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-opus-5-5)
-->

# @dataspace-mgm/c4-m2-core

Framework-free core package of the backend module **C4-M2 Dataspace Wallet Interface** (version 0.2.0 of the spec in
[portal-backend-spec](https://github.com/tx-arena-events/portal-backend-spec/tree/main/C4-M2-DataspaceWalletInterface)).
It is a **proof of concept** (phase 2 of `build-poc`): the use cases run on the in-memory adapters of
`@dataspace-mgm/c4-m2-core/testing`, with the data of the wallets mockup (`mockups/wallets/shared/data.js`). The
vendored spec, the generated types, the HTTP adapter and `createC4M2Module(config)` come in phase 3 (`build-feature`).

Base path: `C4M2_BASE_PATH = '/c4-m2'` (`servers.url` `/api/c4-m2` without `/api`).

## Mockup → code

| Mockup (`mockups/wallets/`) | Becomes |
|---|---|
| view 1 `wallet.html` (layout=stack · skin=carbon · values=full · nav=tabs) | `getOwnWallet`; page "Dataspace wallet" of the feature `wallets` (`/wallets`) |
| view 3 `wallet-accounts.html` (layout=detail · reveal=inline · confirm=ask) | `listWalletAccounts` and `retrieveWalletAccountCredentials`; page "Wallet accounts" (`/wallets/wallet-accounts`) |
| states of view 1: `active`, `validating`, `failed` | `found` with `wallet.status` `ACTIVE`, `VALIDATING`, `FAILED` (`failureReason` `DID_NOT_RESOLVABLE`) |
| states of view 1: `no-wallet`, `forbidden` | `no-wallet` (404), `forbidden` (403, Max) |
| states of view 3: `loaded`, `empty`, `forbidden` | `found` with items, `found` with no items, `forbidden` |
| state of view 3: `retrieved-meanwhile` | `already-retrieved` (410 `urn:c4-m2:problem:already-retrieved`) |
| `data.wallet`, `data.walletVariants` | `WalletAnemic`; `BEISPIEL_MASCHINENBAU_WALLET`, `…_VALIDATING`, `…_FAILED` |
| `data.technicalUsers` (C2-M3 `TechnicalUserSummary`) | `TechnicalUserRefAnemic`; `EDC_CONNECTOR_PRODUCTION` (sa201), `EDC_CONNECTOR_TEST` (sa202), `SUPPLIER_DATA_INTEGRATION` (sa203, walletAccess `NONE`) |
| `data.walletAccounts` | `WalletAccountAnemic`; `WALLET_ACCOUNT_AVAILABLE` (until 2026-12-05), `WALLET_ACCOUNT_RETRIEVED` |
| `data.walletAccountCredentials` | `WalletAccountCredentialsAnemic`; `WALLET_ACCOUNT_CREDENTIALS` (the secret is a stand-in value built from parts) |
| the "Retrieve" button (`credentialsState` `AVAILABLE`, permission `retrieve_wallet_credentials`) | a field of the anemic and a permission of the session; see open point 9 |

## Use cases

| Use case | Operation | Result |
|---|---|---|
| `getOwnWallet.execute(companyId)` | `GET /companies/{companyId}/wallet` (`getWallet`, permission `view_dataspace_wallet`, scope `company`) | `found` with the wallet (any `status`), `no-company`, `no-wallet` (404), `forbidden` (403), `failed` |
| `listWalletAccounts.execute(companyId)` | C2-M3 `listTechnicalUsers` (stand-in port `TechnicalUserDirectory`), then per technical user with `walletAccess` other than `NONE` `GET /technical-users/{technicalUserId}/wallet-account` (`getWalletAccount`, `view_dataspace_wallet`) | `found` with `items: [{ technicalUser, account }]` (`account` null on 404), `no-company`, `forbidden` (403 of either), `failed` |
| `retrieveWalletAccountCredentials.execute(technicalUserId)` | `POST /technical-users/{technicalUserId}/wallet-account/credentials` (`retrieveWalletAccountCredentials`, `retrieve_wallet_credentials`) | `retrieved` with the credentials, `already-retrieved` (410), `expired` (410 `credentials-expired`), `no-credentials` (409), `invalid-state` (409), `forbidden` (403), `not-found` (404), `failed` |

Expected outcomes are results, not exceptions. A 403 is the `forbidden` result: the session's permissions only hide
UI, the API decides. The credentials are returned as data, are never logged and are not cached by the package; the
page keeps them in memory only (the response has `Cache-Control: no-store`).

## Use it (mock mode and tests)

```ts
import { createInMemoryC4M2Module, BEISPIEL_MASCHINENBAU_COMPANY_ID } from '@dataspace-mgm/c4-m2-core/testing';

const c4m2 = createInMemoryC4M2Module(); // the data of Beispiel Maschinenbau GmbH
const wallet = await c4m2.getOwnWallet.execute(session.companyId);
```

`createInMemoryC4M2Module(options)` takes other `wallets`, `technicalUsersByCompany`, `walletAccounts`, `credentials`
and a failure per adapter (`walletFailure`, `technicalUserFailure`, `walletAccountFailure`, e.g. a
`CoreHttpException` with status 403). One instance keeps its state: the in-memory retrieval hands the credentials out
once, the account becomes `RETRIEVED`, and a second call answers 410 `already-retrieved` (C4-M2 README 7.3). The
adapters (`InMemoryWalletRepository`, `InMemoryWalletAccountRepository`, `InMemoryTechnicalUserDirectory`) record
their calls. Only the app's mock container and tests import `/testing`.

The aliases `@dataspace-mgm/c4-m2-core/testing` and `@dataspace-mgm/c4-m2-core` are in `tsconfig.base.json` and
`workspace.aliases.ts`; inside the package, files import each other by relative paths. The portal wires the module
only in `apps/portal/src/core/mock-container.ts` (`c4m2` is an optional member of `CoreModules` while it is a POC).

## Open points for the backend

| # | Priority | Operation | What the UI needs | In the spec? | Notes |
|---|---|---|---|---|---|
| 1 | P0 (blocks the feature) | `GET /companies/{companyId}/wallet-accounts` (new) | the wallet accounts of a company in one call | no | today the page needs the C2-M3 list and one `getWalletAccount` per technical user (N+1) |
| 2 | P0 | C2-M3 `GET /companies/{companyId}/technical-users` | `id`, `name`, `description`, `iamClientId`, `walletAccess` (`TechnicalUserRefAnemic`) | yes, in C2-M3 | not a C4-M2 object; `TechnicalUserDirectory` is a stand-in port until C4-M2 lists the accounts (1) or the feature uses c2-m3-core |
| 3 | P1 (needed for the full feature) | `GET /companies/{companyId}/wallet` | `bpn` of the wallet | no (`WalletInfo` has it, `Wallet` not) | the header of the wallet page needs a second call to C3-M1 for the BPN and the company name |
| 4 | P1 | `GET /wallets` (new, scope `osp`) | status, provider and failure reason per company for OSP staff | no | no OSP view of wallets today; only `/internal` queries for modules |
| 5 | P1 | `retrieveWalletAccountCredentials` | whether a download of the secret as a file is allowed, or only copy | – | security decision; the package returns the credentials as data only, how the page offers them follows the mockup decision |
| 6 | P1 | `retrieveWalletAccountCredentials` | who may retrieve: every person with `retrieve_wallet_credentials` of the company, or only the creator of the technical user | spec allows every person of the company | FRAMEWORK 5.7 says "typically the IT Admin who created it" |
| 7 | P1 | SSE | the event the UI subscribes to when a wallet goes from `VALIDATING` to `ACTIVE` (and an account from `REQUESTED` to `ACTIVE`) | no | `DataspaceWalletCreated` is an outbox event for modules; the UI must not poll |
| 8 | P2 (nice to have) | `GET /companies/{companyId}/wallet` | a QR code of the `did` | – | the POC draws it in the UI with `qrcode.react` 4.2.0 (ISC, approved by Eclipse Dash through ClearlyDefined) behind `QrCode` in `libs/shared/ui-mui`; nothing needed from the backend |
| 9 | P2 | `getWalletAccount` | an `allowedActions` flag (e.g. `retrieveCredentials`) | no | today the UI shows "Retrieve" on `credentialsState` `AVAILABLE` and the session permission; a flag would keep the state rule in the backend |
| 10 | P1 | `GET /companies/{companyId}/wallet` | the dataspace of the wallet (name, logo or mark) for the issuer line of the wallet pass | no | the POC takes C3-M1 `Company.dataspaceName`; the credential passes take the dataspace of each C4-M1 credential (an open point of c4-m1-core) |
| 11 | P2 | `GET /companies/{companyId}/wallet` | the number of technical users with a wallet account, for the card "Wallet accounts" on the wallet page | no | the POC counts the items of `listWalletAccounts` (C2-M3 plus N × `getWalletAccount`, see 1) |

## Layout

`domain/` (anemics, value object `WalletProvider`, ports, result unions, Problem Details types, in-memory adapters and
fixtures in `domain/testing/`) ← `application/` (use cases). `index.ts` exports the public types, the use cases and
`C4M2_BASE_PATH`; `testing.ts` the adapters, fixtures and `createInMemoryC4M2Module`. No `infrastructure/` yet.
