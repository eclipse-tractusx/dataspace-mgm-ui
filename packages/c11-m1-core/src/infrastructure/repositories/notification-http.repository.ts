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

import { CoreHttpException, HTTP, ensureData, ensureOk, type CoreResponse } from '@dataspace-mgm/core-http';
import type { NotificationCountAnemic } from '../../domain/anemics/notification-count.anemic';
import type { NotificationAnemic } from '../../domain/anemics/notification.anemic';
import type { NotificationChangeOutcome } from '../../domain/data/notification-change.data';
import type { NotificationFilter, NotificationPage } from '../../domain/data/notification-filter.data';
import type { NotificationRepository } from '../../domain/repositories/notification.repository';
import { C11M1_PROBLEM } from '../constants/c11-m1-problem.constant';
import type { C11M1Client } from '../data/c11-m1-infrastructure.data';
import { NotificationMapper } from '../mappers/notification.mapper';

/** Adapter of the port over HTTP: the generated client checks paths, parameters and responses against openapi.yaml. */
export class NotificationHttpRepository implements NotificationRepository {
  constructor(private readonly client: C11M1Client) {}

  public async list(filter: NotificationFilter): Promise<NotificationPage> {
    const dto = await ensureData(this.client.GET('/notifications', { params: { query: NotificationMapper.toQuery(filter) } }));
    return NotificationMapper.toPage(dto);
  }

  public async count(): Promise<NotificationCountAnemic> {
    return NotificationMapper.toCount(await ensureData(this.client.GET('/notifications/count')));
  }

  public async get(notificationId: string): Promise<NotificationAnemic | null> {
    try {
      const dto = await ensureData(this.client.GET('/notifications/{notificationId}', { params: { path: { notificationId } } }));
      return NotificationMapper.toAnemic(dto);
    } catch (error) {
      if (error instanceof CoreHttpException && error.status === HTTP.NOT_FOUND) {
        return null;
      }
      throw error;
    }
  }

  public markRead(notificationId: string): Promise<NotificationChangeOutcome> {
    return NotificationHttpRepository.change(
      this.client.POST('/notifications/{notificationId}/read', { params: { path: { notificationId } } }),
    );
  }

  public markUnread(notificationId: string): Promise<NotificationChangeOutcome> {
    return NotificationHttpRepository.change(
      this.client.POST('/notifications/{notificationId}/unread', { params: { path: { notificationId } } }),
    );
  }

  public hide(notificationId: string): Promise<NotificationChangeOutcome> {
    return NotificationHttpRepository.change(
      this.client.POST('/notifications/{notificationId}/hide', { params: { path: { notificationId } } }),
    );
  }

  private static async change(call: Promise<CoreResponse<unknown>>): Promise<NotificationChangeOutcome> {
    try {
      await ensureOk(call);
      return 'changed';
    } catch (error) {
      if (error instanceof CoreHttpException && error.status === HTTP.NOT_FOUND) {
        return 'not-found';
      }
      if (error instanceof CoreHttpException && error.status === C11M1_PROBLEM.CONFLICT_STATUS && error.problemType === C11M1_PROBLEM.TASK_OPEN) {
        return 'task-open';
      }
      throw error;
    }
  }
}
