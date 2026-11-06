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

import { describe, expect, it } from 'vitest';
import { c4m1Problem } from '../../domain/testing/c4-m1-problem.fixtures';
import { C4M1_FIXTURES_NOW } from '../../domain/testing/c4-m1-test-ids.fixtures';
import {
  CREDENTIALS_OF_ALL_COMPANIES,
  FAILED_CREDENTIAL,
  REVOCATION_PENDING_CREDENTIAL,
} from '../../domain/testing/credentials.fixtures';
import { InMemoryCredentialRepository } from '../../domain/testing/in-memory-credential.repository';
import { ConfirmRevocationUseCase } from './confirm-revocation.use-case';

const NOW = new Date(C4M1_FIXTURES_NOW);
const repositoryWith = (failure: Error | null = null) =>
  new InMemoryCredentialRepository(CREDENTIALS_OF_ALL_COMPANIES, failure, () => NOW);

describe('ConfirmRevocationUseCase', () => {
  it('confirms a pending revocation and returns the revoked credential', async () => {
    const repository = repositoryWith();
    const result = await new ConfirmRevocationUseCase(repository).execute(
      REVOCATION_PENDING_CREDENTIAL.id,
      '  Revoked at the Credential Issuer, ticket 4711  ',
    );
    expect(result).toEqual({
      status: 'confirmed',
      credential: { ...REVOCATION_PENDING_CREDENTIAL, status: 'REVOKED', revokedAt: NOW.toISOString(), changedAt: NOW.toISOString() },
    });
    expect(repository.calls).toEqual([
      { method: 'confirmRevocation', credentialId: REVOCATION_PENDING_CREDENTIAL.id, note: 'Revoked at the Credential Issuer, ticket 4711' },
    ]);
  });

  it('does not call the module for an empty note', async () => {
    const repository = repositoryWith();
    const result = await new ConfirmRevocationUseCase(repository).execute(REVOCATION_PENDING_CREDENTIAL.id, '   ');
    expect(result).toEqual({ status: 'invalid', key: 'validation.revocationNoteRequired', error: null });
    expect(repository.calls).toEqual([]);
  });

  it('does not call the module for a note over 500 characters', async () => {
    const result = await new ConfirmRevocationUseCase(repositoryWith()).execute(REVOCATION_PENDING_CREDENTIAL.id, 'x'.repeat(501));
    expect(result).toEqual({ status: 'invalid', key: 'validation.revocationNoteTooLong', error: null });
  });

  it('reports a 400 of the module as invalid, with the error', async () => {
    const result = await new ConfirmRevocationUseCase(repositoryWith(c4m1Problem(400, 'validation'))).execute(
      REVOCATION_PENDING_CREDENTIAL.id,
      'ticket 4711',
    );
    expect(result).toEqual({
      status: 'invalid',
      key: 'validation.revocationNoteRejected',
      error: { status: 400, problemType: 'urn:c4-m1:problem:validation', message: 'validation' },
    });
  });

  it('reports a 409 for a status that does not allow it as conflict', async () => {
    const result = await new ConfirmRevocationUseCase(repositoryWith()).execute(FAILED_CREDENTIAL.id, 'ticket 4711');
    expect(result).toEqual({
      status: 'conflict',
      error: {
        status: 409,
        problemType: 'urn:c4-m1:problem:invalid-state',
        message: 'status FAILED does not allow the confirmation',
      },
    });
  });

  it('reports an unknown credential as not-found', async () => {
    const result = await new ConfirmRevocationUseCase(repositoryWith()).execute('c4c00999-0000-4000-8000-000000000999', 'ticket');
    expect(result).toEqual({ status: 'not-found' });
  });

  it('reports a thrown 404 as not-found', async () => {
    const result = await new ConfirmRevocationUseCase(repositoryWith(c4m1Problem(404, 'not-found'))).execute(
      REVOCATION_PENDING_CREDENTIAL.id,
      'ticket',
    );
    expect(result).toEqual({ status: 'not-found' });
  });

  it('reports a 403 as forbidden', async () => {
    const result = await new ConfirmRevocationUseCase(repositoryWith(c4m1Problem(403, 'forbidden'))).execute(
      REVOCATION_PENDING_CREDENTIAL.id,
      'ticket',
    );
    expect(result).toEqual({ status: 'forbidden' });
  });

  it('reports every other error as failed', async () => {
    const result = await new ConfirmRevocationUseCase(repositoryWith(c4m1Problem(502, 'upstream-error'))).execute(
      REVOCATION_PENDING_CREDENTIAL.id,
      'ticket',
    );
    expect(result).toEqual({
      status: 'failed',
      error: { status: 502, problemType: 'urn:c4-m1:problem:upstream-error', message: 'upstream-error' },
    });
  });
});
