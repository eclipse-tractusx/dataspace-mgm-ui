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

import { describe, expect, it } from 'vitest';
import { LoginTransactionStore } from './login-transaction.store.ts';

function storeAt(maxTransactions = 10) {
  const clock = { now: 1_000 };
  return { clock, store: new LoginTransactionStore({ ttlMs: 600, maxTransactions, now: () => clock.now }) };
}

describe('login transactions (state, nonce, PKCE verifier)', () => {
  it('creates separate random values for state, nonce and verifier', () => {
    const { store } = storeAt();
    const a = store.create('browser-1', '/a');
    const b = store.create('browser-1', '/b');
    const values = [a.state, a.nonce, a.codeVerifier, b.state, b.nonce, b.codeVerifier];
    expect(new Set(values).size).toBe(6);
    values.forEach((value) => expect(value).toMatch(/^[A-Za-z0-9_-]{43}$/));
  });

  it('hands a transaction out once, to the browser that started it', () => {
    const { store } = storeAt();
    const transaction = store.create('browser-1', '/a');
    expect(store.take(transaction.state, 'browser-1')).toEqual(transaction);
    expect(store.take(transaction.state, 'browser-1')).toBeNull();
  });

  it('refuses an unknown state, another browser and no browser binding; the state is used up by the attempt', () => {
    const { store } = storeAt();
    expect(store.take('unknown', 'browser-1')).toBeNull();
    expect(store.take(null, 'browser-1')).toBeNull();

    const other = store.create('browser-1', '/a');
    expect(store.take(other.state, 'browser-2')).toBeNull();
    expect(store.take(other.state, 'browser-1')).toBeNull();

    const none = store.create('browser-1', '/a');
    expect(store.take(none.state, undefined)).toBeNull();
  });

  it('refuses an expired transaction and sweeps it away', () => {
    const { store, clock } = storeAt();
    const transaction = store.create('browser-1', '/a');
    store.create('browser-1', '/b');
    clock.now += 600;
    expect(store.take(transaction.state, 'browser-1')).toBeNull();
    store.sweep();
    expect(store.size).toBe(0);
  });

  it('keeps the number of waiting sign-ins bounded', () => {
    const { store } = storeAt(2);
    const first = store.create('b', '/1');
    store.create('b', '/2');
    const third = store.create('b', '/3');
    expect(store.size).toBe(2);
    expect(store.take(first.state, 'b')).toBeNull();
    expect(store.take(third.state, 'b')).not.toBeNull();
  });
});
