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

// Test helpers of the feature (tests only): the routes of the feature on in-memory adapters that record their calls.

import {
  ConfirmRevocationUseCase,
  CountCredentialsByStatusUseCase,
  GetCredentialUseCase,
  ListCompanyCredentialsUseCase,
  ListCredentialsUseCase,
  ListOpenItemsUseCase,
  type C4M1Module,
  type CredentialDetailAnemic,
  type CredentialStatusAnemic,
} from '@dataspace-mgm/c4-m1-core';
import {
  C4M1_FIXTURES_NOW,
  C4M1_TEST_COMPANY_IDS,
  COMPANY_CREDENTIALS,
  CREDENTIALS_OF_ALL_COMPANIES,
  InMemoryCompanyCredentialRepository,
  InMemoryCredentialRepository,
} from '@dataspace-mgm/c4-m1-core/testing';
import type { CompanyAnemic } from '@dataspace-mgm/c3-m1-core';
import type { SessionAnemic } from '@dataspace-mgm/identity-core';
import { ColorModeProvider } from '@dataspace-mgm/ui-mui';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { vi } from 'vitest';
import { MOCK_PERSONS } from '../../core/mock-container';
import { TestCoreModules, testCoreModules, type TestModulesOptions } from '../../core/testing';
import { walletsFeature } from './routes';

export const ERIKA = MOCK_PERSONS['wallets-erika'];
export const MAX = MOCK_PERSONS['wallets-max'];
export const OTTO = MOCK_PERSONS['wallets-otto'];
export const ROLF = MOCK_PERSONS['wallets-rolf'];

/** "Now" of the mockup for the page (relative times) and the adapters (open orders, revocation time). */
export function atFixturesNow() {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(C4M1_FIXTURES_NOW));
}

interface RecordingOptions {
  companyCredentials?: ReadonlyArray<CredentialStatusAnemic>;
  companyCredentialFailure?: Error;
  credentials?: ReadonlyArray<CredentialDetailAnemic>;
  credentialFailure?: Error;
  /** Thrown by `listCredentials` only (the queue and the counts still answer), e.g. a 400 for the filters. */
  listFailure?: Error;
  /** Another adapter behind confirmRevocation (e.g. one where the credential changed meanwhile). */
  confirmWith?: InMemoryCredentialRepository;
}

/** C4-M1 on in-memory adapters whose calls the test can read. */
export function recordingC4M1(options: RecordingOptions = {}) {
  const companyRepository = new InMemoryCompanyCredentialRepository(
    { [C4M1_TEST_COMPANY_IDS.beispielMaschinenbau]: options.companyCredentials ?? COMPANY_CREDENTIALS.issued },
    options.companyCredentialFailure ?? null,
  );
  const credentialRepository = new InMemoryCredentialRepository(options.credentials ?? CREDENTIALS_OF_ALL_COMPANIES, options.credentialFailure ?? null);
  const module: C4M1Module = {
    listCompanyCredentials: new ListCompanyCredentialsUseCase(companyRepository),
    listCredentials: new ListCredentialsUseCase(
      options.listFailure ? new InMemoryCredentialRepository(CREDENTIALS_OF_ALL_COMPANIES, options.listFailure) : credentialRepository,
    ),
    countCredentialsByStatus: new CountCredentialsByStatusUseCase(credentialRepository),
    getCredential: new GetCredentialUseCase(credentialRepository),
    confirmRevocation: new ConfirmRevocationUseCase(options.confirmWith ?? credentialRepository),
    listOpenItems: new ListOpenItemsUseCase(credentialRepository),
  };
  return { module, companyRepository, credentialRepository };
}

function LocationProbe() {
  const { pathname, search } = useLocation();
  return <output data-testid="location">{`${pathname}${search}`}</output>;
}

interface ShowOptions {
  session: SessionAnemic | null;
  c4m1?: C4M1Module;
  /** C4-M2 as in testCoreModules: `true` (the mockup's fixtures), options of createInMemoryC4M2Module, or a module. */
  c4m2?: TestModulesOptions['c4m2'];
  companies?: ReadonlyArray<CompanyAnemic>;
}

/** Renders the routes of the feature at `path`, as the person `session`, with the modules (absent: not connected). */
export function showWallets(path: string, { session, c4m1, c4m2, companies }: ShowOptions) {
  const test = testCoreModules({ session, c4m1, c4m2, companies });
  render(
    <ColorModeProvider>
      <MemoryRouter initialEntries={[path]}>
        <TestCoreModules modules={test.modules}>
          <Routes>
            {walletsFeature.routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
          <LocationProbe />
        </TestCoreModules>
      </MemoryRouter>
    </ColorModeProvider>,
  );
  return test;
}
