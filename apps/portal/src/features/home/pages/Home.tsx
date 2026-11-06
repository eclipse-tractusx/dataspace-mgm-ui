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
  AppsOutlinedIcon,
  ArrowForwardIcon,
  Box,
  BrandBackdrop,
  Button,
  Container,
  Grid,
  HowToRegOutlinedIcon,
  OpenInNewIcon,
  RocketLaunchOutlinedIcon,
  SpaceGlow,
  Stack,
  Typography,
  VerifiedUserOutlinedIcon,
  alpha,
  tractusx,
  useTheme,
} from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import Footer from '../../../components/general/Footer';
import { ALL_SERVICES_PATH } from '../../../pages/AllServicesPage';
import { HOME_NS } from '../i18n';

const ARCHITECTURE_URL = 'https://github.com/eclipse-tractusx/dataspace-mgm-service/tree/main/docs/architecture';

interface Point {
  /** `how.<key>.title` and `how.<key>.text` in home.json. */
  key: 'join' | 'run' | 'trust';
  icon: ReactElement;
}

/** How taking part works, in three steps: an explanation, not a list of the services. */
const HOW_IT_WORKS: Point[] = [
  { key: 'join', icon: <HowToRegOutlinedIcon /> },
  { key: 'run', icon: <RocketLaunchOutlinedIcon /> },
  { key: 'trust', icon: <VerifiedUserOutlinedIcon /> },
];

/**
 * The welcome page: what the portal is and how taking part works. It does not list the services; the button
 * leads to All services.
 */
export default function Home() {
  const { t } = useTranslation(HOME_NS);
  const iconColor = useTheme().palette.mode === 'dark' ? tractusx.orange : tractusx.orangeDarkest;

  const allServicesButton = (
    <Button component={RouterLink} to={ALL_SERVICES_PATH} color="primary" startIcon={<AppsOutlinedIcon />} endIcon={<ArrowForwardIcon />}>
      {t('hero.allServices')}
    </Button>
  );

  return (
    <article aria-labelledby="home-title">
      <BrandBackdrop>
        <Container maxWidth="lg" sx={{ pt: { xs: 14, md: 12 }, pb: { xs: 8, md: 12 } }}>
          <Stack spacing={3} sx={{ maxWidth: 760 }}>
            <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {t('hero.overline')}
            </Typography>
            <Typography id="home-title" variant="h1" component="h1" sx={{ fontSize: 'clamp(2.25rem, 3vw + 1rem, 4rem)' }}>
              {t('hero.welcome')}{' '}
              <Typography component="span" variant="inherit" sx={{ color: tractusx.orange, display: 'block' }}>
                {t('hero.product')}
              </Typography>
            </Typography>
            <Typography sx={{ fontSize: { xs: 18, md: 20 }, lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.85)' }}>
              {t('hero.lead')}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
              {allServicesButton}
              <Button
                color="secondary"
                href={ARCHITECTURE_URL}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNewIcon />}
              >
                {t('hero.architecture')}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </BrandBackdrop>

      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <SpaceGlow />
        <Container
          component="section"
          maxWidth="lg"
          aria-labelledby="how-title"
          sx={{ position: 'relative', zIndex: 1, py: { xs: 8, md: 12 } }}
        >
          <Typography variant="overline" color="text.secondary">
            {t('how.overline')}
          </Typography>
          <Typography id="how-title" variant="h2" component="h2" sx={{ mt: 1, mb: 2, maxWidth: 760 }}>
            {t('how.title')}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 6, maxWidth: 680 }}>
            {t('how.intro')}
          </Typography>
          <Grid container spacing={{ xs: 4, md: 6 }} component="ol" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {HOW_IT_WORKS.map((point) => (
              <Grid key={point.key} size={{ xs: 12, md: 4 }} component="li">
                <Stack spacing={2}>
                  <Box
                    aria-hidden
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '10px',
                      display: 'grid',
                      placeItems: 'center',
                      color: iconColor,
                      bgcolor: alpha(tractusx.orange, 0.15),
                      boxShadow: `0 0 24px ${alpha(tractusx.orange, 0.18)}`,
                    }}
                  >
                    {point.icon}
                  </Box>
                  <Typography component="h3" sx={{ fontWeight: 700, fontSize: 20 }}>
                    {t(`how.${point.key}.title`)}
                  </Typography>
                  <Typography color="text.secondary">{t(`how.${point.key}.text`)}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 8 }}>{allServicesButton}</Box>
        </Container>
      </Box>
      <Footer />
    </article>
  );
}
