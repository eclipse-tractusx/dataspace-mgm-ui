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

import type { ReactNode } from 'react';
import { c3m1ModuleFrom, type CompanyAnemic } from '@dataspace-mgm/c3-m1-core';
import {
  InMemoryC3M1Store,
  InMemoryChangeRequestReviewRepository,
  InMemoryCompanyRepository,
  InMemoryCompanyRoleRepository,
  InMemoryOspCompanyRepository,
  InMemoryOwnChangeRequestRepository,
  InMemoryOwnCompanyRepository,
  type InMemoryC3M1StoreOptions,
} from '@dataspace-mgm/c3-m1-core/testing';
import { GetCspRegistrationUseCase, type CspRegistrationAnemic } from '@dataspace-mgm/c3-m2-core';
import { CSP_REGISTRATIONS, InMemoryCspRegistrationRepository } from '@dataspace-mgm/c3-m2-core/testing';
import { createC1M2UseCases } from '@dataspace-mgm/c1-m2-core';
import { createMockC1M2Ports, type MockC1M2Options } from '@dataspace-mgm/c1-m2-core/testing';
import { createIdentityModule, type SessionAnemic } from '@dataspace-mgm/identity-core';
import { InMemorySessionRepository, RecordingRedirect } from '@dataspace-mgm/identity-core/testing';
import { CoreModulesProvider } from './CoreModulesContext';
import type { CoreModules } from './container';

interface TestModulesOptions {
  session?: SessionAnemic | null;
  /** The own company from a list (as before); without it, the own company comes from the participants store. */
  companies?: ReadonlyArray<CompanyAnemic>;
  companyFailure?: Error;
  /** Data and injected answers of the in-memory C3-M1 (participant management); the actor is the session's person. */
  participants?: Omit<InMemoryC3M1StoreOptions, 'actorId'>;
  cspRegistrations?: ReadonlyArray<CspRegistrationAnemic>;
  cspFailure?: Error;
  /** C1-M2 Registration (proof of concept) on its in-memory adapters; absent = `modules.c1m2` is undefined. */
  c1m2?: Pick<MockC1M2Options, 'applications' | 'existingCompanies' | 'agreements' | 'failure' | 'now'>;
}

/** The core packages with in-memory adapters: pages are tested against the use cases, without HTTP. */
export function testCoreModules({
  session = null,
  companies,
  companyFailure,
  participants = {},
  cspRegistrations = CSP_REGISTRATIONS,
  cspFailure,
  c1m2,
}: TestModulesOptions = {}) {
  const redirect = new RecordingRedirect();
  const companyRepository = new InMemoryCompanyRepository(companies ?? [], companyFailure ?? null);
  const store = new InMemoryC3M1Store({ ...participants, actorId: session?.user.id });
  const cspRepository = new InMemoryCspRegistrationRepository(cspRegistrations, cspFailure ?? null);
  const c1m2Ports = c1m2 ? createMockC1M2Ports(session, { ...c1m2, applications: c1m2.applications ?? [] }) : undefined;
  const modules: CoreModules = {
    identity: createIdentityModule({ bffBaseUrl: '', sessions: new InMemorySessionRepository(session), redirect }),
    c3m1: c3m1ModuleFrom({
      companies: companies || companyFailure ? companyRepository : new InMemoryOwnCompanyRepository(store),
      ownChangeRequests: new InMemoryOwnChangeRequestRepository(store),
      companyRoles: new InMemoryCompanyRoleRepository(store),
      ospCompanies: new InMemoryOspCompanyRepository(store),
      reviews: new InMemoryChangeRequestReviewRepository(store),
    }),
    c3m2: { getCspRegistration: new GetCspRegistrationUseCase(cspRepository) },
    c1m2: c1m2Ports ? createC1M2UseCases(c1m2Ports) : undefined,
  };
  return { modules, redirect, companyRepository, store, cspRepository, applicationRepository: c1m2Ports?.applications };
}

export function TestCoreModules({ modules, children }: { modules?: CoreModules; children: ReactNode }) {
  return <CoreModulesProvider modules={modules ?? testCoreModules().modules}>{children}</CoreModulesProvider>;
}
