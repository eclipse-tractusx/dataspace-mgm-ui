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

import type { PaletteMode, PaletteOptions } from '@mui/material/styles';

/**
 * The Tractus-X colours: black and white as the base, golden and green as the accents
 * (brand01 / brand02 of the Tractus-X styleguide, see Portal Shared Components).
 *
 * Golden and green have a low contrast on white: use them as fills, borders and accents
 * with black text on top, never as text colour on a white background (WCAG 2.1, TRG 9.01).
 */
export const tractusx = {
  gold: '#FFA600',
  goldDark: '#CC8500',
  green: '#B3CB2D',
  greenDark: '#88982D',
  black: '#000000',
  ink: '#111111',
  white: '#FFFFFF',
} as const;

export type BrandColors = typeof tractusx;

export function paletteFor(mode: PaletteMode): PaletteOptions {
  const light = mode === 'light';
  return {
    mode,
    brand: tractusx,
    primary: light
      ? { main: tractusx.black, dark: tractusx.black, light: '#333333', contrastText: tractusx.white }
      : { main: tractusx.gold, dark: tractusx.goldDark, light: '#FFC04D', contrastText: tractusx.black },
    secondary: { main: tractusx.green, dark: tractusx.greenDark, light: '#D1E07A', contrastText: tractusx.black },
    warning: { main: tractusx.gold, contrastText: tractusx.black },
    success: { main: light ? '#00AA55' : '#33CC77' },
    error: { main: light ? '#D91E18' : '#FF6B5E' },
    background: light
      ? { default: tractusx.white, paper: '#F9F9F9' }
      : { default: tractusx.black, paper: '#121212' },
    text: light
      ? { primary: tractusx.ink, secondary: '#555555' }
      : { primary: tractusx.white, secondary: '#B6B6B6' },
    divider: light ? '#DCDCDC' : '#2A2A2A',
  };
}
