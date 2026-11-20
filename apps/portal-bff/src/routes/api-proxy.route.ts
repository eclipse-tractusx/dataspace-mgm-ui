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

import { request as httpRequest, type IncomingMessage, type ServerResponse } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { BFF } from '../constants/bff.constant.ts';
import type { BffContext } from '../data/bff-context.data.ts';
import type { Session } from '../data/session.data.ts';
import { isCsrfValid, isOwnOrigin, isSafeMethod } from '../http/csrf.ts';
import { requestHeadersForBackend, responseHeadersForBrowser } from '../http/forward-headers.ts';
import { isApiPath } from '../http/request-target.ts';
import { applySecurityHeaders, sendProblem } from '../http/respond.ts';
import { ensureFreshToken, sendProviderUnavailable, sendUnauthorized, sessionOf } from './session-access.ts';

/** Sends the request on to the backend with the token of the session and streams the answer back, unbuffered. */
function forward(context: BffContext, req: IncomingMessage, res: ServerResponse, target: URL, session: Session): void {
  const url = new URL(`${context.config.backendUrl}${target.pathname}${target.search}`);
  const publicUrl = new URL(context.config.publicOrigin);
  const headers = requestHeadersForBackend(req.headers);
  headers.host = url.host;
  headers.authorization = `Bearer ${session.accessToken}`;
  headers['x-forwarded-host'] = publicUrl.host;
  headers['x-forwarded-proto'] = publicUrl.protocol.slice(0, -1);
  if (req.headers['transfer-encoding'] !== undefined) {
    // The body has no declared length: keep sending it in chunks (the header itself is per connection).
    headers['transfer-encoding'] = 'chunked';
  }

  let finished = false;
  let timedOut = false;
  let sessionEnded = false;
  const upstream = (url.protocol === 'https:' ? httpsRequest : httpRequest)(url, { method: req.method, headers });
  const untrack = context.sessions.track(session, () => {
    sessionEnded = true;
    upstream.destroy();
  });

  // Silence of the backend, while connecting, waiting for the answer or in the middle of it.
  upstream.setTimeout(context.upstreamTimeoutMs, () => {
    timedOut = true;
    upstream.destroy();
  });

  upstream.on('response', (answer) => {
    if (String(answer.headers['content-type'] ?? '').startsWith('text/event-stream')) {
      // Server-Sent Events may be silent for long; the stream ends with the browser, the backend or the session.
      upstream.setTimeout(0);
    }
    for (const [name, value] of Object.entries(responseHeadersForBrowser(answer.headers))) {
      if (value !== undefined) {
        res.setHeader(name, value);
      }
    }
    applySecurityHeaders(res);
    if (!res.hasHeader('cache-control')) {
      res.setHeader('Cache-Control', 'no-store');
    }
    res.writeHead(answer.statusCode ?? 502);
    res.flushHeaders();
    answer.on('end', () => {
      finished = true;
    });
    answer.on('error', () => res.destroy());
    answer.on('close', () => {
      if (!finished) {
        res.destroy();
      }
    });
    answer.pipe(res);
  });

  upstream.on('error', () => {
    if (res.headersSent) {
      res.destroy();
    } else if (sessionEnded) {
      sendUnauthorized(context, res);
    } else if (!res.destroyed) {
      context.log('error', 'backend_failed', { reason: timedOut ? 'timeout' : 'no_answer' });
      if (timedOut) {
        sendProblem(res, 504, 'upstream-timeout', 'The backend did not answer in time.');
      } else {
        sendProblem(res, 502, 'upstream', 'The backend cannot be reached.');
      }
    }
  });
  upstream.on('close', untrack);

  res.on('close', () => {
    if (!finished) {
      upstream.destroy();
    }
  });
  req.on('error', () => upstream.destroy());
  req.pipe(upstream);
}

/**
 * /api/**: the calls of the portal to the backend. Needs a session (401), for write requests the CSRF token and the
 * portal as origin (403), and a valid access token, refreshed here when it is about to expire.
 */
export async function apiProxy(context: BffContext, req: IncomingMessage, res: ServerResponse, target: URL): Promise<void> {
  const method = req.method ?? 'GET';
  if (!(BFF.API_METHODS as ReadonlyArray<string>).includes(method)) {
    res.setHeader('Allow', BFF.API_METHODS.join(', '));
    return sendProblem(res, 405, 'method-not-allowed', 'This method is not supported.');
  }
  if (!isApiPath(target.pathname)) {
    return sendProblem(res, 400, 'bad-request', 'This path is not accepted.');
  }
  const session = sessionOf(context, req);
  if (!session) {
    return sendUnauthorized(context, res);
  }
  if (!isSafeMethod(method)) {
    if (!isOwnOrigin(req.headers.origin, context.config.publicOrigin)) {
      return sendProblem(res, 403, 'forbidden-origin', 'This request does not come from the portal.');
    }
    if (!isCsrfValid(method, req.headers[BFF.CSRF_HEADER], session.csrfToken)) {
      return sendProblem(res, 403, 'csrf', 'Write requests need the header X-CSRF-Token from GET /me.');
    }
  }
  const state = await ensureFreshToken(context, session);
  if (state === 'ended') {
    return sendUnauthorized(context, res);
  }
  if (state === 'unavailable') {
    return sendProviderUnavailable(res);
  }
  forward(context, req, res, target, session);
}
