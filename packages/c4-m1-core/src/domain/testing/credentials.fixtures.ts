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

import type { CredentialDetailAnemic } from '../anemics/credential-detail.anemic';
import type { CredentialStatus } from '../valueObjects/credential-status.value-object';
import type { CredentialType } from '../valueObjects/credential-type.value-object';
import type { RevocationReason } from '../valueObjects/revocation-reason.value-object';
import type { Route } from '../valueObjects/route.value-object';
import type { WalletProvider } from '../valueObjects/wallet-provider.value-object';
import { C4M1_TEST_COMPANY_IDS as ids } from './c4-m1-test-ids.fixtures';

/** Name (C3-M1; null for the C4-M2 test companies without a name) and BPN of the companies of the fixtures. */
const COMPANIES: Readonly<Record<string, Readonly<{ name: string | null; bpn: string }>>> = {
  [ids.osp]: { name: 'OSP A Beispiel GmbH', bpn: 'BPNL00000000OSPA' },
  [ids.beispielMaschinenbau]: { name: 'Beispiel Maschinenbau GmbH', bpn: 'BPNLIUK2REMLK3F4' },
  [ids.beispielLogistik]: { name: 'Beispiel Logistik GmbH', bpn: 'BPNL00000000U2LG' },
  [ids.ohneZustimmung]: { name: 'Ohne Zustimmung GmbH', bpn: 'BPNL00000000U3OZ' },
  [ids.andereBeispiel]: { name: 'Andere Beispiel AG', bpn: 'BPNL00000000002B' },
  [ids.div]: { name: null, bpn: 'BPNL0000000DIV01' },
  [ids.identityHub]: { name: null, bpn: 'BPNL00000000IH01' },
  [ids.inactive]: { name: null, bpn: 'BPNL0000000INA01' },
};

/** The issuer of OSP A (own IssuerService, C4-M1 README 14 cases 12 and 13). */
const ISSUER_DID = 'did:web:issuer.osp-a.example.org';

type CspOrOwnProvider = Extract<WalletProvider, 'CSP' | 'SAP_DIV' | 'IDENTITY_HUB'>;

const HOLDER_DID: Readonly<Record<CspOrOwnProvider, (bpn: string) => string>> = {
  CSP: (bpn) => `did:web:csp-wallet.example.org:${bpn}`,
  SAP_DIV: (bpn) => `did:web:div.example.org:did:${bpn}`,
  IDENTITY_HUB: (bpn) => `did:web:ih.example.org:${bpn}`,
};

/** ISSUER_ROUTES of the installation: SAP_DIV:CREDENTIAL_ISSUER, IDENTITY_HUB:ISSUER_SERVICE, CSP:ISSUER_SERVICE. */
const ROUTE: Readonly<Record<CspOrOwnProvider, Route>> = {
  CSP: 'ISSUER_SERVICE',
  IDENTITY_HUB: 'ISSUER_SERVICE',
  SAP_DIV: 'CREDENTIAL_ISSUER',
};

interface Extra {
  walletProvider?: CspOrOwnProvider;
  attempt?: number;
  requestedAt: string;
  issuedAt?: string;
  failedAt?: string;
  revokedAt?: string;
  failureReason?: string;
  revocationReason?: RevocationReason;
  changedAt: string;
}

/** Builds a `CredentialDetail` like the `detail()` helper of mockups/wallets/shared/data.js. */
const detail = (
  n: number,
  companyId: string,
  credentialType: CredentialType,
  status: CredentialStatus,
  extra: Extra,
): CredentialDetailAnemic => {
  const company = COMPANIES[companyId];
  const provider = extra.walletProvider ?? 'CSP';
  const route = ROUTE[provider];
  const attempt = extra.attempt ?? 1;
  const nnn = String(n).padStart(3, '0');
  return {
    id: `c4c00${nnn}-0000-4000-8000-000000000${nnn}`,
    companyId,
    companyName: company.name,
    credentialType,
    status,
    route,
    issuerDid: route === 'ISSUER_SERVICE' ? ISSUER_DID : null,
    walletProvider: provider,
    bpn: company.bpn,
    holderDid: HOLDER_DID[provider](company.bpn),
    requestRef: route === 'ISSUER_SERVICE' ? `${companyId}:${credentialType}:${attempt}` : null,
    attempt,
    requestedAt: extra.requestedAt,
    issuedAt: extra.issuedAt ?? null,
    failedAt: extra.failedAt ?? null,
    revokedAt: extra.revokedAt ?? null,
    failureReason: extra.failureReason ?? null,
    revocationReason: extra.revocationReason ?? null,
    createdAt: extra.requestedAt,
    changedAt: extra.changedAt,
  };
};

/** Membership credential of a deactivated company, to be revoked at the Credential Issuer by hand. */
export const REVOCATION_PENDING_CREDENTIAL = detail(1, ids.inactive, 'MEMBERSHIP', 'REVOCATION_PENDING', {
  walletProvider: 'SAP_DIV',
  requestedAt: '2026-11-02T15:04:10Z',
  issuedAt: '2026-11-02T15:05:02Z',
  revocationReason: 'COMPANY_DEACTIVATED',
  changedAt: '2026-11-06T09:41:27Z',
});

