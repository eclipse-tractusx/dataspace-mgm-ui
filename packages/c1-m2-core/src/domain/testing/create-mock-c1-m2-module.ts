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

import type { SessionAnemic } from '@dataspace-mgm/identity-core';
import { createC1M2UseCases, type C1M2Ports } from '../../application/c1-m2-use-cases.factory';
import type { C1M2Module } from '../../data/c1-m2-module.data';
import type { AgreementVersionAnemic } from '../anemics/agreement-version.anemic';
import type { ApplicationWithReviewAnemic } from '../anemics/application-with-review.anemic';
import { MOCK_MODE_APPLICATIONS } from './fixtures/applications.fixture';
import type { ExistingCompanyFixture } from './fixtures/companies.fixture';
import { InMemoryAgreementRepository } from './in-memory-agreement.repository';
import { InMemoryApplicationRepository } from './in-memory-application.repository';
import { InMemoryReferenceDataRepository } from './in-memory-reference-data.repository';
import { InMemoryWalletAttestationRepository } from './in-memory-wallet-attestation.repository';
import { NO_PERMISSIONS_CALLER, callerOf } from './mock-caller';

export interface MockC1M2Options {
  /** Preloaded applications; default MOCK_MODE_APPLICATIONS. */
  applications?: ReadonlyArray<ApplicationWithReviewAnemic>;
  existingCompanies?: ReadonlyArray<ExistingCompanyFixture>;
  /** Versions of the terms; default AGREEMENT_VERSIONS of C1-M2 README 14.3. */
  agreements?: ReadonlyArray<AgreementVersionAnemic>;
  documentsEnabled?: boolean;
  now?: () => Date;
  /** Every call of every port fails with this error. */
  failure?: Error | null;
  /** The time the wallet takes to answer the attestation request; default 0. */
  walletDelayMs?: number;
}

/** The in-memory adapters of C1-M2 with the caller of the session, sharing one list of terms. */
export function createMockC1M2Ports(session: SessionAnemic | null, options: MockC1M2Options = {}) {
  const caller = session ? callerOf(session) : NO_PERMISSIONS_CALLER;
  const failure = options.failure ?? null;
  const agreements = new InMemoryAgreementRepository({ versions: options.agreements, caller, now: options.now, failure });
  const referenceData = new InMemoryReferenceDataRepository({ agreements, failure });
  const applications = new InMemoryApplicationRepository({
    caller,
    applications: options.applications ?? MOCK_MODE_APPLICATIONS,
    existingCompanies: options.existingCompanies,
    agreements,
    documentsEnabled: options.documentsEnabled,
    now: options.now,
    failure,
  });
  const wallet = new InMemoryWalletAttestationRepository({ caller, now: options.now, failure, delayMs: options.walletDelayMs });
  return { referenceData, applications, agreements, wallet } satisfies C1M2Ports;
}

/**
 * C1-M2 for mock mode (`VITE_USE_MOCKS=true`): every use case on the in-memory adapters, signed in as the person of
 * the session (null: signed out, every call answers 403). Phase 3 replaces it with createC1M2Module (HTTP).
 */
export function createMockC1M2Module(session: SessionAnemic | null, options: MockC1M2Options = {}): C1M2Module {
  return createC1M2UseCases(createMockC1M2Ports(session, options));
}
