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

import { createServer, type IncomingHttpHeaders, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';

export interface FakeBackend {
  url: string;
  requests: Array<{ method: string; url: string; headers: IncomingHttpHeaders; body: string }>;
  /** Sends one more event on every open /api/events stream. */
  sendEvent(data: string): void;
  close(): Promise<void>;
}

/**
 * A backend for the tests, in this process. It records every request and answers with an echo; some paths behave in
 * a special way: /api/events (Server-Sent Events), /api/slow (never answers), /api/reset (drops the connection),
 * /api/cookie (tries to set a cookie and a hop-by-hop header).
 */
export async function startFakeBackend(): Promise<FakeBackend> {
  const streams = new Set<ServerResponse>();
  const backend: FakeBackend = {
    url: '',
    requests: [],
    sendEvent: (data) => streams.forEach((stream) => stream.write(`data: ${data}\n\n`)),
    close: () =>
      new Promise((resolve) => {
        server.closeAllConnections();
        server.close(() => resolve());
      }),
  };

  const server = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');
      const url = req.url ?? '';
      backend.requests.push({ method: req.method ?? '', url, headers: req.headers, body });
      if (url.startsWith('/api/events')) {
        res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' });
        res.write('data: first\n\n');
        streams.add(res);
        res.on('close', () => streams.delete(res));
        return;
      }
      if (url.startsWith('/api/slow')) {
        return;
      }
      if (url.startsWith('/api/reset')) {
        req.socket.destroy();
        return;
      }
      const headers: Record<string, string | string[]> = { 'content-type': 'application/json' };
      if (url.startsWith('/api/cookie')) {
        headers['set-cookie'] = ['dsm_session=from-the-backend; Path=/'];
        headers['x-backend'] = 'kept';
      }
      res.writeHead(req.method === 'POST' ? 201 : 200, headers);
      res.end(req.method === 'HEAD' ? undefined : JSON.stringify({ method: req.method, url, body }));
    });
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  backend.url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  return backend;
}
