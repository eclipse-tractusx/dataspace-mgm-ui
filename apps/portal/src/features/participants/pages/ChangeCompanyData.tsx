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
import { CompanyDomain, type ChangeRequestAnemic } from '@dataspace-mgm/c3-m1-core';
import { Alert, AlertTitle, Button, Stack } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { useCoreModules } from '../../../core/CoreModulesContext';
import { ChangeRequestForm } from '../components/change/ChangeRequestForm';
import { PathChoice, type ChangePath } from '../components/change/PathChoice';
import { LoadingState } from '../components/LoadingState';
import { PageHeader } from '../components/PageHeader';
import { ParticipantsPage } from '../components/ParticipantsPage';
import { failureText } from '../components/problems';
import { StatusChip } from '../components/StatusChip';
import { useOwnCompany } from '../hooks/useOwnCompany';
import { PARTICIPANTS_NS } from '../i18n';
import { participantsPath } from '../paths';

function ChangeCompany() {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const { c3m1 } = useCoreModules();
  const state = useOwnCompany();
  const [path, setPath] = useState<ChangePath | null>(null);
  const [submitted, setSubmitted] = useState<ChangeRequestAnemic | null>(null);

  let body: ReactNode;
  if (state.status === 'loading') {
    body = <LoadingState text={t('loading')} />;
  } else if (state.status === 'failed') {
    body = <Alert severity="error">{t('profile.failed', { reason: failureText(t, state.error) })}</Alert>;
  } else if (state.status !== 'found') {
    body = <Alert severity="info">{t('noCompany')}</Alert>;
  } else if (!CompanyDomain.canEdit(state.company)) {
    body = <Alert severity="warning">{t('change.notEditable')}</Alert>;
  } else if (submitted) {
    body = (
      <Alert severity="success">
        <AlertTitle>{t('change.submittedTitle')}</AlertTitle>
        <Stack spacing={2}>
          <span>
            {t('change.submittedText')} <StatusChip kind="changeRequestStatus" value={submitted.status} />
          </span>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" size="small" component={RouterLink} to={participantsPath.ownChangeRequests()}>{t('change.toRequests')}</Button>
            <Button size="small" component={RouterLink} to={participantsPath.company()}>{t('change.backToCompany')}</Button>
          </Stack>
        </Stack>
      </Alert>
    );
  } else {
    const company = state.company;
    body = (
      <>
        <PathChoice value={path} onChange={setPath} />
        {path === 'wallet' && (
          <Alert severity="info">
            <AlertTitle>{t('change.wallet.unavailableTitle')}</AlertTitle>
            {t('change.wallet.unavailable')}
          </Alert>
        )}
        {path === 'request' && (
          <ChangeRequestForm
            company={company}
            onSubmit={async (draft) => {
              const result = await c3m1.createChangeRequest.execute(company.id, draft);
              if (result.status === 'success') {
                setSubmitted(result.data);
              }
              return result;
            }}
          />
        )}
      </>
    );
  }
  return (
    <>
      <PageHeader overline={t('overline')} title={t('change.title')} back={{ to: participantsPath.company(), label: t('title') }} />
      {body}
    </>
  );
}

/**
 * View 2 "Change company data" (C3-M1 `createChangeRequest`; `updateCompanyFromAttestation` needs the EBW-Connector
 * flow of the BFF, which is not specified yet). Provisional configurator choice: path=choice · wallet=qr (shown as not
 * available) · upload=dropzone · review=compare.
 */
export default function ChangeCompanyData() {
  const { t } = useTranslation(PARTICIPANTS_NS);
  return (
    <ParticipantsPage overline={t('overline')} title={t('change.title')} permission="edit_company" forbiddenText={t('change.forbidden')} returnTo={participantsPath.changeCompany()}>
      {() => <ChangeCompany />}
    </ParticipantsPage>
  );
}
