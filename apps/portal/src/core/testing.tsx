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
import { createC1M2UseCases } from '@dataspace-mgm/c1-m2-core';
import { createMockC1M2Ports, type MockC1M2Options } from '@dataspace-mgm/c1-m2-core/testing';
import { GetOwnCompanyUseCase, type CompanyAnemic } from '@dataspace-mgm/c3-m1-core';
import { InMemoryCompanyRepository } from '@dataspace-mgm/c3-m1-core/testing';
import type { C4M1Module } from '@dataspace-mgm/c4-m1-core';
import { createInMemoryC4M1Module, type InMemoryC4M1ModuleOptions } from '@dataspace-mgm/c4-m1-core/testing';
import { createIdentityModule, type SessionAnemic } from '@dataspace-mgm/identity-core';
import { InMemorySessionRepository, RecordingRedirect } from '@dataspace-mgm/identity-core/testing';
import { CoreModulesProvider } from './CoreModulesContext';
import type { CoreModules } from './container';

interface TestModulesOptions {
  session?: SessionAnemic | null;
  companies?: ReadonlyArray<CompanyAnemic>;
  companyFailure?: Error;
  /**
   * C4-M1 (proof of concept): `true` for the module on the mockup's fixtures, the options of
   * createInMemoryC4M1Module for other fixtures or a failure, or a module (e.g. with recording adapters).
   * Absent: the module is not connected.
   */
  c4m1?: true | InMemoryC4M1ModuleOptions | C4M1Module;
  /** C1-M2 Registration (proof of concept) on its in-memory adapters; absent = `modules.c1m2` is undefined. */
  c1m2?: Pick<MockC1M2Options, 'applications' | 'existingCompanies' | 'agreements' | 'failure' | 'now'>;
}

function c4m1Module(option: TestModulesOptions['c4m1']): C4M1Module | undefined {
  if (option === undefined) {
   return undefined;
  }
  if (option === true) {
   return createInMemoryC4M1Module();
  }
  return 'listCompanyCredentials' in option ? option : createInMemoryC4M1Module(option);
}

/** The core packages with in-memory adapters: pages are tested against the use cases, without HTTP. */
export function testCoreModules({ session = null, companies = [], companyFailure, c1m2, c4m1 }: TestModulesOptions = {}) {
  const redirect = new RecordingRedirect();
  const companyRepository = new InMemoryCompanyRepository(companies, companyFailure ?? null);
  const c1m2Ports = c1m2 ? createMockC1M2Ports(session, { ...c1m2, applications: c1m2.applications ?? [] }) : undefined;
  const modules: CoreModules = {
    identity: createIdentityModule({ bffBaseUrl: '', sessions: new InMemorySessionRepository(session), redirect }),
    c3m1: { getOwnCompany: new GetOwnCompanyUseCase(companyRepository) },
    c4m1: c4m1Module(c4m1),
    c1m2: c1m2Ports ? createC1M2UseCases(c1m2Ports) : undefined,
  };
  return { modules, redirect, companyRepository, applicationRepository: c1m2Ports?.applications };
}

export function TestCoreModules({ modules, children }: { modules?: CoreModules; children: ReactNode }) {
  return <CoreModulesProvider modules={modules ?? testCoreModules().modules}>{children}</CoreModulesProvider>;
}
