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

import { MASCHINENBAU_CLAIMS } from './fixtures/companies.fixture';
import type { MockAttestationClaims, MockAttestationOverrides } from './mock-attestation-claims';

/** The issuer, audience and UI client of the test installation (C1-M2 README 14.4, FRAMEWORK 7a). */
export const MOCK_ATTESTATION_ISSUER = 'https://ebw-connector.example.org';
export const MOCK_ATTESTATION_AUDIENCE = 'portal-registration';
export const MOCK_ATTESTATION_CLIENT_ID = 'osp-a-ui';

const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60;
const HEADER = { alg: 'ES256', typ: 'ebw-attestation+jwt', kid: 'ebw-test-2026-1' };

function base64UrlEncode(text: string): string {
  const binary = Array.from(new TextEncoder().encode(text), (byte) => String.fromCharCode(byte)).join('');
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(part: string): string {
  const base64 = part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '=');
  const binary = atob(base64);
  return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

/**
 * A verification attestation for mock mode and tests: the example of C1-M2 README 14.4 (Erika Mustermann for Beispiel
 * Maschinenbau GmbH) with the overrides applied, as a compact JWS whose signature is the text `mock-signature`. It
 * matches the `Attestation` pattern of the spec. Every call has a new `jti` unless one is given; `iat` is `now`,
 * `exp` 30 days later. Never accepted by the real backend: it checks the signature.
 */
export function mockAttestation(overrides: MockAttestationOverrides = {}, now: Date = new Date()): string {
  const iat = Math.floor(now.getTime() / 1000);
  const company = overrides.company ?? MASCHINENBAU_CLAIMS;
  const payload = {
    iss: MOCK_ATTESTATION_ISSUER,
    sub: company.ebwoid,
    aud: MOCK_ATTESTATION_AUDIENCE,
    iat,
    exp: iat + THIRTY_DAYS_SECONDS,
    jti: crypto.randomUUID(),
    attestation_version: '0.2',
    purpose: 'onboarding',
    verified_at: iat,
    client_id: MOCK_ATTESTATION_CLIENT_ID,
    person: { given_name: 'Erika', family_name: 'Mustermann' },
    representation: {
      confirmed: true,
      result: 'CONFIRMED',
      type: 'legal_representative',
      role: 'Geschäftsführerin',
      valid_until: '2027-12-31',
      issuer: 'https://register.test.example.org',
      trust: 'trust_list',
    },
    evidence: [
      { type: 'PID', vct: 'urn:eudi:pid:1', issuer: 'https://pid.test.example.org', wallet: 'EUDI_WALLET', status_checked: false },
      { type: 'MANDATE', vct: 'urn:tx:test:mandate:1', issuer: 'https://register.test.example.org', wallet: 'EUDI_WALLET', status_checked: true },
      { type: 'LPID', vct: 'urn:tx:test:lpid:1', issuer: 'https://register.test.example.org', wallet: 'BUSINESS_WALLET', status_checked: false },
    ],
    ...overrides,
    company,
  };
  return `${base64UrlEncode(JSON.stringify(HEADER))}.${base64UrlEncode(JSON.stringify(payload))}.mock-signature`;
}

/**
 * Header and payload of a compact JWS, without checking anything; null when it is not three base64url parts with a
 * JSON object in header and payload (reason `format`). The payload is untrusted data: the caller checks every claim.
 */
export function decodeMockAttestation(jws: string): { header: Record<string, unknown>; payload: Partial<MockAttestationClaims> } | null {
  if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(jws)) {
    return null;
  }
  const [headerPart, payloadPart] = jws.split('.');
  try {
    const header: unknown = JSON.parse(base64UrlDecode(headerPart));
    const payload: unknown = JSON.parse(base64UrlDecode(payloadPart));
    if (!isObject(header) || !isObject(payload)) {
      return null;
    }
    return { header, payload: payload as Partial<MockAttestationClaims> };
  } catch {
    return null;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
