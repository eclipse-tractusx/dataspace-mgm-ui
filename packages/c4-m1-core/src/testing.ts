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

// Entry point @dataspace-mgm/c4-m1-core/testing: in-memory adapters, fixtures (from mockups/wallets/shared/data.js) and
// the in-memory module, for mock mode and for tests of pages and use cases. Pages never import it.

import { ConfirmRevocationUseCase } from './application/useCases/confirm-revocation.use-case';
import { CountCredentialsByStatusUseCase } from './application/useCases/count-credentials-by-status.use-case';
import { GetCredentialUseCase } from './application/useCases/get-credential.use-case';
import { ListCompanyCredentialsUseCase } from './application/useCases/list-company-credentials.use-case';
import { ListCredentialsUseCase } from './application/useCases/list-credentials.use-case';
import { ListOpenItemsUseCase } from './application/useCases/list-open-items.use-case';
import type { C4M1Module } from './data/c4-m1-module.data';
import { C4M1_TEST_COMPANY_IDS } from './domain/testing/c4-m1-test-ids.fixtures';
import { COMPANY_CREDENTIALS } from './domain/testing/company-credentials.fixtures';
import { CREDENTIALS_OF_ALL_COMPANIES } from './domain/testing/credentials.fixtures';
import type { InMemoryC4M1ModuleOptions } from './domain/testing/in-memory-c4-m1-module-options.data';
import { InMemoryCompanyCredentialRepository } from './domain/testing/in-memory-company-credential.repository';
import { InMemoryCredentialRepository } from './domain/testing/in-memory-credential.repository';

export { c4m1Problem } from './domain/testing/c4-m1-problem.fixtures';
export { C4M1_FIXTURES_NOW, C4M1_TEST_COMPANY_IDS } from './domain/testing/c4-m1-test-ids.fixtures';
export { COMPANY_CREDENTIALS } from './domain/testing/company-credentials.fixtures';
export {
  CREDENTIALS_OF_ALL_COMPANIES,
  FAILED_CREDENTIAL,
  ISSUED_CREDENTIAL,
  OVERDUE_REQUESTED_CREDENTIAL,
  REQUESTED_CREDENTIAL,
  REVOCATION_PENDING_CREDENTIAL,
} from './domain/testing/credentials.fixtures';
export { CATENA_X_DATASPACE, SEMICONDUCTOR_DATASPACE } from './domain/testing/dataspace.fixtures';
export type { InMemoryC4M1ModuleOptions } from './domain/testing/in-memory-c4-m1-module-options.data';
export type { InMemoryCredentialCall } from './domain/testing/in-memory-credential-call.data';
export { InMemoryCompanyCredentialRepository } from './domain/testing/in-memory-company-credential.repository';
export { InMemoryCredentialRepository } from './domain/testing/in-memory-credential.repository';

/** All use cases of C4-M1 on the in-memory adapters, for mock mode (apps/portal/src/core/mock-container.ts) and tests. */
export function createInMemoryC4M1Module(options: InMemoryC4M1ModuleOptions = {}): C4M1Module {
  const companyCredentials = new InMemoryCompanyCredentialRepository(
    options.companyCredentials ?? { [C4M1_TEST_COMPANY_IDS.beispielMaschinenbau]: COMPANY_CREDENTIALS.issued },
    options.companyCredentialFailure ?? null,
  );
  const credentials = new InMemoryCredentialRepository(
    options.credentials ?? CREDENTIALS_OF_ALL_COMPANIES,
    options.credentialFailure ?? null,
    options.clock,
  );
  return {
    listCompanyCredentials: new ListCompanyCredentialsUseCase(companyCredentials),
    listCredentials: new ListCredentialsUseCase(credentials),
    countCredentialsByStatus: new CountCredentialsByStatusUseCase(credentials),
    getCredential: new GetCredentialUseCase(credentials),
    confirmRevocation: new ConfirmRevocationUseCase(credentials),
    listOpenItems: new ListOpenItemsUseCase(credentials, { clock: options.clock, openOrderHours: options.openOrderHours }),
  };
}
