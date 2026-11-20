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

import { realpathSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { BFF } from './constants/bff.constant.ts';
import type { BffConfig } from './data/bff-config.data.ts';
import type { Bff, BffContext, BffOptions } from './data/bff-context.data.ts';
import { cookieName } from './http/cookies.ts';
import { parseRequestTarget } from './http/request-target.ts';
import { applySecurityHeaders, sendJson, sendProblem } from './http/respond.ts';
import { jsonLog } from './log.ts';
import { OidcClient } from './oidc/oidc.client.ts';
import { apiProxy } from './routes/api-proxy.route.ts';
import { callback, login, logout } from './routes/auth.routes.ts';
import { me } from './routes/me.route.ts';
import { serveConfig, serveStatic } from './routes/static.route.ts';
import { LoginTransactionStore } from './session/login-transaction.store.ts';
import { SessionStore } from './session/session.store.ts';

function allow(res: ServerResponse, method: string | undefined, ...allowed: string[]): boolean {
  if (method !== undefined && allowed.includes(method)) {
    return true;
  }
  res.setHeader('Allow', allowed.join(', '));
  sendProblem(res, 405, 'method-not-allowed', 'This method is not supported here.');
  return false;
}

async function route(context: BffContext, req: IncomingMessage, res: ServerResponse): Promise<void> {
  applySecurityHeaders(res);
  const target = parseRequestTarget(req.url);
  if (!target) {
    return sendProblem(res, 400, 'bad-request', 'The request target is not a path.');
  }
  const path = target.pathname;
  const { method } = req;

  if (path === '/health') {
    return allow(res, method, 'GET', 'HEAD') ? sendJson(res, 200, { status: 'ok' }) : undefined;
  }
  if (path === '/me') {
    return allow(res, method, 'GET') ? me(context, req, res) : undefined;
  }
  if (path === '/auth/login') {
    return allow(res, method, 'GET') ? login(context, req, res, target.searchParams) : undefined;
  }
  if (path === BFF.CALLBACK_PATH) {
    return allow(res, method, 'GET') ? callback(context, req, res, target.searchParams) : undefined;
  }
  if (path === '/auth/logout') {
    return allow(res, method, 'POST') ? logout(context, req, res) : undefined;
  }
  if (path === '/auth' || path.startsWith('/auth/') || path === '/api') {
    return sendProblem(res, 404, 'not-found', 'Not found.');
  }
  if (path.startsWith('/api/')) {
    return apiProxy(context, req, res, target);
  }
  if (!allow(res, method, 'GET', 'HEAD')) {
    return;
  }
  if (path === '/config.json') {
    return serveConfig(context, req, res);
  }
  return serveStatic(context, req, res, path);
}

/**
 * The BFF as a request handler for `node:http`: serves the portal, signs persons in at the identity provider, keeps
 * their tokens in a server-side session and forwards /api/** to the backend with the token of the person.
 */
export function createBff(config: BffConfig, options: BffOptions = {}): Bff {
  const now = options.now ?? Date.now;
  const log = options.log ?? jsonLog;
  const context: BffContext = {
    config,
    sessions: new SessionStore({
      idleMs: config.sessionIdleSeconds * 1000,
      maxMs: config.sessionMaxSeconds * 1000,
      maxSessions: BFF.MAX_SESSIONS,
      now,
    }),
    transactions: new LoginTransactionStore({ ttlMs: BFF.LOGIN_TTL_MS, maxTransactions: BFF.MAX_LOGIN_TRANSACTIONS, now }),
    oidc: new OidcClient({
      issuer: config.issuer,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: `${config.publicOrigin}${BFF.CALLBACK_PATH}`,
      idpHint: config.idpHint,
      now,
      fetch: options.fetch ?? ((...args) => fetch(...args)),
    }),
    log,
    now,
    sessionCookie: cookieName(BFF.SESSION_COOKIE, config.secureCookies),
    loginCookie: cookieName(BFF.LOGIN_COOKIE, config.secureCookies),
    upstreamTimeoutMs: options.upstreamTimeoutMs ?? BFF.UPSTREAM_TIMEOUT_MS,
    staticRoot: realpathSync(config.staticDir),
  };

  const sweeper = setInterval(() => {
    context.sessions.sweep();
    context.transactions.sweep();
  }, BFF.SWEEP_INTERVAL_MS);
  sweeper.unref();

  const handler = (req: IncomingMessage, res: ServerResponse) => {
    res.on('error', () => res.destroy());
    route(context, req, res).catch((error: unknown) => {
      // The name of the error only: a message could carry a URL with a code or a path of the host.
      log('error', 'request_failed', { error: error instanceof Error ? error.name : 'unknown' });
      if (res.headersSent) {
        res.destroy();
      } else {
        sendProblem(res, 500, 'internal', 'The request could not be handled.');
      }
    });
  };

  return { handler, context, close: () => clearInterval(sweeper) };
}
