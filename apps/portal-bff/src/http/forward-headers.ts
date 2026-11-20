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

import type { IncomingHttpHeaders, OutgoingHttpHeaders } from 'node:http';

/** Headers that belong to one connection and are never forwarded (RFC 9110 7.6.1). */
const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'proxy-connection',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

/**
 * Not forwarded to the backend: the session cookie and the CSRF token stay at the BFF, `Authorization` is set by the
 * BFF, and what a client claims about its address or the public host is not passed on as if a proxy had said it.
 */
const NOT_TO_BACKEND = new Set(['cookie', 'authorization', 'x-csrf-token', 'host', 'expect', 'forwarded', 'x-real-ip']);

/** Not forwarded to the browser: the backend must not set cookies on the origin of the portal. */
const NOT_TO_BROWSER = new Set(['set-cookie', 'set-cookie2']);

function namedByConnection(headers: IncomingHttpHeaders): Set<string> {
  const value = headers.connection;
  const tokens = (Array.isArray(value) ? value.join(',') : (value ?? '')).split(',');
  return new Set(tokens.map((token) => token.trim().toLowerCase()).filter(Boolean));
}

function without(headers: IncomingHttpHeaders, blocked: Set<string>, blockedPrefix?: string): OutgoingHttpHeaders {
  const perConnection = namedByConnection(headers);
  const result: OutgoingHttpHeaders = {};
  for (const [name, value] of Object.entries(headers)) {
    const key = name.toLowerCase();
    if (value === undefined || HOP_BY_HOP.has(key) || perConnection.has(key) || blocked.has(key)) {
      continue;
    }
    if (blockedPrefix && key.startsWith(blockedPrefix)) {
      continue;
    }
    result[key] = value;
  }
  return result;
}

/** The headers of a browser request that go on to the backend. */
export function requestHeadersForBackend(headers: IncomingHttpHeaders): OutgoingHttpHeaders {
  return without(headers, NOT_TO_BACKEND, 'x-forwarded-');
}

/** The headers of a backend response that go on to the browser. */
export function responseHeadersForBrowser(headers: IncomingHttpHeaders): OutgoingHttpHeaders {
  return without(headers, NOT_TO_BROWSER);
}
