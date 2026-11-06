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

import { describe, expect, it } from 'vitest';
import { WERKZEUGBAU_CLAIMS } from './fixtures/companies.fixture';
import { decodeMockAttestation, mockAttestation } from './mock-attestation';

describe('mockAttestation', () => {
  const now = new Date('2026-11-06T10:00:00.000Z');

  it('builds a compact JWS of the README 14.4 example that matches the Attestation pattern', () => {
    const jws = mockAttestation({}, now);
    expect(jws).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
    const decoded = decodeMockAttestation(jws);
    expect(decoded?.header).toEqual({ alg: 'ES256', typ: 'ebw-attestation+jwt', kid: 'ebw-test-2026-1' });
    expect(decoded?.payload).toMatchObject({
      iss: 'https://ebw-connector.example.org',
      sub: 'EBWOID-DE-0000000001',
      aud: 'portal-registration',
      iat: 1793959200,
      exp: 1793959200 + 30 * 24 * 60 * 60,
      attestation_version: '0.2',
      purpose: 'onboarding',
      client_id: 'osp-a-ui',
      person: { given_name: 'Erika', family_name: 'Mustermann' },
      company: { legal_name: 'Beispiel Maschinenbau GmbH', address: { street_address: 'Musterstraße 1' } },
      representation: { confirmed: true },
    });
    expect(decoded?.payload.evidence).toHaveLength(3);
  });

  it('applies overrides, removes claims set to undefined and draws a new jti per call', () => {
    const jws = mockAttestation({ company: WERKZEUGBAU_CLAIMS, client_id: undefined, jti: 'fixed' }, now);
    const payload = decodeMockAttestation(jws)?.payload;
    expect(payload).toMatchObject({ sub: 'EBWOID-DE-0000000003', jti: 'fixed', company: { legal_name: 'Beispiel Werkzeugbau GmbH' } });
    expect(payload).not.toHaveProperty('client_id');
    expect(decodeMockAttestation(mockAttestation())?.payload.jti).not.toBe(decodeMockAttestation(mockAttestation())?.payload.jti);
  });

  it('decodes nothing that is not three base64url parts with JSON objects', () => {
    expect(decodeMockAttestation('nope')).toBeNull();
    expect(decodeMockAttestation('a.b.c')).toBeNull();
    const array = btoa('[1]').replace(/=+$/, '');
    expect(decodeMockAttestation(`${array}.${array}.sig`)).toBeNull();
  });
});
