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

/**
 * Entry point @dataspace-mgm/c1-m2-core/testing: the in-memory adapters (a test double of the C1-M2 backend), the
 * fixtures of the specs and the mock attestation, for mock mode and tests. Pages never import it.
 */
export { createMockC1M2Module, createMockC1M2Ports, type MockC1M2Options } from './domain/testing/create-mock-c1-m2-module';
export { InMemoryAgreementRepository, type AgreementVersionSource, type InMemoryAgreementOptions } from './domain/testing/in-memory-agreement.repository';
export { InMemoryApplicationRepository, type InMemoryApplicationOptions } from './domain/testing/in-memory-application.repository';
export { InMemoryWalletAttestationRepository, type InMemoryWalletAttestationOptions } from './domain/testing/in-memory-wallet-attestation.repository';
export { InMemoryReferenceDataRepository, type InMemoryReferenceDataOptions } from './domain/testing/in-memory-reference-data.repository';
export { callerOf, NO_PERMISSIONS_CALLER, type CallerFixture } from './domain/testing/mock-caller';
export {
  decodeMockAttestation,
  mockAttestation,
  MOCK_ATTESTATION_AUDIENCE,
  MOCK_ATTESTATION_CLIENT_ID,
  MOCK_ATTESTATION_ISSUER,
} from './domain/testing/mock-attestation';
export type { MockAttestationClaims, MockAttestationOverrides, MockAttestedCompanyClaims } from './domain/testing/mock-attestation-claims';
export {
  ERIKA_APPLICATION_COMPLETED,
  ERIKA_APPLICATION_CREATED,
  ERIKA_APPLICATION_SUBMITTED,
  ERIKA_ATTESTATION,
  HANS_APPLICATION_DECLINED,
  HANS_APPLICATION_DOCUMENTS,
  MAX_APPLICATION_REACTIVATION,
  MAX_APPLICATION_TRANSFER_RETURN,
  MAX_GIESSEREI_ATTESTATION,
  MAX_WERKZEUGBAU_ATTESTATION,
  MOCK_MODE_APPLICATIONS,
  MOCK_PDF_CONTENT,
} from './domain/testing/fixtures/applications.fixture';
export { AGREEMENT_VERSIONS, COMPANY_ROLES, type CompanyRoleFixture } from './domain/testing/fixtures/catalog.fixture';
export {
  EXISTING_COMPANIES,
  FRAMEWORK_COMPANY_IDS,
  GIESSEREI_CLAIMS,
  GIESSEREI_COMPANY,
  MASCHINENBAU_CLAIMS,
  OSP_A_EXISTING_COMPANY,
  WERKZEUGBAU_CLAIMS,
  WERKZEUGBAU_COMPANY,
  type ExistingCompanyFixture,
} from './domain/testing/fixtures/companies.fixture';
export { REFERENCE_DATA, type ReferenceDataFixture } from './domain/testing/fixtures/reference-data.fixture';
export { ERIKA_SESSION, HANS_SESSION, LIESCHEN_SESSION, MAX_SESSION, OTTO_SESSION, ROLF_SESSION } from './domain/testing/fixtures/sessions.fixture';
