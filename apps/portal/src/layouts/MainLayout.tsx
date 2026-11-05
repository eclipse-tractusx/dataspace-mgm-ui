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

import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Link,
  tractusx,
  useMediaQuery,
  useTheme,
} from '@dataspace-mgm/ui-mui';
import { Outlet, useLocation } from 'react-router-dom';
import ServicesDialog from '../components/general/ServicesDialog';
import BottomBar from '../components/general/BottomBar';
import Header from '../components/general/Header';
import Sidebar from '../components/general/Sidebar';
import { features } from '../features/main';

/**
 * The app shell: the header stays at the top, the sidebar (desktop) on the left and the bottom bar
 * (phones and tablets) at the bottom. Only the canvas between them scrolls. The footer belongs to the home page.
 */
export default function MainLayout() {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('md'));
  const [servicesOpen, setServicesOpen] = useState(false);
  const openServices = () => setServicesOpen(true);
  const canvas = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  // A new page starts at its top, as it would with the window as the scroll container.
  useEffect(() => {
    canvas.current?.scrollTo?.({ top: 0 });
  }, [pathname]);

  return (
    <Box
      sx={{
        height: '100vh',
        '@supports (height: 100dvh)': { height: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Link
        href="#main-content"
        sx={{
          position: 'absolute',
          left: 8,
          top: -48,
          zIndex: 2000,
          px: 2,
          py: 1,
          borderRadius: 1,
          bgcolor: tractusx.orange,
          color: `${tractusx.black} !important`,
          '&:focus': { top: 8 },
        }}
      >
        Skip to content
      </Link>
      <Header />
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {!compact && <Sidebar />}
        <Box
          ref={canvas}
          id="canvas"
          sx={{ flex: 1, minWidth: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
        >
          <Box component="main" id="main-content" tabIndex={-1} sx={{ flex: '1 0 auto', outline: 'none' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
      {compact && <BottomBar onOpenServices={openServices} />}
      {/* Phones open All services full screen; desktop shows it in the canvas (/all-services). */}
      {compact && <ServicesDialog open={servicesOpen} onClose={() => setServicesOpen(false)} items={features} />}
    </Box>
  );
}
