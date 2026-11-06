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
 * to the project's license. Human review is required before committing.
 *
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: Codex (GPT-6)
 ********************************************************************************/

import type { Application } from '../domain/data/review.data';
export const attestationFixture: NonNullable<Application['attestation']> = {
  attestationId: '3f6c1e2a-7b4d-4e8f-9a51-2c0d6b8e4f17',
  issuer: 'https://ebw-connector.example.org',
  keyId: 'ebw-test-2026-1',
  clientId: 'demo-osp',
  issuedAt: '2026-10-28T08:00:00Z',
  expiresAt: '2026-11-27T08:00:00Z',
  verifiedAt: '2026-10-28T08:00:00Z',
  person: {
    givenName: 'Erika',
    familyName: 'Mustermann',
  },
  representation: {
    confirmed: true,
    result: 'CONFIRMED',
    type: 'legal_representative',
    role: 'Geschäftsführerin',
    validUntil: '2027-12-31',
    issuer: 'https://register.test.example.org',
    trust: 'trust_list',
    reasons: [],
  },
  company: {
    legalName: 'Beispiel Maschinenbau GmbH',
    ebwoid: 'EBWOID-DE-0000000001',
    euid: 'DEXX001T.HRB100001',
    countryCode: 'DE',
    address: {
      streetAddress: 'Musterstraße 1',
      postalCode: '70569',
      locality: 'Stuttgart',
      country: 'DE',
    },
  },
  evidence: [
    {
      type: 'PID',
      vct: 'urn:eudi:pid:1',
      issuer: 'https://pid.test.example.org',
      wallet: 'EUDI_WALLET',
      statusChecked: false,
    },
    {
      type: 'MANDATE',
      vct: 'urn:tx:test:mandate:1',
      issuer: 'https://register.test.example.org',
      wallet: 'EUDI_WALLET',
      statusChecked: true,
    },
    {
      type: 'LPID',
      vct: 'urn:tx:test:lpid:1',
      issuer: 'https://register.test.example.org',
      wallet: 'BUSINESS_WALLET',
      statusChecked: false,
    },
  ],
  signatureCheck: {
    result: 'VALID',
    checkedAt: '2026-10-28T08:30:00Z',
  },
};
