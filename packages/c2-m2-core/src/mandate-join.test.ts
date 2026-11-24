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

import { CoreHttpException } from '@dataspace-mgm/core-http';
import { describe, expect, it, vi } from 'vitest';
import {
  AcceptInvitationWithMandateUseCase,
  createC2M2Module,
  MandateNotConfirmedException,
  type AcceptInvitationResult,
  type InvitationRepository,
  type MandateAttestationRepository,
} from './index';

const ACCEPTED: AcceptInvitationResult = { invitationId: 'inv-1', kind: 'COMPANY', userId: 'user-max', companyId: 'company', roles: ['Member'] };
const ATTESTATION = 'aaa.bbb.ccc';

function invitations(acceptWithMandate?: InvitationRepository['acceptWithMandate']): InvitationRepository {
  return { list: async () => [], create: async () => null, revoke: async () => true, ...(acceptWithMandate ? { acceptWithMandate } : {}) };
}

const wallet = (requestAttestation: MandateAttestationRepository['requestAttestation']): MandateAttestationRepository => ({ requestAttestation });
const problem = (status: number, name: string) => new CoreHttpException(status, `urn:c2-m2:problem:${name}`, name);

describe('AcceptInvitationWithMandateUseCase', () => {
  it('asks the wallet for the attestation, with the page to come back to, and accepts the invitation with it', async () => {
    const accept = vi.fn(async () => ACCEPTED);
    const request = vi.fn(async () => ATTESTATION);
    const result = await new AcceptInvitationWithMandateUseCase(invitations(accept), wallet(request)).execute('/access-control');
    expect(result).toEqual({ status: 'joined', data: ACCEPTED });
    expect(request).toHaveBeenCalledWith('/access-control');
    expect(accept).toHaveBeenCalledWith(ATTESTATION);
  });

  it('ends as cancelled when the person declines in the wallet, without calling the backend', async () => {
    const accept = vi.fn(async () => ACCEPTED);
    expect(await new AcceptInvitationWithMandateUseCase(invitations(accept), wallet(async () => null)).execute()).toEqual({ status: 'cancelled' });
    expect(accept).not.toHaveBeenCalled();
  });

  it('reports a wallet step that failed with its message', async () => {
    const failing = wallet(async () => {
      throw new Error('The wallet step failed (CREDENTIAL_REVOKED).');
    });
    expect(await new AcceptInvitationWithMandateUseCase(invitations(async () => ACCEPTED), failing).execute()).toEqual({
      status: 'wallet-failed',
      message: 'The wallet step failed (CREDENTIAL_REVOKED).',
    });
  });

  it.each([
    [400, 'attestation-invalid'],
    [403, 'representation-not-confirmed'],
    [403, 'name-mismatch'],
    [404, 'invitation-not-found'],
    [409, 'company-not-active'],
    [409, 'user-already-bound'],
    [409, 'staff-company-conflict'],
  ] as const)('names the refusal of the backend: %i %s', async (status, name) => {
    const refusing = invitations(async () => {
      throw problem(status, name);
    });
    expect(await new AcceptInvitationWithMandateUseCase(refusing, wallet(async () => ATTESTATION)).execute()).toEqual({ status: 'refused', reason: name, causes: [] });
  });

  it('says why the mandate was not confirmed, with the reasons it has words for', async () => {
    const refusing = (reasons: string[]) =>
      invitations(async () => {
        throw new MandateNotConfirmedException(403, 'urn:c2-m2:problem:representation-not-confirmed', 'Not confirmed', reasons);
      });
    const run = (reasons: string[]) => new AcceptInvitationWithMandateUseCase(refusing(reasons), wallet(async () => ATTESTATION)).execute();
    expect(await run(['EXPIRED'])).toEqual({ status: 'refused', reason: 'representation-not-confirmed', causes: ['EXPIRED'] });
    expect(await run(['SOMETHING_NEW', 'PERSON_MISMATCH', 'EXPIRED'])).toEqual({
      status: 'refused',
      reason: 'representation-not-confirmed',
      causes: ['EXPIRED', 'PERSON_MISMATCH'],
    });
    expect(await run([])).toEqual({ status: 'refused', reason: 'representation-not-confirmed', causes: [] });
  });

  it('reports any other error of the backend as failed', async () => {
    const failing = invitations(async () => {
      throw problem(502, 'upstream-error');
    });
    expect(await new AcceptInvitationWithMandateUseCase(failing, wallet(async () => ATTESTATION)).execute()).toEqual({ status: 'failed', message: 'upstream-error' });
    const foreign = invitations(async () => {
      throw new CoreHttpException(403, 'urn:other:problem:name-mismatch', 'forbidden');
    });
    expect(await new AcceptInvitationWithMandateUseCase(foreign, wallet(async () => ATTESTATION)).execute()).toEqual({ status: 'failed', message: 'forbidden' });
  });

  it('fails when the adapter cannot accept with a mandate', async () => {
    expect(await new AcceptInvitationWithMandateUseCase(invitations(), wallet(async () => ATTESTATION)).execute()).toMatchObject({ status: 'failed' });
  });
});

/** A BFF and a backend in one fetch: the BFF answers `POST /ebw/attestation`, the backend `POST /invitations/accept`. */
function world(outcome: unknown, backend: () => Response = () => Response.json(ACCEPTED)) {
  const calls: Array<{ url: string; method: string; headers: Headers; body: unknown }> = [];
  const fetchImpl = async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = input instanceof Request ? input : new Request(new URL(String(input), 'http://ui.test'), init);
    const body = request.method === 'POST' ? await request.clone().json().catch(() => null) : null;
    calls.push({ url: new URL(request.url).pathname, method: request.method, headers: request.headers, body });
    return new URL(request.url).pathname === '/ebw/attestation' ? Response.json(outcome) : backend();
  };
  const leave = vi.fn<(url: string) => void>();
  const onUnauthorized = vi.fn();
  const module = createC2M2Module(
    { baseUrl: 'http://ui.test/api/app-access', fetch: fetchImpl as typeof fetch, getCsrfToken: () => 'csrf-1', onUnauthorized },
    { leave, currentPath: () => '/access-control?tab=1' },
  );
  return { module, calls, leave, onUnauthorized };
}

