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

import type { ReactElement } from 'react';
import {
  AdminPanelSettingsOutlinedIcon,
  Box,
  BrandStripe,
  Button,
  Card,
  CardContent,
  Container,
  HubOutlinedIcon,
  OpenInNewIcon,
  Stack,
  SwapHorizOutlinedIcon,
  TravelExploreOutlinedIcon,
  Typography,
  tractusx,
} from '@dataspace-mgm/ui-mui';

interface Pillar {
  title: string;
  text: string;
  icon: ReactElement;
  accent: string;
}

const PILLARS: Pillar[] = [
  {
    title: 'Discover',
    text: 'Find partners and their services through the dataspace discovery and the business partner directory.',
    icon: <TravelExploreOutlinedIcon />,
    accent: tractusx.gold,
  },
  {
    title: 'Connect',
    text: 'Onboard your company, prove its identity and receive the credentials you need to join the dataspace.',
    icon: <HubOutlinedIcon />,
    accent: tractusx.green,
  },
  {
    title: 'Exchange',
    text: 'Connect your connector and share data with your partners under the usage policies you agreed on.',
    icon: <SwapHorizOutlinedIcon />,
    accent: tractusx.gold,
  },
  {
    title: 'Govern',
    text: 'Manage the users, roles, technical users and apps of your company in one place.',
    icon: <AdminPanelSettingsOutlinedIcon />,
    accent: tractusx.green,
  },
];

const ARCHITECTURE_URL = 'https://github.com/eclipse-tractusx/dataspace-mgm-service/tree/main/docs/architecture';
const TRACTUSX_URL = 'https://eclipse-tractusx.github.io';

export default function Home() {
  return (
    <Box component="article" aria-labelledby="home-title">
      <Box
        component="section"
        sx={{
          bgcolor: tractusx.black,
          color: tractusx.white,
          borderBottom: 1,
          borderColor: 'divider',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3} sx={{ maxWidth: 760 }}>
            <Typography variant="overline" sx={{ color: tractusx.green }}>
              Eclipse Tractus-X · Dataspace Management
            </Typography>
            <Typography id="home-title" variant="h1" component="h1">
              Welcome to your{' '}
              <Box component="span" sx={{ color: tractusx.gold }}>
                Tractus-X dataspace
              </Box>
            </Typography>
            <BrandStripe width={120} height={6} />
            <Typography variant="h6" component="p" sx={{ color: '#D6D6D6', fontWeight: 400 }}>
              The portal of your Operating Service Provider: onboard your company, manage its identity and its
              people, and connect to the dataspace that the Core Service Provider keeps trusted.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
              <Button
                variant="contained"
                href={ARCHITECTURE_URL}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNewIcon />}
                sx={{ bgcolor: tractusx.gold, color: tractusx.black, '&:hover': { bgcolor: tractusx.goldDark } }}
              >
                Explore the architecture
              </Button>
              <Button
                variant="outlined"
                href={TRACTUSX_URL}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNewIcon />}
                sx={{
                  color: tractusx.white,
                  borderColor: tractusx.green,
                  '&:hover': { borderColor: tractusx.green, bgcolor: 'rgba(179, 203, 45, 0.12)' },
                }}
              >
                About Eclipse Tractus-X
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container component="section" maxWidth="lg" aria-labelledby="pillars-title" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography id="pillars-title" variant="h2" component="h2" gutterBottom>
          Discover. Connect. Exchange. Govern.
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 720 }}>
          Everything your company needs to take part in the dataspace. The features arrive here one module at a
          time.
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          }}
        >
          {PILLARS.map((pillar) => (
            <Card key={pillar.title} component="section" sx={{ borderTop: `4px solid ${pillar.accent}` }}>
              <CardContent>
                <Box
                  aria-hidden
                  sx={{
                    display: 'inline-flex',
                    p: 1.25,
                    mb: 2,
                    borderRadius: '50%',
                    bgcolor: pillar.accent,
                    color: tractusx.black,
                  }}
                >
                  {pillar.icon}
                </Box>
                <Typography variant="h3" component="h3" gutterBottom>
                  {pillar.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {pillar.text}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
