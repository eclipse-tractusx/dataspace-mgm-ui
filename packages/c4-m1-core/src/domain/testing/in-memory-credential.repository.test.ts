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

import { CoreHttpException } from '@dataspace-mgm/core-http';
import { describe, expect, it } from 'vitest';
import type { RevocationNote } from '../valueObjects/revocation-note.value-object';
import { C4M1_FIXTURES_NOW, C4M1_TEST_COMPANY_IDS } from './c4-m1-test-ids.fixtures';
import {
  CREDENTIALS_OF_ALL_COMPANIES,
  ISSUED_CREDENTIAL,
  OVERDUE_REQUESTED_CREDENTIAL,
  REVOCATION_PENDING_CREDENTIAL,
} from './credentials.fixtures';
import { InMemoryCredentialRepository } from './in-memory-credential.repository';

const note = (value: string) => value as RevocationNote;
const NOW = new Date(C4M1_FIXTURES_NOW);
const repository = () => new InMemoryCredentialRepository(CREDENTIALS_OF_ALL_COMPANIES, null, () => NOW);
const ids = (items: ReadonlyArray<{ id: string }>) => items.map((item) => item.id);

describe('InMemoryCredentialRepository', () => {
  it('holds the 16 fixtures sorted by changedAt descending, with the company names of the mockup', () => {
    const sorted = [...CREDENTIALS_OF_ALL_COMPANIES].sort((a, b) => Date.parse(b.changedAt) - Date.parse(a.changedAt));
    expect(CREDENTIALS_OF_ALL_COMPANIES).toHaveLength(16);
    expect(ids(CREDENTIALS_OF_ALL_COMPANIES)).toEqual(ids(sorted));
    expect(ISSUED_CREDENTIAL.companyName).toBe('Beispiel Maschinenbau GmbH');
    expect(REVOCATION_PENDING_CREDENTIAL.companyName).toBeNull();
  });

  it('filters like the API: status, credentialType, companyId, route, requestedBefore', async () => {
    const list = (query: object) => repository().listCredentials({ page: 0, size: 100, ...query });
    expect((await list({ status: ['REQUESTED'] })).total).toBe(3);
    expect((await list({ status: [] })).total).toBe(16);
    expect((await list({ credentialType: 'BPN' })).total).toBe(8);
    expect((await list({ companyId: C4M1_TEST_COMPANY_IDS.beispielMaschinenbau })).total).toBe(2);
    expect((await list({ route: 'CREDENTIAL_ISSUER' })).total).toBe(4);
    const open = await list({ status: ['REQUESTED'], requestedBefore: '2026-11-05T12:00:00Z' });
    expect(ids(open.items)).toEqual([OVERDUE_REQUESTED_CREDENTIAL.id]);
  });

  it('pages and reports the total of all matches', async () => {
    const second = await repository().listCredentials({ page: 1, size: 5 });
    expect(second).toEqual({ items: CREDENTIALS_OF_ALL_COMPANIES.slice(5, 10), page: 1, size: 5, total: 16 });
  });

  it('answers 400 for a page or size out of range', async () => {
    for (const query of [{ page: -1, size: 5 }, { page: 0, size: 0 }, { page: 0, size: 101 }, { page: 0.5, size: 5 }]) {
      await expect(repository().listCredentials(query)).rejects.toMatchObject({ status: 400, problemType: 'urn:c4-m1:problem:validation' });
    }
  });

  it('turns REVOCATION_PENDING into REVOKED, and shows the change in later reads', async () => {
    const credentials = repository();
    const revoked = await credentials.confirmRevocation(REVOCATION_PENDING_CREDENTIAL.id, note('ticket 4711'));
    expect(revoked).toMatchObject({ status: 'REVOKED', revokedAt: NOW.toISOString(), changedAt: NOW.toISOString() });
    expect(await credentials.getCredential(REVOCATION_PENDING_CREDENTIAL.id)).toEqual(revoked);
    expect((await credentials.listCredentials({ status: ['REVOCATION_PENDING'], page: 0, size: 20 })).total).toBe(0);
    expect(REVOCATION_PENDING_CREDENTIAL.status).toBe('REVOCATION_PENDING');
  });

  it('answers a second confirmation with the revoked credential, without a change (README 7.3)', async () => {
    const credentials = repository();
    const first = await credentials.confirmRevocation(REVOCATION_PENDING_CREDENTIAL.id, note('ticket 4711'));
    expect(await credentials.confirmRevocation(REVOCATION_PENDING_CREDENTIAL.id, note('again'))).toBe(first);
  });

  it('answers 409 for any other status, 404 (null) for an unknown credential, 400 for an invalid note', async () => {
    await expect(repository().confirmRevocation(ISSUED_CREDENTIAL.id, note('ticket'))).rejects.toMatchObject({ status: 409 });
    expect(await repository().confirmRevocation('c4c00999-0000-4000-8000-000000000999', note('ticket'))).toBeNull();
    await expect(repository().confirmRevocation(REVOCATION_PENDING_CREDENTIAL.id, note(''))).rejects.toMatchObject({ status: 400 });
    await expect(repository().confirmRevocation(REVOCATION_PENDING_CREDENTIAL.id, note('x'.repeat(501)))).rejects.toMatchObject({
      status: 400,
    });
  });

  it('throws its failure on every call and records the calls', async () => {
    const failure = new CoreHttpException(403, 'urn:c4-m1:problem:forbidden', 'forbidden');
    const credentials = new InMemoryCredentialRepository([], failure);
    await expect(credentials.listCredentials({ page: 0, size: 1 })).rejects.toBe(failure);
    await expect(credentials.getCredential('x')).rejects.toBe(failure);
    await expect(credentials.confirmRevocation('x', note('n'))).rejects.toBe(failure);
    expect(credentials.calls.map((call) => call.method)).toEqual(['listCredentials', 'getCredential', 'confirmRevocation']);
  });

  it('uses the real time by default', async () => {
    const credentials = new InMemoryCredentialRepository([REVOCATION_PENDING_CREDENTIAL]);
    const before = Date.now();
    const revoked = await credentials.confirmRevocation(REVOCATION_PENDING_CREDENTIAL.id, note('ticket'));
    expect(Date.parse(revoked?.revokedAt ?? '')).toBeGreaterThanOrEqual(before - 1000);
  });
});
