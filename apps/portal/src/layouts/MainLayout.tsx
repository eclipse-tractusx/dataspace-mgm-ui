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
  Divider,
  Grid,
  Link,
  Stack,
  TractusXLogo,
  Typography,
  tractusx,
  useMediaQuery,
  useTheme,
} from '@dataspace-mgm/ui-mui';
import { Outlet, useLocation } from 'react-router-dom';
import AppsDialog from '../components/general/AppsDialog';
import BottomBar from '../components/general/BottomBar';
import Header from '../components/general/Header';
import Sidebar from '../components/general/Sidebar';
import { features } from '../features/main';

const ECLIPSE_LINKS = [
  { label: 'About', href: 'https://www.eclipse.org' },
  { label: 'Privacy Policy', href: 'https://www.eclipse.org/legal/privacy.php' },
  { label: 'Terms of Use', href: 'https://www.eclipse.org/legal/termsofuse.php' },
  { label: 'Compliance', href: 'https://www.eclipse.org/legal/compliance/' },
  { label: 'Legal Resources', href: 'https://www.eclipse.org/legal' },
];

const PROJECT_LINKS = [
  { label: 'Eclipse Tractus-X', href: 'https://eclipse-tractusx.github.io' },
  { label: 'Source code', href: 'https://github.com/eclipse-tractusx/dataspace-mgm-ui' },
  { label: 'Architecture', href: 'https://github.com/eclipse-tractusx/dataspace-mgm-service/tree/main/docs/architecture' },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <Stack spacing={1} component="nav" aria-label={title}>
      <Typography variant="overline" sx={{ color: tractusx.white }}>
        {title}
      </Typography>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          variant="body2"
          sx={{ color: 'rgba(255, 255, 255, 0.85)', '&:hover': { color: tractusx.orange } }}
        >
          {link.label}
        </Link>
      ))}
    </Stack>
  );
}

/** Footer in the dark style of eclipse-tractusx.github.io, mentioning the Eclipse Foundation (slide 14). */
function Footer() {
  const { palette } = useTheme();
  return (
    <Box
      component="footer"
      sx={{ bgcolor: palette.ui.footer, color: tractusx.white, borderTop: '0.5px solid', borderColor: palette.ui.cardBorder }}
    >
      <Grid container spacing={4} sx={{ px: { xs: 3, md: 6 }, py: 5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <TractusXLogo size={32} decorative />
              <Typography sx={{ fontWeight: 800, fontSize: 18 }}>Eclipse Tractus-X</Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              Where We Build Dataspaces
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FooterColumn title="Eclipse Foundation" links={ECLIPSE_LINKS} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FooterColumn title="Dataspace Management" links={PROJECT_LINKS} />
        </Grid>
      </Grid>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} />
      <Box sx={{ px: { xs: 3, md: 6 }, py: 2.5 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
          Copyright © 2026 Contributors to the Eclipse Foundation · Apache-2.0
        </Typography>
      </Box>
    </Box>
  );
}

/**
 * The app shell: the header stays at the top, the sidebar (desktop) on the left and the bottom bar
 * (phones and tablets) at the bottom. Only the canvas between them scrolls: the page and its footer.
 */
export default function MainLayout() {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('md'));
  const [appsOpen, setAppsOpen] = useState(false);
  const openApps = () => setAppsOpen(true);
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
      <Header onOpenApps={openApps} />
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {!compact && <Sidebar onOpenApps={openApps} />}
        <Box
          ref={canvas}
          id="canvas"
          sx={{ flex: 1, minWidth: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
        >
          <Box component="main" id="main-content" tabIndex={-1} sx={{ flex: '1 0 auto', outline: 'none' }}>
            <Outlet />
          </Box>
          <Footer />
        </Box>
      </Box>
      {compact && <BottomBar onOpenApps={openApps} />}
      <AppsDialog open={appsOpen} onClose={() => setAppsOpen(false)} items={features} />
    </Box>
  );
}
