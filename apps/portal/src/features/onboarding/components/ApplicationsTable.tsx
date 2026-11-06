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

import type { ApplicationSummaryAnemic } from '@dataspace-mgm/c1-m2-core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useDate } from '../hooks/useOnboarding';
import { ONBOARDING_NS } from '../i18n';
import { StatusChip } from './StatusChip';

/** All applications as a table (decided: layout=table); a row opens the application. */
export function ApplicationsTable({ items, onOpen }: { items: ReadonlyArray<ApplicationSummaryAnemic>; onOpen: (id: string) => void }) {
  const { t } = useTranslation(ONBOARDING_NS);
  const date = useDate();
  const columns = ['company', 'kind', 'verification', 'status', 'created', 'submitted'] as const;
  return (
    <TableContainer>
      <Table size="medium">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column}>{t(`staff.columns.${column}`)}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              hover
              tabIndex={0}
              sx={{ cursor: 'pointer' }}
              onClick={() => onOpen(item.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onOpen(item.id);
                }
              }}
            >
              <TableCell sx={{ fontWeight: 700 }}>{item.legalName}</TableCell>
              <TableCell>{t(`enum.kind.${item.kind}`)}</TableCell>
              <TableCell>{t(`enum.verification.${item.verification}`)}</TableCell>
              <TableCell>
                <StatusChip status={item.status} />
              </TableCell>
              <TableCell>{date(item.createdAt)}</TableCell>
              <TableCell>{date(item.submittedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
