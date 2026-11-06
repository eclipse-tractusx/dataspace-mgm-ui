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

import type { ReactNode } from 'react';
import { CREDENTIAL_TYPES, type CredentialStatusCount, type CredentialType } from '@dataspace-mgm/c4-m1-core';
import { Box, ButtonBase, FormControl, MenuItem, ScheduleOutlinedIcon, Select, alpha, tractusx } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import type { AllCredentialsLoaded } from '../hooks/useAllCredentials';
import { WALLETS_NS } from '../i18n';
import { CountBadge } from './CountBadge';

/** A filter chip that is on or off (aria-pressed). */
function FilterChip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <ButtonBase
      aria-pressed={pressed}
      onClick={onClick}
      sx={{
        height: 32,
        px: 1.5,
        gap: 0.75,
        borderRadius: '16px',
        fontSize: '0.8125rem',
        fontWeight: 600,
        color: 'text.primary',
        border: 1,
        borderColor: pressed ? tractusx.orange : 'ui.cardBorder',
        bgcolor: pressed ? alpha(tractusx.orange, 0.15) : 'transparent',
        '&.Mui-focusVisible': { outline: `2px solid ${tractusx.orange}`, outlineOffset: 2 },
      }}
    >
      {children}
    </ButtonBase>
  );
}

interface CredentialFiltersProps {
  state: AllCredentialsLoaded;
  counts: ReadonlyArray<CredentialStatusCount>;
  openOrderHours: number;
}

/** The filters above the list: a chip per status with its count, open orders, and the credential type. */
export function CredentialFilters({ state, counts, openOrderHours }: CredentialFiltersProps) {
  const { t } = useTranslation(WALLETS_NS);
  const { filters } = state;
  return (
    <Box role="group" aria-label={t('filters.label')} sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap', mb: 2.5 }}>
      {counts
        .filter((count) => count.total > 0)
        .map((count) => (
          <FilterChip key={count.status} pressed={filters.status.includes(count.status)} onClick={() => state.toggleStatus(count.status)}>
            {t(`credentialStatus.${count.status}`)}
            <CountBadge count={count.total} />
          </FilterChip>
        ))}
      <FilterChip pressed={filters.openOnly} onClick={state.toggleOpenOnly}>
        <ScheduleOutlinedIcon sx={{ fontSize: 18 }} />
        {t('filters.openOnly', { hours: openOrderHours })}
      </FilterChip>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <Select
          value={filters.credentialType ?? ''}
          displayEmpty
          inputProps={{ 'aria-label': t('filters.credentialType') }}
          onChange={(event) => state.setCredentialType((event.target.value as CredentialType | '') || null)}
        >
          <MenuItem value="">{t('filters.allCredentialTypes')}</MenuItem>
          {CREDENTIAL_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {t(`credentialType.${type}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
