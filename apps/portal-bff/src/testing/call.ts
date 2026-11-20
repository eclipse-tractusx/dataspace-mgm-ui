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

import { request, type IncomingHttpHeaders, type OutgoingHttpHeaders } from 'node:http';

export interface Answer {
  status: number;
  headers: IncomingHttpHeaders;
  body: string;
}

export interface CallInit {
  method?: string;
  headers?: OutgoingHttpHeaders;
  body?: string;
}

/** One HTTP request with the path sent exactly as written (fetch would normalise "..", which the tests need raw). */
export function call(port: number, path: string, init: CallInit = {}): Promise<Answer> {
  return new Promise((resolve, reject) => {
    // A browser declares the length of a body; Node's client does not for DELETE, so it is set here.
    const headers = init.body === undefined ? init.headers : { 'content-length': Buffer.byteLength(init.body), ...init.headers };
    const req = request({ host: '127.0.0.1', port, path, method: init.method ?? 'GET', headers, agent: false }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode ?? 0, headers: res.headers, body: Buffer.concat(chunks).toString('utf8') }));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.end(init.body);
  });
}
