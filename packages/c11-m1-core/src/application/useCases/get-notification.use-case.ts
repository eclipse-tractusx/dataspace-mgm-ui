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

import { CoreHttpErrorFactory } from '@dataspace-mgm/core-http';
import type { GetNotificationResult } from '../../domain/data/notification-results.data';
import type { NotificationRepository } from '../../domain/repositories/notification.repository';

/** One own notification with its content, e.g. after `notification-created` (C11-M1 `getNotification`, README 7.3). */
export class GetNotificationUseCase {
  constructor(private readonly notifications: NotificationRepository) {}

  public async execute(notificationId: string): Promise<GetNotificationResult> {
    try {
      const notification = await this.notifications.get(notificationId);
      return notification ? { status: 'found', notification } : { status: 'not-found' };
    } catch (error) {
      return { status: 'failed', error: CoreHttpErrorFactory.from(error) };
    }
  }
}
