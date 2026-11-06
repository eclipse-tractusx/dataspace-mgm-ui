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

import type { ReactElement } from 'react';
import { ColorModeProvider } from '@dataspace-mgm/ui-mui';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { C3_MOCK_PERSONS as MOCK_PERSONS } from '../../../core/mock-persons';
import { TestCoreModules, testCoreModules } from '../../../core/testing';

type Options = Parameters<typeof testCoreModules>[0];

/** Shows where the page navigated to, for tests of links and row clicks. */
function CurrentPath() {
  return <output data-testid="path">{useLocation().pathname}</output>;
}

/**
 * Renders a page of the feature at `path` (matched against `route`, for its parameters) with the in-memory core
 * packages; `person` is a key of MOCK_PERSONS (the test persons of FRAMEWORK 7a).
 */
export function renderParticipantsPage(page: ReactElement, { path, route = path, person, ...options }: { path: string; route?: string; person: string | null } & Options) {
  const test = testCoreModules({ session: person ? MOCK_PERSONS[person] : null, ...options });
  const view = render(
    <ColorModeProvider>
      <MemoryRouter initialEntries={[path]}>
        <TestCoreModules modules={test.modules}>
          <Routes>
            <Route path={route} element={page} />
            <Route path="*" element={null} />
          </Routes>
          <CurrentPath />
        </TestCoreModules>
      </MemoryRouter>
    </ColorModeProvider>,
  );
  return { ...test, view };
}
