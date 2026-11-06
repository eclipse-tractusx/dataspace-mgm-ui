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
import { ColorModeProvider } from '@dataspace-mgm/ui-mui';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { TestCoreModules, testCoreModules } from '../../core/testing';
import { onboardingFeature } from './routes';

/** The date the fixtures of c1-m2-core are valid on (their attestations expire on 27 Nov and 4 Dec 2026). */
export const NOW = new Date('2026-11-06T10:00:00.000Z');

/** Shows where the router is, so a test can assert a navigation. */
function Location() {
  return <output data-testid="location">{useLocation().pathname}</output>;
}

/** Renders the onboarding routes at a path, with the core packages on their in-memory adapters (mock mode). */
export function renderOnboarding(path: string, options: { session: SessionAnemic | null; c1m2?: NonNullable<Parameters<typeof testCoreModules>[0]>['c1m2'] | false }) {
  const test = testCoreModules({ session: options.session, c1m2: options.c1m2 === false ? undefined : { now: () => NOW, ...options.c1m2 } });
  render(
    <ColorModeProvider>
      <MemoryRouter initialEntries={[path]}>
        <TestCoreModules modules={test.modules}>
          <Routes>
            {onboardingFeature.routes.map((route) => (
              <Route key={route.path} path={`/${route.path}`} element={route.element} />
            ))}
          </Routes>
          <Location />
        </TestCoreModules>
      </MemoryRouter>
    </ColorModeProvider>,
  );
  return test;
}
