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

import type { ReactNode } from 'react';
import type { CspRegistrationAnemic } from '@dataspace-mgm/c3-m2-core';
import { Alert, AlertTitle, Box, BusinessOutlinedIcon, Button, Card, CardContent, Stack, Typography, alpha, tractusx } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useCoreModules } from '../../../core/CoreModulesContext';
import { RegistrationSteps } from '../components/csp/RegistrationSteps';
import { LoadingState } from '../components/LoadingState';
import { PageHeader } from '../components/PageHeader';
import { ParticipantsPage } from '../components/ParticipantsPage';
import { failureText } from '../components/problems';
import { StatusChip } from '../components/StatusChip';
import { useLoad } from '../hooks/useLoad';
import { PARTICIPANTS_NS } from '../i18n';
import { participantsPath } from '../paths';
import { addressLines, formatDateTime } from '../utils/format';

const BANNER = { REGISTERED: 'success', PENDING: 'warning', FAILED: 'error', TRANSFERRED_AWAY: 'info' } as const;

function Banner({ registration, name, dataspace }: { registration: CspRegistrationAnemic; name: string; dataspace: string }) {
  const { t, i18n } = useTranslation(PARTICIPANTS_NS);
  const values = {
    name,
    dataspace,
    bpn: registration.bpn ?? '–',
    date: formatDateTime(registration.updatedAt, i18n.language),
    reason: registration.failureReason ? t(`failureReason.${registration.failureReason}`, { defaultValue: registration.failureReason }) : '',
  };
  return (
    <Alert severity={BANNER[registration.status]} action={<StatusChip kind="cspStatus" value={registration.status} />}>
      <AlertTitle>{t(`csp.banner.${registration.status}.title`, values)}</AlertTitle>
      {t(`csp.banner.${registration.status}.text`, values)}
    </Alert>
  );
}

function Registration({ companyId }: { companyId: string }) {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const { c3m1, c3m2 } = useCoreModules();
  const company = useLoad(`company:${companyId}`, () => c3m1.getCompanyDetail.execute(companyId));
  const registration = useLoad(`csp:${companyId}`, () => c3m2.getCspRegistration.execute(companyId));
  const detail = company.value?.status === 'success' ? company.value.data : null;
  const name = detail?.name ?? companyId;
  const dataspace = detail?.dataspaceName ?? t('csp.theDataspace');

  let body: ReactNode;
  const value = registration.value;
  if (value === null) {
    body = <LoadingState text={t('csp.loading')} />;
  } else if (value.status === 'forbidden') {
    body = <Alert severity="error">{t('csp.forbidden')}</Alert>;
  } else if (value.status === 'not-registered') {
    body = (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3" component="h2" sx={{ fontSize: 20 }}>{t('csp.notRegisteredTitle')}</Typography>
          <Typography color="text.secondary">{t('csp.notRegisteredText', { name })}</Typography>
        </CardContent>
      </Card>
    );
  } else if (value.status === 'failed') {
    body = (
      <Alert severity="error">
        {failureText(t, value.error)}
        {value.error.problemType && <Box sx={{ fontFamily: 'monospace', mt: 0.5 }}>{value.error.problemType}</Box>}
      </Alert>
    );
  } else {
    body = (
      <Stack spacing={3}>
        <Banner registration={value.registration} name={name} dataspace={dataspace} />
        <Card variant="outlined" component="section" aria-labelledby="registration-title">
          <CardContent>
            <Typography id="registration-title" variant="h3" component="h2" sx={{ fontSize: 20, mb: 2 }}>{t('csp.registration')}</Typography>
            <RegistrationSteps registration={value.registration} dataspace={dataspace} />
          </CardContent>
        </Card>
        <Typography variant="body2" color="text.secondary">{t('csp.note')}</Typography>
      </Stack>
    );
  }

  return (
    <>
      <PageHeader
        overline={t('csp.overline')}
        title={t('csp.title')}
        subtitle={detail ? t('csp.subtitle', { dataspace, name }) : undefined}
        back={{ to: participantsPath.companyDetail(companyId), label: t('detail.title') }}
      />
      {detail && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
              <Box aria-hidden sx={{ width: 44, height: 44, borderRadius: '10px', display: 'grid', placeItems: 'center', color: tractusx.orange, bgcolor: alpha(tractusx.orange, 0.15) }}>
                <BusinessOutlinedIcon />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>{detail.name}</Typography>
                <Typography variant="body2" color="text.secondary">{[...addressLines(detail.postalAddress), detail.postalAddress.countryCode].join(', ')}</Typography>
              </Box>
              <StatusChip kind="status" value={detail.status} />
              <Button size="small" component={RouterLink} to={participantsPath.companyDetail(companyId)}>{t('csp.openCompany')}</Button>
            </Stack>
          </CardContent>
        </Card>
      )}
      {body}
    </>
  );
}

/**
 * View 7 "CSP registration" (C3-M2 `getCspRegistration`; the company card reads C3-M1 `getCompanyDetail`). Read only.
 * Provisional configurator choice: display=steps · status=banner · context=company.
 */
export default function CspRegistration() {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const { companyId = '' } = useParams();
  return (
    <ParticipantsPage overline={t('csp.overline')} title={t('csp.title')} permission="view_csp_registration" forbiddenText={t('csp.forbidden')} returnTo={participantsPath.cspRegistration(companyId)}>
      {() => <Registration key={companyId} companyId={companyId} />}
    </ParticipantsPage>
  );
}
