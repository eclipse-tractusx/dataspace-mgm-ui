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

import type { ChangeRequestAnemic } from '@dataspace-mgm/c3-m1-core';
import { AttachFileIcon, ScheduleIcon, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../../i18n';
import { changeSummary } from '../../utils/change-summary';
import { formatDate, formatDateTime, waitingHours } from '../../utils/format';
import { StatusChip } from '../StatusChip';

/** The queue as a table (configurator choice layout=table, open=page); a row opens the review. */
export function ReviewTable({ requests, onlyOpen, onOpen }: { requests: ReadonlyArray<ChangeRequestAnemic>; onlyOpen: boolean; onOpen: (request: ChangeRequestAnemic) => void }) {
  const { t, i18n } = useTranslation(PARTICIPANTS_NS);
  const waiting = (createdAt: string) => {
    const hours = waitingHours(createdAt);
    return hours >= 24 ? t('queue.waitingDays', { days: Math.floor(hours / 24), hours: hours % 24 }) : t('queue.waitingHours', { hours });
  };
  return (
    <TableContainer>
      <Table aria-label={t('queue.title')}>
        <TableHead>
          <TableRow>
            <TableCell component="th" scope="col">{t('companies.columns.company')}</TableCell>
            <TableCell component="th" scope="col">{t('queue.columns.change')}</TableCell>
            <TableCell component="th" scope="col">{t('queue.columns.documents')}</TableCell>
            <TableCell component="th" scope="col">{t('fields.status')}</TableCell>
            <TableCell component="th" scope="col">{onlyOpen ? t('queue.columns.waiting') : t('queue.columns.date')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow
              key={request.id}
              hover
              tabIndex={0}
              aria-label={t('queue.open', { name: request.companyName ?? request.companyId })}
              onClick={() => onOpen(request)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onOpen(request);
                }
              }}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell><Typography sx={{ fontWeight: 600 }}>{request.companyName ?? request.companyId}</Typography></TableCell>
              <TableCell>{changeSummary(t, request.changes)}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  <AttachFileIcon fontSize="small" aria-hidden />
                  <span>{t('requests.documents', { count: request.documents.length })}</span>
                </Stack>
              </TableCell>
              <TableCell><StatusChip kind="changeRequestStatus" value={request.status} /></TableCell>
              <TableCell>
                {request.status === 'OPEN' ? (
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: waitingHours(request.createdAt) >= 24 ? 'warning.main' : undefined }} title={t('queue.openSince', { date: formatDateTime(request.createdAt, i18n.language) })}>
                    <ScheduleIcon fontSize="small" aria-hidden />
                    <span>{waiting(request.createdAt)}</span>
                  </Stack>
                ) : (
                  formatDate(request.closedAt, i18n.language)
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
