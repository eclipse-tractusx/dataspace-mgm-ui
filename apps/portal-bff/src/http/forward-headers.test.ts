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
import { requestHeadersForBackend, responseHeadersForBrowser } from './forward-headers.ts';

describe('forwarded headers', () => {
  it('keeps the session cookie, the CSRF token and a client-sent Authorization away from the backend', () => {
    const forwarded = requestHeadersForBackend({
      cookie: 'dsm_session=secret',
      authorization: 'Bearer from-the-browser',
      'x-csrf-token': 'csrf',
      host: 'portal.example.org',
      accept: 'application/json',
      'content-type': 'application/json',
      'content-length': '2',
      'accept-language': 'de',
    });
    expect(forwarded).toEqual({ accept: 'application/json', 'content-type': 'application/json', 'content-length': '2', 'accept-language': 'de' });
  });

  it('drops hop-by-hop headers, the headers named by Connection, and what a client claims about proxies', () => {
    const forwarded = requestHeadersForBackend({
      connection: 'keep-alive, X-Secret-Hop',
      'keep-alive': 'timeout=5',
      'x-secret-hop': '1',
      'transfer-encoding': 'chunked',
      te: 'trailers',
      trailer: 'x',
      upgrade: 'websocket',
      'proxy-authorization': 'Basic x',
      'proxy-connection': 'keep-alive',
      expect: '100-continue',
      forwarded: 'for=1.2.3.4',
      'x-forwarded-for': '1.2.3.4',
      'x-forwarded-host': 'evil.example',
      'x-real-ip': '1.2.3.4',
      'x-request-id': 'abc',
    });
    expect(forwarded).toEqual({ 'x-request-id': 'abc' });
  });

  it('drops cookies of the backend and hop-by-hop headers from the answer, keeps the rest', () => {
    const forwarded = responseHeadersForBrowser({
      'set-cookie': ['dsm_session=evil; Path=/'],
      connection: 'close, x-internal',
      'x-internal': '1',
      'transfer-encoding': 'chunked',
      'content-type': 'text/event-stream',
      'content-encoding': 'gzip',
      'cache-control': 'no-cache',
      etag: '"1"',
    });
    expect(forwarded).toEqual({ 'content-type': 'text/event-stream', 'content-encoding': 'gzip', 'cache-control': 'no-cache', etag: '"1"' });
  });
});
