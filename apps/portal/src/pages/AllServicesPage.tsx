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

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowForwardIcon,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  ChevronLeftIcon,
  ChevronRightIcon,
  Container,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  alpha,
  tractusx,
  useTheme,
} from '@dataspace-mgm/ui-mui';
import { useNavigate } from 'react-router-dom';
import { useFavourites } from '../contexts/FavouritesContext';
import { features } from '../features/main';
import type { FeatureCategory, NavigationItem } from '../types/routing';

/** The desktop "All services" view lives in the canvas at this path; phones open it full screen instead. */
export const ALL_SERVICES_PATH = '/all-services';

const CATEGORIES: { id: FeatureCategory; label: string }[] = [
  { id: 'start', label: 'Start' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'participants', label: 'Participants' },
  { id: 'as-a-service', label: 'As a service' },
  { id: 'network', label: 'Network' },
];
const categoryLabel = (id: FeatureCategory) => CATEGORIES.find((category) => category.id === id)?.label ?? id;

const CARD_WIDTH = 300;
const GAP = 24;

function AppCard({ app, favourite, onOpen }: { app: NavigationItem; favourite: boolean; onOpen: () => void }) {
  const theme = useTheme();
  const iconColor = theme.palette.mode === 'dark' ? tractusx.orange : tractusx.orangeDarkest;
  return (
    <Card
      component="li"
      aria-labelledby={`app-${app.path}`}
      sx={{
        flex: `0 0 ${CARD_WIDTH}px`,
        scrollSnapAlign: 'start',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 320,
        listStyle: 'none',
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, pt: 3.5 }}>
        <Box
          aria-hidden
          sx={{
            width: 64,
            height: 64,
            borderRadius: '10px',
            display: 'grid',
            placeItems: 'center',
            color: iconColor,
            bgcolor: alpha(tractusx.orange, 0.15),
            '& svg': { fontSize: 32 },
          }}
        >
          {app.icon}
        </Box>
        <Stack spacing={0.5}>
          <Typography variant="overline" color="text.secondary">
            {categoryLabel(app.category)}
          </Typography>
          <Typography id={`app-${app.path}`} component="h3" sx={{ fontWeight: 800, fontSize: 22, lineHeight: 1.2 }}>
            {app.name}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
          {app.description}
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <Chip size="small" variant="outlined" label={app.disabled ? 'Coming soon' : 'Available'} />
          {favourite && <Chip size="small" variant="outlined" label="In your sidebar" />}
        </Stack>
      </CardContent>
      <CardActions>
        <Button
          fullWidth
          color={app.disabled ? 'secondary' : 'primary'}
          disabled={app.disabled}
          onClick={onOpen}
          endIcon={app.disabled ? undefined : <ArrowForwardIcon />}
          aria-label={app.disabled ? `${app.name}, coming soon` : `Open ${app.name}`}
        >
          {app.disabled ? 'Coming soon' : 'Open'}
        </Button>
      </CardActions>
    </Card>
  );
}

/**
 * All services on desktop, inside the canvas: the services as a carousel of cards that scrolls sideways, filtered by
 * the part of the dataspace they serve. Favourites are kept with the "+" in the sidebar.
 */
export default function AllServicesPage() {
  const navigate = useNavigate();
  const { isFavourite } = useFavourites();
  const [filter, setFilter] = useState<FeatureCategory | 'all'>('all');
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const shown = features.filter((app) => filter === 'all' || app.category === filter);
  const countOf = (id: FeatureCategory) => features.filter((app) => app.category === id).length;

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 1, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 });
  }, []);

  useEffect(() => {
    track.current?.scrollTo?.({ left: 0 });
    measure();
  }, [filter, measure]);

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined' || !track.current) return;
    const observer = new ResizeObserver(measure);
    observer.observe(track.current);
    return () => observer.disconnect();
  }, [measure]);

  const page = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const step = Math.max(CARD_WIDTH + GAP, Math.floor(el.clientWidth / (CARD_WIDTH + GAP)) * (CARD_WIDTH + GAP));
    el.scrollBy?.({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" component="section" aria-labelledby="all-services-title" sx={{ py: { xs: 6, md: 8 } }}>
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

      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mb: 3 }} role="group" aria-label="Filter services">
        <Chip
          label={`All · ${features.length}`}
          onClick={() => setFilter('all')}
          color={filter === 'all' ? 'primary' : 'default'}
          variant={filter === 'all' ? 'filled' : 'outlined'}
          aria-pressed={filter === 'all'}
        />
        {CATEGORIES.filter((category) => countOf(category.id) > 0).map((category) => (
          <Chip
            key={category.id}
            label={`${category.label} · ${countOf(category.id)}`}
            onClick={() => setFilter(category.id)}
            color={filter === category.id ? 'primary' : 'default'}
            variant={filter === category.id ? 'filled' : 'outlined'}
            aria-pressed={filter === category.id}
          />
        ))}
      </Stack>

      <Box component="section" aria-roledescription="carousel" aria-label="Services" sx={{ position: 'relative' }}>
        <Stack direction="row" sx={{ alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }} aria-live="polite">
            {shown.length} {shown.length === 1 ? 'service' : 'services'}
          </Typography>
          <Tooltip title="Previous">
            <span>
              <IconButton onClick={() => page(-1)} disabled={edges.start} aria-label="Previous services">
                <ChevronLeftIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Next">
            <span>
              <IconButton onClick={() => page(1)} disabled={edges.end} aria-label="Next services">
                <ChevronRightIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
        <Box
          component="ul"
          ref={track}
          onScroll={measure}
          sx={{
            display: 'flex',
            gap: `${GAP}px`,
            m: 0,
            p: 0,
            pb: 2,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            '@media (prefers-reduced-motion: reduce)': { scrollBehavior: 'auto' },
          }}
        >
          {shown.map((app) => (
            <AppCard key={app.path} app={app} favourite={isFavourite(app.path)} onOpen={() => navigate(app.path)} />
          ))}
        </Box>
      </Box>
    </Container>
  );
}
