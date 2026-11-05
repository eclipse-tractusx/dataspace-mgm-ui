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

import { useId, useState } from 'react';
import {
  ArrowForwardIcon,
  Box,
  Button,
  ButtonBase,
  Collapse,
  IconButton,
  InfoOutlinedIcon,
  Stack,
  StarIcon,
  Tooltip,
  Typography,
  alpha,
  tractusx,
  useTheme,
} from '@dataspace-mgm/ui-mui';
import type { NavigationItem } from '../../types/routing';

export const SERVICE_CARD_WIDTH = 240;

/** Display names of the areas, for the line under a service's name. */
export const AREA_LABELS: Record<NavigationItem['category'], string> = {
  start: 'Start',
  onboarding: 'Onboarding',
  participants: 'Participants',
  'as-a-service': 'As a service',
  network: 'Network',
};

interface ServiceCardProps {
  service: NavigationItem;
  favourite: boolean;
  onOpen: () => void;
}

/**
 * A service as on the dataspace cards of eclipse-tractusx.github.io: a glowing square with the icon, and
 * below it the name, the area and status, and the action. The info button opens the description below the
 * card, in place.
 */
export default function ServiceCard({ service, favourite, onOpen }: ServiceCardProps) {
  const { palette } = useTheme();
  const dark = palette.mode === 'dark';
  const [showInfo, setShowInfo] = useState(false);
  const infoId = useId();
  const iconColor = dark ? tractusx.orange : tractusx.orangeDarkest;
  const glow = dark ? '0 0 14px rgba(255, 255, 255, 0.28)' : '0 0 14px rgba(0, 0, 0, 0.12)';
  const glowStrong = dark ? '0 0 22px rgba(255, 255, 255, 0.5)' : '0 0 22px rgba(0, 0, 0, 0.2)';

  return (
    <Box
      component="li"
      sx={{ flex: `0 0 ${SERVICE_CARD_WIDTH}px`, listStyle: 'none', scrollSnapAlign: 'start', display: 'grid', gap: 1.5, alignContent: 'start', position: 'relative' }}
    >
      {/* The square opens the service with the mouse too; for the keyboard and screen readers the button below does. */}
      <ButtonBase
        onClick={onOpen}
        disabled={service.disabled}
        tabIndex={-1}
        aria-hidden
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: palette.ui.cardBorder,
          // The light falls in from the top left, as on the website's cards.
          background: dark
            ? `radial-gradient(120% 120% at 0% 0%, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0) 55%), ${tractusx.gray}`
            : `radial-gradient(120% 120% at 0% 0%, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0) 55%), ${tractusx.white}`,
          boxShadow: glow,
          transition: 'box-shadow 0.35s ease, transform 0.35s ease, border-color 0.35s ease',
          '&:hover': { boxShadow: glowStrong, transform: 'translateY(-4px)', borderColor: alpha(tractusx.orange, 0.6) },
          '&:hover .service-orb': { opacity: 1, transform: 'scale(1.08)' },
          '&.Mui-focusVisible': { outline: `2px solid ${tractusx.orange}`, outlineOffset: 3 },
          '&.Mui-disabled': { pointerEvents: 'auto', cursor: 'default' },
          '&.Mui-disabled .service-icon': { opacity: 0.55 },
          '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
        }}
      >
        {/* A soft orange light behind the icon that brightens on hover. */}
        <Box
          aria-hidden
          className="service-orb"
          sx={{
            position: 'absolute',
            width: '70%',
            height: '70%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(tractusx.orange, dark ? 0.22 : 0.16)} 0%, transparent 65%)`,
            opacity: 0.7,
            transition: 'opacity 0.35s ease, transform 0.35s ease',
          }}
        />
        {favourite && (
          <Tooltip title="In your sidebar">
            <Box
              component="span"
              aria-hidden
              sx={{ position: 'absolute', top: 10, left: 10, color: tractusx.orange, display: 'inline-flex' }}
            >
              <StarIcon fontSize="small" />
            </Box>
          </Tooltip>
        )}
        <Box
          aria-hidden
          className="service-icon"
          sx={{ position: 'relative', color: iconColor, display: 'grid', placeItems: 'center', '& svg': { fontSize: 72 } }}
        >
          {service.icon}
        </Box>
      </ButtonBase>

      <Stack direction="row" sx={{ alignItems: 'flex-start', gap: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Room for two lines, so the buttons of a row line up whatever the length of the names. */}
          <Typography component="h3" sx={{ fontWeight: 500, fontSize: 18, lineHeight: 1.3, minHeight: '2.6em' }}>
            {service.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {AREA_LABELS[service.category]} · {service.disabled ? 'Coming soon' : 'Available'}
          </Typography>
        </Box>
        <Tooltip title={showInfo ? 'Hide details' : 'Details'}>
          <IconButton
            size="small"
            onClick={() => setShowInfo((open) => !open)}
            aria-label={`About ${service.name}`}
            aria-expanded={showInfo}
            aria-controls={infoId}
            sx={{ color: showInfo ? tractusx.orange : 'text.secondary', '&:hover': { color: tractusx.orange } }}
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {favourite && (
        <Box component="span" id={`${infoId}-fav`} sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
          In your sidebar
        </Box>
      )}
      <Collapse in={showInfo} id={infoId}>
        <Typography variant="body2" color="text.secondary" sx={{ pb: 0.5 }}>
          {service.description}
        </Typography>
      </Collapse>

      <Button
        variant="outlined"
        fullWidth
        disabled={service.disabled}
        onClick={onOpen}
        endIcon={service.disabled ? undefined : <ArrowForwardIcon />}
        aria-label={service.disabled ? `${service.name}, coming soon` : `Open ${service.name}`}
        aria-describedby={favourite ? `${infoId}-fav` : undefined}
        sx={{ py: 1 }}
      >
        {service.disabled ? 'Coming soon' : 'Open'}
      </Button>
    </Box>
  );
}