/** Whether a promise is still pending after the current tasks ran. */
async function isPending(promise: Promise<unknown>): Promise<boolean> {
  const marker = Symbol('pending');
  return (await Promise.race([promise, new Promise((resolve) => setTimeout(() => resolve(marker), 10))])) === marker;
}

describe('joining with a mandate through the BFF and the backend', () => {
  it('collects the attestation at the BFF and posts it to /invitations/accept', async () => {
    const { module, calls, leave } = world({ status: 'received', attestation: ATTESTATION });
    expect(await module.acceptInvitationWithMandate?.execute()).toEqual({ status: 'joined', data: ACCEPTED });
    expect(calls.map((call) => `${call.method} ${call.url}`)).toEqual(['POST /ebw/attestation', 'POST /api/app-access/invitations/accept']);
    expect(calls[0].headers.get('x-csrf-token')).toBe('csrf-1');
    expect(calls[1].body).toEqual({ attestation: ATTESTATION });
    expect(leave).not.toHaveBeenCalled();
  });

  it('leaves the portal for the wallet step with the purpose representation when no step has ended', async () => {
    const { module, calls, leave } = world({ status: 'none' });
    const pending = module.acceptInvitationWithMandate?.execute() as Promise<unknown>;
    expect(await isPending(pending)).toBe(true);
    expect(leave).toHaveBeenCalledWith('/ebw/attestation/start?purpose=representation&return_to=%2Faccess-control%3Ftab%3D1');
    expect(calls).toHaveLength(1);
  });

  it('names the page to come back to when the caller gives one', async () => {
    const { module, leave } = world({ status: 'none' });
    void module.acceptInvitationWithMandate?.execute('/access-control');
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(leave).toHaveBeenCalledWith('/ebw/attestation/start?purpose=representation&return_to=%2Faccess-control');
  });

  it('maps the outcomes of the step: declined, failed, not understood', async () => {
    expect(await world({ status: 'cancelled' }).module.acceptInvitationWithMandate?.execute()).toEqual({ status: 'cancelled' });
    expect(await world({ status: 'failed', reason: 'CREDENTIAL_REVOKED' }).module.acceptInvitationWithMandate?.execute()).toEqual({
      status: 'wallet-failed',
      message: 'The wallet step failed (CREDENTIAL_REVOKED).',
    });
    expect(await world({ status: 'failed' }).module.acceptInvitationWithMandate?.execute()).toMatchObject({ status: 'wallet-failed', message: 'The wallet step failed (unknown).' });
    for (const answer of [{ status: 'received' }, { status: 'other' }, 'text', null]) {
      expect(await world(answer).module.acceptInvitationWithMandate?.execute()).toMatchObject({ status: 'wallet-failed' });
    }
  });

  it('passes the refusal of the backend on, with its problem type', async () => {
    const refused = () => new Response(JSON.stringify({ type: 'urn:c2-m2:problem:invitation-not-found', status: 404, title: 'Not found' }), { status: 404, headers: { 'content-type': 'application/problem+json' } });
    const { module } = world({ status: 'received', attestation: ATTESTATION }, refused);
    expect(await module.acceptInvitationWithMandate?.execute()).toEqual({ status: 'refused', reason: 'invitation-not-found', causes: [] });
  });

  it('passes on why the mandate was not confirmed: the field reasons of the answer', async () => {
    const answer = (extension: object) => () =>
      new Response(JSON.stringify({ type: 'urn:c2-m2:problem:representation-not-confirmed', status: 403, title: 'Not confirmed', ...extension }), {
        status: 403,
        headers: { 'content-type': 'application/problem+json' },
      });
    const run = (extension: object) => world({ status: 'received', attestation: ATTESTATION }, answer(extension)).module.acceptInvitationWithMandate?.execute();
    expect(await run({ reasons: ['EXPIRED'] })).toEqual({ status: 'refused', reason: 'representation-not-confirmed', causes: ['EXPIRED'] });
    expect(await run({ reasons: ['ISSUER_NOT_TRUSTED', 7, 'OTHER'] })).toEqual({ status: 'refused', reason: 'representation-not-confirmed', causes: ['ISSUER_NOT_TRUSTED'] });
    expect(await run({ reasons: 'EXPIRED' })).toEqual({ status: 'refused', reason: 'representation-not-confirmed', causes: [] });
    expect(await run({})).toEqual({ status: 'refused', reason: 'representation-not-confirmed', causes: [] });
  });

  it('starts the sign-in when the session at the BFF has ended', async () => {
    const unauthorized = { url: '', calls: 0 };
    const fetchImpl = async () => {
      unauthorized.calls += 1;
      return new Response(JSON.stringify({ type: 'urn:portal-bff:problem:unauthorized', title: 'Sign in first' }), { status: 401 });
    };
    const onUnauthorized = vi.fn();
    const module = createC2M2Module({ baseUrl: 'http://ui.test/api/app-access', fetch: fetchImpl as typeof fetch, onUnauthorized });
    expect(await module.acceptInvitationWithMandate?.execute()).toEqual({ status: 'wallet-failed', message: 'Sign in first' });
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });
});
