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

import { createCoreClient } from '@dataspace-mgm/core-http';
import { describe, expect, it } from 'vitest';
import { OSP_A_COMPANY } from '../../domain/testing/in-memory-company.repository';
import type { paths } from '../../generated/c3-m1-api';
import { CompanyHttpRepository } from './company-http.repository';

/** The answer of the C3-M1 stand-in of the backend for Pia (GET /api/c3-m1/companies/1111…), as it is on the wire. */
const WIRE = {
  id: '11111111-1111-4111-8111-111111111111',
  name: 'OSP A Beispiel GmbH',
  shortName: null,
  address: { street: 'Am Prüfstand', houseNumber: '1', postalCode: '70569', city: 'Stuttgart', countryCode: 'DE' },
  identifiers: [{ type: 'VAT_ID', value: 'DE222222222', source: 'DECLARED' }],
  coreDataSource: 'MANUAL',
  status: 'ACTIVE',
  bpn: 'BPNL00000000OSPA',
  companyRoles: [
    { companyRole: 'ONBOARDING_SERVICE_PROVIDER', status: 'ACTIVE' },
    { companyRole: 'ACTIVE_PARTICIPANT', status: 'ACTIVE' },
    { companyRole: 'APP_PROVIDER', status: 'ACTIVE' },
    { companyRole: 'SERVICE_PROVIDER', status: 'ACTIVE' },
    { companyRole: 'OLD_ROLE', status: 'INACTIVE' },
  ],
  createdAt: '2026-11-06T00:00:00+00:00',
  dataspaceName: 'Catena-X',
};

function repositoryAnswering(status: number, body: unknown) {
  const requests: Request[] = [];
  const fetchImpl = async (request: Request) => {
    requests.push(request);
    const type = status < 400 ? 'application/json' : 'application/problem+json';
    return new Response(JSON.stringify(body), { status, headers: { 'content-type': type } });
  };
  const client = createCoreClient<paths>({ baseUrl: 'http://ui.test/api/c3-m1', fetch: fetchImpl as unknown as typeof fetch });
  return { repository: new CompanyHttpRepository(client), requests };
}

describe('CompanyHttpRepository', () => {
  it('calls GET /api/c3-m1/companies/{companyId} and maps the answer', async () => {
    const { repository, requests } = repositoryAnswering(200, WIRE);
    expect(await repository.getCompany(WIRE.id)).toEqual(OSP_A_COMPANY);
    expect(requests[0].method).toBe('GET');
    expect(new URL(requests[0].url).pathname).toBe(`/api/c3-m1/companies/${WIRE.id}`);
  });

  it('maps 404 to null', async () => {
    const { repository } = repositoryAnswering(404, { type: 'urn:c3-m1:problem:not-found', title: 'not found', status: 404 });
    expect(await repository.getCompany('c0000001-0000-4000-8000-000000000001')).toBeNull();
  });

  it('throws every other error', async () => {
    const { repository } = repositoryAnswering(401, { type: 'urn:portal:problem:unauthorized', title: 'unauthorized', status: 401 });
    await expect(repository.getCompany(WIRE.id)).rejects.toMatchObject({ status: 401, problemType: 'urn:portal:problem:unauthorized' });
  });
});
