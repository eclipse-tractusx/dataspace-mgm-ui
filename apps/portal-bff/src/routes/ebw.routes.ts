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
import type { WalletStepResult } from '../data/ebw.data.ts';
import type { WalletStepPurpose } from '../data/session.data.ts';
import { isCsrfValid, isOwnOrigin } from '../http/csrf.ts';
import { sendErrorPage, sendJson, sendProblem, sendRedirect } from '../http/respond.ts';
import { safeReturnTo } from '../http/return-to.ts';
import { OidcError } from '../oidc/oidc.error.ts';
import { sendUnauthorized, sessionOf } from './session-access.ts';

const NOT_CONNECTED = 'The wallet step is not connected: the BFF has no settings for the EBW-Connector (BFF_EBW_*).';
const WALLET_PAGE = { title: 'Wallet step failed', retry: { href: '/', label: 'Back to the portal' } };

/** Where the wallet step goes back to: a path of the portal, never the wallet step or the sign-in itself. */
function returnPathOf(value: string | null, publicOrigin: string): string {
  const path = safeReturnTo(value, publicOrigin);
  return path === '/ebw' || path.startsWith('/ebw/') ? '/' : path;
}

/** The return path with the mark `wallet=returned`, which tells the page to collect the outcome. */
function markedReturn(returnTo: string, publicOrigin: string): string {
  const url = new URL(returnTo, publicOrigin);
  url.searchParams.set(BFF.WALLET_RETURN_PARAM, BFF.WALLET_RETURNED);
  return `${publicOrigin}${url.pathname}${url.search}${url.hash}`;
}

/** A failure reason of the EBW-Connector (C5-M1 6.2) as a fixed word; anything else becomes the OAuth error code. */
function failureOf(error: string, description: string | null): WalletStepResult {
  if (error === 'access_denied' && description === 'WALLET_ERROR') {
    // The wallet answered with an error: the person declined there (C5-M1 13 case 11).
    return { status: 'cancelled' };
  }
  if (error === 'access_denied' && description !== null && /^[A-Z][A-Z0-9_]{1,39}$/.test(description)) {
    return { status: 'failed', reason: description };
  }
  return { status: 'failed', reason: /^[a-z_]{1,40}$/.test(error) ? error : 'error' };
}

/** The purpose a start request names, `onboarding` without one, or null for a word that is no purpose. */
function purposeOf(value: string | null): WalletStepPurpose | null {
  if (value === null || value === 'onboarding') {
    return 'onboarding';
  }
  return value === 'representation' ? value : null;
}

/**
 * GET /ebw/attestation/start?return_to=<path>[&purpose=representation]: starts a wallet step for the signed-in person
 * and sends the browser to the EBW-Connector. Without `purpose` it is the step of the registration (`onboarding`);
 * `representation` is the step of a person who joins a company with a mandate. An outcome of an earlier step that was
 * not collected is dropped.
 */
export async function startWalletStep(context: BffContext, req: IncomingMessage, res: ServerResponse, query: URLSearchParams): Promise<void> {
  const { ebw } = context;
  if (!ebw) {
    return sendProblem(res, 404, 'not-found', NOT_CONNECTED);
  }
  const purpose = purposeOf(query.get(BFF.WALLET_PURPOSE_PARAM));
  if (purpose === null) {
    return sendProblem(res, 400, 'bad-request', 'purpose: onboarding or representation.');
  }
  const returnTo = returnPathOf(query.get('return_to'), context.config.publicOrigin);
  const session = sessionOf(context, req);
  if (!session) {
    // Not signed in (any more): sign in first; the page starts the step again.
    return sendRedirect(res, `${context.config.publicOrigin}/auth/login?return_to=${encodeURIComponent(returnTo)}`);
  }
  session.walletStep = null;
  const transaction = ebw.transactions.create(session.key, returnTo, purpose);
  let location: string;
  try {
    location = await ebw.client.authorizationUrl(transaction);
  } catch (error) {
    ebw.transactions.take(transaction.state, session.key);
    context.log('error', 'wallet_step_failed', { step: 'discovery', reason: error instanceof OidcError ? error.reason : 'error' });
    session.walletStep = { status: 'failed', reason: 'connector_unavailable' };
    return sendRedirect(res, markedReturn(returnTo, context.config.publicOrigin));
  }
  sendRedirect(res, location);
}

