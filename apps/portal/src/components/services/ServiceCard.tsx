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
  Box,
  Button,
  ButtonBase,
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
 * A service as on the dataspace cards of eclipse-tractusx.github.io: a glowing square with the icon (a star at
 * the top left when it is a favourite, the info button at the top right), and below it the name, the area and
 * status, and the action. The description and version show in a tooltip on the info button, never on the card.
 */
export default function ServiceCard({ service, favourite, onOpen }: ServiceCardProps) {
  const { palette } = useTheme();
  const dark = palette.mode === 'dark';
  const iconColor = dark ? tractusx.orange : tractusx.orangeDarkest;
  const glow = dark ? '0 0 14px rgba(255, 255, 255, 0.28)' : '0 0 14px rgba(0, 0, 0, 0.12)';
  const glowStrong = dark ? '0 0 22px rgba(255, 255, 255, 0.5)' : '0 0 22px rgba(0, 0, 0, 0.2)';
  const status = service.disabled ? 'Coming soon' : 'Available';

  return (
    <Box
      component="li"
      sx={{ flex: `0 0 ${SERVICE_CARD_WIDTH}px`, listStyle: 'none', scrollSnapAlign: 'start', display: 'grid', gap: 1.5 }}
    >
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '1 / 1',
          borderRadius: '10px',
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
          '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
        }}
      >
        {/* The square opens the service with the mouse too; for the keyboard and screen readers the button below does. */}
        <ButtonBase
          onClick={onOpen}
          disabled={service.disabled}
          tabIndex={-1}
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: '10px',
            overflow: 'hidden',
            '&.Mui-disabled': { pointerEvents: 'auto', cursor: 'default' },
            '&.Mui-disabled .service-icon': { opacity: 0.55 },
          }}
        >
          {/* A soft orange light behind the icon that brightens on hover. */}
          <Box
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
          <Box
            className="service-icon"
            sx={{ position: 'relative', color: iconColor, display: 'grid', placeItems: 'center', '& svg': { fontSize: 72 } }}
          >
            {service.icon}
          </Box>
        </ButtonBase>

        {favourite && (
          <Tooltip title="In your sidebar">
            <Box component="span" sx={{ position: 'absolute', top: 10, left: 10, color: tractusx.orange, display: 'inline-flex' }}>
              <StarIcon fontSize="small" aria-label="In your sidebar" />
            </Box>
          </Tooltip>
        )}

        {/* The description lives in a tooltip on the info button, not on the card (hover, focus or tap). */}
        <Tooltip
          placement="top-end"
          arrow
          enterTouchDelay={0}
          leaveTouchDelay={4000}
          slotProps={{
            tooltip: {
              sx: {
                maxWidth: SERVICE_CARD_WIDTH,
                p: 1.5,
                borderRadius: '8px',
                bgcolor: dark ? tractusx.grayButton : tractusx.gray,
                color: tractusx.white,
                border: '1px solid',
                borderColor: dark ? palette.ui.cardBorder : 'transparent',
                boxShadow: glowStrong,
              },
            },
            arrow: { sx: { color: dark ? tractusx.grayButton : tractusx.gray } },
          }}
          title={
            <Stack spacing={0.75}>
              <Stack direction="row" sx={{ alignItems: 'baseline', gap: 1 }}>
                <Typography component="span" sx={{ flex: 1, fontWeight: 700, fontSize: 14 }}>
                  {service.name}
                </Typography>
                <Typography component="span" sx={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.7)' }}>
                  v{service.version}
                </Typography>
              </Stack>
              <Typography component="span" sx={{ fontSize: 13, lineHeight: 1.5 }}>
                {service.description}
              </Typography>
            </Stack>
          }
        >
          <IconButton
            size="small"
            aria-label={`About ${service.name}`}
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,
              color: 'text.secondary',
              '&:hover': { color: tractusx.orange, bgcolor: alpha(tractusx.orange, 0.1) },
            }}
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box>
        {/* Room for two lines, so the buttons of a row line up whatever the length of the names. */}
        <Typography component="h3" sx={{ fontWeight: 500, fontSize: 18, lineHeight: 1.3, minHeight: '2.6em' }}>
          {service.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {AREA_LABELS[service.category]} · {status}
        </Typography>
      </Box>

      <Button
        variant="outlined"
        fullWidth
        disabled={service.disabled}
        onClick={onOpen}
        endIcon={service.disabled ? undefined : <ArrowForwardIcon />}
        aria-label={service.disabled ? `${service.name}, coming soon` : `Open ${service.name}`}
        sx={{ py: 1 }}
      >
        {service.disabled ? 'Coming soon' : 'Open'}
      </Button>
    </Box>
  );
}
