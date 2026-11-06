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
import type { Delay, FollowInboxEnd, InboxListener } from '../../domain/data/follow-inbox.data';
import type { InboxEventSource } from '../../domain/repositories/inbox-event-source.port';

/** README 7.6: the first message of a stream sets `retry: 3000`; the same until the server says otherwise. */
export const DEFAULT_RETRY_MILLISECONDS = 3000;

/** The default Delay: setTimeout, cut short when the signal aborts. */
export const abortableDelay: Delay = (milliseconds, signal) =>
  new Promise((resolve) => {
    const timer = setTimeout(resolve, milliseconds);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });

const isClientError = (status: number | null): boolean => status !== null && status >= 400 && status < 500;

/**
 * "Keep my inbox up to date" (C11-M1 `streamNotificationEvents`, README 7.6), until `signal` aborts.
 *
 * - Opens the stream **before** the caller reads the list: once it is open without a `Last-Event-ID` (first time, or
 *   no event had an `id` yet), it sends `resync`, and the caller reads the list and the counters then. Nothing is missed.
 * - Reconnects after a broken connection, after the `retry` delay of the server, with the `id` of the last event, so
 *   the module replays what was missed (or sends `resync` itself if it can no longer).
 * - Stops on 4xx: a reconnect does not fix a missing permission; a 401 has already started the sign-in.
 */
export class FollowInboxUseCase {
  constructor(
    private readonly source: InboxEventSource,
    private readonly delay: Delay = abortableDelay,
  ) {}

  public async execute(listener: InboxListener, signal: AbortSignal): Promise<FollowInboxEnd> {
    let lastEventId: string | null = null;
    let retryMilliseconds = DEFAULT_RETRY_MILLISECONDS;
    while (!signal.aborted) {
      try {
        const messages = await this.source.connect(lastEventId, signal);
        if (lastEventId === null) {
          listener.onEvent({ kind: 'resync' });
        }
        for await (const message of messages) {
          if (message.kind === 'retry') {
            retryMilliseconds = message.milliseconds;
            continue;
          }
          if (message.id !== null) {
            lastEventId = message.id;
          }
          listener.onEvent(message.event);
        }
        if (!signal.aborted) {
          listener.onConnectionLost?.({ status: null, problemType: null, message: 'The inbox stream ended.' });
        }
      } catch (error) {
        if (signal.aborted) {
          break;
        }
        const failure = CoreHttpErrorFactory.from(error);
        if (isClientError(failure.status)) {
          return { status: 'stopped', error: failure };
        }
        listener.onConnectionLost?.(failure);
      }
      if (!signal.aborted) {
        await this.delay(retryMilliseconds, signal);
      }
    }
    return { status: 'closed' };
  }
}
