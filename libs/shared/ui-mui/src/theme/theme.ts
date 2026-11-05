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
      MuiCardHeader: {
        styleOverrides: {
          root: { padding: '28px 28px 0' },
          title: { fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.3 },
        },
      },
      MuiCardContent: { styleOverrides: { root: { padding: '16px 28px', '&:last-child': { paddingBottom: 28 } } } },
      MuiCardActions: { styleOverrides: { root: { padding: '0 28px 28px' } } },
      MuiAvatar: {
        styleOverrides: {
          rounded: { borderRadius: RADIUS, backgroundColor: 'rgba(250, 160, 35, 0.15)' },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: { backgroundColor: mode === 'dark' ? tractusx.black : tractusx.white, borderRight: `1px solid ${tokens.subtleBorder}` },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: BUTTON_RADIUS,
            '&.Mui-focusVisible': focusRing,
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: { height: 64, backgroundColor: tokens.navbar, borderTop: `1px solid ${tokens.subtleBorder}` },
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            minWidth: 0,
            padding: '6px 4px 8px',
            color: tokens.muted,
            position: 'relative',
            '&.Mui-selected': { color: mode === 'dark' ? tractusx.orange : tractusx.black },
            '&.Mui-selected::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '30%',
              right: '30%',
              height: 3,
              borderRadius: '0 0 2px 2px',
              backgroundColor: tractusx.orange,
            },
            '&.Mui-disabled': { opacity: 0.45 },
            '&.Mui-focusVisible': focusRing,
          },
          label: { fontSize: '0.75rem', fontWeight: 500, '&.Mui-selected': { fontSize: '0.75rem', fontWeight: 700 } },
        },
      },
      MuiDialog: {
        defaultProps: { slotProps: { backdrop: { sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' } } } },
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? tractusx.black : tractusx.white,
            backgroundImage: 'none',
            border: `1px solid ${tokens.cardBorder}`,
          },
          paperFullScreen: { borderRadius: 0, border: 0 },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? tractusx.gray : tractusx.white,
            border: `1px solid ${tokens.cardBorder}`,
            borderRadius: RADIUS,
            minWidth: 240,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            minHeight: 44,
            '&:hover': { backgroundColor: 'rgba(250, 160, 35, 0.08)' },
            '&.Mui-focusVisible': { backgroundColor: 'rgba(250, 160, 35, 0.15)' },
          },
        },
      },
      MuiDivider: { styleOverrides: { root: { borderColor: tokens.subtleBorder } } },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: BUTTON_RADIUS / 2, fontWeight: 700 },
          outlined: { borderColor: tokens.cardBorder },
        },
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
