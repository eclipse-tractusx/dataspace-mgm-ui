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

import { BUTTON_RADIUS, ColorModeProvider, RADIUS, createPortalTheme, useColorMode } from '@dataspace-mgm/ui-mui';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// The tokens of the Eclipse Tractus-X Design Guidelines v1.0 that the portal must keep.
describe('Eclipse Tractus-X theme', () => {
  it('uses the orange as the primary accent with black text, in both modes', () => {
    for (const mode of ['dark', 'light'] as const) {
      const { palette } = createPortalTheme(mode);
      expect(palette.primary.main).toBe('#FAA023');
      expect(palette.primary.contrastText).toBe('#000000');
      expect(palette.secondary.main).toBe('#232323');
    }
  });

  it('is black in dark mode and white in light mode', () => {
    expect(createPortalTheme('dark').palette.background.default).toBe('#000000');
    expect(createPortalTheme('light').palette.background.default).toBe('#FFFFFF');
    expect(createPortalTheme('dark').palette.background.paper).toBe('#1E1E1E');
  });

  it('uses Manrope, small button radius and 10 px cards', () => {
    expect(createPortalTheme('dark').typography.fontFamily).toMatch(/^"Manrope Variable", Manrope, Inter, Arial/);
    expect(BUTTON_RADIUS).toBe(8);
    expect(RADIUS).toBe(10);
  });

  it('starts in dark mode', () => {
    function Mode() {
      return <span>{useColorMode().mode}</span>;
    }
    render(
      <ColorModeProvider>
        <Mode />
      </ColorModeProvider>,
    );
    expect(screen.getByText('dark')).toBeInTheDocument();
  });
});
