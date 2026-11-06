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

import type { InboxEvent } from '../../domain/data/inbox-event.data';
import { INBOX_STREAM_EVENT } from '../constants/c11-m1-problem.constant';
import type { NotificationCreatedDto, NotificationDoneDto } from '../data/c11-m1-infrastructure.data';

const parse = (data: string): unknown => {
  try {
    return JSON.parse(data) as unknown;
  } catch {
    return null;
  }
};

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

/** A stream message (event name + `data`) → an inbox event. Unknown names and broken `data` give null and are skipped. */
export class InboxEventMapper {
  public static toEvent(event: string, data: string): InboxEvent | null {
    if (event === INBOX_STREAM_EVENT.RESYNC) {
      return { kind: 'resync' };
    }
    const payload = parse(data);
    if (!isObject(payload) || typeof payload.notificationId !== 'string') {
      return null;
    }
    if (event === INBOX_STREAM_EVENT.CREATED) {
      const dto = payload as NotificationCreatedDto;
      return {
        kind: 'created',
        notificationId: dto.notificationId,
        type: dto.type,
        topic: dto.topic,
        forStaff: dto.forStaff,
        done: dto.topic === 'ACTION' ? (dto.done ?? false) : null,
        createdAt: dto.createdAt,
      };
    }
    if (event === INBOX_STREAM_EVENT.DONE) {
      const dto = payload as NotificationDoneDto;
      return { kind: 'done', notificationId: dto.notificationId, doneAt: dto.doneAt };
    }
    return null;
  }
}
