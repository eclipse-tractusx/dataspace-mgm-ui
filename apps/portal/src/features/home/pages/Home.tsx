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
  OpenInNewIcon,
  Stack,
  Typography,
  tractusx,
  useTheme,
} from '@dataspace-mgm/ui-mui';
import { useNavigate } from 'react-router-dom';
import { features } from '../../main';

const ARCHITECTURE_URL = 'https://github.com/eclipse-tractusx/dataspace-mgm-service/tree/main/docs/architecture';
const TRACTUSX_URL = 'https://eclipse-tractusx.github.io';

export default function Home() {
  // Every service of the portal except Home itself, straight from the feature registry (read at render time:
  // the registry imports this page, so it is not ready yet when this module loads).
  const services = features.filter((item) => item.path !== '/');
  const iconColor = useTheme().palette.mode === 'dark' ? tractusx.orange : tractusx.orangeDarkest;
  const navigate = useNavigate();

  return (
    <article aria-labelledby="home-title">
      <BrandBackdrop>
        <Container maxWidth="lg" sx={{ pt: { xs: 14, md: 12 }, pb: { xs: 8, md: 12 } }}>
          <Stack spacing={3} sx={{ maxWidth: 760 }}>
            <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Onboarding service provider portal
            </Typography>
            <Typography id="home-title" variant="h1" component="h1" sx={{ fontSize: 'clamp(2.25rem, 3vw + 1rem, 4rem)' }}>
              Welcome to the{' '}
              <Typography component="span" variant="inherit" sx={{ color: tractusx.orange, display: 'block' }}>
                Eclipse Tractus-X Dataspace Management UI
              </Typography>
            </Typography>
            <Typography sx={{ fontSize: { xs: 18, md: 20 }, lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.85)' }}>
              Onboard companies, manage your participants, and run their connectors and wallets as a service, in the
              dataspace that the Core Service Provider keeps trusted.
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

      <Container component="section" maxWidth="lg" aria-labelledby="services-title" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography variant="overline" color="text.secondary">
          Services
        </Typography>
        <Typography id="services-title" variant="h2" component="h2" sx={{ mt: 1, mb: 2 }}>
          Onboard, manage and serve your participants
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 6, maxWidth: 680 }}>
          What your onboarding service provider runs for the companies it brings into the dataspace. The services
          arrive here one module at a time.
        </Typography>
        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid key={service.path} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card
                component="section"
                aria-labelledby={`service-${service.path}`}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardHeader
                  avatar={
                    <Avatar variant="rounded" aria-hidden sx={{ color: iconColor }}>
                      {service.icon}
                    </Avatar>
                  }
                  title={service.name}
                  slotProps={{ title: { id: `service-${service.path}`, component: 'h3' } }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  {service.disabled ? (
                    <Chip label="Coming soon" size="small" variant="outlined" />
                  ) : (
                    <Button size="small" onClick={() => navigate(service.path)} endIcon={<ArrowForwardIcon />}>
                      Open
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </article>
  );
}
