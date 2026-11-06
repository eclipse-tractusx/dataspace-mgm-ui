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

import type { CredentialDetailAnemic } from '../anemics/credential-detail.anemic';
import type { CredentialPageAnemic } from '../anemics/credential-page.anemic';
import { CREDENTIAL_PAGE_MAX_SIZE } from '../data/credential-page-limits.data';
import type { CredentialQuery } from '../data/credential-query.data';
import { REVOCATION_NOTE_MAX_LENGTH, REVOCATION_NOTE_MIN_LENGTH } from '../data/revocation-note-limits.data';
import type { CredentialRepository } from '../repositories/credential.repository';
import type { RevocationNote } from '../valueObjects/revocation-note.value-object';
import { c4m1Problem } from './c4-m1-problem.fixtures';
import type { InMemoryCredentialCall } from './in-memory-credential-call.data';

const byChangedAtDescending = (a: CredentialDetailAnemic, b: CredentialDetailAnemic): number =>
  Date.parse(b.changedAt) - Date.parse(a.changedAt);

/**
 * In-memory adapter of the port, for tests and mock mode. It answers like C4-M1 0.2: `listCredentials` filters
 * (status, credentialType, companyId, route, requestedBefore), sorts by `changedAt` descending and pages;
 * `confirmRevocation` turns REVOCATION_PENDING into REVOKED (README 7.3). Records every call; built with a failure, it
 * throws it on every call.
 */
export class InMemoryCredentialRepository implements CredentialRepository {
  public readonly calls: InMemoryCredentialCall[] = [];
  private credentials: CredentialDetailAnemic[];

  constructor(
    credentials: ReadonlyArray<CredentialDetailAnemic> = [],
    private readonly failure: Error | null = null,
    private readonly clock: () => Date = () => new Date(),
  ) {
    this.credentials = [...credentials];
  }

  public async listCredentials(query: CredentialQuery): Promise<CredentialPageAnemic> {
    this.calls.push({ method: 'listCredentials', query });
    this.throwFailure();
    const { page, size } = query;
    if (!Number.isInteger(page) || page < 0 || !Number.isInteger(size) || size < 1 || size > CREDENTIAL_PAGE_MAX_SIZE) {
      throw c4m1Problem(400, 'validation', 'page or size out of range');
    }
    const matches = this.credentials.filter((credential) => InMemoryCredentialRepository.matches(credential, query));
    matches.sort(byChangedAtDescending);
    return { items: matches.slice(page * size, (page + 1) * size), page, size, total: matches.length };
  }

  public async getCredential(credentialId: string): Promise<CredentialDetailAnemic | null> {
    this.calls.push({ method: 'getCredential', credentialId });
    this.throwFailure();
    return this.credentials.find((credential) => credential.id === credentialId) ?? null;
  }

  public async confirmRevocation(credentialId: string, note: RevocationNote): Promise<CredentialDetailAnemic | null> {
    this.calls.push({ method: 'confirmRevocation', credentialId, note });
    this.throwFailure();
    if (note.length < REVOCATION_NOTE_MIN_LENGTH || note.length > REVOCATION_NOTE_MAX_LENGTH) {
      throw c4m1Problem(400, 'validation', 'note must have 1 to 500 characters');
    }
    const index = this.credentials.findIndex((credential) => credential.id === credentialId);
    if (index < 0) {
      return null;
    }
    const credential = this.credentials[index];
    if (credential.status === 'REVOKED') {
      return credential;
    }
    if (credential.status !== 'REVOCATION_PENDING') {
      throw c4m1Problem(409, 'invalid-state', `status ${credential.status} does not allow the confirmation`);
    }
    const now = this.clock().toISOString();
    const revoked: CredentialDetailAnemic = { ...credential, status: 'REVOKED', revokedAt: now, changedAt: now };
    this.credentials[index] = revoked;
    return revoked;
  }

  private throwFailure(): void {
    if (this.failure) {
      throw this.failure;
    }
  }

  private static matches(credential: CredentialDetailAnemic, query: CredentialQuery): boolean {
    if (query.status && query.status.length > 0 && !query.status.includes(credential.status)) {
      return false;
    }
    if (query.credentialType && credential.credentialType !== query.credentialType) {
      return false;
    }
    if (query.companyId && credential.companyId !== query.companyId) {
      return false;
    }
    if (query.route && credential.route !== query.route) {
      return false;
    }
    if (query.requestedBefore) {
      return credential.requestedAt !== null && Date.parse(credential.requestedAt) < Date.parse(query.requestedBefore);
    }
    return true;
  }
}
