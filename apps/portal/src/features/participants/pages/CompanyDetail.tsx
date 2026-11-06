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
import { CompanyDomain, type CompanyDetailAnemic, type OperationResult } from '@dataspace-mgm/c3-m1-core';
import type { SessionAnemic } from '@dataspace-mgm/identity-core';
import { Alert, BlockOutlinedIcon, Box, Button, EditOutlinedIcon, Grid, Stack, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useCoreModules } from '../../../core/CoreModulesContext';
import { CompanyMainSections, CompanySideSections } from '../components/detail/CompanySections';
import { CorrectionDialog } from '../components/detail/CorrectionDialog';
import { CspSummaryCard } from '../components/detail/CspSummaryCard';
import { LoadingState } from '../components/LoadingState';
import { useNotice } from '../components/Notice';
import { PageHeader } from '../components/PageHeader';
import { ParticipantsPage } from '../components/ParticipantsPage';
import { ReasonDialog } from '../components/ReasonDialog';
import { ResultAlert } from '../components/ResultAlert';
import { StatusChip } from '../components/StatusChip';
import { useLoad } from '../hooks/useLoad';
import { hasPermission } from '../hooks/useParticipantSession';
import { PARTICIPANTS_NS } from '../i18n';
import { participantsPath } from '../paths';
import { formatDateTime } from '../utils/format';

const CONSEQUENCES = ['accounts', 'technicalUsers', 'credential', 'membership', 'data'] as const;

function Detail({ session, companyId }: { session: SessionAnemic; companyId: string }) {
  const { t, i18n } = useTranslation(PARTICIPANTS_NS);
  const { c3m1, c3m2 } = useCoreModules();
  const { notice, show } = useNotice();
  const detail = useLoad(`company:${companyId}`, () => c3m1.getCompanyDetail.execute(companyId));
  const showCsp = hasPermission(session, 'view_csp_registration');
  const csp = useLoad(showCsp ? `csp:${companyId}` : null, () => c3m2.getCspRegistration.execute(companyId));
  const [correcting, setCorrecting] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deactivation, setDeactivation] = useState<OperationResult<CompanyDetailAnemic> | null>(null);
  const manage = hasPermission(session, 'manage_companies');
  const back = { to: participantsPath.companies(), label: t('companies.title') };

  const value = detail.value;
  if (value === null || value.status !== 'success') {
    return (
      <>
        <PageHeader overline={t('detail.overline')} title={t('detail.title')} back={back} />
        {value === null ? (
          <LoadingState text={t('detail.loading')} />
        ) : (
          <ResultAlert
            result={value}
            notFoundText={t('detail.notFound')}
            forbiddenText={t('companies.forbidden')}
            action={<Button color="inherit" component={RouterLink} to={participantsPath.companies()}>{t('detail.allCompanies')}</Button>}
          />
        )}
      </>
    );
  }
  const company = value.data;
  const update = (next: CompanyDetailAnemic, text: string) => {
    detail.replace({ status: 'success', data: next });
    show(text);
  };
  const deactivate = async (reason: string) => {
    setBusy(true);
    const result = await c3m1.deactivateCompany.execute(company.id, reason);
    setBusy(false);
    setDeactivation(result);
    if (result.status === 'success') {
      setDeactivating(false);
      update(result.data, t('detail.deactivatedNotice'));
    }
  };

  const actions: ReactNode = manage && (
    <>
      {CompanyDomain.canCorrect(company) && <Button variant="outlined" startIcon={<EditOutlinedIcon />} onClick={() => setCorrecting(true)}>{t('detail.correct')}</Button>}
      {CompanyDomain.canDeactivate(company) && <Button variant="contained" color="secondary" startIcon={<BlockOutlinedIcon />} onClick={() => setDeactivating(true)}>{t('detail.deactivate')}</Button>}
    </>
  );
  const main = <CompanyMainSections company={company} />;
  const side = <CompanySideSections company={company} />;

  return (
    <>
      <PageHeader
        overline={t('detail.overline')}
        back={back}
        title={<Box component="span" sx={{ display: 'inline-flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>{company.name}<StatusChip kind="status" value={company.status} /></Box>}
        subtitle={[company.bpn ?? t('detail.noBpn'), t(`coreDataSource.${company.coreDataSource}`), company.dataspaceName].filter(Boolean).join(' · ')}
        actions={actions}
      />
      <Stack spacing={2} sx={{ mb: 3 }}>
        {company.status === 'INACTIVE' && (
          <Alert severity="warning">
            {t('detail.inactive', { date: formatDateTime(company.deactivatedAt, i18n.language), reason: company.deactivationReason ? t(`deactivationReason.${company.deactivationReason}`) : '–' })}
          </Alert>
        )}
        {company.openChangeRequestId && (
          <Alert
            severity="info"
            action={hasPermission(session, 'review_company_changes') ? <Button color="inherit" size="small" component={RouterLink} to={participantsPath.review(company.openChangeRequestId)}>{t('detail.review')}</Button> : undefined}
          >
            {t('detail.openRequest')}
          </Alert>
        )}
      </Stack>
      {showCsp ? (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>{main}</Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <CspSummaryCard companyId={company.id} result={csp.value} />
              {side}
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <Stack spacing={2}>{main}{side}</Stack>
      )}
      {correcting && (
        <CorrectionDialog
          company={company}
          onCancel={() => setCorrecting(false)}
          onSave={async (correction) => {
            const result = await c3m1.correctCompany.execute(company.id, correction);
            if (result.status === 'success') {
              setCorrecting(false);
              const sourceChanged = result.data.coreDataSource !== company.coreDataSource;
              update(result.data, sourceChanged ? t('detail.correctedManual') : t('detail.corrected'));
            }
            return result;
          }}
        />
      )}
      <ReasonDialog
        open={deactivating}
        title={t('detail.deactivateTitle')}
        body={
          <>
            <Typography component="span">{t('detail.deactivateIntro', { name: company.name })}</Typography>
            <Box component="ul" sx={{ mt: 1 }}>{CONSEQUENCES.map((key) => <li key={key}>{t(`detail.consequences.${key}`)}</li>)}</Box>
            <Typography component="span" variant="body2">{t('detail.reactivationHint')}</Typography>
          </>
        }
        input={{ label: t('detail.reason'), help: t('detail.deactivateReasonHelp'), maxLength: 500, field: 'reason', required: true }}
        confirmLabel={t('detail.deactivateConfirm')}
        danger
        busy={busy}
        errors={deactivation?.status === 'invalid' ? deactivation.errors : []}
        outcome={deactivation && deactivation.status !== 'success' && deactivation.status !== 'invalid' ? <ResultAlert result={deactivation} /> : null}
        onCancel={() => {
          setDeactivating(false);
          setDeactivation(null);
        }}
        onConfirm={(reason) => void deactivate(reason)}
      />
      {notice}
    </>
  );
}

/**
 * View 6 "Company" for the onboarding service provider (C3-M1 `getCompanyDetail`, `correctCompany`,
 * `deactivateCompany`; C3-M2 `getCspRegistration`). Provisional configurator choice: layout=sections · actions=header ·
 * correct=dialog · csp=side.
 */
export default function CompanyDetail() {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const { companyId = '' } = useParams();
  return (
    <ParticipantsPage overline={t('detail.overline')} title={t('detail.title')} permission="view_companies" forbiddenText={t('companies.forbidden')} returnTo={participantsPath.companyDetail(companyId)}>
      {(session) => <Detail key={companyId} session={session} companyId={companyId} />}
    </ParticipantsPage>
  );
}
