/********************************************************************************
 * Copyright (c) 2026 Catena-X Automotive Network e.V.
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
 * Assisted-By: Claude Code (claude-opus-5-5)
 ********************************************************************************/

import { CoreHttpException } from '@dataspace-mgm/core-http';
import { describe, expect, it } from 'vitest';
import { decodeMockAttestation } from '../../domain/testing/mock-attestation';
import { InMemoryWalletAttestationRepository } from '../../domain/testing/in-memory-wallet-attestation.repository';
import { callerOf } from '../../domain/testing/mock-caller';
import { ERIKA_SESSION, MAX_SESSION } from '../../domain/testing/fixtures/sessions.fixture';
import { RequestAttestationUseCase } from './request-attestation.use-case';

describe('RequestAttestationUseCase', () => {
  it('receives the attestation of the person and their company', async () => {
    const wallet = new InMemoryWalletAttestationRepository({ caller: callerOf(ERIKA_SESSION) });
    const result = await new RequestAttestationUseCase(wallet).execute();
    expect(result.status).toBe('received');
    const payload = result.status === 'received' ? decodeMockAttestation(result.attestation)?.payload : undefined;
    expect(payload).toMatchObject({ person: { given_name: 'Erika', family_name: 'Mustermann' }, company: { legal_name: 'Beispiel Maschinenbau GmbH' } });
    expect(wallet.calls).toEqual(['requestAttestation']);
  });

  it('gives Max Mustermann the wallet of Beispiel Werkzeugbau GmbH (reactivation)', async () => {
    const result = await new RequestAttestationUseCase(new InMemoryWalletAttestationRepository({ caller: callerOf(MAX_SESSION) })).execute();
    const payload = result.status === 'received' ? decodeMockAttestation(result.attestation)?.payload : undefined;
    expect(payload).toMatchObject({ person: { given_name: 'Max' }, company: { ebwoid: 'EBWOID-DE-0000000003' } });
  });

  it('reports a cancelled wallet step and a failure', async () => {
    const caller = callerOf(ERIKA_SESSION);
    expect(await new RequestAttestationUseCase(new InMemoryWalletAttestationRepository({ caller, cancel: true })).execute()).toEqual({ status: 'cancelled' });
    const failure = new CoreHttpException(502, null, 'EBW-Connector not reachable');
    expect(await new RequestAttestationUseCase(new InMemoryWalletAttestationRepository({ caller, failure })).execute()).toEqual({
      status: 'failed',
      error: { status: 502, problemType: null, message: 'EBW-Connector not reachable' },
    });
  });
});
