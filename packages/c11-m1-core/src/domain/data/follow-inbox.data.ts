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
import type { InboxEvent } from './inbox-event.data';

export interface InboxListener {
  /** Every change of the own inbox; `resync` means "read the list and the counters now". */
  onEvent(event: InboxEvent): void;
  /** The connection broke (network, 5xx, end of stream); the use case reconnects by itself. */
  onConnectionLost?(error: CoreHttpErrorData): void;
}

/**
 * How following the inbox ended: `closed` after the signal aborted; `stopped` after an answer that a reconnect does not
 * fix (401, 403, other 4xx). A 401 has also triggered the sign-in through the client's `onUnauthorized`.
 */
export type FollowInboxEnd = { status: 'closed' } | { status: 'stopped'; error: CoreHttpErrorData };

/** Waits before a reconnect; returns early when the signal aborts. Injected so tests do not wait. */
export type Delay = (milliseconds: number, signal: AbortSignal) => Promise<void>;
