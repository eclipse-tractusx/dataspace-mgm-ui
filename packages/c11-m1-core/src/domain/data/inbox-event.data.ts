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

import type { NotificationTopic } from '../anemics/notification.anemic';

/** `notification-created`: a notification arrived in the own inbox. No content: read it by ID when needed. */
export interface InboxNotificationCreated {
  kind: 'created';
  notificationId: string;
  type: string;
  topic: NotificationTopic;
  forStaff: boolean;
  done: boolean | null;
  createdAt: string;
}

/** `notification-done`: a task of the own inbox was closed. */
export interface InboxNotificationDone {
  kind: 'done';
  notificationId: string;
  doneAt: string;
}

/** The view may have missed changes: read the list and the counters again. Also sent once the stream is open. */
export interface InboxResync {
  kind: 'resync';
}

export type InboxEvent = InboxNotificationCreated | InboxNotificationDone | InboxResync;

/** One message of the stream as the port delivers it: an event with its `id`, or a new reconnect delay. */
export type InboxStreamMessage =
  | { kind: 'event'; id: string | null; event: InboxEvent }
  | { kind: 'retry'; milliseconds: number };
