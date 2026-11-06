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

import { createCoreClient, type CoreModuleConfig } from '@dataspace-mgm/core-http';
import { CountNotificationsUseCase } from './application/useCases/count-notifications.use-case';
import { FollowInboxUseCase } from './application/useCases/follow-inbox.use-case';
import { GetNotificationUseCase } from './application/useCases/get-notification.use-case';
import { HideNotificationUseCase } from './application/useCases/hide-notification.use-case';
import { ListNotificationsUseCase } from './application/useCases/list-notifications.use-case';
import { MarkNotificationReadUseCase } from './application/useCases/mark-notification-read.use-case';
import { MarkNotificationUnreadUseCase } from './application/useCases/mark-notification-unread.use-case';
import type { C11M1Module } from './data/c11-m1-module.data';
import type { InboxEventSource } from './domain/repositories/inbox-event-source.port';
import type { NotificationRepository } from './domain/repositories/notification.repository';
import type { paths } from './generated/c11-m1-api';
import { InboxSseEventSource } from './infrastructure/repositories/inbox-sse.event-source';
import { NotificationHttpRepository } from './infrastructure/repositories/notification-http.repository';

/** The base path of the module under the app's api_base_url (`servers.url` of specs/c11-m1/openapi.yaml). */
export const C11M1_BASE_PATH = '/c11-m1';

/** Builds the use cases on any adapters: the HTTP ones in the app, the in-memory ones in tests and mock mode. */
export function createC11M1ModuleFrom(notifications: NotificationRepository, events: InboxEventSource): C11M1Module {
  return {
    listNotifications: new ListNotificationsUseCase(notifications),
    countNotifications: new CountNotificationsUseCase(notifications),
    getNotification: new GetNotificationUseCase(notifications),
    markNotificationRead: new MarkNotificationReadUseCase(notifications),
    markNotificationUnread: new MarkNotificationUnreadUseCase(notifications),
    hideNotification: new HideNotificationUseCase(notifications),
    followInbox: new FollowInboxUseCase(events),
  };
}

/** Creates the module once per app (composition root); `config.baseUrl` is the module's base URL. */
export function createC11M1Module(config: CoreModuleConfig): C11M1Module {
  const client = createCoreClient<paths>(config);
  return createC11M1ModuleFrom(new NotificationHttpRepository(client), new InboxSseEventSource(client));
}

export type { C11M1Module } from './data/c11-m1-module.data';
export type { NotificationAnemic, NotificationTopic } from './domain/anemics/notification.anemic';
export type { NotificationCountAnemic } from './domain/anemics/notification-count.anemic';
export type { Delay, FollowInboxEnd, InboxListener } from './domain/data/follow-inbox.data';
export type {
  InboxEvent,
  InboxNotificationCreated,
  InboxNotificationDone,
  InboxResync,
  InboxStreamMessage,
} from './domain/data/inbox-event.data';
export type { NotificationChangeOutcome } from './domain/data/notification-change.data';
export type { NotificationFilter, NotificationPage } from './domain/data/notification-filter.data';
export type {
  ChangeNotificationResult,
  CountNotificationsResult,
  GetNotificationResult,
  ListNotificationsResult,
  NotificationsFailed,
} from './domain/data/notification-results.data';
export type { InboxEventSource } from './domain/repositories/inbox-event-source.port';
export type { NotificationRepository } from './domain/repositories/notification.repository';
export { DEFAULT_RETRY_MILLISECONDS, FollowInboxUseCase } from './application/useCases/follow-inbox.use-case';
