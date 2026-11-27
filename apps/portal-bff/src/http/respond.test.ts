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

import type { ServerResponse } from 'node:http';
import { describe, expect, it } from 'vitest';
import { escapeHtml, sendErrorPage } from './respond.ts';

/** The parts of a response the error page writes. */
function fakeResponse() {
  const headers = new Map<string, unknown>();
  const sent = { status: 0, body: '' };
  const res = {
    setHeader: (name: string, value: unknown) => headers.set(name, value),
    end: (body: string) => {
      sent.body = body;
    },
    set statusCode(value: number) {
      sent.status = value;
    },
  };
  return { res: res as unknown as ServerResponse, sent, headers };
}

describe('HTML of the BFF', () => {
  it('writes the page of a failed sign-in by default', () => {
    const { res, sent, headers } = fakeResponse();
    sendErrorPage(res, 400, 'Something <b>failed</b>.', 'access_denied');
    expect(sent.status).toBe(400);
    expect(sent.body).toContain('<h1>Sign-in failed</h1>');
    expect(sent.body).toContain('Something &#60;b&#62;failed&#60;/b&#62;.');
    expect(sent.body).toContain('<code>access_denied</code>');
    expect(sent.body).toContain('<a href="/auth/login">Try again</a>');
    expect(headers.get('Cache-Control')).toBe('no-store');
  });

  it('writes another title and way out when a page is given, and shows no code that is not a short word', () => {
    const { res, sent } = fakeResponse();
    sendErrorPage(res, 400, 'Expired.', '<script>', { title: 'Wallet step failed', retry: { href: '/', label: 'Back to the portal' } });
    expect(sent.body).toContain('<title>Wallet step failed</title>');
    expect(sent.body).toContain('<a href="/">Back to the portal</a>');
    expect(sent.body).not.toContain('Code:');
    expect(sent.body).not.toContain('<script>');
  });

  it('escapes everything that could become markup', () => {
    expect(escapeHtml(`<script>alert("x")</script> & 'y'`)).toBe('&#60;script&#62;alert(&#34;x&#34;)&#60;/script&#62; &#38; &#39;y&#39;');
  });
});
