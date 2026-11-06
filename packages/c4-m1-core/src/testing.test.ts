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
import {
  C4M1_FIXTURES_NOW,
  C4M1_TEST_COMPANY_IDS,
  c4m1Problem,
  COMPANY_CREDENTIALS,
  createInMemoryC4M1Module,
  REVOCATION_PENDING_CREDENTIAL,
} from './testing';

describe('createInMemoryC4M1Module', () => {
  it('wires every use case on the fixtures of the mockup by default', async () => {
    const c4m1 = createInMemoryC4M1Module({ clock: () => new Date(C4M1_FIXTURES_NOW) });
    expect(await c4m1.listCompanyCredentials.execute(C4M1_TEST_COMPANY_IDS.beispielMaschinenbau)).toEqual({
      status: 'found',
      credentials: COMPANY_CREDENTIALS.issued,
    });
    expect(await c4m1.listCredentials.execute({ page: 0, size: 1 })).toMatchObject({ status: 'found', page: { total: 16 } });
    expect(await c4m1.countCredentialsByStatus.execute(['FAILED'])).toEqual({ status: 'found', counts: [{ status: 'FAILED', total: 1 }] });
    expect(await c4m1.listOpenItems.execute()).toMatchObject({ status: 'found', total: 3 });
    expect(await c4m1.confirmRevocation.execute(REVOCATION_PENDING_CREDENTIAL.id, 'ticket 4711')).toMatchObject({
      status: 'confirmed',
      credential: { status: 'REVOKED', revokedAt: '2026-11-06T12:00:00.000Z' },
    });
    expect(await c4m1.getCredential.execute(REVOCATION_PENDING_CREDENTIAL.id)).toMatchObject({
      status: 'found',
      credential: { status: 'REVOKED' },
    });
  });

  it('takes other fixtures and failures', async () => {
    const c4m1 = createInMemoryC4M1Module({
      companyCredentials: {},
      credentials: [],
      credentialFailure: c4m1Problem(403, 'forbidden'),
      openOrderHours: 48,
    });
    expect(await c4m1.listCompanyCredentials.execute(C4M1_TEST_COMPANY_IDS.beispielMaschinenbau)).toEqual({ status: 'not-found' });
    expect(await c4m1.listOpenItems.execute()).toEqual({ status: 'forbidden' });
    const failing = createInMemoryC4M1Module({ companyCredentialFailure: c4m1Problem(403, 'forbidden') });
    expect(await failing.listCompanyCredentials.execute(C4M1_TEST_COMPANY_IDS.beispielMaschinenbau)).toEqual({ status: 'forbidden' });
  });
});
