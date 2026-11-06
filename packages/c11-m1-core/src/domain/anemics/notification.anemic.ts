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

export type NotificationTopic = 'INFO' | 'ACTION';

/** One entry of the person's inbox (C11-M1 `Notification`). The UI renders the text from `type` and `content`. */
export type NotificationAnemic = Readonly<{
  id: string;
  /** README 6.2, e.g. `APPLICATION_SUBMITTED`; the i18n key of the text. */
  type: string;
  /** `INFO` (information) or `ACTION` (task). */
  topic: NotificationTopic;
  companyId: string | null;
  subjectType: string | null;
  subjectId: string | null;
  /** IDs and business values of the event that created it; never names. */
  content: Readonly<Record<string, unknown>>;
  /** Addressed to a permission (all OSP staff with it), not to the person. */
  forStaff: boolean;
  read: boolean;
  /** Tasks only: closed by the matching event. Always null for `INFO`. */
  done: boolean | null;
  createdAt: string;
  doneAt: string | null;
}>;
