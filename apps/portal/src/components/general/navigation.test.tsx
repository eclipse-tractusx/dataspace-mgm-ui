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
import { features } from '../../features/main';
import AppsDialog from './AppsDialog';
import BottomBar from './BottomBar';
import Sidebar from './Sidebar';
import AllAppsPage from '../../pages/AllAppsPage';

const wrap = (ui: ReactElement, path = '/') =>
  render(
    <ColorModeProvider>
      <MemoryRouter initialEntries={[path]}>
        <FavouritesProvider items={features}>{ui}</FavouritesProvider>
      </MemoryRouter>
    </ColorModeProvider>,
  );

beforeEach(() => localStorage.clear());

describe('favourites', () => {
  it('are every feature until one is taken out, with Home always first', () => {
    expect(favouritesOf(features, [])).toHaveLength(features.length);
    expect(favouritesOf(features, ['/company']).map((item) => item.path)).not.toContain('/company');
    expect(toggleHidden([], '/')).toEqual([]);
    expect(toggleHidden(['/company'], '/company')).toEqual([]);
  });

  it('match the current page and the pages below it', () => {
    expect(activePath('/', ['/', '/company'])).toBe('/');
    expect(activePath('/company/123', ['/', '/company'])).toBe('/company');
    expect(activePath('/companyx', ['/', '/company'])).toBeUndefined();
  });
});

describe('Sidebar', () => {
  it('puts the plus right under the last favourite and notifications, profile and All apps at the bottom', () => {
    wrap(<Sidebar />);
    const slots = within(screen.getByRole('list', { name: 'Favourites' })).getAllByRole('listitem');
    expect(slots).toHaveLength(features.length + 1);
    expect(within(slots[slots.length - 1]).getByRole('button', { name: 'Edit favourites' })).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Features' });
    const labels = within(nav)
      .getAllByRole('button')
      .map((button) => button.getAttribute('aria-label'));
    expect(labels.slice(-2)).toEqual(['Notifications', 'Profile']);
    // All apps is the last control of the sidebar and opens the view in the canvas.
    const allApps = within(nav).getByRole('link', { name: 'All apps' });
    expect(allApps).toHaveAttribute('href', '/all-apps');
    expect(within(nav).getAllByRole('link').at(-1)).toBe(allApps);
  });

  it('switches favourites on and off in the plus menu, which stays open', () => {
    wrap(<Sidebar />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit favourites' }));
    const menu = screen.getByRole('menu', { name: 'Favourites' });
    expect(within(menu).queryByRole('menuitemcheckbox', { name: /Home/ })).toBeNull();
    fireEvent.click(within(menu).getByRole('menuitemcheckbox', { name: /Company/ }));
    expect(within(menu).getByRole('menuitemcheckbox', { name: /Company/ })).toHaveAttribute('aria-checked', 'false');
    expect(JSON.parse(localStorage.getItem(HIDDEN_STORAGE_KEY) ?? '[]')).toEqual(['/company']);
    expect(screen.queryByRole('link', { name: 'Company' })).toBeNull();
  });
});

describe('Bottom bar', () => {
  it('shows Home and the first favourites, the plus, then profile and All apps at the right', () => {
    wrap(<BottomBar onOpenApps={() => undefined} />);
    const labels = within(screen.getByRole('navigation', { name: 'Favourites' }))
      .getAllByRole('button')
      .map((button) => button.getAttribute('aria-label'));
    expect(labels).toHaveLength(PHONE_FAVOURITE_SLOTS + 3);
    expect(labels[0]).toBe('Home');
    expect(labels.slice(-3)).toEqual(['Edit favourites', 'Profile', 'All apps']);
  });
});

describe('All apps', () => {
  it('shows every feature as a tile and marks the upcoming ones', () => {
    wrap(<AppsDialog open onClose={() => undefined} items={features} />);
    const dialog = screen.getByRole('dialog', { name: 'All apps' });
    for (const item of features) {
      expect(within(dialog).getByRole('button', { name: new RegExp(`^${item.name}`) })).toBeInTheDocument();
    }
    expect(within(dialog).getAllByText('Coming soon')).toHaveLength(features.filter((item) => item.disabled).length);
    expect(within(dialog).getByRole('button', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });
});

describe('All apps on desktop', () => {
  it('shows every app as a card in a carousel and filters by area', () => {
    wrap(<AllAppsPage />, '/all-apps');
    const carousel = screen.getByRole('region', { name: 'Apps' });
    expect(within(carousel).getAllByRole('listitem')).toHaveLength(features.length);
    expect(within(carousel).getByRole('button', { name: 'Open Home' })).toBeEnabled();
    expect(within(carousel).getByRole('button', { name: 'Company, coming soon' })).toBeDisabled();

    fireEvent.click(within(screen.getByRole('group', { name: 'Filter apps' })).getByRole('button', { name: /^Connect/ }));
    expect(within(carousel).getAllByRole('listitem')).toHaveLength(features.filter((app) => app.category === 'connect').length);
  });
});
