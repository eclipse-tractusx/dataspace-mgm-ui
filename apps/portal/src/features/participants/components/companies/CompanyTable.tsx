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

import type { CompanySummaryAnemic } from '@dataspace-mgm/c3-m1-core';
import { Chip, FactCheckOutlinedIcon, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, VerifiedUserOutlinedIcon } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../../i18n';
import { countryName, formatDate } from '../../utils/format';
import { StatusChip } from '../StatusChip';

const HIDE_ON_PHONE = { display: { xs: 'none', md: 'table-cell' } } as const;

/** The companies as a table (configurator choice layout=table, open=page, density=comfortable); a row opens the company. */
export function CompanyTable({ companies, onOpen }: { companies: ReadonlyArray<CompanySummaryAnemic>; onOpen: (company: CompanySummaryAnemic) => void }) {
  const { t, i18n } = useTranslation(PARTICIPANTS_NS);
  return (
    <TableContainer>
      <Table aria-label={t('companies.title')}>
        <TableHead>
          <TableRow>
            <TableCell component="th" scope="col">{t('companies.columns.company')}</TableCell>
            <TableCell component="th" scope="col">{t('fields.bpn')}</TableCell>
            <TableCell component="th" scope="col">{t('fields.status')}</TableCell>
            <TableCell component="th" scope="col" sx={HIDE_ON_PHONE}>{t('fields.coreData')}</TableCell>
            <TableCell component="th" scope="col" sx={HIDE_ON_PHONE}>{t('companies.columns.roles')}</TableCell>
            <TableCell component="th" scope="col" sx={HIDE_ON_PHONE}>{t('companies.columns.created')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies.map((company) => (
            <TableRow
              key={company.id}
              hover
              tabIndex={0}
              aria-label={t('companies.open', { name: company.name })}
              onClick={() => onOpen(company)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onOpen(company);
                }
              }}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                <Typography sx={{ fontWeight: 600 }}>{company.name}</Typography>
                <Typography variant="body2" color="text.secondary">{countryName(company.countryCode, i18n.language)}</Typography>
              </TableCell>
              <TableCell sx={{ fontFamily: company.bpn ? 'monospace' : undefined, color: company.bpn ? undefined : 'text.secondary' }}>{company.bpn ?? t('bpnNotAssigned')}</TableCell>
              <TableCell><StatusChip kind="status" value={company.status} /></TableCell>
              <TableCell sx={HIDE_ON_PHONE}>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  {company.coreDataSource === 'EBW' ? <VerifiedUserOutlinedIcon fontSize="small" color="success" aria-hidden /> : <FactCheckOutlinedIcon fontSize="small" aria-hidden />}
                  <span>{t(`companies.source.${company.coreDataSource}`)}</span>
                </Stack>
              </TableCell>
              <TableCell sx={HIDE_ON_PHONE}>
                {company.companyRoles.length ? (
                  <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
                    {company.companyRoles.map((role) => <Chip key={role} size="small" label={t(`roles.${role}`, { defaultValue: role })} />)}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">{t('companies.noActiveRoles')}</Typography>
                )}
              </TableCell>
              <TableCell sx={HIDE_ON_PHONE}>{formatDate(company.createdAt, i18n.language)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
