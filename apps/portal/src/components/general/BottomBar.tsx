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

import { BottomNavigation, BottomNavigationAction, Box, Divider, Paper } from '@dataspace-mgm/ui-mui';
import { useLocation, useNavigate } from 'react-router-dom';
import { MAX_FAVOURITES, useFavourites } from '../../contexts/FavouritesContext';
import { MoreMenu, ProfileMenu } from './HeaderMenus';

/** The favourite whose path is the current page or a parent of it ("/" only matches itself). */
export function activeFavourite(pathname: string, paths: string[]): string | false {
  const matches = paths.filter((path) => pathname === path || (path !== '/' && pathname.startsWith(`${path}/`)));
  return matches.sort((a, b) => b.length - a.length)[0] ?? false;
}

/**
 * The navigation on phones and tablets, along the bottom of the screen: the person's favourites
 * (at most five, in registry order, icons only) and, at the right, the profile and the more-options
 * menu, which opens "All apps" in full screen. Items only move when the favourites change.
 */
export default function BottomBar({ onOpenApps }: { onOpenApps: () => void }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const shown = useFavourites().favourites.slice(0, MAX_FAVOURITES);
  const current = activeFavourite(
    pathname,
    shown.map((item) => item.path),
  );

  return (
    <Paper
      component="nav"
      aria-label="Favourites"
      square
      elevation={0}
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        display: 'flex',
        alignItems: 'center',
        bgcolor: (theme) => theme.palette.ui.navbar,
        borderTop: 1,
        borderColor: 'divider',
        pb: 'env(safe-area-inset-bottom, 0px)',
        pl: 'env(safe-area-inset-left, 0px)',
        pr: 'calc(8px + env(safe-area-inset-right, 0px))',
      }}
    >
      <BottomNavigation
        value={current}
        onChange={(_, value: string) => navigate(value)}
        sx={{ flex: 1, minWidth: 0, borderTop: 0, bgcolor: 'transparent' }}
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
      <Divider orientation="vertical" aria-hidden sx={{ height: 32, mx: 0.5 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <ProfileMenu placement="bar" />
        <MoreMenu placement="bar" onOpenApps={onOpenApps} />
      </Box>
    </Paper>
  );
}
