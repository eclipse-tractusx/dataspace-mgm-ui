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
  Divider,
  StarBorderIcon,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Tooltip,
  alpha,
  tractusx,
  useTheme,
} from '@dataspace-mgm/ui-mui';
import { NavLink } from 'react-router-dom';
import { useFavourites } from '../../contexts/FavouritesContext';

const RAIL_WIDTH = 72;

const railButton = {
  flex: 'none',
  width: 44,
  height: 44,
  justifyContent: 'center',
  position: 'relative',
  color: 'text.secondary',
} as const;

/** Header height on desktop (74 px toolbar + 1 px border): the rail sticks right below it. */
const HEADER_HEIGHT = 75;

/**
 * Icon rail on desktop (MUI Drawer + List), the full height of the page next to the content and its
 * footer: the person's favourite features on top and, at the bottom left, "Choose favourites" and
 * "All apps". The icons stick below the header, so both stay in reach while the page scrolls.
 * On phones and tablets the BottomBar shows the same favourites.
 */
export default function Sidebar({ onOpenApps }: { onOpenApps: () => void }) {
  const items = useFavourites().favourites;
  // Orange on white is below 3:1, so the light theme marks the active item with the bar and a tint.
  const activeColor = useTheme().palette.mode === 'dark' ? tractusx.orange : tractusx.black;

  return (
    <Drawer
      variant="permanent"
      component="nav"
      aria-label="Features"
      sx={{
        width: RAIL_WIDTH,
        flexShrink: 0,
        // The rail runs the full height of the page; its content sticks below the header.
        borderRight: 1,
        borderColor: 'divider',
        '& .MuiDrawer-paper': {
          position: 'sticky',
          top: HEADER_HEIGHT,
          width: RAIL_WIDTH,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          borderRight: 0,
        },
      }}
    >
      <List sx={{ py: 2, flex: 1, overflowY: 'auto' }}>
        {items.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ justifyContent: 'center' }}>
            <Tooltip title={item.disabled ? `${item.name} (coming soon)` : item.name} placement="right">
              <ListItemButton
                component={NavLink}
                to={item.path}
                end={item.path === '/'}
                disabled={item.disabled}
                aria-label={item.name}
                sx={{
                  ...railButton,
                  '&:hover': { color: activeColor, bgcolor: alpha(tractusx.orange, 0.08) },
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
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mx: 2 }} />
      <List sx={{ py: 2 }} aria-label="App actions">
        {[
          { label: 'Choose favourites', icon: <StarBorderIcon /> },
          { label: 'All apps', icon: <AppsOutlinedIcon /> },
        ].map((action) => (
          <ListItem key={action.label} disablePadding sx={{ justifyContent: 'center' }}>
            <Tooltip title={action.label} placement="right">
              <ListItemButton
                onClick={onOpenApps}
                aria-label={action.label}
                sx={{ ...railButton, '&:hover': { color: activeColor, bgcolor: alpha(tractusx.orange, 0.08) } }}
              >
                <ListItemIcon sx={{ minWidth: 0, color: 'inherit' }}>{action.icon}</ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
