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

import { useState, type MouseEvent } from 'react';
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  LoginIcon,
  Menu,
  MenuItem,
  NotificationsOutlinedIcon,
  PersonOutlinedIcon,
  Tooltip,
  Typography,
  alpha,
  tractusx,
} from '@dataspace-mgm/ui-mui';

/**
 * Where a menu button sits, which decides where its menu opens: below it in the header, above it in the
 * phone's bottom bar, to its right (bottom-aligned) at the foot of the desktop sidebar.
 */
export type MenuPlacement = 'header' | 'bar' | 'rail';

export const originsFor = (placement: MenuPlacement) => {
  switch (placement) {
    case 'bar':
      return {
        anchorOrigin: { vertical: 'top', horizontal: 'right' } as const,
        transformOrigin: { vertical: 'bottom', horizontal: 'right' } as const,
      };
    case 'rail':
      return {
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' } as const,
        transformOrigin: { vertical: 'bottom', horizontal: 'left' } as const,
      };
    default:
      return {
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' } as const,
        transformOrigin: { vertical: 'top', horizontal: 'right' } as const,
      };
  }
};

/** The 44 px square of every button on the sidebar. */
export const railButtonSx = { width: 44, height: 44, borderRadius: '8px', color: 'text.secondary' } as const;

function useMenu() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return {
    anchor,
    open: Boolean(anchor),
    show: (event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget),
    hide: () => setAnchor(null),
  };
}

/**
 * Profile of the signed-in person. Sign-in is handled by the backend (BFF session, GET /me) and is not
 * wired yet, so the menu shows the guest state.
 */
export function ProfileMenu({ placement = 'header' }: { placement?: MenuPlacement }) {
  const menu = useMenu();
  return (
    <>
      <Tooltip title="Profile" placement={placement === 'rail' ? 'right' : 'bottom'}>
        <IconButton
          onClick={menu.show}
          aria-label="Profile"
          aria-haspopup="menu"
          aria-expanded={menu.open}
          aria-controls={menu.open ? `profile-menu-${placement}` : undefined}
          sx={placement === 'rail' ? { ...railButtonSx, p: 0 } : { p: 0.5 }}
        >
          <Avatar sx={{ width: 34, height: 34, bgcolor: alpha(tractusx.orange, 0.15), color: tractusx.orange }}>
            <PersonOutlinedIcon fontSize="small" />
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        id={`profile-menu-${placement}`}
        anchorEl={menu.anchor}
        open={menu.open}
        onClose={menu.hide}
        {...originsFor(placement)}
      >
        <MenuItem disabled sx={{ opacity: '1 !important', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography sx={{ fontWeight: 700 }}>Guest</Typography>
          <Typography variant="body2" color="text.secondary">
            Not signed in
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <ListItemIcon>
            <PersonOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="My profile" secondary="Coming soon" />
        </MenuItem>
        <MenuItem disabled>
          <ListItemIcon>
            <LoginIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Sign in" secondary="Arrives with the identity module" />
        </MenuItem>
      </Menu>
    </>
  );
}

/**
 * The person's notifications. The bell sits on the sidebar above "All apps" on desktop and in the header on
 * phones. The inbox arrives with the notifications module; until then the menu says so.
 */
export function NotificationsMenu({ placement = 'header' }: { placement?: MenuPlacement }) {
  const menu = useMenu();
  return (
    <>
      <Tooltip title="Notifications" placement={placement === 'rail' ? 'right' : 'bottom'}>
        <IconButton
          onClick={menu.show}
          aria-label="Notifications"
          aria-haspopup="menu"
          aria-expanded={menu.open}
          aria-controls={menu.open ? `notifications-menu-${placement}` : undefined}
          sx={
            placement === 'rail'
              ? { ...railButtonSx, '&:hover': { color: 'text.primary', bgcolor: alpha(tractusx.orange, 0.08) } }
              : { color: 'text.primary', '&:hover': { color: tractusx.orange } }
          }
        >
          <NotificationsOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Menu id={`notifications-menu-${placement}`} anchorEl={menu.anchor} open={menu.open} onClose={menu.hide} {...originsFor(placement)}>
        <MenuItem disabled sx={{ opacity: '1 !important', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography sx={{ fontWeight: 700 }}>Notifications</Typography>
          <Typography variant="body2" color="text.secondary">
            Nothing new
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <ListItemText primary="Your inbox" secondary="Arrives with the notifications module" />
        </MenuItem>
      </Menu>
    </>
  );
}
