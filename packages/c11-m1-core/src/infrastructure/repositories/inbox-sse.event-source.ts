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

import { CoreHttpException, ensureData } from '@dataspace-mgm/core-http';
import type { InboxStreamMessage } from '../../domain/data/inbox-event.data';
import type { InboxEventSource } from '../../domain/repositories/inbox-event-source.port';
import type { C11M1Client } from '../data/c11-m1-infrastructure.data';
import { InboxEventMapper } from '../mappers/inbox-event.mapper';
import { ServerSentEventParser } from '../mappers/server-sent-event.parser';

/**
 * Adapter of the stream port: `GET /notifications/events` with fetch, not EventSource. The browser holds only the
 * session cookie; the BFF opens the stream at C11-M1 with the person's token in the `Authorization` header.
 */
export class InboxSseEventSource implements InboxEventSource {
  constructor(private readonly client: C11M1Client) {}

  public async connect(lastEventId: string | null, signal: AbortSignal): Promise<AsyncIterable<InboxStreamMessage>> {
    const body = await ensureData(
      this.client.GET('/notifications/events', {
        params: { header: lastEventId === null ? {} : { 'Last-Event-ID': lastEventId } },
        headers: { accept: 'text/event-stream' },
        parseAs: 'stream',
        signal,
      }),
    );
    if (!body) {
      throw new CoreHttpException(200, null, 'The inbox stream has no body.');
    }
    return InboxSseEventSource.messages(body, signal);
  }

  private static async *messages(body: ReadableStream<Uint8Array>, signal: AbortSignal): AsyncGenerator<InboxStreamMessage> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    const parser = new ServerSentEventParser();
    const cancel = () => {
      void reader.cancel().catch(() => undefined);
    };
    signal.addEventListener('abort', cancel, { once: true });
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) {
          return;
        }
        for (const message of parser.push(decoder.decode(value, { stream: true }))) {
          if (message.kind === 'retry') {
            yield message;
            continue;
          }
          const event = InboxEventMapper.toEvent(message.event, message.data);
          if (event) {
            yield { kind: 'event', id: message.id, event };
          }
        }
      }
    } finally {
      signal.removeEventListener('abort', cancel);
      cancel();
    }
  }
}
