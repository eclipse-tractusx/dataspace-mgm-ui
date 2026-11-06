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

import type { CredentialPageAnemic } from '@dataspace-mgm/c4-m1-core';
import { Box, Button, Card, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, alpha, tractusx } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useListLinkState } from '../hooks/useListReturn';
import { useTimeTexts } from '../hooks/useTimeTexts';
import { WALLETS_NS } from '../i18n';
import { WALLETS_PATHS } from '../paths';
import { CompanyName } from './CompanyName';
import { CredentialStatusChip } from './CredentialStatusChip';
import { StatusNote } from './StatusNote';

interface CredentialTableProps {
  page: CredentialPageAnemic;
  onPage: (page: number) => void;
}

/** One page of the credentials of all companies; a row opens the credential on its own page. */
export function CredentialTable({ page, onPage }: CredentialTableProps) {
  const { t } = useTranslation(WALLETS_NS);
  const time = useTimeTexts();
  const navigate = useNavigate();
  const state = useListLinkState();
  const pages = Math.max(1, Math.ceil(page.total / page.size));

  return (
    <Card sx={{ py: 1, '&:hover': { boxShadow: 'none' } }}>
      <TableContainer>
        <Table aria-label={t('allCredentials.all')} sx={{ '& td': { py: 1.75 }, '& th': { py: 1.5 } }}>
          <TableHead>
            <TableRow>
              {(['company', 'credential', 'status', 'route', 'changed'] as const).map((column) => (
                <TableCell key={column} sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {t(`table.${column}`)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {page.items.map((credential) => {
              const to = WALLETS_PATHS.credential(credential.id);
              return (
                <TableRow
                  key={credential.id}
                  hover
                  onClick={(event) => !(event.target as HTMLElement).closest('a') && navigate(to, { state })}
                  sx={{ cursor: 'pointer', '&.MuiTableRow-hover:hover': { bgcolor: alpha(tractusx.orange, 0.08) } }}
                >
                  <TableCell>
                    <Link component={RouterLink} to={to} state={state} sx={{ display: 'block' }}>
                      <CompanyName credential={credential} />
                    </Link>
                  </TableCell>
                  <TableCell>{t(`credentialTypeShort.${credential.credentialType}`)}</TableCell>
                  <TableCell>
                    <CredentialStatusChip status={credential.status} />
                    <StatusNote credential={credential} />
                  </TableCell>
                  <TableCell>{t(`route.${credential.route}`)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{time.dateTime(credential.changedAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        component="nav"
        aria-label={t('pager.label')}
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', px: 2, pt: 1.5, color: 'text.secondary', fontSize: '0.875rem' }}
      >
        <span>{t('pager.total', { count: page.total })}</span>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button variant="text" size="small" color="inherit" disabled={page.page === 0} onClick={() => onPage(page.page - 1)}>
            {t('pager.previous')}
          </Button>
          <span>{t('pager.pageOf', { page: page.page + 1, pages })}</span>
          <Button variant="text" size="small" color="inherit" disabled={page.page >= pages - 1} onClick={() => onPage(page.page + 1)}>
            {t('pager.next')}
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
