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

import { createCoreClient } from '@dataspace-mgm/core-http';
import { describe, expect, it } from 'vitest';
import type { InboxStreamMessage } from '../../domain/data/inbox-event.data';
import type { paths } from '../../generated/c11-m1-api';
import { InboxSseEventSource } from './inbox-sse.event-source';

const encoder = new TextEncoder();

/** A response whose body sends the given chunks and then ends. */
function streamOf(chunks: ReadonlyArray<string>): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
}

function sourceAnswering(response: () => Response) {
  const requests: Request[] = [];
  const fetchImpl = async (request: Request) => {
    requests.push(request);
    return response();
  };
  const client = createCoreClient<paths>({ baseUrl: 'http://ui.test/api/c11-m1', fetch: fetchImpl as unknown as typeof fetch });
  return { source: new InboxSseEventSource(client), requests };
}

async function collect(messages: AsyncIterable<InboxStreamMessage>): Promise<InboxStreamMessage[]> {
  const all: InboxStreamMessage[] = [];
  for await (const message of messages) {
    all.push(message);
  }
  return all;
}

describe('InboxSseEventSource', () => {
  it('opens GET /notifications/events with Last-Event-ID and turns the stream into inbox events', async () => {
    const body = streamOf([
      'retry: 3000\n\n',
      'id: 7\nevent: notification-created\ndata: {"notificationId":"n1","type":"PROCESS_STEP_FAILED",',
      '"topic":"ACTION","forStaff":true,"done":false,"createdAt":"t"}\n\n: keep-alive\n\n',
      'id: 8\nevent: notification-done\ndata: {"notificationId":"n1","doneAt":"t2"}\n\n',
      'id: 9\nevent: unknown\ndata: {}\n\n',
    ]);
    const { source, requests } = sourceAnswering(
      () => new Response(body, { status: 200, headers: { 'content-type': 'text/event-stream' } }),
    );
    const messages = await collect(await source.connect('6', new AbortController().signal));
    expect(messages).toEqual([
      { kind: 'retry', milliseconds: 3000 },
      { kind: 'event', id: '7', event: { kind: 'created', notificationId: 'n1', type: 'PROCESS_STEP_FAILED', topic: 'ACTION', forStaff: true, done: false, createdAt: 't' } },
      { kind: 'event', id: '8', event: { kind: 'done', notificationId: 'n1', doneAt: 't2' } },
    ]);
    expect(new URL(requests[0].url).pathname).toBe('/api/c11-m1/notifications/events');
    expect(requests[0].headers.get('Last-Event-ID')).toBe('6');
    expect(requests[0].headers.get('accept')).toBe('text/event-stream');
    expect(requests[0].headers.get('authorization')).toBeNull();
  });

  it('sends no Last-Event-ID on the first connect', async () => {
    const { source, requests } = sourceAnswering(() => new Response(streamOf([]), { status: 200 }));
    await collect(await source.connect(null, new AbortController().signal));
    expect(requests[0].headers.has('Last-Event-ID')).toBe(false);
  });

  it('throws when the module refuses the stream', async () => {
    const { source } = sourceAnswering(
      () => new Response(JSON.stringify({ type: 'urn:c11-m1:problem:forbidden', title: 'forbidden', status: 403 }), {
        status: 403,
        headers: { 'content-type': 'application/problem+json' },
      }),
    );
    await expect(source.connect(null, new AbortController().signal)).rejects.toMatchObject({ status: 403 });
  });

  it('ends the messages when the signal aborts, also while the server sends nothing', async () => {
    const open = new ReadableStream<Uint8Array>({ start: () => undefined });
    const { source } = sourceAnswering(() => new Response(open, { status: 200 }));
    const abort = new AbortController();
    const messages = collect(await source.connect(null, abort.signal));
    abort.abort();
    await expect(messages).resolves.toEqual([]);
  });
});
