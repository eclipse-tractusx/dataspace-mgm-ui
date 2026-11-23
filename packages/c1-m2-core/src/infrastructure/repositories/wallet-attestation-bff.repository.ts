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

import { CoreHttpException, HTTP } from '@dataspace-mgm/core-http';
import type { WalletAttestationRepository } from '../../domain/repositories/wallet-attestation.repository';
import type { WalletStepOptions, WalletStepOutcomeDto } from '../data/c1-m2-infrastructure.data';

const COLLECT_PATH = '/ebw/attestation';
const START_PATH = '/ebw/attestation/start';

function outcomeOf(body: unknown): WalletStepOutcomeDto | null {
  if (typeof body !== 'object' || body === null) {
    return null;
  }
  const { status, attestation, reason } = body as Record<string, unknown>;
  if (status === 'received' && typeof attestation === 'string' && attestation.length > 0) {
    return { status, attestation };
  }
  if (status === 'failed') {
    return { status, reason: typeof reason === 'string' ? reason : 'unknown' };
  }
  return status === 'cancelled' || status === 'none' ? { status } : null;
}

/**
 * Adapter of the wallet step behind the BFF (FRAMEWORK 5.2 step 2). The BFF is the client of the EBW-Connector and
 * keeps the outcome of a step in the session:
 *
 * 1. `POST /ebw/attestation` collects the outcome, once. `received`: the verification attestation; `cancelled`: the
 *    person declined in the wallet; `failed`: an error with the reason of the EBW-Connector.
 * 2. `none`: no step has ended. The browser leaves the portal for `GET /ebw/attestation/start?return_to=…`, which
 *    sends it to the EBW-Connector; it comes back to `return_to` with `wallet=returned`. The promise of this call
 *    never settles, because the page is gone; the page calls again after the return and gets the outcome of 1.
 *
 * The only place of the package that touches `window`.
 */
export class WalletAttestationBffRepository implements WalletAttestationRepository {
  constructor(private readonly options: WalletStepOptions) {}

  public async requestAttestation(returnTo?: string): Promise<string | null> {
    const outcome = await this.collect();
    if (outcome.status === 'received') {
      return outcome.attestation;
    }
    if (outcome.status === 'cancelled') {
      return null;
    }
    if (outcome.status === 'failed') {
      throw new Error(`The wallet step failed (${outcome.reason}).`);
    }
    const target = returnTo ?? (this.options.currentPath ?? (() => `${window.location.pathname}${window.location.search}`))();
    const leave = this.options.leave ?? ((url: string) => window.location.assign(url));
    leave(`${this.options.bffBaseUrl}${START_PATH}?return_to=${encodeURIComponent(target)}`);
    return new Promise<string | null>(() => undefined);
  }

  private async collect(): Promise<WalletStepOutcomeDto> {
    const fetchImpl = this.options.fetch ?? ((...args: Parameters<typeof fetch>) => fetch(...args));
    const csrf = this.options.getCsrfToken?.() ?? null;
    const response = await fetchImpl(`${this.options.bffBaseUrl}${COLLECT_PATH}`, {
      method: 'POST',
      credentials: 'include',
      headers: { accept: 'application/json', ...(csrf !== null ? { [HTTP.CSRF_HEADER]: csrf } : {}) },
    });
    if (response.status === HTTP.UNAUTHORIZED) {
      this.options.onUnauthorized?.();
    }
    if (!response.ok) {
      const problem = (await response.json().catch(() => ({}))) as { type?: unknown; detail?: unknown; title?: unknown };
      const message = typeof problem.detail === 'string' ? problem.detail : typeof problem.title === 'string' ? problem.title : `${response.status} ${COLLECT_PATH}`;
      throw new CoreHttpException(response.status, typeof problem.type === 'string' ? problem.type : null, message);
    }
    const outcome = outcomeOf(await response.json().catch(() => null));
    if (!outcome) {
      throw new Error('The answer of the wallet step was not understood.');
    }
    return outcome;
  }
}
