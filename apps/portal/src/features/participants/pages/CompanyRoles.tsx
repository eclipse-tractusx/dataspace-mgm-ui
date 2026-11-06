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
import { CompanyDomain, CompanyRoleDomain, type CompanyRoleStateAnemic, type OperationResult } from '@dataspace-mgm/c3-m1-core';
import type { SessionAnemic } from '@dataspace-mgm/identity-core';
import { Alert, Grid, Stack } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useCoreModules } from '../../../core/CoreModulesContext';
import { LoadingState } from '../components/LoadingState';
import { useNotice } from '../components/Notice';
import { PageHeader } from '../components/PageHeader';
import { ParticipantsPage } from '../components/ParticipantsPage';
import { ReasonDialog } from '../components/ReasonDialog';
import { ResultAlert } from '../components/ResultAlert';
import { ConsentDialog } from '../components/roles/ConsentDialog';
import { RoleCard } from '../components/roles/RoleCard';
import { useLoad } from '../hooks/useLoad';
import { useOwnCompany } from '../hooks/useOwnCompany';
import { hasPermission } from '../hooks/useParticipantSession';
import { PARTICIPANTS_NS } from '../i18n';
import { participantsPath } from '../paths';

type Roles = ReadonlyArray<CompanyRoleStateAnemic>;

function RoleList({ session }: { session: SessionAnemic }) {
  const { t, i18n } = useTranslation(PARTICIPANTS_NS);
  const { c3m1 } = useCoreModules();
  const company = useOwnCompany();
  const { notice, show } = useNotice();
  const lang = (i18n.resolvedLanguage ?? i18n.language).slice(0, 2);
  const companyId = session.companyId;
  const roles = useLoad(companyId ? `roles:${companyId}:${lang}` : null, () => c3m1.listCompanyRoles.execute(companyId ?? '', lang));
  const [adding, setAdding] = useState<CompanyRoleStateAnemic | null>(null);
  const [removing, setRemoving] = useState<CompanyRoleStateAnemic | null>(null);
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<OperationResult<Roles> | null>(null);
  const editable = hasPermission(session, 'edit_company_roles') && (company.status !== 'found' || CompanyDomain.canEdit(company.company));
  const roleName = (role: CompanyRoleStateAnemic) => t(`roles.${role.companyRole}`, { defaultValue: role.companyRole });

  const run = async (role: CompanyRoleStateAnemic, call: () => Promise<OperationResult<Roles>>, done: string) => {
    setBusy(true);
    const result = await call();
    setBusy(false);
    setAdding(null);
    setRemoving(null);
    setOutcome(result.status === 'success' ? null : result);
    if (result.status === 'success') {
      roles.replace(result);
      show(t(done, { role: roleName(role) }));
    }
  };

  let body: ReactNode;
  const value = roles.value;
  if (!companyId) {
    body = <Alert severity="info">{t('noCompany')}</Alert>;
  } else if (value === null) {
    body = <LoadingState text={t('roleCards.loading')} />;
  } else if (value.status !== 'success') {
    body = <ResultAlert result={value} notFoundText={t('notFound')} />;
  } else {
    body = (
      <Grid container spacing={2}>
        {value.data.map((role) => (
          <Grid key={role.companyRole} size={{ xs: 12, md: 6, lg: 4 }}>
            <RoleCard
              role={role}
              canAdd={editable && CompanyRoleDomain.canAdd(role)}
              canRemove={editable && CompanyRoleDomain.canRemove(role)}
              onAdd={() => setAdding(role)}
              onRemove={() => setRemoving(role)}
            />
          </Grid>
        ))}
      </Grid>
    );
  }
  const companyName = company.status === 'found' ? company.company.name : '';
  const dataspace = company.status === 'found' ? (company.company.dataspaceName ?? '') : '';

  return (
    <>
      <PageHeader
        overline={t('overline')}
        title={t('roleCards.title')}
        subtitle={companyName ? t('roleCards.subtitle', { company: companyName, dataspace }) : undefined}
        back={{ to: participantsPath.company(), label: t('title') }}
      />
      <Stack spacing={3}>
        {outcome && outcome.status !== 'success' && <ResultAlert result={outcome} />}
        {body}
      </Stack>
      {adding && companyId && (
        <ConsentDialog
          role={adding}
          companyName={companyName}
          busy={busy}
          onCancel={() => setAdding(null)}
          onConfirm={() => void run(adding, () => c3m1.addCompanyRole.execute(companyId, adding, lang), 'roleCards.added')}
        />
      )}
      <ReasonDialog
        open={removing !== null}
        title={t('roleCards.removeTitle')}
        body={removing ? t('roleCards.removeText', { company: companyName, role: roleName(removing) }) : ''}
        confirmLabel={t('roleCards.remove')}
        danger
        busy={busy}
        errors={[]}
        onCancel={() => setRemoving(null)}
        onConfirm={() => removing && companyId && void run(removing, () => c3m1.removeCompanyRole.execute(companyId, removing.companyRole, lang), 'roleCards.removed')}
      />
      {notice}
    </>
  );
}

/**
 * View 4 "Company roles" (C3-M1 `listCompanyRolesOfCompany`, `addCompanyRole`, `removeCompanyRole`). Provisional
 * configurator choice: layout=cards · consent=dialog · terms=always.
 */
export default function CompanyRoles() {
  const { t } = useTranslation(PARTICIPANTS_NS);
  return (
    <ParticipantsPage overline={t('overline')} title={t('roleCards.title')} permission="view_company" forbiddenText={t('profile.forbidden')} returnTo={participantsPath.companyRoles()}>
      {(session) => <RoleList session={session} />}
    </ParticipantsPage>
  );
}
