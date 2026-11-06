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

import { CoreHttpException, createCoreClient } from '@dataspace-mgm/core-http';
import { describe, expect, it } from 'vitest';
import { GetCspRegistrationUseCase } from './application/useCases/get-csp-registration.use-case';
import { CSP_REGISTRATIONS, InMemoryCspRegistrationRepository } from './domain/testing/in-memory-csp-registration.repository';
import type { paths } from './generated/c3-m2-api';
import { CspRegistrationHttpRepository } from './infrastructure/repositories/csp-registration-http.repository';

const U1 = 'c0000001-0000-4000-8000-000000000001';

function httpAnswering(status: number, body: unknown) {
  const requests: Request[] = [];
  const fetchImpl = async (request: Request) => {
    requests.push(request);
    const type = status < 400 ? 'application/json' : 'application/problem+json';
    return new Response(JSON.stringify(body), { status, headers: { 'content-type': type } });
  };
  const client = createCoreClient<paths>({ baseUrl: 'http://ui.test/api/c3-m2', fetch: fetchImpl as unknown as typeof fetch });
  return { useCase: new GetCspRegistrationUseCase(new CspRegistrationHttpRepository(client)), requests };
}

describe('GetCspRegistrationUseCase (in memory)', () => {
  it('returns the registration', async () => {
    const result = await new GetCspRegistrationUseCase(new InMemoryCspRegistrationRepository(CSP_REGISTRATIONS)).execute(U1);
    expect(result).toMatchObject({ status: 'found', registration: { status: 'REGISTERED', membership: 'REGISTERED' } });
  });

  it('reports a company without registration as not-registered', async () => {
    expect(await new GetCspRegistrationUseCase(new InMemoryCspRegistrationRepository([])).execute(U1)).toEqual({ status: 'not-registered' });
  });

  it('reports a 403 of the module as forbidden', async () => {
    const repository = new InMemoryCspRegistrationRepository(CSP_REGISTRATIONS, new CoreHttpException(403, 'urn:c3-m2:problem:forbidden', 'forbidden'));
    expect(await new GetCspRegistrationUseCase(repository).execute(U1)).toEqual({ status: 'forbidden' });
  });
});

describe('CspRegistrationHttpRepository (wire format of C3-M2)', () => {
  it('calls GET /api/c3-m2/companies/{companyId} and maps missing fields to null', async () => {
    const { useCase, requests } = httpAnswering(200, { companyId: U1, status: 'PENDING', membership: 'NONE', updatedAt: '2026-11-04T11:02:00Z' });
    expect(await useCase.execute(U1)).toEqual({
      status: 'found',
      registration: { companyId: U1, bpn: null, status: 'PENDING', failureReason: null, did: null, membership: 'NONE', registeredAt: null, updatedAt: '2026-11-04T11:02:00Z' },
    });
    expect(requests[0].method).toBe('GET');
    expect(new URL(requests[0].url).pathname).toBe(`/api/c3-m2/companies/${U1}`);
  });

  it.each([
    [404, 'urn:c3-m2:problem:not-found', { status: 'not-registered' }],
    [403, 'urn:c3-m2:problem:forbidden', { status: 'forbidden' }],
  ])('maps %s to its result', async (status, type, expected) => {
    const { useCase } = httpAnswering(status, { type, title: type, status });
    expect(await useCase.execute(U1)).toEqual(expected);
  });

  it.each([401, 501, 502])('reports %s as failed with the Problem Details type', async (status) => {
    const { useCase } = httpAnswering(status, { type: 'urn:c3-m2:problem:not-implemented', title: 'not implemented', status });
    expect(await useCase.execute(U1)).toEqual({ status: 'failed', error: { status, problemType: 'urn:c3-m2:problem:not-implemented', message: 'not implemented' } });
  });

  it('reports a network error as failed without a status', async () => {
    const repository = new InMemoryCspRegistrationRepository([], new TypeError('Failed to fetch'));
    expect(await new GetCspRegistrationUseCase(repository).execute(U1)).toEqual({ status: 'failed', error: { status: null, problemType: null, message: 'Failed to fetch' } });
  });
});
