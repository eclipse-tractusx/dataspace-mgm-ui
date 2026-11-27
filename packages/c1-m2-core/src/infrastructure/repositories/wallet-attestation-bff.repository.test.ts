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
import { RequestAttestationUseCase } from '../../application/useCases/request-attestation.use-case';
import { WalletAttestationBffRepository } from './wallet-attestation-bff.repository';

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

function world(answer: Response) {
  const fetchImpl = vi.fn<typeof fetch>(async () => answer);
  const leave = vi.fn<(url: string) => void>();
  const onUnauthorized = vi.fn();
  const wallet = new WalletAttestationBffRepository({
    bffBaseUrl: '',
    getCsrfToken: () => 'csrf-1',
    onUnauthorized,
    fetch: fetchImpl,
    leave,
    currentPath: () => '/onboarding/application/7/terms?tab=1',
  });
  return { wallet, fetchImpl, leave, onUnauthorized };
}

/** Whether a promise is still pending after the current tasks ran. */
async function isPending(promise: Promise<unknown>): Promise<boolean> {
  const marker = Symbol('pending');
  return (await Promise.race([promise, new Promise((resolve) => setTimeout(() => resolve(marker), 10))])) === marker;
}

describe('WalletAttestationBffRepository', () => {
  it('collects the attestation at the BFF with the session cookie and the CSRF token, without leaving the portal', async () => {
    const { wallet, fetchImpl, leave } = world(json(200, { status: 'received', attestation: 'aaa.bbb.ccc' }));
    expect(await wallet.requestAttestation('/onboarding/start?kind=ONBOARDING')).toBe('aaa.bbb.ccc');
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('/ebw/attestation');
    expect(init).toMatchObject({ method: 'POST', credentials: 'include' });
    expect(init?.headers).toMatchObject({ 'X-CSRF-Token': 'csrf-1' });
    expect(leave).not.toHaveBeenCalled();
  });

  it('leaves the portal for the wallet step when nothing is to collect, and comes back to the page it was given', async () => {
    const { wallet, leave } = world(json(200, { status: 'none' }));
    const pending = wallet.requestAttestation('/onboarding/start?kind=TRANSFER&bpn=BPNL000000000001');
    expect(await isPending(pending)).toBe(true);
    expect(leave).toHaveBeenCalledTimes(1);
    expect(leave).toHaveBeenCalledWith(`/ebw/attestation/start?return_to=${encodeURIComponent('/onboarding/start?kind=TRANSFER&bpn=BPNL000000000001')}`);
  });

  it('returns to the current page when the caller names none', async () => {
    const { wallet, leave } = world(json(200, { status: 'none' }));
    void wallet.requestAttestation();
    await vi.waitFor(() => expect(leave).toHaveBeenCalled());
    expect(leave).toHaveBeenCalledWith(`/ebw/attestation/start?return_to=${encodeURIComponent('/onboarding/application/7/terms?tab=1')}`);
  });

  it('reports a cancelled step as null and a failed one as an error with the reason, through the use case as results', async () => {
    expect(await world(json(200, { status: 'cancelled' })).wallet.requestAttestation()).toBeNull();
    await expect(world(json(200, { status: 'failed', reason: 'STATUS_UNAVAILABLE' })).wallet.requestAttestation()).rejects.toThrow('The wallet step failed (STATUS_UNAVAILABLE).');

    expect(await new RequestAttestationUseCase(world(json(200, { status: 'cancelled' })).wallet).execute('/x')).toEqual({ status: 'cancelled' });
    expect(await new RequestAttestationUseCase(world(json(200, { status: 'failed', reason: 'EXPIRED' })).wallet).execute('/x')).toEqual({
      status: 'failed',
      error: { status: null, problemType: null, message: 'The wallet step failed (EXPIRED).' },
    });
    expect(await new RequestAttestationUseCase(world(json(200, { status: 'received', attestation: 'a.b.c' })).wallet).execute('/x')).toEqual({ status: 'received', attestation: 'a.b.c' });
  });

  it('reports a BFF without the wallet step (404) with the Problem Details of the answer', async () => {
    const problem = { type: 'urn:portal-bff:problem:not-found', title: 'not-found', status: 404, detail: 'The wallet step is not connected.' };
    const { wallet, leave } = world(json(404, problem));
    const failure = await wallet.requestAttestation().catch((error: unknown) => error);
    expect(failure).toBeInstanceOf(CoreHttpException);
    expect(failure).toMatchObject({ status: 404, problemType: 'urn:portal-bff:problem:not-found', message: 'The wallet step is not connected.' });
    expect(leave).not.toHaveBeenCalled();
  });

  it('starts the sign-in on a 401 and does not leave for the wallet', async () => {
    const { wallet, leave, onUnauthorized } = world(json(401, { type: 'urn:portal-bff:problem:unauthorized', title: 'unauthorized', status: 401 }));
    await expect(wallet.requestAttestation()).rejects.toMatchObject({ status: 401 });
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
    expect(leave).not.toHaveBeenCalled();
  });

  it.each([
    ['an answer that is no JSON', new Response('<html>', { status: 200 })],
    ['an unknown status', json(200, { status: 'surprise' })],
    ['received without an attestation', json(200, { status: 'received' })],
  ])('refuses %s', async (_name, answer) => {
    const { wallet, leave } = world(answer);
    await expect(wallet.requestAttestation()).rejects.toThrow('The answer of the wallet step was not understood.');
    expect(leave).not.toHaveBeenCalled();
  });
});
