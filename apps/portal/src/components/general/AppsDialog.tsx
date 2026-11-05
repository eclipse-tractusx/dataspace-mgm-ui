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

import { forwardRef, useId, type ReactElement, type ReactNode, type Ref } from 'react';
import {
  AppBar,
  Box,
  ButtonBase,
  CloseIcon,
  Container,
  DarkModeOutlinedIcon,
  Dialog,
  GitHubIcon,
  IconButton,
  LightModeOutlinedIcon,
  Slide,
  Toolbar,
  Typography,
  alpha,
  tractusx,
  useColorMode,
  useMediaQuery,
  useTheme,
} from '@dataspace-mgm/ui-mui';
import { useLocation, useNavigate } from 'react-router-dom';
import { activePath } from '../../contexts/FavouritesContext';
import type { NavigationItem } from '../../types/routing';

const SOURCE_URL = 'https://github.com/eclipse-tractusx/dataspace-mgm-ui';

/** On phones the view rises from the bottom bar. */
const SlideUp = forwardRef(function SlideUp(props: { children: ReactElement; in?: boolean }, ref: Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface TileProps {
  label: string;
  icon: ReactNode;
  note?: string;
  active?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

/** One square tile of the launcher: an app, or a setting on phones. */
function Tile({ label, icon, note, active = false, disabled = false, onSelect }: TileProps) {
  const theme = useTheme();
  const iconColor = theme.palette.mode === 'dark' ? tractusx.orange : tractusx.orangeDarkest;
  return (
    <ButtonBase
      onClick={onSelect}
      disabled={disabled}
      aria-current={active ? 'page' : undefined}
      aria-label={note ? `${label}, ${note.toLowerCase()}` : label}
      sx={{
        aspectRatio: '1 / 1',
        width: '100%',
        borderRadius: '10px',
        border: '1px solid',
        borderColor: active ? tractusx.orange : theme.palette.ui.cardBorder,
        bgcolor: theme.palette.ui.surface,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 1,
        textAlign: 'center',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        '&:hover': { boxShadow: theme.palette.ui.glow },
        '&.Mui-focusVisible': { outline: `2px solid ${tractusx.orange}`, outlineOffset: 2 },
        '&.Mui-disabled': { opacity: 0.55 },
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 44,
          height: 44,
          borderRadius: '10px',
          display: 'grid',
          placeItems: 'center',
          color: iconColor,
          bgcolor: alpha(tractusx.orange, 0.15),
        }}
      >
        {icon}
      </Box>
      <Typography component="span" sx={{ fontWeight: 700, fontSize: 14, lineHeight: 1.25 }}>
        {label}
      </Typography>
      {note && (
        <Typography component="span" variant="caption" color="text.secondary">
          {note}
        </Typography>
      )}
    </ButtonBase>
  );
}

function TileGrid({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: { xs: 'repeat(3, minmax(0, 1fr))', sm: 'repeat(4, minmax(0, 1fr))', md: 'repeat(5, minmax(0, 1fr))' },
      }}
    >
      {children}
    </Box>
  );
}

interface AppsDialogProps {
  open: boolean;
  onClose: () => void;
  items: NavigationItem[];
}

/**
 * "All apps": every feature as a square tile. On desktop a dialog opened from the foot of the sidebar; on
 * phones and tablets a full-screen view that rises from the bottom bar, with the settings below the apps and
 * the close button where the button that opened it was. Opening an app closes it.
 */
export default function AppsDialog({ open, onClose, items }: AppsDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { mode, toggle } = useColorMode();
  const appsHeading = useId();
  const settingsHeading = useId();
  const current = activePath(
    pathname,
    items.map((item) => item.path),
  );

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  const closeButton = (
    <IconButton onClick={onClose} aria-label="Close all apps" sx={{ color: 'text.primary', width: 44, height: 44 }}>
      <CloseIcon />
    </IconButton>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      aria-labelledby={appsHeading}
      slots={fullScreen ? { transition: SlideUp } : undefined}
      transitionDuration={reduceMotion ? 0 : undefined}
    >
      {!fullScreen && (
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', color: 'text.primary', borderBottom: 1, borderColor: 'divider' }}>
          <Toolbar sx={{ minHeight: 64 }}>
            <Typography component="span" sx={{ flex: 1, fontWeight: 800, fontSize: 20 }}>
              All apps
            </Typography>
            {closeButton}
          </Toolbar>
        </AppBar>
      )}
      <Box sx={{ flex: 1, overflowY: 'auto', pt: fullScreen ? 'calc(24px + env(safe-area-inset-top, 0px))' : 3, pb: 3 }}>
        <Container maxWidth="md" sx={{ display: 'grid', gap: 4 }}>
          <Box component="section" aria-labelledby={appsHeading} sx={{ display: 'grid', gap: 2 }}>
            <Typography id={appsHeading} component="h2" variant="overline" color="text.secondary">
              All apps
            </Typography>
            <TileGrid>
              {items.map((item) => (
                <Tile
                  key={item.path}
                  label={item.name}
                  icon={item.icon}
                  note={item.disabled ? 'Coming soon' : undefined}
                  active={item.path === current}
                  disabled={item.disabled}
                  onSelect={() => go(item.path)}
                />
              ))}
            </TileGrid>
          </Box>
          {fullScreen && (
            <Box component="section" aria-labelledby={settingsHeading} sx={{ display: 'grid', gap: 2 }}>
              <Typography id={settingsHeading} component="h2" variant="overline" color="text.secondary">
                Settings
              </Typography>
              <TileGrid>
                <Tile
                  label={mode === 'light' ? 'Dark mode' : 'Light mode'}
                  icon={mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
                  onSelect={toggle}
                />
                <Tile
                  label="Source code"
                  icon={<GitHubIcon />}
                  onSelect={() => globalThis.open?.(SOURCE_URL, '_blank', 'noopener,noreferrer')}
                />
              </TileGrid>
            </Box>
          )}
        </Container>
      </Box>
      {fullScreen && (
        // Closing sits where the button that opened it was: the right end of the bottom bar.
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            height: 64,
            flexShrink: 0,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: theme.palette.ui.navbar,
            pb: 'env(safe-area-inset-bottom, 0px)',
            pr: 'calc(8px + env(safe-area-inset-right, 0px))',
            boxSizing: 'content-box',
          }}
        >
          {closeButton}
        </Box>
      )}
    </Dialog>
  );
}
