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
import { FAVOURITES_STORAGE_KEY, FavouritesProvider, MAX_FAVOURITES, sanitiseFavourites } from '../../contexts/FavouritesContext';
import { features } from '../../features/main';
import AppsDialog from './AppsDialog';
import BottomBar, { activeFavourite } from './BottomBar';

const wrap = (ui: ReactElement) =>
  render(
    <ColorModeProvider>
      <MemoryRouter>
        <FavouritesProvider items={features}>{ui}</FavouritesProvider>
      </MemoryRouter>
    </ColorModeProvider>,
  );

const star = (name: string) => screen.getByRole('button', { name: `Favourite: ${name}` });

beforeEach(() => localStorage.clear());

describe('favourites', () => {
  it('keeps Home first, drops unknown paths and caps the list', () => {
    const all = features.map((item) => item.path);
    expect(sanitiseFavourites(['/nowhere', '/company'], features)).toEqual(['/', '/company']);
    expect(sanitiseFavourites(all.reverse(), features)).toHaveLength(MAX_FAVOURITES);
    expect(sanitiseFavourites('garbage', features)).toEqual(['/']);
  });

  it('starts with the first five features, then profile and more options at the right', () => {
    wrap(<BottomBar onOpenApps={() => undefined} />);
    const bar = screen.getByRole('navigation', { name: 'Favourites' });
    const buttons = within(bar).getAllByRole('button');
    expect(buttons).toHaveLength(MAX_FAVOURITES + 2);
    expect(buttons.slice(-2).map((button) => button.getAttribute('aria-label'))).toEqual(['Profile', 'More options']);
  });

  it('marks the favourite of the current page, also below it', () => {
    expect(activeFavourite('/', ['/', '/company'])).toBe('/');
    expect(activeFavourite('/company/123', ['/', '/company'])).toBe('/company');
    expect(activeFavourite('/companyx', ['/', '/company'])).toBe(false);
  });
});

describe('All apps view', () => {
  it('lists every feature and marks the upcoming ones', () => {
    wrap(<AppsDialog open onClose={() => undefined} items={features} />);
    const dialog = screen.getByRole('dialog', { name: 'All apps' });
    for (const item of features) {
      expect(within(dialog).getByRole('heading', { level: 3, name: item.name })).toBeInTheDocument();
    }
    expect(within(dialog).getAllByText('Coming soon')).toHaveLength(features.filter((item) => item.disabled).length);
  });

  it('turns favourites on and off, keeps Home and allows at most five', () => {
    wrap(
      <>
        <AppsDialog open onClose={() => undefined} items={features} />
        <BottomBar onOpenApps={() => undefined} />
      </>,
    );
    expect(star('Home')).toBeDisabled();
    expect(star('Apps')).toBeDisabled(); // five chosen already
    fireEvent.click(star('Company'));
    expect(star('Company')).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(star('Apps'));
    expect(star('Apps')).toHaveAttribute('aria-pressed', 'true');
    expect(JSON.parse(localStorage.getItem(FAVOURITES_STORAGE_KEY) ?? '[]')).toContain('/apps');
  });
});
