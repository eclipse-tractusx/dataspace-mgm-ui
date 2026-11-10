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

import {
  AppsOutlinedIcon,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Tooltip,
  alpha,
  tractusx,
  useTheme,
} from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { activePath, useFavourites } from '../../contexts/FavouritesContext';
import { ALL_SERVICES_PATH } from '../../pages/AllServicesPage';
import FavouritesMenu from './FavouritesMenu';
import { NotificationsMenu, ProfileMenu, railButtonSx } from './HeaderMenus';

const RAIL_WIDTH = 72;

/** One centred slot of the rail. */
function RailSlot({ children }: { children: React.ReactNode }) {
  return (
    <ListItem disablePadding sx={{ justifyContent: 'center', py: 0.25 }}>
      {children}
    </ListItem>
  );
}

/**
 * Icon rail on desktop (MUI Drawer + List), fixed on the left of the shell from the header to the bottom
 * of the window; it never scrolls with the page.
 * - Top: Home and the person's favourite features, and right under the last one the "+" to edit them.
 * - Bottom left: notifications, the profile, and "All services" as the last button, which opens the All services
 *   view in the canvas.
 * On phones and tablets the BottomBar shows the same favourites.
 */
export default function Sidebar() {
  const { t } = useTranslation();
  const { favourites } = useFavourites();
  // One active item: the favourite whose path is the longest match of the page (/onboarding/reviews is the review,
  // not also onboarding). NavLink would mark every parent path.
  const current = activePath(
    useLocation().pathname,
    favourites.map((item) => item.path),
  );
  // Orange on white is below 3:1, so the light theme marks the active item with the bar and a tint.
  const activeColor = useTheme().palette.mode === 'dark' ? tractusx.orange : tractusx.black;
  const hover = { color: activeColor, bgcolor: alpha(tractusx.orange, 0.08) };

  return (
    <Drawer
      variant="permanent"
      component="nav"
      aria-label={t('navigation.features')}
      sx={{
        width: RAIL_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          position: 'relative',
          width: RAIL_WIDTH,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
        },
      }}
    >
      <List aria-label={t('navigation.favourites')} sx={{ py: 2, flex: 1, overflowY: 'auto' }}>
        {favourites.map((item) => (
          <RailSlot key={item.path}>
            <Tooltip title={item.disabled ? t('navigation.itemComingSoon', { name: item.name }) : item.name} placement="right">
              <ListItemButton
                component={Link}
                to={item.path}
                className={item.path === current ? 'active' : undefined}
                aria-current={item.path === current ? 'page' : undefined}
                disabled={item.disabled}
                aria-label={item.name}
                sx={{
                  ...railButtonSx,
                  flex: 'none',
                  justifyContent: 'center',
                  position: 'relative',
                  '&:hover': hover,
                  '&.active': { color: activeColor, bgcolor: alpha(tractusx.orange, 0.15) },
                  '&.active::before': {
                    content: '""',
                    position: 'absolute',
                    left: -14,
                    top: 8,
                    bottom: 8,
                    width: 3,
                    borderRadius: 2,
                    bgcolor: tractusx.orange,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, color: 'inherit' }}>{item.icon}</ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </RailSlot>
        ))}
        <RailSlot>
          <FavouritesMenu placement="rail" />
        </RailSlot>
      </List>
      <Divider sx={{ mx: 2 }} />
      <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
        <NotificationsMenu placement="rail" />
        <ProfileMenu placement="rail" />
        <Tooltip title={t('navigation.allServices')} placement="right">
          <IconButton
            component={NavLink}
            to={ALL_SERVICES_PATH}
            aria-label={t('navigation.allServices')}
            sx={{
              ...railButtonSx,
              '&:hover': hover,
              '&.active': { color: activeColor, bgcolor: alpha(tractusx.orange, 0.15) },
            }}
          >
            <AppsOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
}
