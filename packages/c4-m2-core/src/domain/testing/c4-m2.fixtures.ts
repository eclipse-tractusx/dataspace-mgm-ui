/********************************************************************************
 * Copyright (c) 2026 Catena-X Automotive Network e.V.
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * AI Disclosure: This file was entirely AI-generated.
 * The AI-generated portions are made available under CC0-1.0 and not subject
 * to the project's license. The human contributor has reviewed and verified
 * that the code is correct.
 *
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: Claude Code (claude-opus-5-5)
 ********************************************************************************/

import type { TechnicalUserRefAnemic } from '../anemics/technical-user-ref.anemic';
import type { WalletAccountAnemic } from '../anemics/wallet-account.anemic';
import type { WalletAccountCredentialsAnemic } from '../anemics/wallet-account-credentials.anemic';
import type { WalletAnemic } from '../anemics/wallet.anemic';

// The test data of the wallets mockup (mockups/wallets/shared/data.js): Beispiel Maschinenbau GmbH of FRAMEWORK 7a
// with the dataspace wallet of the CSP (C4-M2 README 14.1). Field names and enum values as on the wire.

/** Beispiel Maschinenbau GmbH (FRAMEWORK 7a), BPN BPNLIUK2REMLK3F4. */
export const BEISPIEL_MASCHINENBAU_COMPANY_ID = 'c0000001-0000-4000-8000-000000000001';

const BPN = 'BPNLIUK2REMLK3F4';

/** `Wallet` of Beispiel Maschinenbau GmbH: the dataspace wallet of the CSP, ACTIVE. */
export const BEISPIEL_MASCHINENBAU_WALLET: WalletAnemic = {
  companyId: BEISPIEL_MASCHINENBAU_COMPANY_ID,
  provider: 'CSP',
  status: 'ACTIVE',
  did: `did:web:csp-wallet.example.org:${BPN}`,
  didDocumentLocation: `https://csp-wallet.example.org/${BPN}/did.json`,
  credentialServiceUrl: `https://csp-wallet.example.org/api/credentials/v1/participants/${BPN}`,
  bdrsUrl: 'https://bdrs.example.org/api/directory',
  stsTokenUrl: null,
  supportsWalletAccounts: true,
  failureReason: null,
  createdAt: '2026-11-03T09:58:20Z',
  activatedAt: '2026-11-03T09:58:31Z',
};

/** The same wallet while the DID document is checked. */
export const BEISPIEL_MASCHINENBAU_WALLET_VALIDATING: WalletAnemic = {
  ...BEISPIEL_MASCHINENBAU_WALLET,
  status: 'VALIDATING',
  activatedAt: null,
};

/** The same wallet after a failed check: the DID document could not be resolved. */
export const BEISPIEL_MASCHINENBAU_WALLET_FAILED: WalletAnemic = {
  ...BEISPIEL_MASCHINENBAU_WALLET,
  status: 'FAILED',
  failureReason: 'DID_NOT_RESOLVABLE',
  activatedAt: null,
};

/** C2-M3 technical user sa201 with wallet access. */
export const EDC_CONNECTOR_PRODUCTION: TechnicalUserRefAnemic = {
  id: '7c3a0001-0000-4000-8000-000000000001',
  name: 'EDC connector production',
  description: 'Connector of the plant in Stuttgart',
  iamClientId: 'sa201',
  walletAccess: 'ACTIVE',
};

/** C2-M3 technical user sa202 with wallet access. */
export const EDC_CONNECTOR_TEST: TechnicalUserRefAnemic = {
  id: '7c3a0002-0000-4000-8000-000000000002',
  name: 'EDC connector test',
  description: 'Test connector of the IT department',
  iamClientId: 'sa202',
  walletAccess: 'ACTIVE',
};

/** C2-M3 technical user sa203 without wallet access: not listed on the wallet accounts page. */
export const SUPPLIER_DATA_INTEGRATION: TechnicalUserRefAnemic = {
  id: '7c3a0003-0000-4000-8000-000000000003',
  name: 'Supplier data integration',
  description: null,
  iamClientId: 'sa203',
  walletAccess: 'NONE',
};

export const BEISPIEL_MASCHINENBAU_TECHNICAL_USERS: ReadonlyArray<TechnicalUserRefAnemic> = [
  EDC_CONNECTOR_PRODUCTION,
  EDC_CONNECTOR_TEST,
  SUPPLIER_DATA_INTEGRATION,
];

/** Wallet account of sa201: the credentials can be retrieved once, until 2026-12-05. */
export const WALLET_ACCOUNT_AVAILABLE: WalletAccountAnemic = {
  walletAccountRef: 'b7a10001-0000-4000-8000-000000000001',
  technicalUserId: EDC_CONNECTOR_PRODUCTION.id,
  companyId: BEISPIEL_MASCHINENBAU_COMPANY_ID,
  provider: 'CSP',
  status: 'ACTIVE',
  failureReason: null,
  credentialsState: 'AVAILABLE',
  credentialsExpireAt: '2026-12-05T08:12:30Z',
  createdAt: '2026-11-05T08:12:30Z',
  changedAt: '2026-11-05T08:12:30Z',
};

/** Wallet account of sa202: the credentials were retrieved already. */
export const WALLET_ACCOUNT_RETRIEVED: WalletAccountAnemic = {
  walletAccountRef: 'b7a10002-0000-4000-8000-000000000002',
  technicalUserId: EDC_CONNECTOR_TEST.id,
  companyId: BEISPIEL_MASCHINENBAU_COMPANY_ID,
  provider: 'CSP',
  status: 'ACTIVE',
  failureReason: null,
  credentialsState: 'RETRIEVED',
  credentialsExpireAt: null,
  createdAt: '2026-11-04T14:21:09Z',
  changedAt: '2026-11-04T14:35:47Z',
};

export const BEISPIEL_MASCHINENBAU_WALLET_ACCOUNTS: ReadonlyArray<WalletAccountAnemic> = [
  WALLET_ACCOUNT_AVAILABLE,
  WALLET_ACCOUNT_RETRIEVED,
];

// Not a secret: a visible stand-in value of the mockup, built from parts so it reads as a value of realistic length.
const MOCK_CLIENT_SECRET = ['mockup', 'value', 'not', 'a', 'real', 'secret'].join('-');

/** `WalletAccountCredentials` of the one retrieval of the account of sa201 (stand-in values of the CSP wallet). */
export const WALLET_ACCOUNT_CREDENTIALS: WalletAccountCredentialsAnemic = {
  walletAccountRef: WALLET_ACCOUNT_AVAILABLE.walletAccountRef,
  tokenUrl: 'https://csp-wallet.example.org/api/sts/token',
  clientId: 'tu-7c3a0001-0000-4000-8000-000000000001',
  clientSecret: MOCK_CLIENT_SECRET,
  did: BEISPIEL_MASCHINENBAU_WALLET.did,
  credentialServiceUrl: BEISPIEL_MASCHINENBAU_WALLET.credentialServiceUrl,
};
