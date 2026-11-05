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
import { ArrowBackIcon, ArrowForwardIcon, Box, IconButton, Stack, Typography, useTheme } from '@dataspace-mgm/ui-mui';
import { useNavigate } from 'react-router-dom';
import { useFavourites } from '../../contexts/FavouritesContext';
import type { NavigationItem } from '../../types/routing';
import ServiceCard, { SERVICE_CARD_WIDTH } from './ServiceCard';

const GAP = 32;

/**
 * Services as a row of cards that scrolls sideways and snaps from card to card, with round previous and next
 * buttons that turn off at the ends. Used on the home page and in All services.
 */
export default function ServiceCarousel({ services, label = 'Services' }: { services: NavigationItem[]; label?: string }) {
  const navigate = useNavigate();
  const { isFavourite } = useFavourites();
  const { palette } = useTheme();
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 1, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 });
  }, []);

  useEffect(() => {
    track.current?.scrollTo?.({ left: 0 });
    measure();
  }, [services, measure]);

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined' || !track.current) return;
    const observer = new ResizeObserver(measure);
    observer.observe(track.current);
    return () => observer.disconnect();
  }, [measure]);

  const page = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = SERVICE_CARD_WIDTH + GAP;
    el.scrollBy?.({ left: direction * Math.max(card, Math.floor(el.clientWidth / card) * card), behavior: 'smooth' });
  };

  const arrow = {
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: '1px solid',
    borderColor: palette.ui.cardBorder,
    color: 'text.primary',
    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
    '&:hover': { boxShadow: palette.ui.glow, borderColor: 'text.primary', bgcolor: 'transparent' },
    '&.Mui-disabled': { opacity: 0.35 },
  } as const;

  return (
    <Box component="section" aria-roledescription="carousel" aria-label={label}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }} aria-live="polite">
          {services.length} {services.length === 1 ? 'service' : 'services'}
        </Typography>
        <IconButton onClick={() => page(-1)} disabled={edges.start} aria-label="Previous services" sx={arrow}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={() => page(1)} disabled={edges.end} aria-label="Next services" sx={arrow}>
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Box
        component="ul"
        ref={track}
        onScroll={measure}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: `${GAP}px`,
          m: 0,
          // Room for the glow and the lift on hover, which the scroll box would otherwise cut off.
          px: '16px',
          mx: '-16px',
          pt: 2,
          pb: 3,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollPaddingInline: '16px',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          '@media (prefers-reduced-motion: reduce)': { scrollBehavior: 'auto' },
        }}
      >
        {services.map((service) => (
          <ServiceCard
            key={service.path}
            service={service}
            favourite={isFavourite(service.path)}
            onOpen={() => navigate(service.path)}
          />
        ))}
      </Box>
    </Box>
  );
}
