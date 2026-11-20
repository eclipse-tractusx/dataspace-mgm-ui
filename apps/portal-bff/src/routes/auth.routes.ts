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

import type { IncomingMessage, ServerResponse } from 'node:http';
import { BFF } from '../constants/bff.constant.ts';
import type { BffContext } from '../data/bff-context.data.ts';
import { isOpaqueToken, parseCookies, serializeCookie } from '../http/cookies.ts';
import { isOwnOrigin } from '../http/csrf.ts';
import { sendErrorPage, sendProblem, sendRedirect } from '../http/respond.ts';
import { safeReturnTo } from '../http/return-to.ts';
import { OidcError } from '../oidc/oidc.error.ts';
import { randomToken } from '../oidc/pkce.ts';
import { clearSessionCookie, sessionOf } from './session-access.ts';

const UNAVAILABLE = 'The sign-in service does not answer at the moment. Please try again in a moment.';

/** GET /auth/login?return_to=<path>: starts the authorization code flow and sends the browser to the provider. */
export async function login(context: BffContext, req: IncomingMessage, res: ServerResponse, query: URLSearchParams): Promise<void> {
  const returnTo = safeReturnTo(query.get('return_to'), context.config.publicOrigin);
  // One binding per browser, kept while sign-ins are under way, so several tabs can sign in at the same time.
  const existing = parseCookies(req.headers.cookie).get(context.loginCookie);
  const binding = isOpaqueToken(existing) ? existing : randomToken();
  const transaction = context.transactions.create(binding, returnTo);
  let location: string;
  try {
    location = await context.oidc.authorizationUrl(transaction);
  } catch (error) {
    context.transactions.take(transaction.state, binding);
    context.log('error', 'login_failed', { step: 'discovery', reason: error instanceof OidcError ? error.reason : 'error' });
    return sendErrorPage(res, 503, UNAVAILABLE);
  }
  res.appendHeader('Set-Cookie', serializeCookie(context.loginCookie, binding, context.config.secureCookies, BFF.LOGIN_TTL_MS / 1000));
  sendRedirect(res, location);
}

/** GET /auth/callback: finishes the sign-in, creates the session and goes back to where the person came from. */
export async function callback(context: BffContext, req: IncomingMessage, res: ServerResponse, query: URLSearchParams): Promise<void> {
  const cookies = parseCookies(req.headers.cookie);
  const transaction = context.transactions.take(query.get('state'), cookies.get(context.loginCookie));
  if (!transaction) {
    context.log('warn', 'login_failed', { step: 'state', reason: 'unknown_expired_or_other_browser' });
    return sendErrorPage(res, 400, 'This sign-in is no longer valid: it has expired, was already used or was started in another browser.');
  }

  const providerError = query.get('error');
  if (providerError !== null) {
    const code = /^[a-z0-9_]{1,40}$/.test(providerError) ? providerError : 'error';
    context.log('warn', 'login_failed', { step: 'authorization', reason: code });
    return sendErrorPage(res, 400, 'The sign-in was not completed.', code);
  }

  const code = query.get('code');
  let issuerMatches: boolean;
  try {
    issuerMatches = await context.oidc.isExpectedIssuer(query.get('iss'));
  } catch {
    return sendErrorPage(res, 503, UNAVAILABLE);
  }
  if (!code || !issuerMatches) {
    context.log('warn', 'login_failed', { step: 'authorization', reason: code ? 'iss' : 'no_code' });
    return sendErrorPage(res, 400, 'The answer of the sign-in service was not understood.');
  }

  let result: Awaited<ReturnType<typeof context.oidc.exchangeCode>>;
  try {
    result = await context.oidc.exchangeCode(code, transaction);
  } catch (error) {
    const kind = error instanceof OidcError ? error.kind : 'invalid';
    context.log('error', 'login_failed', { step: 'token', kind, reason: error instanceof OidcError ? error.reason : 'error' });
    if (kind === 'unavailable') {
      return sendErrorPage(res, 503, UNAVAILABLE);
    }
    return sendErrorPage(res, kind === 'rejected' ? 400 : 502, 'The sign-in could not be completed.');
  }

  // A new id for every sign-in; a session the browser still had ends here (no session fixation, no leftovers).
  const previous = sessionOf(context, req);
  if (previous) {
    context.sessions.destroy(previous.key);
  }
  const { id } = context.sessions.create({
    subject: result.identity.subject,
    username: result.identity.username,
    accessToken: result.tokens.accessToken,
    claims: result.tokens.claims,
    accessTokenExpiresAt: result.tokens.accessTokenExpiresAt,
    refreshToken: result.tokens.refreshToken,
  });
  context.log('info', 'login', { sessions: context.sessions.size });
  res.appendHeader('Set-Cookie', serializeCookie(context.sessionCookie, id, context.config.secureCookies));
  sendRedirect(res, `${context.config.publicOrigin}${transaction.returnTo}`);
}

/**
 * POST /auth/logout: ends the session here and, as far as it goes without a browser redirect, at the provider.
 * Always 204 for a request of the portal itself, signed in or not. The CSRF token is not required: a tab whose token
 * is out of date must still be able to sign out; a request from another origin is refused (and SameSite=Lax keeps the
 * cookie away from cross-site POSTs).
 */
export async function logout(context: BffContext, req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (!isOwnOrigin(req.headers.origin, context.config.publicOrigin)) {
    return sendProblem(res, 403, 'forbidden-origin', 'This request does not come from the portal.');
  }
  const session = sessionOf(context, req);
  if (session) {
    context.sessions.destroy(session.key);
    const endedAtProvider = session.refreshToken !== null && (await context.oidc.endSession(session.refreshToken));
    context.log('info', 'logout', { ended_at_provider: endedAtProvider });
  }
  clearSessionCookie(context, res);
  res.statusCode = 204;
  res.setHeader('Cache-Control', 'no-store');
  res.end();
}
