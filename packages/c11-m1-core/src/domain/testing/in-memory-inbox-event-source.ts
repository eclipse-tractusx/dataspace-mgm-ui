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

import type { InboxEvent, InboxStreamMessage } from '../data/inbox-event.data';
import type { InboxEventSource } from '../repositories/inbox-event-source.port';

/** In-memory adapter of the stream port: tests and mock mode push events with `emit`. */
export class InMemoryInboxEventSource implements InboxEventSource {
  /** The `Last-Event-ID` of every connect, in order. */
  public readonly connects: Array<string | null> = [];
  /** One delivery function per open connection; `null` ends it. */
  private readonly open = new Set<(message: InboxStreamMessage | null) => void>();
  private readonly failures: Error[] = [];
  private nextId = 1;

  /** The next connect throws this error (e.g. a CoreHttpException with 403). */
  public failNextConnect(error: Error): void {
    this.failures.push(error);
  }

  /** Sends an event with a new `id` to every open connection. */
  public emit(event: InboxEvent): void {
    this.deliver({ kind: 'event', id: String(this.nextId++), event });
  }

  public setRetry(milliseconds: number): void {
    this.deliver({ kind: 'retry', milliseconds });
  }

  /** Ends every open connection, as a restart of the module or an expired token does. */
  public drop(): void {
    this.deliver(null);
    this.open.clear();
  }

  public get openConnections(): number {
    return this.open.size;
  }

  public async connect(lastEventId: string | null, signal: AbortSignal): Promise<AsyncIterable<InboxStreamMessage>> {
    this.connects.push(lastEventId);
    const failure = this.failures.shift();
    if (failure) {
      throw failure;
    }
    const queue: Array<InboxStreamMessage | null> = [];
    let wake: () => void = () => undefined;
    const receive = (message: InboxStreamMessage | null) => {
      queue.push(message);
      wake();
    };
    this.open.add(receive);
    signal.addEventListener(
      'abort',
      () => {
        this.open.delete(receive);
        receive(null);
      },
      { once: true },
    );
    async function* messages(): AsyncGenerator<InboxStreamMessage> {
      for (;;) {
        if (queue.length === 0) {
          await new Promise<void>((resolve) => {
            wake = resolve;
          });
          continue;
        }
        const message = queue.shift();
        if (!message) {
          return;
        }
        yield message;
      }
    }
    return messages();
  }

  private deliver(message: InboxStreamMessage | null): void {
    for (const receive of this.open) {
      receive(message);
    }
  }
}
