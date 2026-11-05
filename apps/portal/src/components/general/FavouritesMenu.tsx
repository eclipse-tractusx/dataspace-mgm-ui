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
  AddIcon,
  Box,
  CloseIcon,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  Tooltip,
  Typography,
  alpha,
  tractusx,
} from '@dataspace-mgm/ui-mui';
import { useLocation } from 'react-router-dom';
import { activePath, useFavourites } from '../../contexts/FavouritesContext';
import { railButtonSx } from './HeaderMenus';

export type FavouritesPlacement = 'rail' | 'bar';

/**
 * The "+" right after the last favourite, in the sidebar and in the phone's bottom bar. It opens every service
 * (Home is always there and not in the list): on the desktop each with a switch, on a phone with × to take
 * a favourite out and + to put one in. A choice applies at once and the list stays open, so several services can
 * be changed in one go. Favourites keep the registry order, so adding one never moves another. While the page
 * on screen belongs to a service that is not a favourite, the "+" is marked and offers to add it.
 */
export default function FavouritesMenu({ placement }: { placement: FavouritesPlacement }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const { candidates, isFavourite, toggle } = useFavourites();
  const { pathname } = useLocation();
  const open = Boolean(anchor);
  const rail = placement === 'rail';

  const currentPath = activePath(
    pathname,
    candidates.map((app) => app.path),
  );
  const suggested = candidates.find((app) => app.path === currentPath && !isFavourite(app.path));
  const label = suggested ? `Add ${suggested.name} to favourites` : 'Edit favourites';

  const button = (
    <IconButton
      onClick={(event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget)}
      aria-label={label}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={open ? `favourites-menu-${placement}` : undefined}
      sx={{
        ...(rail ? railButtonSx : { width: 44, height: 44, borderRadius: '8px', color: 'text.secondary' }),
        border: '1px dashed',
        borderColor: suggested || open ? tractusx.orange : 'divider',
        color: suggested || open ? tractusx.orange : 'text.secondary',
        '&:hover': { color: tractusx.orange, borderColor: tractusx.orange, bgcolor: alpha(tractusx.orange, 0.08) },
      }}
    >
      <AddIcon />
    </IconButton>
  );

  return (
    <>
      {rail ? (
        <Tooltip title={label} placement="right" disableHoverListener={open}>
          {button}
        </Tooltip>
      ) : (
        button
      )}
      <Menu
        id={`favourites-menu-${placement}`}
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        anchorOrigin={rail ? { vertical: 'top', horizontal: 'right' } : { vertical: 'top', horizontal: 'center' }}
        transformOrigin={rail ? { vertical: 'top', horizontal: 'left' } : { vertical: 'bottom', horizontal: 'center' }}
        slotProps={{ list: { 'aria-label': 'Favourites' } }}
      >
        <Box sx={{ px: 2, pt: 1, pb: 1.5 }}>
          <Typography sx={{ fontWeight: 700 }}>Favourites</Typography>
          <Typography variant="body2" color="text.secondary">
            {rail
              ? 'Switch on the services you want in your sidebar.'
              : 'The first five are in your bar. Home is always there.'}
          </Typography>
        </Box>
        {candidates.map((app) => {
          const favourite = isFavourite(app.path);
          const isSuggested = app === suggested;
          return (
            <MenuItem
              key={app.path}
              role="menuitemcheckbox"
              aria-checked={favourite}
              aria-current={isSuggested ? 'page' : undefined}
              selected={!rail && favourite}
              onClick={() => toggle(app.path)}
              sx={isSuggested ? { boxShadow: `inset 3px 0 0 ${tractusx.orange}` } : undefined}
            >
              <ListItemIcon sx={{ color: favourite ? tractusx.orange : 'text.secondary' }}>{app.icon}</ListItemIcon>
              <ListItemText primary={app.name} secondary={app.disabled ? 'Coming soon' : undefined} />
              {rail ? (
                <Switch
                  edge="end"
                  size="small"
                  checked={favourite}
                  tabIndex={-1}
                  aria-hidden
                  sx={{ ml: 2, pointerEvents: 'none' }}
                />
              ) : (
                <Box component="span" aria-hidden sx={{ ml: 2, display: 'inline-flex', color: favourite ? 'text.secondary' : tractusx.orange }}>
                  {favourite ? <CloseIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                </Box>
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
