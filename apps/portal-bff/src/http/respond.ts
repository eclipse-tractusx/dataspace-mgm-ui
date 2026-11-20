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
import { BFF } from '../constants/bff.constant.ts';

/** The headers docker/nginx.conf sets for the portal, on every response of the BFF. */
export function applySecurityHeaders(res: ServerResponse): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}

export function sendJson(res: ServerResponse, status: number, body: unknown, contentType = 'application/json'): void {
  const payload = JSON.stringify(body);
  res.statusCode = status;
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', Buffer.byteLength(payload));
  res.setHeader('Cache-Control', 'no-store');
  res.end(payload);
}

/** An error as RFC 9457 Problem Details. `detail` is a fixed sentence, never something a client or provider sent. */
export function sendProblem(res: ServerResponse, status: number, type: string, detail: string): void {
  sendJson(res, status, { type: `${BFF.PROBLEM_PREFIX}${type}`, title: type, status, detail }, 'application/problem+json');
}

export function sendRedirect(res: ServerResponse, location: string): void {
  res.statusCode = 302;
  res.setHeader('Location', location);
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Length', 0);
  res.end();
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

/**
 * The page a person sees when the sign-in fails (the only HTML the BFF writes itself). `code` is shown for support;
 * it is cut down to a short word and escaped, so nothing from the query of a callback is reflected as markup.
 */
export function sendErrorPage(res: ServerResponse, status: number, message: string, code?: string | null): void {
  const safeCode = code && /^[a-z0-9_]{1,40}$/.test(code) ? code : null;
  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Sign-in failed</title></head>
<body>
<h1>Sign-in failed</h1>
<p>${escapeHtml(message)}</p>
${safeCode ? `<p>Code: <code>${escapeHtml(safeCode)}</code></p>\n` : ''}<p><a href="/auth/login">Try again</a></p>
</body>
</html>
`;
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.end(html);
}
