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

import { useState, type ReactNode } from 'react';
import {
  Avatar,
  Box,
  GridViewOutlinedIcon,
  Stack,
  TableRowsOutlinedIcon,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  alpha,
  tractusx,
  useMediaQuery,
  useTheme,
  type DataTableLocale,
} from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PEOPLE_NS } from './i18n';

/** How a list of Access control is shown. */
export type ViewMode = 'table' | 'cards';
/** The lists that remember their view mode, each on its own. */
export type ViewList = 'users' | 'technical' | 'invitations';

const VIEW_KEY = 'portal.accessControl.view';

function readMode(list: ViewList): ViewMode | null {
  try {
    const value = window.localStorage.getItem(`${VIEW_KEY}.${list}`);
    return value === 'table' || value === 'cards' ? value : null;
  } catch {
    return null;
  }
}

function writeMode(list: ViewList, mode: ViewMode): void {
  try {
    window.localStorage.setItem(`${VIEW_KEY}.${list}`, mode);
  } catch {
    // Without storage the choice lasts until the page is left.
  }
}

/** The view mode of a list: the viewer's last choice (this browser), else a table on desktop and cards on a phone. */
export function useViewMode(list: ViewList): readonly [ViewMode, (mode: ViewMode) => void] {
  const phone = useMediaQuery(useTheme().breakpoints.down('sm'));
  const [chosen, setChosen] = useState<ViewMode | null>(() => readMode(list));
  const choose = (mode: ViewMode) => {
    setChosen(mode);
    writeMode(list, mode);
  };
  return [chosen ?? (phone ? 'cards' : 'table'), choose] as const;
}

/** The language of the portal for the grid's own texts. */
export function useTableLocale(): DataTableLocale {
  const { i18n } = useTranslation();
  return (i18n.resolvedLanguage ?? i18n.language ?? 'en').startsWith('de') ? 'de' : 'en';
}

/** Table | Cards switch of a list. */
export function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (mode: ViewMode) => void }) {
  const { t } = useTranslation(PEOPLE_NS);
  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={mode}
      onChange={(_, next: ViewMode | null) => next && onChange(next)}
      aria-label={t('view.label')}
      sx={{ '& .MuiToggleButton-root': { borderRadius: '8px', px: 1.25, color: 'text.secondary' }, '& .Mui-selected': { color: `${tractusx.orange} !important`, bgcolor: `${alpha(tractusx.orange, 0.12)} !important` } }}
    >
      <ToggleButton value="table" aria-label={t('view.table')}>
        <Tooltip title={t('view.table')}>
          <TableRowsOutlinedIcon fontSize="small" />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="cards" aria-label={t('view.cards')}>
        <Tooltip title={t('view.cards')}>
          <GridViewOutlinedIcon fontSize="small" />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

/** The row above a list: its filters on the left, the number of results and the view switch on the right. */
export function ListToolbar({ filters, count, mode, onMode }: { filters?: ReactNode; count: string; mode: ViewMode; onMode: (mode: ViewMode) => void }) {
  return (
    <Stack direction="row" useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
      <Stack direction="row" useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1, flex: 1, minWidth: 0 }}>
        {filters}
      </Stack>
      <Typography variant="body2" color="text.secondary" role="status" sx={{ whiteSpace: 'nowrap' }}>
        {count}
      </Typography>
      <ViewToggle mode={mode} onChange={onMode} />
    </Stack>
  );
}

/** The colour of a status: green when it works, orange while something is pending, red when it failed or ended. */
export type Tone = 'success' | 'warning' | 'error' | 'default';

const TONES: Readonly<Record<string, Tone>> = {
  ACTIVE: 'success',
  OPEN: 'success',
  PENDING: 'warning',
  PENDING_DELETION: 'warning',
  REQUESTED: 'warning',
  REMOVING: 'warning',
  DISABLED: 'warning',
  FAILED: 'error',
  REMOVED: 'error',
  DELETED: 'error',
  REVOKED: 'error',
  EXPIRED: 'default',
  INACTIVE: 'default',
  NONE: 'default',
};

export const toneOf = (status: string): Tone => TONES[status] ?? 'default';

/** A status as a dot in its colour and the label on a tint of it (like the status of a wallet pass). */
export function DotChip({ tone, label }: { tone: Tone; label: string }) {
  const theme = useTheme();
  const dot = tone === 'default' ? theme.palette.text.disabled : theme.palette[tone].main;
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        height: 24,
        px: '10px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: 700,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        color: 'text.primary',
        bgcolor: alpha(dot, 0.16),
        '&::before': { content: '""', width: 8, height: 8, borderRadius: '50%', bgcolor: dot, flexShrink: 0 },
      }}
    >
      {label}
    </Box>
  );
}

/** A small neutral tag, e.g. a role or a visibility. */
export function Tag({ children, mono }: { children: ReactNode; mono?: boolean }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 24,
        px: '8px',
        borderRadius: '6px',
        border: '1px solid',
        borderColor: 'divider',
        fontSize: '0.75rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        color: 'text.secondary',
        ...(mono && { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontWeight: 500 }),
      }}
    >
      {children}
    </Box>
  );
}

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';

/** The initials of a person, or an icon for a program, on an orange tint. */
export function PersonAvatar({ name, icon, size = 36 }: { name: string; icon?: ReactNode; size?: number }) {
  return (
    <Avatar
      aria-hidden="true"
      sx={{ width: size, height: size, fontSize: size * 0.4, fontWeight: 700, color: tractusx.orange, bgcolor: alpha(tractusx.orange, 0.14), '& svg': { fontSize: size * 0.55 } }}
    >
      {icon ?? initialsOf(name)}
    </Avatar>
  );
}

/** Avatar, name and a muted second line, the first cell of a row and the head of a card. */
export function Identity({ name, secondary, icon, size, wrap }: { name: string; secondary?: ReactNode; icon?: ReactNode; size?: number; wrap?: boolean }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
      <PersonAvatar name={name} icon={icon} size={size} />
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</Typography>
        {secondary && (
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.3, ...(wrap ? { mt: 0.25 } : { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }) }}>
            {secondary}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

/** The responsive grid of the cards view. */
export const cardGridSx = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
  gap: 2,
} as const;
