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
  AppsOutlinedIcon,
  Avatar,
  DarkModeOutlinedIcon,
  Divider,
  GitHubIcon,
  IconButton,
  LightModeOutlinedIcon,
  ListItemIcon,
  ListItemText,
  LoginIcon,
  Menu,
  MenuItem,
  MoreVertIcon,
  PersonOutlinedIcon,
  StarBorderIcon,
  Tooltip,
  Typography,
  alpha,
  tractusx,
  useColorMode,
} from '@dataspace-mgm/ui-mui';

const SOURCE_URL = 'https://github.com/eclipse-tractusx/dataspace-mgm-ui';

/** Where a menu button sits: in the header (menu opens below) or in the phone's bottom bar (menu opens above). */
export type MenuPlacement = 'header' | 'bar';

const originsFor = (placement: MenuPlacement) =>
  placement === 'bar'
    ? {
        anchorOrigin: { vertical: 'top', horizontal: 'right' } as const,
        transformOrigin: { vertical: 'bottom', horizontal: 'right' } as const,
      }
    : {
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' } as const,
        transformOrigin: { vertical: 'top', horizontal: 'right' } as const,
      };

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
      <Tooltip title="Profile">
        <IconButton
          onClick={menu.show}
          aria-label="Profile"
          aria-haspopup="menu"
          aria-expanded={menu.open}
          aria-controls={menu.open ? `profile-menu-${placement}` : undefined}
          sx={{ p: 0.5 }}
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

/** More options: all apps, favourites, theme and source code. In the header on desktop, in the bottom bar on phones. */
export function MoreMenu({ onOpenApps, placement = 'header' }: { onOpenApps: () => void; placement?: MenuPlacement }) {
  const menu = useMenu();
  const { mode, toggle } = useColorMode();
  const nextMode = mode === 'light' ? 'dark' : 'light';
  const run = (action: () => void) => () => {
    menu.hide();
    action();
  };

  return (
    <>
      <Tooltip title="More options">
        <IconButton
          onClick={menu.show}
          aria-label="More options"
          aria-haspopup="menu"
          aria-expanded={menu.open}
          aria-controls={menu.open ? `more-menu-${placement}` : undefined}
          sx={{ color: 'text.primary', '&:hover': { color: tractusx.orange } }}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id={`more-menu-${placement}`}
        anchorEl={menu.anchor}
        open={menu.open}
        onClose={menu.hide}
        {...originsFor(placement)}
      >
        <MenuItem onClick={run(onOpenApps)}>
          <ListItemIcon>
            <AppsOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="All apps" />
        </MenuItem>
        <MenuItem onClick={run(onOpenApps)}>
          <ListItemIcon>
            <StarBorderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Choose favourites" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={run(toggle)}>
          <ListItemIcon>
            {mode === 'light' ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText primary={`Switch to ${nextMode} mode`} />
        </MenuItem>
        <MenuItem component="a" href={SOURCE_URL} target="_blank" rel="noopener noreferrer" onClick={menu.hide}>
          <ListItemIcon>
            <GitHubIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Source code" />
        </MenuItem>
      </Menu>
    </>
  );
}
