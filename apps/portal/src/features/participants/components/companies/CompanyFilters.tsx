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

import { useEffect, useState } from 'react';
import { COMPANY_STATUSES, type CompanyListQueryData, type CompanyStatus, type CoreDataSource } from '@dataspace-mgm/c3-m1-core';
import { Button, CheckIcon, Chip, InputAdornment, MenuItem, SearchIcon, Stack, TextField } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../../i18n';

export type CompanyFilter = Omit<CompanyListQueryData, 'page' | 'size'>;

const BPN = /^BPNL[0-9A-Z]{12}$/;
/** Company roles of the test data catalogue that the filter offers (the API has no list of them for the UI yet). */
const ROLE_OPTIONS = ['ACTIVE_PARTICIPANT', 'APP_PROVIDER', 'SERVICE_PROVIDER', 'ONBOARDING_SERVICE_PROVIDER'];

/** The search text is a BPN when it looks like one, otherwise a part of the name (query parameters `bpn` / `name`). */
export function searchFilter(text: string): Pick<CompanyFilter, 'bpn' | 'name'> {
  const value = text.trim();
  if (!value) {
    return {};
  }
  return BPN.test(value.toUpperCase()) ? { bpn: value.toUpperCase() } : { name: value };
}

/** Filters of the company list (configurator choice filters=chips): search, status chips, role, source, BPN. */
export function CompanyFilters({ filter, onChange }: { filter: CompanyFilter; onChange: (filter: CompanyFilter) => void }) {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const [text, setText] = useState(filter.name ?? filter.bpn ?? '');
  const statuses = filter.status ?? [];
  const active = Boolean(text || statuses.length || filter.companyRole || filter.coreDataSource || filter.hasBpn !== undefined);

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = searchFilter(text);
      if (next.name !== filter.name || next.bpn !== filter.bpn) {
        onChange({ ...filter, name: next.name, bpn: next.bpn });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [text, filter, onChange]);

  const toggle = (status: CompanyStatus) =>
    onChange({ ...filter, status: statuses.includes(status) ? statuses.filter((item) => item !== status) : [...statuses, status] });
  const select = (value: string) => (value === '' ? undefined : value);

  return (
    <Stack spacing={2} sx={{ mb: 2 }} component="section" role="search" aria-label={t('companies.filters')}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { md: 'center' } }}>
        <TextField
          size="small"
          placeholder={t('companies.searchPlaceholder')}
          value={text}
          onChange={(event) => setText(event.target.value)}
          slotProps={{ htmlInput: { 'aria-label': t('companies.search'), maxLength: 160 }, input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }}
          sx={{ minWidth: 260 }}
        />
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }} role="group" aria-label={t('fields.status')}>
          {COMPANY_STATUSES.map((status) => (
            <Chip
              key={status}
              label={t(`status.${status}`)}
              icon={statuses.includes(status) ? <CheckIcon /> : undefined}
              color={statuses.includes(status) ? 'primary' : 'default'}
              variant={statuses.includes(status) ? 'filled' : 'outlined'}
              onClick={() => toggle(status)}
              aria-pressed={statuses.includes(status)}
            />
          ))}
        </Stack>
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField select size="small" label={t('fields.roles')} value={filter.companyRole ?? ''} onChange={(event) => onChange({ ...filter, companyRole: select(event.target.value) })} sx={{ minWidth: 220 }}>
          <MenuItem value="">{t('companies.allRoles')}</MenuItem>
          {ROLE_OPTIONS.map((role) => <MenuItem key={role} value={role}>{t(`roles.${role}`)}</MenuItem>)}
        </TextField>
        <TextField select size="small" label={t('fields.coreData')} value={filter.coreDataSource ?? ''} onChange={(event) => onChange({ ...filter, coreDataSource: select(event.target.value) as CoreDataSource | undefined })} sx={{ minWidth: 220 }}>
          <MenuItem value="">{t('companies.anySource')}</MenuItem>
          <MenuItem value="EBW">{t('companies.source.EBW')}</MenuItem>
          <MenuItem value="MANUAL">{t('companies.source.MANUAL')}</MenuItem>
        </TextField>
        <TextField select size="small" label={t('fields.bpn')} value={filter.hasBpn === undefined ? '' : String(filter.hasBpn)} onChange={(event) => onChange({ ...filter, hasBpn: event.target.value === '' ? undefined : event.target.value === 'true' })} sx={{ minWidth: 220 }}>
          <MenuItem value="">{t('companies.anyBpn')}</MenuItem>
          <MenuItem value="true">{t('companies.withBpn')}</MenuItem>
          <MenuItem value="false">{t('companies.withoutBpn')}</MenuItem>
        </TextField>
        {active && (
          <Button onClick={() => { setText(''); onChange({}); }}>{t('companies.reset')}</Button>
        )}
      </Stack>
    </Stack>
  );
}
