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

import { ColorModeProvider } from '@dataspace-mgm/ui-mui';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ErrorNotFound from '../components/general/ErrorNotFound';
import { FavouritesProvider } from '../contexts/FavouritesContext';
import { TestCoreModules } from '../core/testing';
import { features } from '../features/main';
import Home from '../features/home/pages/Home';
import AllServicesPage from '../pages/AllServicesPage';
import MainLayout from './MainLayout';

const at = (path: string) =>
  render(
    <ColorModeProvider>
      <MemoryRouter initialEntries={[path]}>
        <TestCoreModules>
          <FavouritesProvider items={features}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="all-services" element={<AllServicesPage />} />
                <Route path="*" element={<ErrorNotFound />} />
              </Route>
            </Routes>
          </FavouritesProvider>
        </TestCoreModules>
      </MemoryRouter>
    </ColorModeProvider>,
  );

describe('the footer', () => {
  it('is on the home page', () => {
    at('/');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it.each(['/all-services', '/nowhere'])('is not on %s', (path) => {
    at(path);
    expect(screen.queryByRole('contentinfo')).toBeNull();
  });
});
