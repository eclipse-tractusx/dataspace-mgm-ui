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
import type { paths } from '../../generated/c11-m1-api';
import { NotificationHttpRepository } from './notification-http.repository';

/** GET /api/c11-m1/notifications of the C11-M1 stand-in for Erika after demo scenario 1 (6 Nov 2026). */
const STAND_IN_PAGE = {
  items: [
    {
      id: 'c35cbdfd-2436-4f1c-b909-6c40f6d4c496', userId: '5a1c0001-0000-4000-8000-000000000001',
      type: 'APPLICATION_SUBMITTED', topic: 'INFO', read: false, done: false,
      createdAt: '2026-11-06T11:34:43.574674+00:00', sourceEventId: '5fd26745-007a-409e-8d8c-6081480b6f71',
      content: { applicationId: 'd6e6b2fd-6ebb-4bea-a9c1-516962d13d59' },
    },
  ],
  page: 0,
  size: 1,
  total: 1,
};

const problem = (status: number, name: string) => ({ type: `urn:c11-m1:problem:${name}`, title: name, status });

function repositoryAnswering(status: number, body?: unknown) {
  const requests: Request[] = [];
  const fetchImpl = async (request: Request) => {
    requests.push(request);
    if (body === undefined) {
      return new Response(null, { status });
    }
    const type = status < 400 ? 'application/json' : 'application/problem+json';
    return new Response(JSON.stringify(body), { status, headers: { 'content-type': type } });
  };
  const client = createCoreClient<paths>({
    baseUrl: 'http://ui.test/api/c11-m1',
    fetch: fetchImpl as unknown as typeof fetch,
    getCsrfToken: () => 'csrf-1',
  });
  return { repository: new NotificationHttpRepository(client), requests };
}

describe('NotificationHttpRepository', () => {
  it('lists with GET /api/c11-m1/notifications and the filter as query', async () => {
    const { repository, requests } = repositoryAnswering(200, STAND_IN_PAGE);
    const page = await repository.list({ topic: 'INFO', read: false, order: 'newest-first' });
    expect(page.total).toBe(1);
    expect(page.items[0]).toMatchObject({ id: 'c35cbdfd-2436-4f1c-b909-6c40f6d4c496', type: 'APPLICATION_SUBMITTED', done: null });
    const url = new URL(requests[0].url);
    expect(url.pathname).toBe('/api/c11-m1/notifications');
    expect(Object.fromEntries(url.searchParams)).toEqual({ topic: 'INFO', read: 'false', sort: 'createdAt.desc' });
  });

  it('reads the counters', async () => {
    const { repository, requests } = repositoryAnswering(200, { total: 3, unread: 2, openTasks: 1, unreadInfo: 1 });
    expect(await repository.count()).toEqual({ total: 3, unread: 2, openTasks: 1, unreadInfo: 1 });
    expect(new URL(requests[0].url).pathname).toBe('/api/c11-m1/notifications/count');
  });

  it('throws 501 while the module does not have the operation yet', async () => {
    const { repository } = repositoryAnswering(501, problem(501, 'not-implemented'));
    await expect(repository.count()).rejects.toMatchObject({ status: 501 });
  });

  it('maps 404 of getNotification to null', async () => {
    const { repository } = repositoryAnswering(404, problem(404, 'not-found'));
    expect(await repository.get('7c1d0001-0000-4000-8000-000000000001')).toBeNull();
  });

  it('marks as read with POST, the CSRF token and no body; 204 = changed', async () => {
    const { repository, requests } = repositoryAnswering(204);
    expect(await repository.markRead('n1')).toBe('changed');
    expect(requests[0].method).toBe('POST');
    expect(new URL(requests[0].url).pathname).toBe('/api/c11-m1/notifications/n1/read');
    expect(requests[0].headers.get('X-CSRF-Token')).toBe('csrf-1');
  });

  it('reports 409 task-open on hide and 404 on unread as outcomes', async () => {
    expect(await repositoryAnswering(409, problem(409, 'task-open')).repository.hide('n1')).toBe('task-open');
    expect(await repositoryAnswering(404, problem(404, 'not-found')).repository.markUnread('n1')).toBe('not-found');
  });

  it('throws other conflicts and errors', async () => {
    await expect(repositoryAnswering(409, problem(409, 'other')).repository.hide('n1')).rejects.toMatchObject({ status: 409 });
    await expect(repositoryAnswering(403, problem(403, 'forbidden')).repository.markRead('n1')).rejects.toMatchObject({
      status: 403,
      problemType: 'urn:c11-m1:problem:forbidden',
    });
  });
});
