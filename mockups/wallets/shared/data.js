/********************************************************************************
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

// The data every screen of this mockup shows. Never invent people, companies or IDs:
// - persons, companies and IDs: FRAMEWORK 7a of portal-backend-spec ("Common test IDs"), the companies of the
//   participant management mockup (C3-M1 14), and the test data of C4-M1 (README 14) and C4-M2 (README 14.1);
// - the objects: the field names and enum values of the openapi.yaml schemas of C4-M1 (`CredentialStatusView`,
//   `CredentialDetail`, `CredentialPage`) and C4-M2 (`Wallet`, `WalletAccount`, `WalletAccountCredentials`), camelCase
//   as on the wire;
// - technical users are C2-M3 objects (`TechnicalUserSummary`); their IDs are test IDs of this mockup only, because
//   C2-M3 14 defines none.
// The installation is OSP A in the target picture of C4-M1 (README 14, cases 12 and 13): own issuer, ISSUER_ROUTES
// SAP_DIV:CREDENTIAL_ISSUER, IDENTITY_HUB:ISSUER_SERVICE, CSP:ISSUER_SERVICE. The time is the hackathon week: today is
// 2026-11-06. The proof of concept turns these objects into the fixtures of the in-memory adapters of c4-m1-core and
// c4-m2-core.
(function () {
  'use strict';

  const ids = {
    osp: '11111111-1111-4111-8111-111111111111',
    u1: 'c0000001-0000-4000-8000-000000000001',
    u2: 'c0000002-0000-4000-8000-000000000002',
    u3: 'c0000003-0000-4000-8000-000000000003',
    u4: 'c0000004-0000-4000-8000-000000000004',
    div: '1a2b3c4d-0001-4000-8000-000000000001',
    ih: '1a2b3c4d-0002-4000-8000-000000000002',
    inactive: '1a2b3c4d-0006-4000-8000-000000000006',
  };

  const persons = {
    erika: { id: '5a1c0001-0000-4000-8000-000000000001', name: 'Erika Mustermann', portalRoles: ['Company Admin'], companyId: ids.u1, note: 'Company Admin of Beispiel Maschinenbau GmbH (C4-M1 P1, C4-M2 P1)' },
    max: { id: '5a1c0002-0000-4000-8000-000000000002', name: 'Max Mustermann', portalRoles: ['Member'], companyId: ids.u1, note: 'Member of Beispiel Maschinenbau GmbH, no permission of C4-M1 or C4-M2 (P4)' },
    otto: { id: '5a1c0012-0000-4000-8000-000000000012', name: 'Otto Normalverbraucher', portalRoles: ['OSP Admin'], note: 'OSP Admin (C4-M1 P2)' },
    rolf: { id: 'bbede0f3-fbc4-433b-b7ca-1982e8724912', name: 'Rolf Prüfer', portalRoles: ['OSP Reviewer'], note: 'OSP Reviewer, without manage_credentials' },
  };

  /** Permissions of C4-M1 (README 6.5) and C4-M2 (README 6.8) per person, as GET /me would list them. */
  const permissions = {
    erika: ['view_credentials', 'view_dataspace_wallet', 'retrieve_wallet_credentials'],
    max: [],
    otto: ['manage_credentials'],
    rolf: [],
  };

  /** The companies by `companyId`: name from C3-M1 (participant management mockup), BPN, status at C3-M1. */
  const companies = {
    [ids.osp]: { id: ids.osp, name: 'OSP A Beispiel GmbH', bpn: 'BPNL00000000OSPA', status: 'ACTIVE' },
    [ids.u1]: { id: ids.u1, name: 'Beispiel Maschinenbau GmbH', bpn: 'BPNLIUK2REMLK3F4', status: 'ACTIVE' },
    [ids.u2]: { id: ids.u2, name: 'Beispiel Logistik GmbH', bpn: 'BPNL00000000U2LG', status: 'ACTIVE' },
    [ids.u3]: { id: ids.u3, name: 'Ohne Zustimmung GmbH', bpn: 'BPNL00000000U3OZ', status: 'REQUESTED' },
    [ids.u4]: { id: ids.u4, name: 'Andere Beispiel AG', bpn: 'BPNL00000000002B', status: 'ACTIVE' },
    // C4-M2 14.1: test companies without a name in the spec; the screens show their BPN only.
    [ids.div]: { id: ids.div, name: null, bpn: 'BPNL0000000DIV01', status: 'ACTIVE' },
    [ids.ih]: { id: ids.ih, name: null, bpn: 'BPNL00000000IH01', status: 'ACTIVE' },
    [ids.inactive]: { id: ids.inactive, name: null, bpn: 'BPNL0000000INA01', status: 'INACTIVE' },
  };

  // ── C4-M2 Dataspace Wallet Interface ─────────────────────────────────────
  const cspWallet = (bpn) => ({
    did: `did:web:csp-wallet.example.org:${bpn}`,
    didDocumentLocation: `https://csp-wallet.example.org/${bpn}/did.json`,
    credentialServiceUrl: `https://csp-wallet.example.org/api/credentials/v1/participants/${bpn}`,
  });

  /** C4-M2 `Wallet` of Beispiel Maschinenbau GmbH (GET /companies/{companyId}/wallet), dataspace wallet of the CSP. */
  const wallet = {
    companyId: ids.u1,
    provider: 'CSP',
    status: 'ACTIVE',
    ...cspWallet('BPNLIUK2REMLK3F4'),
    bdrsUrl: 'https://bdrs.example.org/api/directory',
    stsTokenUrl: null,
    supportsWalletAccounts: true,
    failureReason: null,
    createdAt: '2026-11-03T09:58:20Z',
    activatedAt: '2026-11-03T09:58:31Z',
  };

  /** The same wallet in the other results of the use case (state buttons of the views). */
  const walletVariants = {
    validating: { ...wallet, status: 'VALIDATING', activatedAt: null },
    failed: { ...wallet, status: 'FAILED', failureReason: 'DID_NOT_RESOLVABLE', activatedAt: null },
  };

  /** C2-M3 `TechnicalUserSummary` of Beispiel Maschinenbau GmbH with wallet access (the list comes from C2-M3). */
  const technicalUsers = [
    { id: '7c3a0001-0000-4000-8000-000000000001', companyId: ids.u1, name: 'EDC connector production', description: 'Connector of the plant in Stuttgart', origin: 'OWN', status: 'ACTIVE', iamClientId: 'sa201', walletAccess: 'ACTIVE', disabled: false, createdAt: '2026-11-05T08:12:04Z' },
    { id: '7c3a0002-0000-4000-8000-000000000002', companyId: ids.u1, name: 'EDC connector test', description: 'Test connector of the IT department', origin: 'OWN', status: 'ACTIVE', iamClientId: 'sa202', walletAccess: 'ACTIVE', disabled: false, createdAt: '2026-11-04T14:20:51Z' },
    { id: '7c3a0003-0000-4000-8000-000000000003', companyId: ids.u1, name: 'Supplier data integration', description: null, origin: 'OWN', status: 'ACTIVE', iamClientId: 'sa203', walletAccess: 'NONE', disabled: false, createdAt: '2026-11-04T09:02:13Z' },
  ];

  /** C4-M2 `WalletAccount` per technical user (GET /technical-users/{technicalUserId}/wallet-account). */
  const walletAccounts = {
    '7c3a0001-0000-4000-8000-000000000001': {
      walletAccountRef: 'b7a10001-0000-4000-8000-000000000001', technicalUserId: '7c3a0001-0000-4000-8000-000000000001', companyId: ids.u1,
      provider: 'CSP', status: 'ACTIVE', failureReason: null, credentialsState: 'AVAILABLE', credentialsExpireAt: '2026-12-05T08:12:30Z',
      createdAt: '2026-11-05T08:12:30Z', changedAt: '2026-11-05T08:12:30Z',
    },
    '7c3a0002-0000-4000-8000-000000000002': {
      walletAccountRef: 'b7a10002-0000-4000-8000-000000000002', technicalUserId: '7c3a0002-0000-4000-8000-000000000002', companyId: ids.u1,
      provider: 'CSP', status: 'ACTIVE', failureReason: null, credentialsState: 'RETRIEVED', credentialsExpireAt: null,
      createdAt: '2026-11-04T14:21:09Z', changedAt: '2026-11-04T14:35:47Z',
    },
  };

  // Not a secret: a visible placeholder of the mockup, so the screen shows a value of a realistic length.
  const SHOWN_ONCE_PLACEHOLDER = ['mockup', 'value', 'not', 'a', 'real', 'secret'].join('-');

  /** C4-M2 `WalletAccountCredentials`: the response of the one retrieval (stand-in values of the CSP wallet, 11.3). */
  const walletAccountCredentials = {
    walletAccountRef: 'b7a10001-0000-4000-8000-000000000001',
    tokenUrl: 'https://csp-wallet.example.org/api/sts/token',
    clientId: 'tu-7c3a0001-0000-4000-8000-000000000001',
    clientSecret: SHOWN_ONCE_PLACEHOLDER,
    did: wallet.did,
    credentialServiceUrl: wallet.credentialServiceUrl,
  };

  // ── C4-M1 Credentials ────────────────────────────────────────────────────
  /** C4-M1 `CredentialStatusView[]` of Beispiel Maschinenbau GmbH (GET /companies/{companyId}/credentials). */
  // `dataspace` is not in CredentialStatusView (C4-M1 0.2): the UI takes it from the installation settings
  // (dataspace.memberOf, dataspace.name) until the API returns it per credential. Open point in the hub.
  const CATENA_X = { id: 'catena-x', name: 'Catena-X', mark: 'CX' };
  const view = (credentialType, status, requestedAt, issuedAt, revokedAt, dataspace = CATENA_X) => ({
    key: `${dataspace.id}:${credentialType}`, credentialType, status, requestedAt: requestedAt || null, issuedAt: issuedAt || null, revokedAt: revokedAt || null, dataspace,
  });
  /** Outlook only (not in C4-M1 0.2): the credential of a second dataspace, to show that passes of several dataspaces live together. */
  const SEMICONDUCTOR = { id: 'semiconductor', name: 'Semiconductor dataspace', mark: 'SC' };
  const companyCredentials = {
    issued: [
      view('BPN', 'ISSUED', '2026-11-03T09:59:40Z', '2026-11-03T10:00:12Z'),
      view('MEMBERSHIP', 'ISSUED', '2026-11-03T09:59:40Z', '2026-11-03T10:00:15Z'),
    ],
    requested: [
      view('BPN', 'ISSUED', '2026-11-03T09:59:40Z', '2026-11-03T10:00:12Z'),
      view('MEMBERSHIP', 'REQUESTED', '2026-11-03T09:59:40Z'),
    ],
    failed: [
      view('BPN', 'ISSUED', '2026-11-03T09:59:40Z', '2026-11-03T10:00:12Z'),
      view('MEMBERSHIP', 'FAILED', '2026-11-03T09:59:40Z'),
    ],
    revoked: [
      view('BPN', 'ISSUED', '2026-11-03T09:59:40Z', '2026-11-03T10:00:12Z'),
      view('MEMBERSHIP', 'REVOKED', '2026-11-03T09:59:40Z', '2026-11-03T10:00:15Z', '2026-11-06T09:30:02Z'),
    ],
    none: [view('BPN', 'NONE'), view('MEMBERSHIP', 'NONE')],
    twoDataspaces: [
      view('BPN', 'ISSUED', '2026-11-03T09:59:40Z', '2026-11-03T10:00:12Z'),
      view('MEMBERSHIP', 'ISSUED', '2026-11-03T09:59:40Z', '2026-11-03T10:00:15Z'),
      view('MEMBERSHIP', 'ISSUED', '2026-11-05T08:30:00Z', '2026-11-05T08:31:10Z', null, SEMICONDUCTOR),
    ],
  };

  /** C4-M1 `CredentialDetail` of all companies (GET /credentials, sorted by changedAt descending). */
  const ISSUER_DID = 'did:web:issuer.osp-a.example.org';
  const detail = (n, companyId, credentialType, status, extra) => {
    const company = companies[companyId];
    const provider = extra.walletProvider || 'CSP';
    const holderDid = {
      CSP: `did:web:csp-wallet.example.org:${company.bpn}`,
      SAP_DIV: `did:web:div.example.org:did:${company.bpn}`,
      IDENTITY_HUB: `did:web:ih.example.org:${company.bpn}`,
    }[provider];
    const route = { CSP: 'ISSUER_SERVICE', IDENTITY_HUB: 'ISSUER_SERVICE', SAP_DIV: 'CREDENTIAL_ISSUER' }[provider];
    const attempt = extra.attempt || 1;
    return {
      id: `c4c00${String(n).padStart(3, '0')}-0000-4000-8000-000000000${String(n).padStart(3, '0')}`,
      companyId,
      credentialType,
      status,
      route,
      issuerDid: route === 'ISSUER_SERVICE' ? ISSUER_DID : null,
      walletProvider: provider,
      bpn: company.bpn,
      holderDid,
      requestRef: route === 'ISSUER_SERVICE' ? `${companyId}:${credentialType}:${attempt}` : null,
      attempt,
      requestedAt: extra.requestedAt,
      issuedAt: extra.issuedAt || null,
      failedAt: extra.failedAt || null,
      revokedAt: extra.revokedAt || null,
      failureReason: extra.failureReason || null,
      revocationReason: extra.revocationReason || null,
      createdAt: extra.createdAt || extra.requestedAt,
      changedAt: extra.changedAt,
    };
  };

  const credentials = [
    detail(1, ids.inactive, 'MEMBERSHIP', 'REVOCATION_PENDING', { walletProvider: 'SAP_DIV', requestedAt: '2026-11-02T15:04:10Z', issuedAt: '2026-11-02T15:05:02Z', revocationReason: 'COMPANY_DEACTIVATED', changedAt: '2026-11-06T09:41:27Z' }),
    detail(2, ids.u3, 'BPN', 'REQUESTED', { requestedAt: '2026-11-05T16:10:44Z', changedAt: '2026-11-05T16:10:44Z' }),
    detail(3, ids.u3, 'MEMBERSHIP', 'REQUESTED', { requestedAt: '2026-11-05T16:10:44Z', changedAt: '2026-11-05T16:10:44Z' }),
    detail(4, ids.ih, 'MEMBERSHIP', 'REQUESTED', { walletProvider: 'IDENTITY_HUB', requestedAt: '2026-11-04T09:15:30Z', changedAt: '2026-11-04T09:15:30Z' }),
    detail(5, ids.u4, 'MEMBERSHIP', 'ISSUED', { requestedAt: '2026-11-05T13:45:12Z', issuedAt: '2026-11-05T13:46:01Z', changedAt: '2026-11-05T13:46:01Z' }),
    detail(6, ids.u4, 'BPN', 'ISSUED', { requestedAt: '2026-11-05T13:45:12Z', issuedAt: '2026-11-05T13:45:58Z', changedAt: '2026-11-05T13:45:58Z' }),
    detail(7, ids.u2, 'MEMBERSHIP', 'FAILED', {
      requestedAt: '2026-11-04T11:29:03Z', failedAt: '2026-11-04T11:29:41Z', changedAt: '2026-11-04T11:29:41Z',
      failureReason: 'The credential request ended in state ERROR at the IssuerService.',
    }),
    detail(8, ids.u2, 'BPN', 'ISSUED', { requestedAt: '2026-11-04T11:29:03Z', issuedAt: '2026-11-04T11:29:36Z', changedAt: '2026-11-04T11:29:36Z' }),
    detail(9, ids.ih, 'BPN', 'ISSUED', { walletProvider: 'IDENTITY_HUB', requestedAt: '2026-11-04T09:15:30Z', issuedAt: '2026-11-04T09:16:12Z', changedAt: '2026-11-04T09:16:12Z' }),
    detail(10, ids.u1, 'MEMBERSHIP', 'ISSUED', { requestedAt: '2026-11-03T09:59:40Z', issuedAt: '2026-11-03T10:00:15Z', changedAt: '2026-11-03T10:00:15Z' }),
    detail(11, ids.u1, 'BPN', 'ISSUED', { requestedAt: '2026-11-03T09:59:40Z', issuedAt: '2026-11-03T10:00:12Z', changedAt: '2026-11-03T10:00:12Z' }),
    detail(12, ids.inactive, 'BPN', 'ISSUED', { walletProvider: 'SAP_DIV', requestedAt: '2026-11-02T15:04:10Z', issuedAt: '2026-11-02T15:04:58Z', changedAt: '2026-11-02T15:04:58Z' }),
    detail(13, ids.div, 'MEMBERSHIP', 'ISSUED', { walletProvider: 'SAP_DIV', requestedAt: '2026-11-02T10:31:00Z', issuedAt: '2026-11-02T10:31:49Z', changedAt: '2026-11-02T10:31:49Z' }),
    detail(14, ids.div, 'BPN', 'ISSUED', { walletProvider: 'SAP_DIV', requestedAt: '2026-11-02T10:31:00Z', issuedAt: '2026-11-02T10:31:44Z', changedAt: '2026-11-02T10:31:44Z' }),
    detail(15, ids.osp, 'MEMBERSHIP', 'ISSUED', { requestedAt: '2026-11-01T07:02:00Z', issuedAt: '2026-11-01T07:02:31Z', changedAt: '2026-11-01T07:02:31Z' }),
    detail(16, ids.osp, 'BPN', 'ISSUED', { requestedAt: '2026-11-01T07:02:00Z', issuedAt: '2026-11-01T07:02:27Z', changedAt: '2026-11-01T07:02:27Z' }),
  ];

  window.MOCK_DATA = {
    /** OSP A, the installation this mockup runs in (C4-M1 README 14: installation.json). */
    installation: { ospId: '22222222-2222-4222-8222-222222222222', name: 'OSP A', dataspace: 'Catena-X', memberOf: 'catena-x', issuerDid: ISSUER_DID, resendAfterHours: 24 },
    ids,
    persons,
    permissions,
    companies,
    wallet,
    walletVariants,
    technicalUsers,
    walletAccounts,
    walletAccountCredentials,
    companyCredentials,
    /** Sorted like the API: changedAt descending. */
    credentials: credentials.sort((a, b) => b.changedAt.localeCompare(a.changedAt)),
  };
})();
