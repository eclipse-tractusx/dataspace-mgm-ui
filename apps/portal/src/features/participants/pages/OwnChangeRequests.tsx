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
import { type ChangeRequestAnemic, type OperationResult } from '@dataspace-mgm/c3-m1-core';
import type { SessionAnemic } from '@dataspace-mgm/identity-core';
import { AddIcon, Alert, Button, Card, CardContent, Stack, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { useCoreModules } from '../../../core/CoreModulesContext';
import { LoadingState } from '../components/LoadingState';
import { PageHeader } from '../components/PageHeader';
import { Pager } from '../components/Pager';
import { ParticipantsPage } from '../components/ParticipantsPage';
import { ReasonDialog } from '../components/ReasonDialog';
import { ResultAlert } from '../components/ResultAlert';
import { OwnChangeRequestItem } from '../components/requests/OwnChangeRequestItem';
import { useNotice } from '../components/Notice';
import { useLoad } from '../hooks/useLoad';
import { useOwnCompany } from '../hooks/useOwnCompany';
import { hasPermission } from '../hooks/useParticipantSession';
import { PARTICIPANTS_NS } from '../i18n';
import { participantsPath } from '../paths';
import { changeSummary } from '../utils/change-summary';

const SIZE = 20;

function ChangeRequestList({ session }: { session: SessionAnemic }) {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const { c3m1 } = useCoreModules();
  const company = useOwnCompany();
  const { notice, show } = useNotice();
  const [page, setPage] = useState(0);
  const [withdrawing, setWithdrawing] = useState<ChangeRequestAnemic | null>(null);
  const [outcome, setOutcome] = useState<OperationResult<ChangeRequestAnemic> | null>(null);
  const [busy, setBusy] = useState(false);
  const companyId = session.companyId;
  const list = useLoad(companyId ? `own-requests:${companyId}:${page}` : null, () => c3m1.listOwnChangeRequests.execute(companyId ?? '', { page, size: SIZE }));
  const canEdit = hasPermission(session, 'edit_company');
  const current = company.status === 'found' ? company.company : null;

  const withdraw = async () => {
    if (!withdrawing || !companyId) {
      return;
    }
    setBusy(true);
    const result = await c3m1.withdrawChangeRequest.execute(companyId, withdrawing.id);
    setBusy(false);
    if (result.status === 'success') {
      setWithdrawing(null);
      setOutcome(null);
      show(t('requests.withdrawn'));
      list.reload();
    } else {
      setOutcome(result);
    }
  };

  let body: ReactNode;
  const value = list.value;
  if (!companyId) {
    body = <Alert severity="info">{t('noCompany')}</Alert>;
  } else if (value === null) {
    body = <LoadingState text={t('requests.loading')} />;
  } else if (value.status !== 'success') {
    body = <ResultAlert result={value} notFoundText={t('notFound')} forbiddenText={t('requests.forbidden')} />;
  } else if (value.data.total === 0) {
    body = (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3" component="h2" sx={{ fontSize: 20 }}>{t('requests.emptyTitle')}</Typography>
          <Typography color="text.secondary" sx={{ my: 1 }}>{t('requests.emptyText')}</Typography>
          {canEdit && <Button variant="outlined" component={RouterLink} to={participantsPath.changeCompany()}>{t('profile.changeData')}</Button>}
        </CardContent>
      </Card>
    );
  } else {
    body = (
      <>
        <Stack component="ol" spacing={2} sx={{ listStyle: 'none', p: 0, m: 0 }} aria-label={t('requests.title')}>
          {value.data.items.map((request) => (
            <OwnChangeRequestItem key={request.id} request={request} company={current} canWithdraw={canEdit} onWithdraw={setWithdrawing} />
          ))}
        </Stack>
        {value.data.total > SIZE && <Pager page={value.data} onPage={setPage} />}
      </>
    );
  }

  return (
    <>
      <PageHeader
        overline={t('overline')}
        title={t('requests.title')}
        subtitle={t('requests.subtitle')}
        back={{ to: participantsPath.company(), label: t('title') }}
        actions={canEdit && value?.status === 'success' ? <Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to={participantsPath.changeCompany()}>{t('requests.new')}</Button> : null}
      />
      {body}
      <ReasonDialog
        open={withdrawing !== null}
        title={t('requests.withdrawTitle')}
        body={withdrawing ? t('requests.withdrawText', { summary: changeSummary(t, withdrawing.changes) }) : ''}
        confirmLabel={t('requests.withdraw')}
        danger
        busy={busy}
        errors={[]}
        outcome={outcome && outcome.status !== 'success' ? <ResultAlert result={outcome} /> : null}
        onCancel={() => {
          setWithdrawing(null);
          setOutcome(null);
        }}
        onConfirm={() => void withdraw()}
      />
      {notice}
    </>
  );
}

/**
 * View 3 "Your change requests" (C3-M1 `listOwnChangeRequests`, `withdrawChangeRequest`). Provisional configurator
 * choice: layout=timeline · detail=expand · withdraw=row.
 */
export default function OwnChangeRequests() {
  const { t } = useTranslation(PARTICIPANTS_NS);
  return (
    <ParticipantsPage overline={t('overline')} title={t('requests.title')} permission="view_company" forbiddenText={t('requests.forbidden')} returnTo={participantsPath.ownChangeRequests()}>
      {(session) => <ChangeRequestList session={session} />}
    </ParticipantsPage>
  );
}
