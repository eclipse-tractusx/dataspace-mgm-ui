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

import { useState } from 'react';
import { Box, Chip, Container, SpaceGlow, Stack, Typography } from '@dataspace-mgm/ui-mui';
import ServiceCarousel from '../components/services/ServiceCarousel';
import { AREA_LABELS } from '../components/services/ServiceCard';
import { features } from '../features/main';
import type { FeatureCategory } from '../types/routing';

/** The desktop "All services" view lives in the canvas at this path; phones open it full screen instead. */
export const ALL_SERVICES_PATH = '/all-services';

const AREAS = Object.keys(AREA_LABELS) as FeatureCategory[];

/**
 * All services on desktop, inside the canvas: every service as a card in a carousel that scrolls sideways,
 * filtered by area. Favourites are kept with the "+" in the sidebar.
 */
export default function AllServicesPage() {
  const [filter, setFilter] = useState<FeatureCategory | 'all'>('all');
  const shown = features.filter((service) => filter === 'all' || service.category === filter);
  const countOf = (area: FeatureCategory) => features.filter((service) => service.category === area).length;

  const chip = (id: FeatureCategory | 'all', label: string) => (
    <Chip
      key={id}
      label={label}
      onClick={() => setFilter(id)}
      color={filter === id ? 'primary' : 'default'}
      variant={filter === id ? 'filled' : 'outlined'}
      aria-pressed={filter === id}
    />
  );

  return (
    <Box sx={{ position: 'relative', minHeight: '100%', overflow: 'hidden' }}>
      <SpaceGlow />
      <Container
        maxWidth="lg"
        component="section"
        aria-labelledby="all-services-title"
        sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 8 } }}
      >
        <Typography variant="overline" color="text.secondary">
          Eclipse Tractus-X Dataspace Management
        </Typography>
        <Typography id="all-services-title" variant="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
          All services
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 680 }}>
          Every service of your onboarding service provider in one place. Keep the ones you use most in your sidebar
          with the + under your favourites.
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mb: 4 }} role="group" aria-label="Filter services">
          {chip('all', `All · ${features.length}`)}
          {AREAS.filter((area) => countOf(area) > 0).map((area) => chip(area, `${AREA_LABELS[area]} · ${countOf(area)}`))}
        </Stack>
        <ServiceCarousel services={shown} />
      </Container>
    </Box>
  );
}
