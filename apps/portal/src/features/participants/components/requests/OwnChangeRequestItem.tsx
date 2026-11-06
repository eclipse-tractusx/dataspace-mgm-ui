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

import { useState } from 'react';
import { ChangeRequestDomain, type ChangeRequestAnemic, type CompanyAnemic } from '@dataspace-mgm/c3-m1-core';
import { Alert, Box, Button, Card, CardContent, ExpandLessIcon, ExpandMoreIcon, InfoOutlinedIcon, Stack, Typography, UndoIcon } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../../i18n';
import { changeRows } from '../../utils/change-rows';
import { changeSummary } from '../../utils/change-summary';
import { formatDateTime } from '../../utils/format';
import { ChangeTable } from '../ChangeTable';
import { DocumentList } from '../DocumentList';
import { StatusChip } from '../StatusChip';

interface OwnChangeRequestItemProps {
  request: ChangeRequestAnemic;
  company: CompanyAnemic | null;
  canWithdraw: boolean;
  onWithdraw: (request: ChangeRequestAnemic) => void;
}

const DECISION_SEVERITY = { OPEN: 'info', APPROVED: 'success', DECLINED: 'error', WITHDRAWN: 'info' } as const;

/** One change request in the timeline (configurator choice layout=timeline, detail=expand, withdraw=row). */
export function OwnChangeRequestItem({ request, company, canWithdraw, onWithdraw }: OwnChangeRequestItemProps) {
  const { t, i18n } = useTranslation(PARTICIPANTS_NS);
  const [open, setOpen] = useState(false);
  const current = company ? { name: company.name, address: company.postalAddress, identifiers: company.identifiers } : undefined;
  const summary = changeSummary(t, request.changes, current);
  const detailsId = `request-${request.id}`;
  const withdraw = canWithdraw && ChangeRequestDomain.isOpen(request) && (
    <Button variant="outlined" size="small" startIcon={<UndoIcon />} onClick={() => onWithdraw(request)}>
      {t('requests.withdraw')}
    </Button>
  );
  return (
    <Card component="li" variant="outlined" sx={{ borderRadius: '10px' }}>
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h3" component="h2" sx={{ fontSize: 18 }}>{summary}</Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDateTime(request.createdAt, i18n.language)} · {t('requests.documents', { count: request.documents.length })}
            </Typography>
          </Box>
          <StatusChip kind="changeRequestStatus" value={request.status} />
        </Stack>
        {request.status === 'DECLINED' && !open && request.decisionReason && (
          <Stack direction="row" spacing={1} sx={{ mt: 1, color: 'text.secondary' }}>
            <InfoOutlinedIcon fontSize="small" aria-hidden />
            <Typography variant="body2">{request.decisionReason}</Typography>
          </Stack>
        )}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button size="small" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={detailsId} endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}>
            {open ? t('requests.hideDetails') : t('requests.details')}
          </Button>
          {withdraw}
        </Stack>
        {open && (
          <Stack id={detailsId} spacing={2} sx={{ mt: 2 }}>
            <Alert severity={DECISION_SEVERITY[request.status]}>
              {request.status === 'DECLINED' && t('requests.declinedOn', { date: formatDateTime(request.closedAt, i18n.language), reason: request.decisionReason ?? '' })}
              {request.status === 'APPROVED' && t('requests.approvedOn', { date: formatDateTime(request.closedAt, i18n.language) })}
              {request.status === 'WITHDRAWN' && t('requests.withdrawnOn', { date: formatDateTime(request.closedAt, i18n.language) })}
              {request.status === 'OPEN' && t('requests.checking')}
            </Alert>
            {current && <ChangeTable rows={changeRows(request.changes, current)} caption={t('requests.whatChanges')} />}
            <Box>
              <Typography variant="overline" color="text.secondary" component="h3">{t('requests.comment')}</Typography>
              <Typography component="blockquote" sx={{ m: 0, fontStyle: 'italic' }}>“{request.comment}”</Typography>
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary" component="h3">{t('change.documentsTitle')}</Typography>
              <DocumentList documents={request.documents} label={t('change.documentsTitle')} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{t('requests.documentsNote')}</Typography>
            </Box>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
