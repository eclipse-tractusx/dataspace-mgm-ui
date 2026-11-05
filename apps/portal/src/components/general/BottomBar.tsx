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

import { AppsOutlinedIcon, BottomNavigation, BottomNavigationAction, Box, Divider, IconButton, Paper } from '@dataspace-mgm/ui-mui';
import { useLocation, useNavigate } from 'react-router-dom';
import { PHONE_FAVOURITE_SLOTS, activePath, useFavourites } from '../../contexts/FavouritesContext';
import FavouritesMenu from './FavouritesMenu';
import { ProfileMenu } from './HeaderMenus';

/**
 * The navigation on phones and tablets, at the bottom of the shell (it never scrolls): Home and the first
 * favourites (five in all, icons only, each with its name for screen readers), the "+" to edit them, and at
 * the right the profile and "All apps", which opens in full screen. Items only move when the favourites change.
 */
export default function BottomBar({ onOpenApps }: { onOpenApps: () => void }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const shown = useFavourites().favourites.slice(0, PHONE_FAVOURITE_SLOTS);
  const current =
    activePath(
      pathname,
      shown.map((item) => item.path),
    ) ?? false;

  return (
    <Paper
      component="nav"
      aria-label="Favourites"
      square
      elevation={0}
      sx={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        bgcolor: (theme) => theme.palette.ui.navbar,
        borderTop: 1,
        borderColor: 'divider',
        pb: 'env(safe-area-inset-bottom, 0px)',
        pl: 'env(safe-area-inset-left, 0px)',
        pr: 'calc(4px + env(safe-area-inset-right, 0px))',
      }}
    >
      <BottomNavigation
        value={current}
        onChange={(_, value: string) => navigate(value)}
        sx={{ flex: '0 1 auto', minWidth: 0, borderTop: 0, bgcolor: 'transparent', '& .MuiBottomNavigationAction-root': { minWidth: 44, px: 0 } }}
      >
        {shown.map((item) => (
          <BottomNavigationAction
            key={item.path}
            value={item.path}
            icon={item.icon}
            disabled={item.disabled}
            aria-label={item.disabled ? `${item.name}, coming soon` : item.name}
            title={item.name}
          />
        ))}
      </BottomNavigation>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 0.5 }}>
        <FavouritesMenu placement="bar" />
      </Box>
      <Box sx={{ flex: 1 }} />
      <Divider orientation="vertical" aria-hidden sx={{ height: 32, mx: 0.5 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
        <ProfileMenu placement="bar" />
        <IconButton onClick={onOpenApps} aria-label="All apps" aria-haspopup="dialog" sx={{ width: 44, height: 44, borderRadius: '8px', color: 'text.primary' }}>
          <AppsOutlinedIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
