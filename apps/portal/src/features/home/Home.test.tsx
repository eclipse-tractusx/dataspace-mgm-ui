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
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { FavouritesProvider } from '../../contexts/FavouritesContext';
import { allFeatures, features, getAllRoutes } from '../main';
import Home from './pages/Home';

describe('Home', () => {
  it('welcomes the user, shows every service and ends with the footer', () => {
    render(
      <ColorModeProvider>
        <MemoryRouter>
          <FavouritesProvider items={features}>
            <Home />
          </FavouritesProvider>
        </MemoryRouter>
      </ColorModeProvider>,
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome to the Eclipse Tractus-X Dataspace Management UI');
    for (const service of ['Onboarding', 'Participant management', 'Connectors as a service', 'Wallets as a service', 'Marketplace', 'Provider network']) {
      expect(screen.getByRole('heading', { level: 3, name: service })).toBeInTheDocument();
    }
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Contributors to the Eclipse Foundation');
  });
});

describe('feature registry', () => {
  it('registers home as the index route and in the navigation', () => {
    expect(allFeatures.map((feature) => feature.name)).toContain('Home');
    expect(getAllRoutes().some((route) => route.index)).toBe(true);
    expect(features.find((item) => item.path === '/')?.disabled).toBe(false);
  });
});
