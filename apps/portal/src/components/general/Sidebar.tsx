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

import { Box, IconButton, Tooltip, alpha, tractusx, useTheme } from '@dataspace-mgm/ui-mui';
import { NavLink } from 'react-router-dom';
import type { NavigationItem } from '../../types/routing';

/** Icon rail of the feature modules, built from the feature registry (src/features/main.tsx). */
export default function Sidebar({ items }: { items: NavigationItem[] }) {
  const theme = useTheme();
  const activeColor = theme.palette.mode === 'light' ? tractusx.black : tractusx.gold;

  return (
    <Box
      component="nav"
      aria-label="Features"
      sx={{
        width: 72,
        flexShrink: 0,
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        py: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}
    >
      {items.map((item) => (
        <Tooltip key={item.path} title={item.disabled ? `${item.name} (coming soon)` : item.name} placement="right">
          <span>
            <IconButton
              component={NavLink}
              to={item.path}
              end
              disabled={item.disabled}
              aria-label={item.name}
              sx={{
                position: 'relative',
                borderRadius: 3,
                color: 'text.secondary',
                '&.active': {
                  color: activeColor,
                  bgcolor: alpha(tractusx.gold, 0.16),
                },
                '&.active::before': {
                  content: '""',
                  position: 'absolute',
                  left: -14,
                  top: 8,
                  bottom: 8,
                  width: 4,
                  borderRadius: 2,
                  bgcolor: tractusx.gold,
                },
              }}
            >
              {item.icon}
            </IconButton>
          </span>
        </Tooltip>
      ))}
    </Box>
  );
}
