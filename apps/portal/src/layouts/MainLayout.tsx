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

import { Box, Link, Typography } from '@dataspace-mgm/ui-mui';
import { Outlet } from 'react-router-dom';
import Header from '../components/general/Header';
import Sidebar from '../components/general/Sidebar';
import { features } from '../features/main';

export default function MainLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Link
        href="#main-content"
        sx={{
          position: 'absolute',
          left: 8,
          top: -48,
          zIndex: 2000,
          p: 1,
          bgcolor: 'background.paper',
          '&:focus': { top: 8 },
        }}
      >
        Skip to content
      </Link>
      <Header />
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar items={features} />
        <Box component="main" id="main-content" tabIndex={-1} sx={{ flex: 1, minWidth: 0, outline: 'none' }}>
          <Outlet />
        </Box>
      </Box>
      <Box component="footer" sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          Eclipse Tractus-X Dataspace Management · Copyright © 2026 Contributors to the Eclipse Foundation ·{' '}
          <Link href="https://github.com/eclipse-tractusx/dataspace-mgm-ui" target="_blank" rel="noopener noreferrer">
            Source code
          </Link>{' '}
          ·{' '}
          <Link href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener noreferrer">
            Apache-2.0
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
