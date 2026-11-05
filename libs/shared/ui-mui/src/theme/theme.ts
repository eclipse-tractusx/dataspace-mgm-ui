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

import { createTheme, type PaletteMode, type Theme } from '@mui/material/styles';
import { paletteFor, tractusx, uiTokens, type BrandColors, type UiTokens } from './palette';
import { typography } from './typography';

declare module '@mui/material/styles' {
  interface Palette {
    brand: BrandColors;
    ui: UiTokens;
  }
  interface PaletteOptions {
    brand?: BrandColors;
    ui?: UiTokens;
  }
}

/** Card and panel radius (slide 6). */
export const RADIUS = 10;
/** Button radius (slide 18): a small radius, never a pill. */
export const BUTTON_RADIUS = 8;

export function createPortalTheme(mode: PaletteMode): Theme {
  const tokens = uiTokens[mode];
  const focusRing = { outline: `2px solid ${tractusx.orange}`, outlineOffset: 2 };

  return createTheme({
    palette: paletteFor(mode),
    typography,
    shape: { borderRadius: RADIUS },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { WebkitFontSmoothing: 'antialiased' },
          '::selection': { backgroundColor: tractusx.orange, color: tractusx.black },
        },
      },
      MuiButtonBase: { defaultProps: { disableRipple: true } },
      MuiButton: {
        defaultProps: { disableElevation: true, variant: 'contained' },
        styleOverrides: {
          root: {
            borderRadius: BUTTON_RADIUS,
            padding: '14px 24px',
            lineHeight: 1.25,
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
            '&.Mui-focusVisible': focusRing,
          },
        },
        variants: [
          {
            props: { variant: 'contained', color: 'primary' },
            style: { '&:hover': { backgroundColor: tractusx.orangeDark } },
          },
          {
            props: { variant: 'contained', color: 'secondary' },
            style: {
              border: '1px solid transparent',
              '&:hover': { backgroundColor: tractusx.grayButton, borderColor: tokens.cardBorder, boxShadow: tokens.glow },
            },
          },
          {
            props: { variant: 'outlined' },
            style: {
              padding: '13px 23px',
              borderColor: tokens.cardBorder,
              color: 'inherit',
              '&:hover': { borderColor: tractusx.orange, backgroundColor: 'transparent', boxShadow: tokens.glow },
            },
          },
        ],
      },
      MuiIconButton: {
        styleOverrides: { root: { borderRadius: BUTTON_RADIUS, '&.Mui-focusVisible': focusRing } },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: RADIUS,
            border: `1px solid ${tokens.cardBorder}`,
            backgroundColor: tokens.surface,
            transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
            '&:hover': { boxShadow: tokens.glow },
          },
        },
      },
      MuiCardContent: { styleOverrides: { root: { padding: 28, '&:last-child': { paddingBottom: 28 } } } },
      MuiChip: {
        styleOverrides: { root: { borderRadius: BUTTON_RADIUS / 2, fontWeight: 700 } },
      },
      MuiLink: {
        defaultProps: { underline: 'hover' },
        styleOverrides: {
          root: {
            color: mode === 'dark' ? tractusx.orange : tractusx.black,
            '&.Mui-focusVisible, &:focus-visible': focusRing,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { backgroundColor: tractusx.grayButton, color: tractusx.white, fontSize: '0.8125rem' },
        },
      },
    },
  });
}
