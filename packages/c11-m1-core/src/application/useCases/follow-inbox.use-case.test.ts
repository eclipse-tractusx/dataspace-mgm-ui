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

import { CoreHttpException } from '@dataspace-mgm/core-http';
import { describe, expect, it } from 'vitest';
import type { InboxEvent } from '../../domain/data/inbox-event.data';
import { InMemoryInboxEventSource } from '../../domain/testing/in-memory-inbox-event-source';
import type { Delay } from '../../domain/data/follow-inbox.data';
import { abortableDelay, FollowInboxUseCase } from './follow-inbox.use-case';

/** Lets the event loop run until `condition` holds. */
async function until(condition: () => boolean): Promise<void> {
  for (let i = 0; i < 200 && !condition(); i += 1) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  expect(condition()).toBe(true);
}

function follow(source: InMemoryInboxEventSource) {
  const events: InboxEvent[] = [];
  const lost: Array<number | null> = [];
  const delays: number[] = [];
  const delay: Delay = async (milliseconds) => {
    delays.push(milliseconds);
  };
  const abort = new AbortController();
  const end = new FollowInboxUseCase(source, delay).execute(
    { onEvent: (event) => events.push(event), onConnectionLost: (error) => lost.push(error.status) },
    abort.signal,
  );
  return { events, lost, delays, abort, end };
}

const CREATED: InboxEvent = {
  kind: 'created', notificationId: 'n1', type: 'PROCESS_STEP_FAILED', topic: 'ACTION', forStaff: true, done: false, createdAt: 't',
};

describe('FollowInboxUseCase', () => {
  it('says resync once the stream is open, so the caller reads the list only then', async () => {
    const source = new InMemoryInboxEventSource();
    const { events, abort, end } = follow(source);
    await until(() => source.openConnections === 1);
    expect(events).toEqual([{ kind: 'resync' }]);
    expect(source.connects).toEqual([null]);
    abort.abort();
    expect(await end).toEqual({ status: 'closed' });
  });

  it('passes on created and done', async () => {
    const source = new InMemoryInboxEventSource();
    const { events, abort } = follow(source);
    await until(() => source.openConnections === 1);
    source.emit(CREATED);
    source.emit({ kind: 'done', notificationId: 'n1', doneAt: 't2' });
    await until(() => events.length === 3);
    expect(events.slice(1)).toEqual([CREATED, { kind: 'done', notificationId: 'n1', doneAt: 't2' }]);
    abort.abort();
  });

  it('reconnects after the server delay with the id of the last event, without its own resync', async () => {
    const source = new InMemoryInboxEventSource();
    const { events, lost, delays, abort } = follow(source);
    await until(() => source.openConnections === 1);
    source.setRetry(5000);
    source.emit(CREATED);
    await until(() => events.length === 2);
    source.drop();
    await until(() => source.connects.length === 2 && source.openConnections === 1);
    expect(source.connects).toEqual([null, '1']);
    expect(delays).toEqual([5000]);
    expect(lost).toEqual([null]);
    expect(events.filter((event) => event.kind === 'resync')).toHaveLength(1);
    abort.abort();
  });

  it('retries after a network error or 5xx', async () => {
    const source = new InMemoryInboxEventSource();
    source.failNextConnect(new CoreHttpException(502, null, 'bad gateway'));
    const { events, lost, delays, abort } = follow(source);
    await until(() => source.openConnections === 1);
    expect(lost).toEqual([502]);
    expect(delays).toEqual([3000]);
    expect(events).toEqual([{ kind: 'resync' }]);
    abort.abort();
  });

  it('stops on 401 and 403: a reconnect does not fix them', async () => {
    const source = new InMemoryInboxEventSource();
    source.failNextConnect(new CoreHttpException(403, 'urn:c11-m1:problem:forbidden', 'forbidden'));
    const { events, end } = follow(source);
    expect(await end).toEqual({
      status: 'stopped',
      error: { status: 403, problemType: 'urn:c11-m1:problem:forbidden', message: 'forbidden' },
    });
    expect(events).toEqual([]);
    expect(source.connects).toEqual([null]);
  });
});

describe('FollowInboxUseCase, ending', () => {
  it('ends as closed when the signal aborts while a connect fails', async () => {
    const abort = new AbortController();
    const failing = {
      connect: async () => {
        abort.abort();
        throw new Error('aborted');
      },
    };
    expect(await new FollowInboxUseCase(failing).execute({ onEvent: () => undefined }, abort.signal)).toEqual({ status: 'closed' });
  });
});

describe('abortableDelay', () => {
  it('waits for the time', async () => {
    const start = Date.now();
    await abortableDelay(20, new AbortController().signal);
    expect(Date.now() - start).toBeGreaterThanOrEqual(15);
  });

  it('returns early when the signal aborts', async () => {
    const abort = new AbortController();
    const start = Date.now();
    const waiting = abortableDelay(60_000, abort.signal);
    abort.abort();
    await waiting;
    expect(Date.now() - start).toBeLessThan(1000);
  });
});
