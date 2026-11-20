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

import type { LoginTransaction, LoginTransactionStoreOptions } from '../data/session.data.ts';
import { safeEqual } from '../http/csrf.ts';
import { randomToken } from '../oidc/pkce.ts';

/**
 * The sign-ins that wait for their callback: `state`, `nonce` and the PKCE verifier of each.
 *
 * MINIMAL: kept in the memory of this process, like the sessions (session.store.ts): one replica, and a sign-in that
 * is under way during a restart has to be started again. Upgrade path: the same shared store as the sessions.
 */
export class LoginTransactionStore {
  private readonly options: LoginTransactionStoreOptions;
  private readonly transactions = new Map<string, LoginTransaction>();

  constructor(options: LoginTransactionStoreOptions) {
    this.options = options;
  }

  public get size(): number {
    return this.transactions.size;
  }

  /** Starts a sign-in for the browser that holds `binding` in its login cookie. */
  public create(binding: string, returnTo: string): LoginTransaction {
    if (this.transactions.size >= this.options.maxTransactions) {
      this.sweep();
    }
    if (this.transactions.size >= this.options.maxTransactions) {
      // Anybody can start a sign-in: the oldest one makes room, so the memory stays bounded.
      const oldest = this.transactions.keys().next().value;
      if (oldest !== undefined) {
        this.transactions.delete(oldest);
      }
    }
    const transaction: LoginTransaction = {
      state: randomToken(),
      nonce: randomToken(),
      codeVerifier: randomToken(),
      binding,
      returnTo,
      expiresAt: this.options.now() + this.options.ttlMs,
    };
    this.transactions.set(transaction.state, transaction);
    return transaction;
  }

  /**
   * The sign-in a callback belongs to, or null: unknown or expired `state`, or a browser other than the one that
   * started it. A `state` works once: it is removed here whatever the outcome, so a callback cannot be replayed.
   */
  public take(state: string | null, binding: string | undefined): LoginTransaction | null {
    if (!state) {
      return null;
    }
    const transaction = this.transactions.get(state);
    if (!transaction) {
      return null;
    }
    this.transactions.delete(state);
    if (transaction.expiresAt <= this.options.now() || !binding || !safeEqual(binding, transaction.binding)) {
      return null;
    }
    return transaction;
  }

  public sweep(): void {
    const now = this.options.now();
    for (const [state, transaction] of this.transactions) {
      if (transaction.expiresAt <= now) {
        this.transactions.delete(state);
      }
    }
  }
}
