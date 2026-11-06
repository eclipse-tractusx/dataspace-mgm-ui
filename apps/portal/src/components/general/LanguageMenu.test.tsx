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

import { ColorModeProvider } from '@dataspace-mgm/ui-mui';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG } from '../../config';
import { ConfigContext } from '../../config/ConfigContext';
import { TestCoreModules } from '../../core/testing';
import Header from './Header';

describe('language switch', () => {
  it('lists every language in its own name and translates the shell at once', async () => {
    render(
      <ColorModeProvider>
        <MemoryRouter>
          <ConfigContext.Provider value={DEFAULT_CONFIG}>
            <TestCoreModules>
              <Header />
            </TestCoreModules>
          </ConfigContext.Provider>
        </MemoryRouter>
      </ColorModeProvider>,
    );
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Language' }));
    const menu = screen.getByRole('menu', { name: 'Choose a language' });
    expect(within(menu).getByRole('menuitemradio', { name: 'English' })).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(within(menu).getByRole('menuitemradio', { name: 'Deutsch' }));

    expect(await screen.findByRole('button', { name: 'Zum hellen Modus wechseln' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sprache' })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('de');
  });
});
