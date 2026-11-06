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

import type { CoreHttpErrorData } from '@dataspace-mgm/core-http';
import type { NotificationCountAnemic } from '../anemics/notification-count.anemic';
import type { NotificationAnemic } from '../anemics/notification.anemic';
import type { NotificationPage } from './notification-filter.data';

/** Any call that did not get an expected answer: HTTP status and Problem Details type, e.g. 501 until C11-M1 has it. */
export interface NotificationsFailed {
  status: 'failed';
  error: CoreHttpErrorData;
}

export type ListNotificationsResult = { status: 'found'; page: NotificationPage } | NotificationsFailed;

export type CountNotificationsResult = { status: 'found'; count: NotificationCountAnemic } | NotificationsFailed;

/** `not-found`: not in the own inbox (404). */
export type GetNotificationResult =
  | { status: 'found'; notification: NotificationAnemic }
  | { status: 'not-found' }
  | NotificationsFailed;

/** `task-open`: an open task cannot be hidden (409 `urn:c11-m1:problem:task-open`). */
export type ChangeNotificationResult =
  | { status: 'changed' }
  | { status: 'not-found' }
  | { status: 'task-open' }
  | NotificationsFailed;
