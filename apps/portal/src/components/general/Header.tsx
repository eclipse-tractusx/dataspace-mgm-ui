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
  AppBar,
  Box,
  Chip,
  CircleIcon,
  DarkModeOutlinedIcon,
  Divider,
  IconButton,
  LightModeOutlinedIcon,
  Toolbar,
  Tooltip,
  TractusXLogo,
  Typography,
  tractusx,
  useColorMode,
  useMediaQuery,
  useTheme,
} from '@dataspace-mgm/ui-mui';
import { Link as RouterLink } from 'react-router-dom';
import { useConfig } from '../../config/ConfigContext';
import { MoreMenu, NotificationsMenu } from './HeaderMenus';

/**
 * Navigation bar after eclipse-tractusx.github.io: 74 px, black (dark) or #F0F0F0 (light), the mark in colour.
 * Right side on desktop: environment, theme switch and more options (notifications and the profile sit at the
 * foot of the sidebar). On phones: notifications; profile and more options sit in the bottom bar.
 */
export default function Header({ onOpenApps }: { onOpenApps: () => void }) {
  const { mode, toggle } = useColorMode();
  const { environment } = useConfig();
  const theme = useTheme();
  const { palette } = theme;
  // On phones and tablets the sidebar is replaced by the bottom bar.
  const compact = useMediaQuery(theme.breakpoints.down('md'));
  const nextMode = mode === 'light' ? 'dark' : 'light';

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: palette.ui.navbar, color: 'text.primary', borderBottom: 1, borderColor: 'divider' }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, md: 74 }, gap: { xs: 1, sm: 2 }, px: { xs: 2, md: 3 } }}>
        <Box
          component={RouterLink}
          to="/"
          aria-label="Eclipse Tractus-X Dataspace Management, home"
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'inherit', textDecoration: 'none', minWidth: 0 }}
        >
          <TractusXLogo size={34} decorative />
          <Typography component="span" sx={{ fontWeight: 800, fontSize: { xs: 16, sm: 18 }, whiteSpace: 'nowrap' }}>
            Eclipse Tractus-X
          </Typography>
          <Divider
            orientation="vertical"
            aria-hidden
            sx={{ display: { xs: 'none', md: 'block' }, height: 24, borderColor: palette.ui.cardBorder }}
          />
          <Typography
            component="span"
            sx={{ display: { xs: 'none', md: 'inline' }, fontWeight: 500, fontSize: 16, color: 'text.secondary' }}
          >
            Dataspace Management
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Chip
          size="small"
          variant="outlined"
          label={environment}
          aria-label={`Environment: ${environment}`}
          icon={<CircleIcon aria-hidden sx={{ fontSize: '8px !important', color: `${tractusx.green} !important`, ml: '10px !important' }} />}
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            borderColor: palette.ui.cardBorder,
            color: 'text.secondary',
          }}
        />
        <Tooltip title={`Switch to ${nextMode} mode`}>
          <IconButton
            onClick={toggle}
            aria-label={`Switch to ${nextMode} mode`}
            sx={{ display: { xs: 'none', md: 'inline-flex' }, color: 'text.primary', '&:hover': { color: tractusx.orange } }}
          >
            {mode === 'light' ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
        {compact ? <NotificationsMenu /> : <MoreMenu onOpenApps={onOpenApps} />}
      </Toolbar>
    </AppBar>
  );
}
