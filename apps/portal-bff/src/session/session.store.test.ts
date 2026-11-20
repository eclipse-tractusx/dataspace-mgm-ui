/********************************************************************************
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
 * Assisted-By: Claude Code (claude-fable-5-2)
 ********************************************************************************/

import { describe, expect, it, vi } from 'vitest';
import { SessionStore } from './session.store.ts';

const seed = { subject: 's', username: null, accessToken: 'at', claims: {}, accessTokenExpiresAt: 0, refreshToken: 'rt' };

function storeAt(start = 1_000, maxSessions = 10) {
  const clock = { now: start };
  return { clock, store: new SessionStore({ idleMs: 1_000, maxMs: 5_000, maxSessions, now: () => clock.now }) };
}

describe('session store', () => {
  it('creates a session with a random 256-bit id and its own CSRF token, and finds it by the id only', () => {
    const { store } = storeAt();
    const a = store.create(seed);
    const b = store.create(seed);
    expect(a.id).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(a.id).not.toBe(b.id);
    expect(a.session.csrfToken).not.toBe(b.session.csrfToken);
    expect(a.session.key).not.toContain(a.id);
    expect(store.find(a.id)).toBe(a.session);

    const tampered = `${a.id.slice(0, -1)}${a.id.endsWith('A') ? 'B' : 'A'}`;
    for (const wrong of [tampered, a.session.key, '', undefined, `${a.id}x`, '../../etc/passwd']) {
      expect(store.find(wrong)).toBeNull();
    }
  });

  it('ends a session that was idle for too long; using it keeps it alive', () => {
    const { store, clock } = storeAt();
    const { id } = store.create(seed);
    clock.now += 900;
    expect(store.find(id)).not.toBeNull();
    clock.now += 900;
    expect(store.find(id)).not.toBeNull();
    clock.now += 1_000;
    expect(store.find(id)).toBeNull();
    expect(store.size).toBe(0);
  });

  it('ends a session at its absolute lifetime even when it is in use', () => {
    const { store, clock } = storeAt();
    const { id } = store.create(seed);
    for (let step = 0; step < 5; step++) {
      clock.now += 999;
      expect(store.find(id)).not.toBeNull();
    }
    clock.now += 999;
    expect(store.find(id)).toBeNull();
  });

  it('closes the open streams of a session when it ends, by destroy or by the sweep', () => {
    const { store, clock } = storeAt();
    const first = store.create(seed);
    const second = store.create(seed);
    const closeFirst = vi.fn();
    const closeSecond = vi.fn();
    const closeGone = vi.fn();
    store.track(first.session, closeFirst);
    store.track(second.session, closeSecond);
    store.track(second.session, closeGone)();

    store.destroy(first.session.key);
    expect(closeFirst).toHaveBeenCalledOnce();
    expect(store.isAlive(first.session)).toBe(false);
    expect(store.find(first.id)).toBeNull();

    clock.now += 1_000;
    store.sweep();
    expect(closeSecond).toHaveBeenCalledOnce();
    expect(closeGone).not.toHaveBeenCalled();
    expect(store.size).toBe(0);
  });

  it('keeps the number of sessions bounded: the oldest makes room', () => {
    const { store } = storeAt(1_000, 2);
    const first = store.create(seed);
    const second = store.create(seed);
    const third = store.create(seed);
    expect(store.size).toBe(2);
    expect(store.find(first.id)).toBeNull();
    expect(store.find(second.id)).not.toBeNull();
    expect(store.find(third.id)).not.toBeNull();
  });
});
