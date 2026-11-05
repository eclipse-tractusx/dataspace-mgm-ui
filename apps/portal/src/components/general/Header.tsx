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
  BrandStripe,
  Chip,
  DarkModeOutlinedIcon,
  DataspaceMark,
  IconButton,
  LightModeOutlinedIcon,
  Toolbar,
  Tooltip,
  Typography,
  tractusx,
  useColorMode,
} from '@dataspace-mgm/ui-mui';
import { Link as RouterLink } from 'react-router-dom';
import { useConfig } from '../../config/ConfigContext';

export default function Header() {
  const { mode, toggle } = useColorMode();
  const { environment } = useConfig();
  const nextMode = mode === 'light' ? 'dark' : 'light';

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: tractusx.black, color: tractusx.white }}>
      <Toolbar sx={{ gap: 2 }}>
        <Box
          component={RouterLink}
          to="/"
          aria-label="Dataspace Management, home"
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'inherit', textDecoration: 'none' }}
        >
          <DataspaceMark size={32} />
          <Typography component="span" sx={{ fontWeight: 700, letterSpacing: '0.02em' }}>
            Tractus-X
          </Typography>
          <Typography
            component="span"
            sx={{ color: tractusx.gold, fontWeight: 500, display: { xs: 'none', sm: 'inline' } }}
          >
            Dataspace Management
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Chip
          label={environment}
          size="small"
          variant="outlined"
          aria-label={`Environment: ${environment}`}
          sx={{ color: tractusx.green, borderColor: tractusx.green, textTransform: 'uppercase', fontWeight: 600 }}
        />
        <Tooltip title={`Switch to ${nextMode} mode`}>
          <IconButton onClick={toggle} aria-label={`Switch to ${nextMode} mode`} sx={{ color: tractusx.white }}>
            {mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
      <BrandStripe height={3} />
    </AppBar>
  );
}
