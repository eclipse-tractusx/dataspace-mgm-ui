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
import { InMemoryNotificationRepository } from '../../domain/testing/in-memory-notification.repository';
import {
  MOCK_INBOX,
  OFFER_APPROVED_INFO,
  REVIEW_CASE_DONE_TASK,
  SUBSCRIPTION_REQUESTED_TASK,
} from '../../domain/testing/notification.fixtures';
import { CountNotificationsUseCase } from './count-notifications.use-case';
import { GetNotificationUseCase } from './get-notification.use-case';
import { HideNotificationUseCase } from './hide-notification.use-case';
import { ListNotificationsUseCase } from './list-notifications.use-case';
import { MarkNotificationReadUseCase } from './mark-notification-read.use-case';
import { MarkNotificationUnreadUseCase } from './mark-notification-unread.use-case';

const NOT_IMPLEMENTED = new CoreHttpException(501, 'urn:c11-m1:problem:not-implemented', 'not implemented');

describe('ListNotificationsUseCase', () => {
  it('returns the inbox newest first, filtered', async () => {
    const useCase = new ListNotificationsUseCase(new InMemoryNotificationRepository(MOCK_INBOX));
    const all = await useCase.execute();
    expect(all.status === 'found' && all.page.items.map((n) => n.id)).toEqual([
      SUBSCRIPTION_REQUESTED_TASK.id,
      OFFER_APPROVED_INFO.id,
      REVIEW_CASE_DONE_TASK.id,
    ]);
    const openTasks = await useCase.execute({ topic: 'ACTION', done: false });
    expect(openTasks.status === 'found' && openTasks.page.items.map((n) => n.id)).toEqual([SUBSCRIPTION_REQUESTED_TASK.id]);
  });

  it('reports errors as data', async () => {
    const failure = new CoreHttpException(403, 'urn:c11-m1:problem:forbidden', 'forbidden');
    expect(await new ListNotificationsUseCase(new InMemoryNotificationRepository([], failure)).execute()).toEqual({
      status: 'failed',
      error: { status: 403, problemType: 'urn:c11-m1:problem:forbidden', message: 'forbidden' },
    });
  });
});

describe('CountNotificationsUseCase', () => {
  it('counts unread, open tasks and unread information', async () => {
    expect(await new CountNotificationsUseCase(new InMemoryNotificationRepository(MOCK_INBOX)).execute()).toEqual({
      status: 'found',
      count: { total: 3, unread: 2, openTasks: 1, unreadInfo: 1 },
    });
  });

  it('reports 501 while the module does not have the operation yet', async () => {
    const result = await new CountNotificationsUseCase(new InMemoryNotificationRepository([], NOT_IMPLEMENTED)).execute();
    expect(result).toMatchObject({ status: 'failed', error: { status: 501 } });
  });
});

describe('GetNotificationUseCase', () => {
  it('finds an own notification, not-found otherwise', async () => {
    const useCase = new GetNotificationUseCase(new InMemoryNotificationRepository(MOCK_INBOX));
    expect(await useCase.execute(OFFER_APPROVED_INFO.id)).toEqual({ status: 'found', notification: OFFER_APPROVED_INFO });
    expect(await useCase.execute('00000000-0000-4000-8000-000000000000')).toEqual({ status: 'not-found' });
  });
});

describe('marking and hiding', () => {
  it('marks as read and unread again', async () => {
    const repository = new InMemoryNotificationRepository(MOCK_INBOX);
    expect(await new MarkNotificationReadUseCase(repository).execute(OFFER_APPROVED_INFO.id)).toEqual({ status: 'changed' });
    expect((await repository.get(OFFER_APPROVED_INFO.id))?.read).toBe(true);
    expect(await new MarkNotificationUnreadUseCase(repository).execute(OFFER_APPROVED_INFO.id)).toEqual({ status: 'changed' });
    expect((await repository.get(OFFER_APPROVED_INFO.id))?.read).toBe(false);
  });

  it('refuses to hide an open task, hides a closed one and information', async () => {
    const repository = new InMemoryNotificationRepository(MOCK_INBOX);
    const hide = new HideNotificationUseCase(repository);
    expect(await hide.execute(SUBSCRIPTION_REQUESTED_TASK.id)).toEqual({ status: 'task-open' });
    expect(await hide.execute(REVIEW_CASE_DONE_TASK.id)).toEqual({ status: 'changed' });
    expect(await hide.execute(OFFER_APPROVED_INFO.id)).toEqual({ status: 'changed' });
    expect((await repository.list({})).items.map((n) => n.id)).toEqual([SUBSCRIPTION_REQUESTED_TASK.id]);
  });

  it('reports failures of get, read and unread as data', async () => {
    const failing = new InMemoryNotificationRepository([], NOT_IMPLEMENTED);
    expect(await new GetNotificationUseCase(failing).execute('x')).toMatchObject({ status: 'failed', error: { status: 501 } });
    expect(await new MarkNotificationReadUseCase(failing).execute('x')).toMatchObject({ status: 'failed', error: { status: 501 } });
    expect(await new MarkNotificationUnreadUseCase(failing).execute('x')).toMatchObject({ status: 'failed', error: { status: 501 } });
  });

  it('shows tasks that C11-M1 adds and closes', async () => {
    const repository = new InMemoryNotificationRepository();
    repository.add(SUBSCRIPTION_REQUESTED_TASK);
    repository.close(SUBSCRIPTION_REQUESTED_TASK.id, '2026-11-06T10:00:00Z');
    expect(await repository.get(SUBSCRIPTION_REQUESTED_TASK.id)).toMatchObject({ done: true, doneAt: '2026-11-06T10:00:00Z' });
    expect(await new HideNotificationUseCase(repository).execute(SUBSCRIPTION_REQUESTED_TASK.id)).toEqual({ status: 'changed' });
  });

  it('reports an unknown notification and failures', async () => {
    expect(await new MarkNotificationReadUseCase(new InMemoryNotificationRepository()).execute('x')).toEqual({ status: 'not-found' });
    const result = await new HideNotificationUseCase(new InMemoryNotificationRepository([], NOT_IMPLEMENTED)).execute('x');
    expect(result).toMatchObject({ status: 'failed', error: { status: 501 } });
  });
});
