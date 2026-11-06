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

import { describe, expect, it, vi } from 'vitest';
import { CoreHttpErrorFactory, CoreHttpException, createCoreClient, ensureData } from './index';

interface TestPaths {
  '/things/{id}': {
    parameters: { query?: never; header?: never; path: { id: string }; cookie?: never };
    get: {
      parameters: { query?: never; header?: never; path: { id: string }; cookie?: never };
      requestBody?: never;
      responses: {
        200: { headers: Record<string, unknown>; content: { 'application/json': { id: string } } };
        404: { headers: Record<string, unknown>; content: { 'application/problem+json': { type: string } } };
      };
    };
    post: {
      parameters: { query?: never; header?: never; path: { id: string }; cookie?: never };
      requestBody?: never;
      responses: { 204: { headers: Record<string, unknown>; content?: never } };
    };
  };
}

const json = (status: number, body: unknown, type = 'application/json') =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': type } });

describe('createCoreClient', () => {
  it('sends the session cookie, the CSRF token only on writes, and reports 401', async () => {
    const seen: Request[] = [];
    const onUnauthorized = vi.fn();
    const fetchImpl = vi.fn(async (input: Request) => {
      seen.push(input);
      return input.method === 'GET' ? json(401, { type: 'urn:x:unauthorized' }, 'application/problem+json') : new Response(null, { status: 204 });
    });
    const client = createCoreClient<TestPaths>({
      baseUrl: 'http://ui.test/api/x',
      getCsrfToken: () => 'csrf-1',
      onUnauthorized,
      fetch: fetchImpl as unknown as typeof fetch,
    });

    await client.GET('/things/{id}', { params: { path: { id: '1' } } });
    await client.POST('/things/{id}', { params: { path: { id: '1' } } });

    expect(seen[0].url).toMatch(/\/api\/x\/things\/1$/);
    expect(seen[0].credentials).toBe('include');
    expect(seen[0].headers.get('X-CSRF-Token')).toBeNull();
    expect(seen[1].headers.get('X-CSRF-Token')).toBe('csrf-1');
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });
});

describe('ensureData', () => {
  const client = (response: Response) =>
    createCoreClient<TestPaths>({ baseUrl: 'http://ui.test/api/x', fetch: (async () => response) as unknown as typeof fetch });

  it('returns the body of a successful call', async () => {
    const data = await ensureData(client(json(200, { id: '1' })).GET('/things/{id}', { params: { path: { id: '1' } } }));
    expect(data).toEqual({ id: '1' });
  });

  it('turns Problem Details into a CoreHttpException with status and type', async () => {
    const problem = { type: 'urn:c3-m1:problem:not-found', title: 'not found', status: 404 };
    const call = client(json(404, problem, 'application/problem+json')).GET('/things/{id}', { params: { path: { id: '2' } } });
    const error = await ensureData(call).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(CoreHttpException);
    expect(CoreHttpErrorFactory.from(error)).toEqual({ status: 404, problemType: 'urn:c3-m1:problem:not-found', message: 'not found' });
  });
});
