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
import { fireEvent, render, screen, within } from '@testing-library/react';
import i18n from 'i18next';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  FavouritesProvider,
  HIDDEN_STORAGE_KEY,
  PHONE_FAVOURITE_SLOTS,
  activePath,
  favouritesOf,
  toggleHidden,
} from '../../contexts/FavouritesContext';
import { TestCoreModules } from '../../core/testing';
import { features } from '../../features/main';
import ServiceTiles from '../services/ServiceTiles';
import BottomBar from './BottomBar';
import Sidebar from './Sidebar';
import AllServicesPage from '../../pages/AllServicesPage';

const wrap = (ui: ReactElement, path = '/') =>
  render(
    <ColorModeProvider>
      <MemoryRouter initialEntries={[path]}>
        <TestCoreModules>
          <FavouritesProvider items={features}>{ui}</FavouritesProvider>
        </TestCoreModules>
      </MemoryRouter>
    </ColorModeProvider>,
  );

beforeEach(() => localStorage.clear());

/** A feature's name or description in the language of the test (English). */
const text = (id: string, field: 'name' | 'description' = 'name') => i18n.t(`features.${id}.${field}`);

describe('favourites', () => {
  it('are every feature until one is taken out, with Home always first', () => {
    expect(favouritesOf(features, [])).toHaveLength(features.length);
    expect(favouritesOf(features, ['/participants']).map((item) => item.path)).not.toContain('/participants');
    expect(toggleHidden([], '/')).toEqual([]);
    expect(toggleHidden(['/participants'], '/participants')).toEqual([]);
  });

  it('match the current page and the pages below it', () => {
    expect(activePath('/', ['/', '/participants'])).toBe('/');
    expect(activePath('/participants/123', ['/', '/participants'])).toBe('/participants');
    expect(activePath('/participantsx', ['/', '/participants'])).toBeUndefined();
  });
});

describe('Sidebar', () => {
  it('puts the plus right under the last favourite and notifications, profile and All services at the bottom', () => {
    wrap(<Sidebar />);
    const slots = within(screen.getByRole('list', { name: 'Favourites' })).getAllByRole('listitem');
    expect(slots).toHaveLength(features.length + 1);
    expect(within(slots[slots.length - 1]).getByRole('button', { name: 'Edit favourites' })).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Features' });
    const labels = within(nav)
      .getAllByRole('button')
      .map((button) => button.getAttribute('aria-label'));
    expect(labels.slice(-2)).toEqual(['Notifications', 'Profile']);
    // All services is the last control of the sidebar and opens the view in the canvas.
    const allApps = within(nav).getByRole('link', { name: 'All services' });
    expect(allApps).toHaveAttribute('href', '/all-services');
    expect(within(nav).getAllByRole('link').at(-1)).toBe(allApps);
  });

  it('marks only the deepest matching favourite as active (Application review, not also Onboarding)', () => {
    wrap(<Sidebar />, '/onboarding/reviews/123');
    const nav = screen.getByRole('navigation', { name: 'Features' });
    const active = within(nav)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('aria-current') === 'page');
    expect(active.map((link) => link.getAttribute('aria-label'))).toEqual([text('onboarding-review')]);
  });

  it('switches favourites on and off in the plus menu, which stays open', () => {
    wrap(<Sidebar />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit favourites' }));
    const menu = screen.getByRole('menu', { name: 'Favourites' });
    expect(within(menu).queryByRole('menuitemcheckbox', { name: /Home/ })).toBeNull();
    fireEvent.click(within(menu).getByRole('menuitemcheckbox', { name: /Participant management/ }));
    expect(within(menu).getByRole('menuitemcheckbox', { name: /Participant management/ })).toHaveAttribute('aria-checked', 'false');
    expect(JSON.parse(localStorage.getItem(HIDDEN_STORAGE_KEY) ?? '[]')).toEqual(['/participants']);
    expect(screen.queryByRole('link', { name: 'Participant management' })).toBeNull();
  });
});

describe('Bottom bar', () => {
  it('shows Home and the first favourites, the plus, then profile and All services at the right', () => {
    wrap(<BottomBar />);
    const bar = screen.getByRole('navigation', { name: 'Favourites' });
    const labels = within(bar)
      .getAllByRole('button')
      .map((button) => button.getAttribute('aria-label'));
    expect(labels).toHaveLength(PHONE_FAVOURITE_SLOTS + 2);
    expect(labels[0]).toBe('Home');
    expect(labels.slice(-2)).toEqual(['Edit favourites', 'Profile']);
    expect(within(bar).getByRole('link', { name: 'All services' })).toHaveAttribute('href', '/all-services');
  });

  it('marks All services, not Home, while All services is open', () => {
    wrap(<BottomBar />, '/all-services');
    const bar = screen.getByRole('navigation', { name: 'Favourites' });
    expect(within(bar).getByRole('link', { name: 'All services' })).toHaveAttribute('aria-current', 'page');
    expect(within(bar).getByRole('button', { name: 'Home' })).not.toHaveClass('Mui-selected');
  });
});

describe('All services on phones', () => {
  it('shows every service as a tile and marks the upcoming ones, then the settings', () => {
    wrap(<ServiceTiles services={features.map((item) => ({ ...item, name: text(item.id), description: text(item.id, 'description') }))} />, '/all-services');
    for (const item of features) {
      expect(screen.getByRole('button', { name: new RegExp(`^${text(item.id)}`) })).toBeInTheDocument();
    }
    expect(screen.getAllByText('Coming soon')).toHaveLength(features.filter((item) => item.disabled).length);
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
  });
});

describe('All services on desktop', () => {
  it('shows every service as a card in a carousel, the description and version in a tooltip, and filters by area', async () => {
    wrap(<AllServicesPage />, '/all-services');
    const carousel = screen.getByRole('region', { name: 'Services' });
    expect(within(carousel).getAllByRole('listitem')).toHaveLength(features.length);
    expect(within(carousel).getByRole('button', { name: 'Open Home' })).toBeEnabled();
    expect(within(carousel).getByRole('button', { name: 'Open Participant management' })).toBeEnabled();
    expect(within(carousel).getByRole('button', { name: 'Open Application review' })).toBeEnabled();

    // The description is not on the card: it shows in the tooltip of the info button, with the version.
    const wallets = features.find((service) => service.path === '/wallets')!;
    expect(within(carousel).queryByText(text(wallets.id, 'description'))).toBeNull();
    fireEvent.mouseOver(within(carousel).getByRole('button', { name: 'About Wallets as a service' }));
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent(text(wallets.id, 'description'));
    expect(tooltip).toHaveTextContent(`v${wallets.version}`);

    fireEvent.click(within(screen.getByRole('group', { name: 'Filter services' })).getByRole('button', { name: /^As a service/ }));
    expect(within(carousel).getAllByRole('listitem')).toHaveLength(features.filter((app) => app.category === 'as-a-service').length);
  });
});
