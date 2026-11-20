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
import type { Session, SessionState } from '../data/session.data.ts';
import { parseCookies, serializeCookie } from '../http/cookies.ts';
import { sendProblem } from '../http/respond.ts';
import { OidcError } from '../oidc/oidc.error.ts';

/** The session of the request's cookie, or null. */
export function sessionOf(context: BffContext, req: IncomingMessage): Session | null {
  return context.sessions.find(parseCookies(req.headers.cookie).get(context.sessionCookie));
}

export function clearSessionCookie(context: BffContext, res: ServerResponse): void {
  res.appendHeader('Set-Cookie', serializeCookie(context.sessionCookie, '', context.config.secureCookies, 0));
}

/** 401 as Problem Details: the UI answers it with the redirect to /auth/login. */
export function sendUnauthorized(context: BffContext, res: ServerResponse): void {
  clearSessionCookie(context, res);
  sendProblem(res, 401, 'unauthorized', 'Not signed in. Open /auth/login to sign in.');
}

export function sendProviderUnavailable(res: ServerResponse): void {
  res.setHeader('Retry-After', '5');
  sendProblem(res, 503, 'identity-provider-unavailable', 'The identity provider does not answer. Try again.');
}

async function refresh(context: BffContext, session: Session, refreshToken: string): Promise<SessionState> {
  try {
    const tokens = await context.oidc.refresh(refreshToken);
    if (!context.sessions.isAlive(session)) {
      return 'ended';
    }
    if (typeof tokens.claims.sub === 'string' && tokens.claims.sub !== session.subject) {
      throw new OidcError('invalid', 'access_token_sub');
    }
    session.accessToken = tokens.accessToken;
    session.claims = tokens.claims;
    session.accessTokenExpiresAt = tokens.accessTokenExpiresAt;
    session.refreshToken = tokens.refreshToken ?? refreshToken;
    return 'ok';
  } catch (error) {
    const reason = error instanceof OidcError ? error.reason : 'error';
    if (error instanceof OidcError && error.kind === 'unavailable') {
      // The provider is not reachable right now: keep the session; the token in hand is used as long as it is valid.
      context.log('warn', 'token_refresh_unavailable', { reason });
      return session.accessTokenExpiresAt > context.now() ? 'ok' : 'unavailable';
    }
    context.log('info', 'session_ended', { cause: 'refresh_failed', reason });
    context.sessions.destroy(session.key);
    return 'ended';
  }
}

/**
 * Makes sure the session has an access token that is valid for a while: refreshes it shortly before it expires, once
 * for all parallel requests. `ended`: the provider refused the refresh (or there is nothing to refresh with) and the
 * session is gone.
 */
export async function ensureFreshToken(context: BffContext, session: Session): Promise<SessionState> {
  if (session.accessTokenExpiresAt - BFF.REFRESH_SKEW_MS > context.now()) {
    return 'ok';
  }
  const { refreshToken } = session;
  if (refreshToken === null) {
    if (session.accessTokenExpiresAt > context.now()) {
      return 'ok';
    }
    context.log('info', 'session_ended', { cause: 'access_token_expired', reason: 'no_refresh_token' });
    context.sessions.destroy(session.key);
    return 'ended';
  }
  session.refreshing ??= refresh(context, session, refreshToken).finally(() => {
    session.refreshing = null;
  });
  return session.refreshing;
}
