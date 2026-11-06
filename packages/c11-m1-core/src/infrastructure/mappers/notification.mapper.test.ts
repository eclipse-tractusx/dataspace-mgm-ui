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
import type { NotificationDto } from '../data/c11-m1-infrastructure.data';
import { NotificationMapper } from './notification.mapper';

/** An item of GET /api/c11-m1/notifications from the C11-M1 stand-in for Erika after demo scenario 1 (6 Nov 2026). */
const STAND_IN_ITEM = {
  id: 'c35cbdfd-2436-4f1c-b909-6c40f6d4c496',
  userId: '5a1c0001-0000-4000-8000-000000000001',
  type: 'APPLICATION_SUBMITTED',
  topic: 'INFO',
  read: false,
  done: false,
  createdAt: '2026-11-06T11:34:43.574674+00:00',
  sourceEventId: '5fd26745-007a-409e-8d8c-6081480b6f71',
  content: { applicationId: 'd6e6b2fd-6ebb-4bea-a9c1-516962d13d59' },
} as unknown as NotificationDto;

/** The same as the spec describes it (openapi.yaml `Notification`). */
const SPEC_TASK: NotificationDto = {
  notificationId: '3c6b1f2a-8d4e-4a5b-9c7d-0e1f2a3b4c5d',
  type: 'PROCESS_STEP_FAILED',
  topic: 'ACTION',
  companyId: null,
  subjectType: 'PROCESS',
  subjectId: '9a9a0001-0000-4000-8000-000000000001',
  content: { processId: '9a9a0001-0000-4000-8000-000000000001', stepKey: 'create-wallet' },
  forStaff: true,
  read: false,
  done: false,
  createdAt: '2026-11-06T09:31:00Z',
  doneAt: null,
};

describe('NotificationMapper', () => {
  it('maps a notification of the spec', () => {
    expect(NotificationMapper.toAnemic(SPEC_TASK)).toEqual({
      id: SPEC_TASK.notificationId,
      type: 'PROCESS_STEP_FAILED',
      topic: 'ACTION',
      companyId: null,
      subjectType: 'PROCESS',
      subjectId: SPEC_TASK.subjectId,
      content: SPEC_TASK.content,
      forStaff: true,
      read: false,
      done: false,
      createdAt: '2026-11-06T09:31:00Z',
      doneAt: null,
    });
  });

  it('accepts the stand-in: id instead of notificationId, no forStaff, done only for tasks', () => {
    expect(NotificationMapper.toAnemic(STAND_IN_ITEM)).toMatchObject({
      id: 'c35cbdfd-2436-4f1c-b909-6c40f6d4c496',
      type: 'APPLICATION_SUBMITTED',
      topic: 'INFO',
      forStaff: false,
      done: null,
      companyId: null,
      content: { applicationId: 'd6e6b2fd-6ebb-4bea-a9c1-516962d13d59' },
    });
  });

  it('refuses a notification without any ID', () => {
    const withoutId: Partial<NotificationDto> = { ...SPEC_TASK };
    delete withoutId.notificationId;
    expect(() => NotificationMapper.toAnemic(withoutId as NotificationDto)).toThrow(/notificationId/);
  });

  it('turns the filter into the query of listNotifications', () => {
    expect(NotificationMapper.toQuery({ topic: 'ACTION', done: false, order: 'oldest-first', page: 1, size: 10 })).toEqual({
      topic: 'ACTION',
      type: undefined,
      read: undefined,
      done: false,
      createdSince: undefined,
      sort: 'createdAt.asc',
      page: 1,
      size: 10,
    });
    expect(NotificationMapper.toQuery({}).sort).toBeUndefined();
  });
});
