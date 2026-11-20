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

import { createHash } from 'node:crypto';
import type { Session, SessionSeed, SessionStoreOptions } from '../data/session.data.ts';
import { isOpaqueToken } from '../http/cookies.ts';
import { randomToken } from '../oidc/pkce.ts';

/**
 * The sessions of the signed-in persons, with their tokens.
 *
 * MINIMAL: kept in the memory of this process. Limits: one replica only (a second replica does not know the session),
 * and every restart or deployment signs everybody out. Upgrade path: put the same five operations (create, find,
 * destroy, track, sweep) on a shared store with expiry, for example Redis or PostgreSQL, with the tokens encrypted at
 * rest; until then run one replica, or pin a browser to its replica at the ingress.
 */
export class SessionStore {
  private readonly options: SessionStoreOptions;
  private readonly sessions = new Map<string, Session>();
  private readonly closers = new Map<string, Set<() => void>>();

  constructor(options: SessionStoreOptions) {
    this.options = options;
  }

  public get size(): number {
    return this.sessions.size;
  }

  /** A new session with a new random id. Returns the id once, for the cookie; the store keeps only its hash. */
  public create(seed: SessionSeed): { id: string; session: Session } {
    if (this.sessions.size >= this.options.maxSessions) {
      this.sweep();
    }
    if (this.sessions.size >= this.options.maxSessions) {
      // Still full: the oldest session makes room, so the memory stays bounded.
      const oldest = this.sessions.keys().next().value;
      if (oldest !== undefined) {
        this.destroy(oldest);
      }
    }
    const id = randomToken();
    const now = this.options.now();
    const session: Session = {
      ...seed,
      key: SessionStore.keyOf(id),
      csrfToken: randomToken(),
      createdAt: now,
      lastSeenAt: now,
      refreshing: null,
    };
    this.sessions.set(session.key, session);
    return { id, session };
  }

  /**
   * The session of a cookie value, or null when there is none, when it was idle for too long or when it reached its
   * absolute lifetime. A found session counts as used now.
   */
  public find(id: string | undefined): Session | null {
    if (!isOpaqueToken(id)) {
      return null;
    }
    const session = this.sessions.get(SessionStore.keyOf(id));
    if (!session) {
      return null;
    }
    if (this.isExpired(session)) {
      this.destroy(session.key);
      return null;
    }
    session.lastSeenAt = this.options.now();
    return session;
  }

  public isAlive(session: Session): boolean {
    return this.sessions.get(session.key) === session;
  }

  /** Ends a session and closes what is still streaming for it (Server-Sent Events). */
  public destroy(key: string): void {
    this.sessions.delete(key);
    const closers = this.closers.get(key);
    this.closers.delete(key);
    closers?.forEach((close) => close());
  }

  /** Registers a running response of the session; `close` is called when the session ends. Returns the unregister. */
  public track(session: Session, close: () => void): () => void {
    const closers = this.closers.get(session.key) ?? new Set();
    this.closers.set(session.key, closers);
    closers.add(close);
    return () => {
      closers.delete(close);
      if (closers.size === 0 && this.closers.get(session.key) === closers) {
        this.closers.delete(session.key);
      }
    };
  }

  /** Removes the sessions that have expired. */
  public sweep(): void {
    for (const session of [...this.sessions.values()]) {
      if (this.isExpired(session)) {
        this.destroy(session.key);
      }
    }
  }

  private isExpired(session: Session): boolean {
    const now = this.options.now();
    return now - session.lastSeenAt >= this.options.idleMs || now - session.createdAt >= this.options.maxMs;
  }

  private static keyOf(id: string): string {
    return createHash('sha256').update(id).digest('hex');
  }
}
