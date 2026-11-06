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

import { useId, useState, type MouseEvent, type ReactNode } from 'react';
import {
  Box,
  ButtonBase,
  DarkModeOutlinedIcon,
  GitHubIcon,
  LightModeOutlinedIcon,
  TranslateOutlinedIcon,
  Stack,
  Typography,
  alpha,
  tractusx,
  useColorMode,
  useTheme,
} from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LANGUAGE_NAMES, currentLanguage } from '../../i18n';
import type { NavigationItem } from '../../types/routing';
import { LanguageOptions } from '../general/LanguageMenu';

const SOURCE_URL = 'https://github.com/eclipse-tractusx/dataspace-mgm-ui';

interface TileProps {
  label: string;
  icon: ReactNode;
  note?: string;
  /** The name for screen readers when it is more than the label and the note. */
  ariaLabel?: string;
  /** For a tile that opens a menu. */
  menu?: string;
  active?: boolean;
  disabled?: boolean;
  onSelect: (event: MouseEvent<HTMLElement>) => void;
}

/** One tile of the launcher: a service, or a setting on phones. Tiles in a row share their height. */
function Tile({ label, icon, note, ariaLabel, menu, active = false, disabled = false, onSelect }: TileProps) {
  const theme = useTheme();
  const iconColor = theme.palette.mode === 'dark' ? tractusx.orange : tractusx.orangeDarkest;
  return (
    <ButtonBase
      onClick={onSelect}
      disabled={disabled}
      aria-current={active ? 'page' : undefined}
      aria-label={ariaLabel ?? (note ? `${label}, ${note}` : label)}
      aria-haspopup={menu ? 'menu' : undefined}
      aria-controls={menu}
      sx={{
        width: '100%',
        minHeight: 120,
        // Icon and name sit in the middle of the tile; a "Coming soon" note simply adds a line.
        justifyContent: 'center',
        borderRadius: '10px',
        border: '1px solid',
        borderColor: active ? tractusx.orange : theme.palette.ui.cardBorder,
        bgcolor: theme.palette.ui.surface,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 1.5,
        textAlign: 'center',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        '&:hover': { boxShadow: theme.palette.ui.glow },
        '&.Mui-focusVisible': { outline: `2px solid ${tractusx.orange}`, outlineOffset: 2 },
        '&.Mui-disabled': { opacity: 0.55 },
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 44,
          height: 44,
          borderRadius: '10px',
          display: 'grid',
          placeItems: 'center',
          color: iconColor,
          bgcolor: alpha(tractusx.orange, 0.15),
        }}
      >
        {icon}
      </Box>
      <Typography component="span" sx={{ fontWeight: 700, fontSize: 14, lineHeight: 1.25, maxWidth: '100%', hyphens: 'auto', overflowWrap: 'break-word' }}>
        {label}
      </Typography>
      {note && (
        <Typography component="span" variant="caption" color="text.secondary">
          {note}
        </Typography>
      )}
    </ButtonBase>
  );
}

function TileGrid({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: { xs: 'repeat(3, minmax(0, 1fr))', sm: 'repeat(4, minmax(0, 1fr))', md: 'repeat(5, minmax(0, 1fr))' },
      }}
    >
      {children}
    </Box>
  );
}

/**
 * All services on phones and tablets, inside the canvas between the header and the bottom bar: every service as
 * a tile, then the settings (language, theme, source code). Opening a service goes to its page.
 */
export default function ServiceTiles({ services }: { services: NavigationItem[] }) {
  const { t } = useTranslation();
  const [languageAnchor, setLanguageAnchor] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();
  const { mode, toggle } = useColorMode();
  const servicesHeading = useId();
  const settingsHeading = useId();

  return (
    <Stack spacing={4}>
      <Box component="section" aria-labelledby={servicesHeading} sx={{ display: 'grid', gap: 2 }}>
        <Typography id={servicesHeading} component="h2" variant="overline" color="text.secondary">
          {t('services.heading')}
        </Typography>
        <TileGrid>
          {services.map((service) => (
            <Tile
              key={service.path}
              label={service.name}
              icon={service.icon}
              note={service.disabled ? t('navigation.comingSoon') : undefined}
              ariaLabel={service.disabled ? t('navigation.itemComingSoonLabel', { name: service.name }) : undefined}
              disabled={service.disabled}
              onSelect={() => navigate(service.path)}
            />
          ))}
        </TileGrid>
      </Box>
      <Box component="section" aria-labelledby={settingsHeading} sx={{ display: 'grid', gap: 2 }}>
        <Typography id={settingsHeading} component="h2" variant="overline" color="text.secondary">
          {t('services.settings')}
        </Typography>
        <TileGrid>
          <Tile
            label={t('language.label')}
            note={LANGUAGE_NAMES[currentLanguage()]}
            icon={<TranslateOutlinedIcon />}
            menu={languageAnchor ? 'language-menu-tiles' : undefined}
            onSelect={(event) => setLanguageAnchor(event.currentTarget)}
          />
          <Tile
            label={mode === 'light' ? t('services.darkMode') : t('services.lightMode')}
            icon={mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
            onSelect={toggle}
          />
          <Tile
            label={t('services.sourceCode')}
            icon={<GitHubIcon />}
            onSelect={() => globalThis.open?.(SOURCE_URL, '_blank', 'noopener,noreferrer')}
          />
        </TileGrid>
        <LanguageOptions
          id="language-menu-tiles"
          anchor={languageAnchor}
          onClose={() => setLanguageAnchor(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </Stack>
  );
}
