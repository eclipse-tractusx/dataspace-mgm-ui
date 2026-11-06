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

import { useCallback, useState, type ReactNode } from 'react';
import { Button, Card, CardContent, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCoreModules } from '../../../core/CoreModulesContext';
import { CompanyFilters, type CompanyFilter } from '../components/companies/CompanyFilters';
import { CompanyTable } from '../components/companies/CompanyTable';
import { LoadingState } from '../components/LoadingState';
import { PageHeader } from '../components/PageHeader';
import { Pager } from '../components/Pager';
import { ParticipantsPage } from '../components/ParticipantsPage';
import { ResultAlert } from '../components/ResultAlert';
import { useLoad } from '../hooks/useLoad';
import { PARTICIPANTS_NS } from '../i18n';
import { participantsPath } from '../paths';

const SIZE = 20;

function CompanyList() {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const { c3m1 } = useCoreModules();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<CompanyFilter>({});
  const [page, setPage] = useState(0);
  const changeFilter = useCallback((next: CompanyFilter) => {
    setFilter(next);
    setPage(0);
  }, []);
  const list = useLoad(`companies:${JSON.stringify(filter)}:${page}`, () => c3m1.listCompanies.execute({ ...filter, page, size: SIZE }));
  const reset = <Button color="inherit" onClick={() => changeFilter({})}>{t('companies.reset')}</Button>;

  let body: ReactNode;
  const value = list.value;
  if (value === null) {
    body = <LoadingState text={t('companies.loading')} />;
  } else if (value.status !== 'success') {
    body = (
      <ResultAlert
        result={value}
        forbiddenText={t('companies.forbidden')}
        action={value.status === 'rejected' && value.problem === 'validation' ? reset : undefined}
      />
    );
  } else if (value.data.total === 0) {
    body = (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3" component="h2" sx={{ fontSize: 20 }}>{t('companies.emptyTitle')}</Typography>
          <Typography color="text.secondary" sx={{ my: 1 }}>{t('companies.emptyText')}</Typography>
          <Button variant="outlined" onClick={() => changeFilter({})}>{t('companies.reset')}</Button>
        </CardContent>
      </Card>
    );
  } else {
    body = (
      <>
        <Typography role="status" color="text.secondary" sx={{ mb: 1 }}>{t('companies.count', { count: value.data.total })}</Typography>
        <CompanyTable companies={value.data.items} onOpen={(company) => navigate(participantsPath.companyDetail(company.id))} />
        <Pager page={value.data} onPage={setPage} />
      </>
    );
  }
  return (
    <>
      <PageHeader overline={t('companies.overline')} title={t('companies.title')} subtitle={t('companies.subtitle')} />
      <CompanyFilters filter={filter} onChange={changeFilter} />
      {body}
    </>
  );
}

/**
 * View 5 "Companies" (C3-M1 `listCompanies`). Provisional configurator choice: filters=chips · layout=table ·
 * open=page · density=comfortable.
 */
export default function Companies() {
  const { t } = useTranslation(PARTICIPANTS_NS);
  return (
    <ParticipantsPage overline={t('companies.overline')} title={t('companies.title')} permission="view_companies" forbiddenText={t('companies.forbidden')} returnTo={participantsPath.companies()}>
      {() => <CompanyList />}
    </ParticipantsPage>
  );
}
