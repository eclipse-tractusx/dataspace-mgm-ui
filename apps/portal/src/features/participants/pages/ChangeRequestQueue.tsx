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
import { CHANGE_REQUEST_STATUSES, type ChangeRequestStatus } from '@dataspace-mgm/c3-m1-core';
import { Button, Card, CardContent, Tab, Tabs, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCoreModules } from '../../../core/CoreModulesContext';
import { LoadingState } from '../components/LoadingState';
import { PageHeader } from '../components/PageHeader';
import { Pager } from '../components/Pager';
import { ParticipantsPage } from '../components/ParticipantsPage';
import { ResultAlert } from '../components/ResultAlert';
import { ReviewTable } from '../components/review/ReviewTable';
import { useLoad } from '../hooks/useLoad';
import { PARTICIPANTS_NS } from '../i18n';
import { participantsPath } from '../paths';

const SIZE = 20;
type Filter = ChangeRequestStatus | 'ALL';

function Queue() {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const { c3m1 } = useCoreModules();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('OPEN');
  const [page, setPage] = useState(0);
  const list = useLoad(`queue:${filter}:${page}`, () =>
    c3m1.listChangeRequests.execute({ page, size: SIZE, status: filter === 'ALL' ? undefined : [filter] }),
  );
  const choose = (next: Filter) => {
    setFilter(next);
    setPage(0);
  };

  let body: ReactNode;
  const value = list.value;
  if (value === null) {
    body = <LoadingState text={t('queue.loading')} />;
  } else if (value.status !== 'success') {
    body = (
      <ResultAlert
        result={value}
        forbiddenText={t('queue.forbidden')}
        action={value.status === 'rejected' ? <Button color="inherit" onClick={() => choose('OPEN')}>{t('companies.reset')}</Button> : undefined}
      />
    );
  } else if (value.data.total === 0) {
    const open = filter === 'OPEN';
    body = (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3" component="h2" sx={{ fontSize: 20 }}>{open ? t('queue.emptyTitle') : t('queue.noMatchTitle')}</Typography>
          {open ? <Typography color="text.secondary">{t('queue.emptyText')}</Typography> : <Button sx={{ mt: 1 }} variant="outlined" onClick={() => choose('OPEN')}>{t('companies.reset')}</Button>}
        </CardContent>
      </Card>
    );
  } else {
    body = (
      <>
        <ReviewTable requests={value.data.items} onlyOpen={filter === 'OPEN'} onOpen={(request) => navigate(participantsPath.review(request.id))} />
        <Pager page={value.data} onPage={setPage} />
      </>
    );
  }
  return (
    <>
      <PageHeader overline={t('overline')} title={t('queue.title')} subtitle={t('queue.subtitle')} />
      <Tabs value={filter} onChange={(_event, next: Filter) => choose(next)} aria-label={t('fields.status')} variant="scrollable" allowScrollButtonsMobile sx={{ mb: 2 }}>
        {CHANGE_REQUEST_STATUSES.map((status) => <Tab key={status} value={status} label={t(`queue.tabs.${status}`)} />)}
        <Tab value="ALL" label={t('queue.tabs.ALL')} />
      </Tabs>
      {body}
    </>
  );
}

/**
 * View 8 "Change requests to review" (C3-M1 `listChangeRequests`). Provisional configurator choice: layout=table ·
 * filter=tabs · open=page.
 */
export default function ChangeRequestQueue() {
  const { t } = useTranslation(PARTICIPANTS_NS);
  return (
    <ParticipantsPage overline={t('overline')} title={t('queue.title')} permission="review_company_changes" forbiddenText={t('queue.forbidden')} returnTo={participantsPath.reviewQueue()}>
      {() => <Queue />}
    </ParticipantsPage>
  );
}
