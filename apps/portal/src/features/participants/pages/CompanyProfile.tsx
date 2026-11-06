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
import { ChangeRequestDomain, CompanyDomain, type CompanyAnemic } from '@dataspace-mgm/c3-m1-core';
import type { SessionAnemic } from '@dataspace-mgm/identity-core';
import { Alert, BlockOutlinedIcon, Button, EditOutlinedIcon, Link, PendingActionsOutlinedIcon, Stack } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { Navigate, Link as RouterLink } from 'react-router-dom';
import { useCoreModules, useSession } from '../../../core/CoreModulesContext';
import { CompanyCard } from '../components/company/CompanyCard';
import { LoadingState } from '../components/LoadingState';
import { PageHeader } from '../components/PageHeader';
import { ParticipantsPage } from '../components/ParticipantsPage';
import { failureText } from '../components/problems';
import { useLoad } from '../hooks/useLoad';
import { useOwnCompany } from '../hooks/useOwnCompany';
import { hasPermission } from '../hooks/useParticipantSession';
import { PARTICIPANTS_NS } from '../i18n';
import { participantsPath } from '../paths';
import { changeSummary } from '../utils/change-summary';
import { formatDate } from '../utils/format';

function OwnCompany({ session }: { session: SessionAnemic }) {
  const { t, i18n } = useTranslation(PARTICIPANTS_NS);
  const { c3m1 } = useCoreModules();
  const state = useOwnCompany();
  const [saved, setSaved] = useState<CompanyAnemic | null>(null);
  const companyId = state.status === 'found' ? state.company.id : null;
  // The open change request: a second call until Company carries openChangeRequestId (open point C3-M1).
  const requests = useLoad(companyId ? `open-requests:${companyId}` : null, () => c3m1.listOwnChangeRequests.execute(companyId ?? '', { page: 0, size: 20 }));

  let body: ReactNode;
  let actions: ReactNode = null;
  switch (state.status) {
    case 'loading':
      body = <LoadingState text={t('loading')} />;
      break;
    case 'signed-out':
    case 'no-company':
      body = <Alert severity="info">{t('noCompany')}</Alert>;
      break;
    case 'not-found':
      body = <Alert severity="warning">{t('notFound')}</Alert>;
      break;
    case 'failed':
      body = (
        <Alert severity="error">
          {t('profile.failed', { reason: failureText(t, state.error) })}
          {state.error.problemType && <div style={{ fontFamily: 'monospace', marginTop: 4 }}>{state.error.problemType}</div>}
        </Alert>
      );
      break;
    default: {
      const company = saved && saved.id === state.company.id ? saved : state.company;
      const editable = hasPermission(session, 'edit_company') && CompanyDomain.canEdit(company);
      const open = requests.value?.status === 'success' ? requests.value.data.items.find(ChangeRequestDomain.isOpen) : undefined;
      if (editable) {
        actions = (
          <Button variant="contained" component={RouterLink} to={participantsPath.changeCompany()} startIcon={<EditOutlinedIcon />}>
            {t('profile.changeData')}
          </Button>
        );
      }
      body = (
        <Stack spacing={3}>
          {company.status === 'INACTIVE' && (
            <Alert severity="warning" icon={<BlockOutlinedIcon />}>
              {t('profile.inactive')}
            </Alert>
          )}
          {open && company.status !== 'INACTIVE' && (
            <Alert
              severity="info"
              icon={<PendingActionsOutlinedIcon />}
              action={
                <Button color="inherit" size="small" component={RouterLink} to={participantsPath.ownChangeRequests()}>
                  {t('actions.view')}
                </Button>
              }
            >
              {t('profile.openRequest', { date: formatDate(open.createdAt, i18n.language), summary: changeSummary(t, open.changes, { ...company, address: company.postalAddress }) })}
            </Alert>
          )}
          <CompanyCard
            company={company}
            canEditShortName={editable}
            canManageRoles={hasPermission(session, 'edit_company_roles') && CompanyDomain.canEdit(company)}
            onSaveShortName={async (shortName) => {
              const result = await c3m1.updateShortName.execute(company.id, shortName);
              if (result.status === 'success') {
                setSaved(result.data);
              }
              return result;
            }}
          />
          <Link component={RouterLink} to={participantsPath.ownChangeRequests()}>
            {t('profile.allChangeRequests')}
          </Link>
        </Stack>
      );
    }
  }

  return (
    <>
      <PageHeader overline={t('overline')} title={t('title')} actions={actions} />
      {body}
    </>
  );
}

/**
 * View 1 "Your company" (C3-M1 `getCompany`, `updateCompany`, `listOwnChangeRequests`). Provisional configurator
 * choice of the mockup: layout=hero · verification=badge · shortname=inline · action=header.
 */
export default function CompanyProfile() {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const state = useSession();
  // The entry of the navigation: OSP staff without a company of their own start in their area (UI only; no data shown).
  if (state.status === 'signed-in' && !hasPermission(state.session, 'view_company')) {
    if (hasPermission(state.session, 'view_companies')) {
      return <Navigate to={participantsPath.companies()} replace />;
    }
    if (hasPermission(state.session, 'review_company_changes')) {
      return <Navigate to={participantsPath.reviewQueue()} replace />;
    }
  }
  return (
    <ParticipantsPage overline={t('overline')} title={t('title')} permission="view_company" forbiddenText={t('profile.forbidden')} returnTo={participantsPath.company()}>
      {(session) => <OwnCompany session={session} />}
    </ParticipantsPage>
  );
}
