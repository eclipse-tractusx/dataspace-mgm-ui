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

import type { BffConfig } from './bff-config.data.ts';
import type { LoginTransactionStore } from '../session/login-transaction.store.ts';
import type { SessionStore } from '../session/session.store.ts';
import type { OidcClient } from '../oidc/oidc.client.ts';

export type LogLevel = 'info' | 'warn' | 'error';

/** One line per event. Fields are fixed words and numbers, never tokens, codes, cookies or secrets. */
export type Log = (level: LogLevel, event: string, fields?: Record<string, string | number | boolean | null>) => void;

/** What a test may replace. */
export interface BffOptions {
  now?: () => number;
  fetch?: typeof fetch;
  log?: Log;
  upstreamTimeoutMs?: number;
}

/** Everything a route needs. */
export interface BffContext {
  config: BffConfig;
  sessions: SessionStore;
  transactions: LoginTransactionStore;
  oidc: OidcClient;
  log: Log;
  now: () => number;
  sessionCookie: string;
  loginCookie: string;
  upstreamTimeoutMs: number;
  /** Real path of the static directory. */
  staticRoot: string;
}

export interface Bff {
  handler: (req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse) => void;
  context: BffContext;
  close: () => void;
}
