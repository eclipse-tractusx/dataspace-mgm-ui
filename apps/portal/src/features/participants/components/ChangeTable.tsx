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

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, alpha, tractusx } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../i18n';
import type { ChangeRow } from '../utils/change-rows';

/** "Field | Now | Requested" for the requested changes of a change request; changed rows are highlighted. */
export function ChangeTable({ rows, caption }: { rows: ReadonlyArray<ChangeRow>; caption: string }) {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const label = (row: ChangeRow) => (row.kind === 'identifier' ? t(`identifierTypes.${row.field}`) : t(`fields.${row.field}`));
  return (
    <TableContainer>
      <Table size="small" aria-label={caption}>
        <TableHead>
          <TableRow>
            <TableCell component="th" scope="col">{t('compare.field')}</TableCell>
            <TableCell component="th" scope="col">{t('compare.now')}</TableCell>
            <TableCell component="th" scope="col">{t('compare.requested')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.field} sx={row.changed ? { bgcolor: alpha(tractusx.orange, 0.08) } : undefined}>
              <TableCell component="th" scope="row">{label(row)}</TableCell>
              <TableCell>{row.current ?? t('compare.none')}</TableCell>
              <TableCell sx={{ fontWeight: row.changed ? 600 : undefined }}>
                {row.requested ?? t('compare.removed')}
                {row.changed && row.current === null ? ` (${t('compare.new')})` : ''}
                {!row.changed ? ` (${t('compare.unchanged')})` : ''}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
