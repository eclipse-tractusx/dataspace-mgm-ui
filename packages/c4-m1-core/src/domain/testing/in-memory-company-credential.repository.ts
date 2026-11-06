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

import type { CredentialStatusAnemic } from '../anemics/credential-status.anemic';
import type { CompanyCredentialRepository } from '../repositories/company-credential.repository';

/** In-memory adapter of the port, for tests of use cases and pages without HTTP. Records the company IDs it is asked for. */
export class InMemoryCompanyCredentialRepository implements CompanyCredentialRepository {
  public readonly calls: string[] = [];

  /** `credentialsByCompany`: the list per company ID; a company that is not in it answers 404 (null). */
  constructor(
    private readonly credentialsByCompany: Readonly<Record<string, ReadonlyArray<CredentialStatusAnemic>>> = {},
    private readonly failure: Error | null = null,
  ) {}

  public async listCompanyCredentials(companyId: string): Promise<ReadonlyArray<CredentialStatusAnemic> | null> {
    this.calls.push(companyId);
    if (this.failure) {
      throw this.failure;
    }
    return Object.hasOwn(this.credentialsByCompany, companyId) ? this.credentialsByCompany[companyId] : null;
  }
}
