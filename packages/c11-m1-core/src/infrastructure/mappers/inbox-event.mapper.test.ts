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
import { InboxEventMapper } from './inbox-event.mapper';

describe('InboxEventMapper', () => {
  it('maps notification-created; done only for tasks', () => {
    const task = '{"notificationId":"n1","type":"PROCESS_STEP_FAILED","topic":"ACTION","forStaff":true,"done":false,"createdAt":"t"}';
    expect(InboxEventMapper.toEvent('notification-created', task)).toEqual({
      kind: 'created', notificationId: 'n1', type: 'PROCESS_STEP_FAILED', topic: 'ACTION', forStaff: true, done: false, createdAt: 't',
    });
    // The stand-in sends "done": null for information.
    const info = '{"notificationId":"n2","type":"APPLICATION_SUBMITTED","topic":"INFO","forStaff":false,"done":null,"createdAt":"t"}';
    expect(InboxEventMapper.toEvent('notification-created', info)).toMatchObject({ kind: 'created', done: null });
  });

  it('maps notification-done and resync', () => {
    expect(InboxEventMapper.toEvent('notification-done', '{"notificationId":"n1","doneAt":"t"}')).toEqual({
      kind: 'done', notificationId: 'n1', doneAt: 't',
    });
    expect(InboxEventMapper.toEvent('resync', '{}')).toEqual({ kind: 'resync' });
  });

  it('skips unknown events and broken data', () => {
    expect(InboxEventMapper.toEvent('something-new', '{"notificationId":"n1"}')).toBeNull();
    expect(InboxEventMapper.toEvent('notification-done', 'not json')).toBeNull();
    expect(InboxEventMapper.toEvent('notification-done', '{"doneAt":"t"}')).toBeNull();
  });
});
