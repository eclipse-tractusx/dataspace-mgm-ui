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
  ArrowForwardIcon,
  Avatar,
  BrandBackdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Grid,
  HubOutlinedIcon,
  OpenInNewIcon,
  Stack,
  SwapHorizOutlinedIcon,
  TravelExploreOutlinedIcon,
  Typography,
  tractusx,
  useTheme,
} from '@dataspace-mgm/ui-mui';

interface Pillar {
  title: string;
  text: string;
  icon: ReactElement;
}

const PILLARS: Pillar[] = [
  {
    title: 'Discover',
    text: 'Find partners and their services through the dataspace discovery and the business partner directory.',
    icon: <TravelExploreOutlinedIcon />,
  },
  {
    title: 'Connect',
    text: 'Onboard your company, prove its identity and receive the credentials you need to join the dataspace.',
    icon: <HubOutlinedIcon />,
  },
  {
    title: 'Exchange',
    text: 'Connect your connector and share data with your partners under the usage policies you agreed on.',
    icon: <SwapHorizOutlinedIcon />,
  },
  {
    title: 'Govern',
    text: 'Manage the users, roles, technical users and apps of your company in one place.',
    icon: <AdminPanelSettingsOutlinedIcon />,
  },
];

const ARCHITECTURE_URL = 'https://github.com/eclipse-tractusx/dataspace-mgm-service/tree/main/docs/architecture';
const TRACTUSX_URL = 'https://eclipse-tractusx.github.io';

export default function Home() {
  const iconColor = useTheme().palette.mode === 'dark' ? tractusx.orange : tractusx.orangeDarkest;

  return (
    <article aria-labelledby="home-title">
      <BrandBackdrop>
        <Container maxWidth="lg" sx={{ pt: { xs: 14, md: 12 }, pb: { xs: 8, md: 12 } }}>
          <Stack spacing={3} sx={{ maxWidth: 760 }}>
            <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Operating Service Provider portal
            </Typography>
            <Typography id="home-title" variant="h1" component="h1" sx={{ fontSize: 'clamp(2.25rem, 3vw + 1rem, 4rem)' }}>
              Welcome to the{' '}
              <Typography component="span" variant="inherit" sx={{ color: tractusx.orange, display: 'block' }}>
                Eclipse Tractus-X Dataspace Management
              </Typography>
            </Typography>
            <Typography sx={{ fontSize: { xs: 18, md: 20 }, lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.85)' }}>
              Onboard your company, manage its identity and its people, and connect to the dataspace that the Core
              Service Provider keeps trusted.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
              <Button
                color="primary"
                href={ARCHITECTURE_URL}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<ArrowForwardIcon />}
              >
                Explore the architecture
              </Button>
              <Button
                color="secondary"
                href={TRACTUSX_URL}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNewIcon />}
              >
                Visit Eclipse Tractus-X
              </Button>
            </Stack>
          </Stack>
        </Container>
      </BrandBackdrop>

      <Container component="section" maxWidth="lg" aria-labelledby="pillars-title" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography variant="overline" color="text.secondary">
          What you can do here
        </Typography>
        <Typography id="pillars-title" variant="h2" component="h2" sx={{ mt: 1, mb: 2 }}>
          Discover. Connect. Exchange. Govern.
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 6, maxWidth: 680 }}>
          Everything your company needs to take part in the dataspace. The features arrive here one module at a
          time.
        </Typography>
        <Grid container spacing={3}>
          {PILLARS.map((pillar) => (
            <Grid key={pillar.title} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card component="section" aria-labelledby={`pillar-${pillar.title}`} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardHeader
                  avatar={
                    <Avatar variant="rounded" aria-hidden sx={{ color: iconColor }}>
                      {pillar.icon}
                    </Avatar>
                  }
                  title={pillar.title}
                  slotProps={{ title: { id: `pillar-${pillar.title}`, component: 'h3' } }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {pillar.text}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Chip label="Coming soon" size="small" variant="outlined" />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </article>
  );
}
