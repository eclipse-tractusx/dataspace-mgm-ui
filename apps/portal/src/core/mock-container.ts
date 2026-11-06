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

import { createInMemoryC3M1Module } from '@dataspace-mgm/c3-m1-core/testing';
import { CSP_REGISTRATIONS, InMemoryCspRegistrationRepository } from '@dataspace-mgm/c3-m2-core/testing';
import { GetCspRegistrationUseCase } from '@dataspace-mgm/c3-m2-core';
import { createIdentityModule, type RedirectPort } from '@dataspace-mgm/identity-core';
import { InMemorySessionRepository } from '@dataspace-mgm/identity-core/testing';
import type { CoreModules } from './container';
import { MOCK_PERSONS } from './mock-persons';

export { MOCK_PERSONS } from './mock-persons';

/** The person signed in when VITE_MOCK_PERSON is not set. */
export const DEFAULT_MOCK_PERSON = 'pia';

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
    // C3-M1 and C3-M2 on fixtures (the mockup's data). The rules stay the modules': mock mode shows success paths only.
    c3m1: createInMemoryC3M1Module({ actorId: session?.user.id }).module,
    c3m2: { getCspRegistration: new GetCspRegistrationUseCase(new InMemoryCspRegistrationRepository(CSP_REGISTRATIONS)) },
  };
}