/**
 * GET /ebw/callback: finishes the wallet step. Checks `state` (once, and only in the session that started the step),
 * exchanges the code, keeps the verification attestation in the session and goes back to the page. A failure of the
 * step is kept as the outcome, too: the page shows it.
 */
export async function walletStepCallback(context: BffContext, req: IncomingMessage, res: ServerResponse, query: URLSearchParams): Promise<void> {
  const { ebw } = context;
  if (!ebw) {
    return sendProblem(res, 404, 'not-found', NOT_CONNECTED);
  }
  const session = sessionOf(context, req);
  const transaction = session ? ebw.transactions.take(query.get('state'), session.key) : null;
  if (!session || !transaction) {
    context.log('warn', 'wallet_step_failed', { step: 'state', reason: session ? 'unknown_expired_or_other_session' : 'no_session' });
    return sendErrorPage(res, 400, 'This wallet step is no longer valid: it has expired, was already used or was started in another session.', null, WALLET_PAGE);
  }
  const done = (result: WalletStepResult) => {
    session.walletStep = result;
    context.log(result.status === 'received' ? 'info' : 'warn', 'wallet_step', { outcome: result.status, reason: result.status === 'failed' ? result.reason : null });
    sendRedirect(res, markedReturn(transaction.returnTo, context.config.publicOrigin));
  };

  const providerError = query.get('error');
  if (providerError !== null) {
    return done(failureOf(providerError, query.get('error_description')));
  }
  const code = query.get('code');
  if (!code || !ebw.client.isExpectedIssuer(query.get('iss'))) {
    return done({ status: 'failed', reason: code ? 'iss' : 'no_code' });
  }
  try {
    const attestation = await ebw.client.exchangeCode(code, transaction);
    return done(attestation === null ? { status: 'failed', reason: 'no_attestation' } : { status: 'received', attestation });
  } catch (error) {
    const kind = error instanceof OidcError ? error.kind : 'invalid';
    context.log('error', 'wallet_step_failed', { step: 'token', kind, reason: error instanceof OidcError ? error.reason : 'error' });
    return done({ status: 'failed', reason: kind === 'unavailable' ? 'connector_unavailable' : 'connector_answer' });
  }
}

/**
 * POST /ebw/attestation: hands the outcome of the wallet step to the portal, once: `received` with the verification
 * attestation (for POST /applications of C1-M2 or POST /invitations/accept of C2-M2), `cancelled`, `failed` with a reason, or `none` when no step has
 * ended since the last call. A write request: it needs the CSRF token and the portal as origin.
 */
export function collectAttestation(context: BffContext, req: IncomingMessage, res: ServerResponse): void {
  if (!context.ebw) {
    return sendProblem(res, 404, 'not-found', NOT_CONNECTED);
  }
  const session = sessionOf(context, req);
  if (!session) {
    return sendUnauthorized(context, res);
  }
  if (!isOwnOrigin(req.headers.origin, context.config.publicOrigin)) {
    return sendProblem(res, 403, 'forbidden-origin', 'This request does not come from the portal.');
  }
  if (!isCsrfValid('POST', req.headers[BFF.CSRF_HEADER], session.csrfToken)) {
    return sendProblem(res, 403, 'csrf', 'Write requests need the header X-CSRF-Token from GET /me.');
  }
  const result = session.walletStep;
  session.walletStep = null;
  sendJson(res, 200, result ?? { status: 'none' });
}

/** GET /ebw/jwks: the public key of the client, for the entry of the portal at the EBW-Connector (`jwksUri`). */
export function clientJwks(context: BffContext, res: ServerResponse): void {
  if (!context.ebw) {
    return sendProblem(res, 404, 'not-found', NOT_CONNECTED);
  }
  sendJson(res, 200, context.ebw.jwks);
}