/** Being issued, younger than 24 hours at C4M1_FIXTURES_NOW. */
export const REQUESTED_CREDENTIAL = detail(2, ids.ohneZustimmung, 'BPN', 'REQUESTED', {
  requestedAt: '2026-11-05T16:10:44Z',
  changedAt: '2026-11-05T16:10:44Z',
});

/** Open for more than 24 hours at C4M1_FIXTURES_NOW. */
export const OVERDUE_REQUESTED_CREDENTIAL = detail(4, ids.identityHub, 'MEMBERSHIP', 'REQUESTED', {
  walletProvider: 'IDENTITY_HUB',
  requestedAt: '2026-11-04T09:15:30Z',
  changedAt: '2026-11-04T09:15:30Z',
});

export const FAILED_CREDENTIAL = detail(7, ids.beispielLogistik, 'MEMBERSHIP', 'FAILED', {
  requestedAt: '2026-11-04T11:29:03Z',
  failedAt: '2026-11-04T11:29:41Z',
  changedAt: '2026-11-04T11:29:41Z',
  failureReason: 'The credential request ended in state ERROR at the IssuerService.',
});

/** The membership credential of Beispiel Maschinenbau GmbH. */
export const ISSUED_CREDENTIAL = detail(10, ids.beispielMaschinenbau, 'MEMBERSHIP', 'ISSUED', {
  requestedAt: '2026-11-03T09:59:40Z',
  issuedAt: '2026-11-03T10:00:15Z',
  changedAt: '2026-11-03T10:00:15Z',
});

/** C4-M1 `CredentialDetail` of all companies (`GET /credentials`), sorted like the API: `changedAt` descending. */
export const CREDENTIALS_OF_ALL_COMPANIES: ReadonlyArray<CredentialDetailAnemic> = [
  REVOCATION_PENDING_CREDENTIAL,
  REQUESTED_CREDENTIAL,
  detail(3, ids.ohneZustimmung, 'MEMBERSHIP', 'REQUESTED', { requestedAt: '2026-11-05T16:10:44Z', changedAt: '2026-11-05T16:10:44Z' }),
  detail(5, ids.andereBeispiel, 'MEMBERSHIP', 'ISSUED', {
    requestedAt: '2026-11-05T13:45:12Z',
    issuedAt: '2026-11-05T13:46:01Z',
    changedAt: '2026-11-05T13:46:01Z',
  }),
  detail(6, ids.andereBeispiel, 'BPN', 'ISSUED', {
    requestedAt: '2026-11-05T13:45:12Z',
    issuedAt: '2026-11-05T13:45:58Z',
    changedAt: '2026-11-05T13:45:58Z',
  }),
  FAILED_CREDENTIAL,
  detail(8, ids.beispielLogistik, 'BPN', 'ISSUED', {
    requestedAt: '2026-11-04T11:29:03Z',
    issuedAt: '2026-11-04T11:29:36Z',
    changedAt: '2026-11-04T11:29:36Z',
  }),
  detail(9, ids.identityHub, 'BPN', 'ISSUED', {
    walletProvider: 'IDENTITY_HUB',
    requestedAt: '2026-11-04T09:15:30Z',
    issuedAt: '2026-11-04T09:16:12Z',
    changedAt: '2026-11-04T09:16:12Z',
  }),
  OVERDUE_REQUESTED_CREDENTIAL,
  ISSUED_CREDENTIAL,
  detail(11, ids.beispielMaschinenbau, 'BPN', 'ISSUED', {
    requestedAt: '2026-11-03T09:59:40Z',
    issuedAt: '2026-11-03T10:00:12Z',
    changedAt: '2026-11-03T10:00:12Z',
  }),
  detail(12, ids.inactive, 'BPN', 'ISSUED', {
    walletProvider: 'SAP_DIV',
    requestedAt: '2026-11-02T15:04:10Z',
    issuedAt: '2026-11-02T15:04:58Z',
    changedAt: '2026-11-02T15:04:58Z',
  }),
  detail(13, ids.div, 'MEMBERSHIP', 'ISSUED', {
    walletProvider: 'SAP_DIV',
    requestedAt: '2026-11-02T10:31:00Z',
    issuedAt: '2026-11-02T10:31:49Z',
    changedAt: '2026-11-02T10:31:49Z',
  }),
  detail(14, ids.div, 'BPN', 'ISSUED', {
    walletProvider: 'SAP_DIV',
    requestedAt: '2026-11-02T10:31:00Z',
    issuedAt: '2026-11-02T10:31:44Z',
    changedAt: '2026-11-02T10:31:44Z',
  }),
  detail(15, ids.osp, 'MEMBERSHIP', 'ISSUED', {
    requestedAt: '2026-11-01T07:02:00Z',
    issuedAt: '2026-11-01T07:02:31Z',
    changedAt: '2026-11-01T07:02:31Z',
  }),
  detail(16, ids.osp, 'BPN', 'ISSUED', {
    requestedAt: '2026-11-01T07:02:00Z',
    issuedAt: '2026-11-01T07:02:27Z',
    changedAt: '2026-11-01T07:02:27Z',
  }),
];
