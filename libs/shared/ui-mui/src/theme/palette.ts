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
 * Colour tokens of the Eclipse Tractus-X Design Guidelines v1.0 (September 2026).
 *
 * - Primary orange (golden) #FAA023: the main accent, for accents and interactive elements only (slide 3).
 *   Never long body copy in orange on white (slide 25).
 * - Logo green #AFC72D: secondary accent for supporting graphic elements; orange stays the interactive
 *   accent, and orange and green are never built into one gradient (slides 4, 25).
 * - Base colours black #000000 and the Eclipse Tractus-X gray #1E1E1E (slide 5); secondary button gray
 *   #232323 (slide 18); neutrals and UI tokens per theme (slide 8).
 * - Do not introduce off-palette colours: derive tints from these tokens (slide 25).
 */
export const tractusx = {
  orange: '#FAA023',
  orangeDark: '#F99407',
  orangeDarker: '#ED8C05',
  orangeDarkest: '#C37304',
  orangeLight: '#FBAC3F',
  orangeLighter: '#FBB24D',
  orangeLightest: '#FCC477',
  green: '#AFC72D',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#1E1E1E',
  grayButton: '#232323',
  grayDarkest: '#626262',
  navbarLight: '#F0F0F0',
} as const;

export type BrandColors = typeof tractusx;

/** The neutrals and UI tokens of slide 8, per theme. */
export interface UiTokens {
  navbar: string;
  muted: string;
  cardBorder: string;
  subtleBorder: string;
  surface: string;
  footer: string;
  glow: string;
}

export const uiTokens: Record<PaletteMode, UiTokens> = {
  dark: {
    navbar: tractusx.black,
    muted: 'rgba(255, 255, 255, 0.7)',
    cardBorder: 'rgba(255, 255, 255, 0.3)',
    subtleBorder: 'rgba(255, 255, 255, 0.1)',
    surface: tractusx.gray,
    footer: tractusx.black,
    glow: '0 0 12px rgba(255, 255, 255, 0.5)',
  },
  light: {
    navbar: tractusx.navbarLight,
    muted: '#00000099',
    cardBorder: 'rgba(0, 0, 0, 0.3)',
    subtleBorder: 'rgba(0, 0, 0, 0.1)',
    surface: tractusx.white,
    footer: tractusx.grayDarkest,
    glow: '0 0 12px rgba(0, 0, 0, 0.15)',
  },
};

export function paletteFor(mode: PaletteMode): PaletteOptions {
  const dark = mode === 'dark';
  const tokens = uiTokens[mode];
  return {
    mode,
    brand: tractusx,
    ui: tokens,
    primary: {
      main: tractusx.orange,
      dark: tractusx.orangeDark,
      light: tractusx.orangeLight,
      contrastText: tractusx.black,
    },
    secondary: {
      main: tractusx.grayButton,
      dark: tractusx.gray,
      light: tractusx.grayDarkest,
      contrastText: tractusx.white,
    },
    background: { default: dark ? tractusx.black : tractusx.white, paper: tokens.surface },
    text: { primary: dark ? tractusx.white : tractusx.black, secondary: tokens.muted },
    divider: tokens.subtleBorder,
  };
}
