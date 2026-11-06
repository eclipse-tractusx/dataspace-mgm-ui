/********************************************************************************
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

import {
  createMockC1M2Module,
  ERIKA_SESSION,
  HANS_SESSION,
  LIESCHEN_SESSION,
  MAX_SESSION,
  OTTO_SESSION,
  ROLF_SESSION,
} from '@dataspace-mgm/c1-m2-core/testing';
import { GetOwnCompanyUseCase } from '@dataspace-mgm/c3-m1-core';
import { InMemoryCompanyRepository, OSP_A_COMPANY } from '@dataspace-mgm/c3-m1-core/testing';
import { C4M1_TEST_COMPANY_IDS, COMPANY_CREDENTIALS, createInMemoryC4M1Module } from '@dataspace-mgm/c4-m1-core/testing';
import { createIdentityModule, type RedirectPort, type SessionAnemic } from '@dataspace-mgm/identity-core';
import { InMemorySessionRepository, PIA_SESSION } from '@dataspace-mgm/identity-core/testing';
import type { CoreModules } from './container';

/** The person signed in when VITE_MOCK_PERSON is not set. */
export const DEFAULT_MOCK_PERSON = 'pia';

/**
 * The test persons of mock mode, by their key in test data or a feature-specific alias. VITE_MOCK_PERSON picks one; a
 * key that is not here (e.g. `none`) starts signed out. Add a person when a page needs other permissions.
 */
export const MOCK_PERSONS: Readonly<Record<string, SessionAnemic>> = {
  pia: PIA_SESSION,
  /** Applicants and OSP staff for C1-M2 Registration. */
  erika: ERIKA_SESSION,
  max: MAX_SESSION,
  hans: HANS_SESSION,
  lieschen: LIESCHEN_SESSION,
  rolf: ROLF_SESSION,
  otto: OTTO_SESSION,
  /** C4-M1 credentials test persons, kept separate where C1-M2 uses the same names for different identities. */
  'wallets-erika': {
    user: { id: '5a1c0001-0000-4000-8000-000000000001', name: 'Erika Mustermann', username: 'erika' },
    companyId: 'c0000001-0000-4000-8000-000000000001',
    bpn: 'BPNLIUK2REMLK3F4',
    permissions: ['view_credentials'],
    csrfToken: 'csrf-test',
  },
  'wallets-max': {
    user: { id: '5a1c0002-0000-4000-8000-000000000002', name: 'Max Mustermann', username: 'max' },
    companyId: 'c0000001-0000-4000-8000-000000000001',
    bpn: 'BPNLIUK2REMLK3F4',
    permissions: [],
    csrfToken: 'csrf-test',
  },
  'wallets-otto': {
    user: { id: '5a1c0012-0000-4000-8000-000000000012', name: 'Otto Normalverbraucher', username: 'otto' },
    companyId: null,
    bpn: null,
    permissions: ['manage_credentials'],
    csrfToken: 'csrf-test',
  },
  'wallets-rolf': {
    user: { id: 'bbede0f3-fbc4-433b-b7ca-1982e8724912', name: 'Rolf Prüfer', username: 'rolf' },
    companyId: null,
    bpn: null,
    permissions: [],
    csrfToken: 'csrf-test',
  },
};

/** Mock mode has no BFF: "sign in" reloads the page, which starts a new mock session. */
class ReloadRedirect implements RedirectPort {
  public toLogin(returnTo: string): void {
    window.location.assign(returnTo);
  }
}

/**
 * The core packages on in-memory adapters with the fixtures of their `testing` entry points: no backend, no BFF, no
 * token. main.tsx loads this file only in mock mode (core/mock-mode.ts).
 *
 * Add a module: `<module>: { <useCase>: new <UseCase>(new InMemory<Entity>Repository(<FIXTURES>)) }`. A proof of
 * concept is wired here only; the real container gets the module when its HTTP adapter exists (skill build-feature).
 */
export function createMockCoreModules(person: string = DEFAULT_MOCK_PERSON): CoreModules {
  const session = MOCK_PERSONS[person] ?? null;
  return {
    identity: createIdentityModule({
      bffBaseUrl: '',
      sessions: new InMemorySessionRepository(session),
      redirect: new ReloadRedirect(),
    }),
    c3m1: { getOwnCompany: new GetOwnCompanyUseCase(new InMemoryCompanyRepository([OSP_A_COMPANY])) },
    // Proof of concept: the fixtures of mockups/wallets/. Beispiel Maschinenbau GmbH holds the credentials of Catena-X
    // and of a second dataspace (state two-dataspaces), so the logo slot of the passes shows two dataspaces.
    c4m1: createInMemoryC4M1Module({
      companyCredentials: { [C4M1_TEST_COMPANY_IDS.beispielMaschinenbau]: COMPANY_CREDENTIALS.twoDataspaces },
    }),
    c1m2: createMockC1M2Module(session),
  };
}
