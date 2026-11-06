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
import type { FailedOutcome, ProblemOutcome } from '@dataspace-mgm/c1-m2-core';
import { Alert, Box, Button, Card, CardContent, Stack, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ApplicationStepper } from '../components/ApplicationStepper';
import { ApplicationTabs } from '../components/ApplicationTabs';
import { OutcomeAlert } from '../components/OutcomeAlert';
import { PageFrame } from '../components/PageFrame';
import { StateView } from '../components/StateView';
import { StatusChip } from '../components/StatusChip';
import { Toast } from '../components/Toast';
import { WithdrawSection } from '../components/WithdrawSection';
import { useApplicationActions, useCompanyRoles, useOwnApplication } from '../hooks/useApplications';
import { ONBOARDING_NS } from '../i18n';

/** My application (mockup view 5, decided: withdraw=bottom · status=stepper · details=tabs). */
export default function MyApplicationPage() {
  const { t } = useTranslation(ONBOARDING_NS);
  const navigate = useNavigate();
  const { applicationId = '' } = useParams();
  const { state, reload } = useOwnApplication(applicationId);
  const roles = useCompanyRoles().state;
  const actions = useApplicationActions(applicationId);
  const [outcome, setOutcome] = useState<ProblemOutcome | FailedOutcome | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (state.status !== 'found' || !actions) {
    return (
      <PageFrame titleKey="application.title">
        <StateView state={state} returnTo={`/onboarding/application/${applicationId}`} />
      </PageFrame>
    );
  }
  const { application } = state;
  const roleName = (role: string) => (roles.status === 'found' ? roles.companyRoles.find((r) => r.role === role)?.name : undefined) ?? role;
  const withdraw = async () => {
    const answer = await actions.withdraw();
    if (answer.status === 'withdrawn') {
      setOutcome(null);
      setToast(t('application.withdrawnToast'));
      reload();
    } else {
      setOutcome(answer);
    }
  };
  // Withdrawing is offered while the application is open; whether it is still allowed is the API's answer
  // (409 already-decided). A canWithdraw flag is an open point for the backend.
  const open = application.status === 'CREATED' || application.status === 'SUBMITTED';
  return (
    <PageFrame titleKey="application.title">
      {outcome && <OutcomeAlert outcome={outcome} />}
      {application.status === 'DECLINED' && (
        <Alert
          severity="error"
          action={
            <Button variant="text" color="inherit" onClick={() => navigate('/onboarding/start')}>
              {t('application.startNew')}
            </Button>
          }
        >
          <strong>{t('application.declinedTitle')}</strong>
          {application.declineReason && <Box>{t('application.declineReason', { reason: application.declineReason })}</Box>}
        </Alert>
      )}
      <Card component="section" aria-labelledby="application-company">
        <CardContent sx={{ p: { xs: 3, md: 3.5 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { sm: 'flex-start' } }}>
            <Box>
              <Typography id="application-company" variant="h2" component="h2" sx={{ fontSize: 28, mb: 1 }}>
                {application.companyData.legalName}
              </Typography>
              <Stack direction="row" spacing={1.5} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <StatusChip status={application.status} />
                <Typography variant="body2" color="text.secondary">
                  {t('application.meta', { kind: t(`enum.kind.${application.kind}`), verification: t(`enum.verification.${application.verification}`), review: t(`enum.reviewStatus.${application.reviewStatus}`) })}
                </Typography>
              </Stack>
            </Box>
            {application.status === 'CREATED' && (
              <Button variant="contained" onClick={() => navigate(`/onboarding/application/${applicationId}/company-data`)}>
                {t('continue')}
              </Button>
            )}
          </Stack>
          <ApplicationStepper application={application} />
        </CardContent>
      </Card>
      <ApplicationTabs application={application} roleName={roleName} />
      {open && <WithdrawSection company={application.companyData.legalName} onWithdraw={withdraw} />}
      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
