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

import type { NotificationCountAnemic } from '../../domain/anemics/notification-count.anemic';
import type { NotificationAnemic } from '../../domain/anemics/notification.anemic';
import type { NotificationFilter, NotificationPage } from '../../domain/data/notification-filter.data';
import type {
  NotificationCountDto,
  NotificationDto,
  NotificationPageDto,
  NotificationsQueryDto,
} from '../data/c11-m1-infrastructure.data';

/** C11-M1 DTOs ↔ the anemics of the UI. */
export class NotificationMapper {
  public static toAnemic(dto: NotificationDto): NotificationAnemic {
    // The C11-M1 stand-in of the backend (as of 6 Nov 2026) sends `id` instead of `notificationId` and leaves out
    // `forStaff`. Both are accepted until the stand-in follows the spec; then remove `id` here and in the test.
    const wire = dto as Partial<NotificationDto> & Pick<NotificationDto, 'type' | 'topic' | 'read' | 'createdAt'> & { id?: string };
    const id = wire.notificationId ?? wire.id;
    if (id === undefined) {
      throw new Error('C11-M1 sent a notification without notificationId.');
    }
    return {
      id,
      type: wire.type,
      topic: wire.topic,
      companyId: wire.companyId ?? null,
      subjectType: wire.subjectType ?? null,
      subjectId: wire.subjectId ?? null,
      content: wire.content ?? {},
      forStaff: wire.forStaff ?? false,
      read: wire.read,
      done: wire.topic === 'ACTION' ? (wire.done ?? false) : null,
      createdAt: wire.createdAt,
      doneAt: wire.doneAt ?? null,
    };
  }

  public static toPage(dto: NotificationPageDto): NotificationPage {
    return {
      items: dto.items.map((item) => NotificationMapper.toAnemic(item)),
      page: dto.page,
      size: dto.size,
      total: dto.total,
    };
  }

  public static toCount(dto: NotificationCountDto): NotificationCountAnemic {
    return { total: dto.total, unread: dto.unread, openTasks: dto.openTasks, unreadInfo: dto.unreadInfo };
  }

  public static toQuery(filter: NotificationFilter): NotificationsQueryDto {
    return {
      topic: filter.topic,
      type: filter.type,
      read: filter.read,
      done: filter.done,
      createdSince: filter.createdSince,
      sort: filter.order === 'oldest-first' ? 'createdAt.asc' : filter.order === 'newest-first' ? 'createdAt.desc' : undefined,
      page: filter.page,
      size: filter.size,
    };
  }
}
