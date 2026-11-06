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
import type { AgreementAnemic, FailedOutcome, Language, ProblemOutcome } from '@dataspace-mgm/c1-m2-core';
import { Box, Button, Card, CardContent, CheckCircleOutlinedIcon, SendOutlinedIcon, Typography } from '@dataspace-mgm/ui-mui';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ApplicationSummary } from '../components/ApplicationSummary';
import { IconTile } from '../components/IconTile';
import { OutcomeAlert } from '../components/OutcomeAlert';
import { PageFrame } from '../components/PageFrame';
import { RolesCard } from '../components/RolesCard';
import { StateView } from '../components/StateView';
import { TermsList, termKey } from '../components/TermsList';
import { TermsViewer } from '../components/TermsViewer';
import { Toast } from '../components/Toast';
import { useAgreements, useApplicationActions, useCompanyRoles, useOwnApplication } from '../hooks/useApplications';
import { useApiLanguage } from '../hooks/useOnboarding';
import { ONBOARDING_NS } from '../i18n';
import { stepsOf } from './flowSteps';

/** Roles, terms and submission (mockup view 4, decided: summary=top · roles=checkboxes · terms in a full-screen viewer). */
export default function TermsPage() {
  const { t } = useTranslation(ONBOARDING_NS);
  const navigate = useNavigate();
  const { applicationId = '' } = useParams();
  const representationDeclared = (useLocation().state as { representationDeclared?: boolean } | null)?.representationDeclared;
  const language = useApiLanguage();
  const { state, reload } = useOwnApplication(applicationId);
  const roles = useCompanyRoles().state;
  const selected = state.status === 'found' ? state.application.companyRoles : null;
  const agreements = useAgreements(selected);
  const actions = useApplicationActions(applicationId);
  const [accepted, setAccepted] = useState<Record<string, Language>>({});
  const [viewing, setViewing] = useState<AgreementAnemic | null>(null);
  const [outcome, setOutcome] = useState<ProblemOutcome | FailedOutcome | null>(null);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (state.status !== 'found' || !actions) {
    return (
      <PageFrame titleKey="terms.title">
        <StateView state={state} returnTo={`/onboarding/application/${applicationId}/terms`} />
      </PageFrame>
    );
  }
  const { application } = state;
  const terms = agreements.state.status === 'found' ? agreements.state.agreements : [];
  const missing = terms.filter((term) => !accepted[termKey(term)]).length;
  const steps = stepsOf(application.verification);

  const toggleRole = async (role: string) => {
    const next = application.companyRoles.includes(role) ? application.companyRoles.filter((r) => r !== role) : [...application.companyRoles, role];
    const answer = await actions.update({ companyRoles: next });
    if (answer.status === 'updated') {
      setOutcome(null);
      setToast(t('terms.rolesSaved'));
      reload();
    } else {
      setOutcome(answer);
    }
  };
  const submit = async () => {
    setBusy(true);
    const answer = await actions.submit({
      consents: terms.map((term) => ({ agreementKey: term.agreementKey, version: term.version, language: accepted[termKey(term)] })),
      ...(application.verification === 'DOCUMENTS' ? { representationDeclared: representationDeclared === true } : {}),
    });
    setBusy(false);
    if (answer.status === 'submitted') {
      setSubmitted(true);
      return;
    }
    setOutcome(answer);
    if (answer.status === 'consents-incomplete') {
      agreements.reload();
    }
  };
  const reverify = async () => {
    const answer = await actions.reverify();
    if (answer.status === 'replaced') {
      setOutcome(null);
      setToast(t('terms.reverified'));
      reload();
    } else if (answer.status !== 'cancelled') {
      setOutcome(answer);
    }
  };

  if (submitted) {
    return (
      <PageFrame titleKey="terms.title">
        <Card>
          <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
            <IconTile>
              <CheckCircleOutlinedIcon />
            </IconTile>
            <Typography variant="h2" component="h2" sx={{ fontSize: 28 }}>
              {t('terms.submittedTitle')}
            </Typography>
            <Typography>
              <Trans t={t} i18nKey="terms.submittedText" values={{ company: application.companyData.legalName }} components={{ strong: <strong /> }} />
            </Typography>
            <Button variant="contained" onClick={() => navigate(`/onboarding/application/${applicationId}`)}>
              {t('terms.showApplication')}
            </Button>
          </CardContent>
        </Card>
      </PageFrame>
    );
  }

  const outcomeAction =
    outcome?.status === 'attestation-expired' ? (
      <Button variant="text" color="inherit" onClick={reverify}>
        {t('terms.reverify')}
      </Button>
    ) : outcome?.status === 'documents-incomplete' ? (
      <Button variant="text" color="inherit" onClick={() => navigate(`/onboarding/application/${applicationId}/documents`)}>
        {t('terms.toDocuments')}
      </Button>
    ) : undefined;
  return (
    <PageFrame titleKey="terms.title" steps={{ keys: steps, current: steps.length - 2 + (application.verification === 'DOCUMENTS' ? 1 : 0) }}>
      {outcome && <OutcomeAlert outcome={outcome} action={outcomeAction} />}
      <ApplicationSummary application={application} roles={roles.status === 'found' ? roles.companyRoles : []} />
      <RolesCard roles={roles.status === 'found' ? roles.companyRoles : []} selected={application.companyRoles} disabled={application.status !== 'CREATED'} onToggle={toggleRole} />
      <TermsList terms={terms} accepted={accepted} onOpen={setViewing} />
      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
        {missing > 0 && (
          <Typography variant="body2" color="text.secondary">
            {t('terms.missing', { count: missing })}
          </Typography>
        )}
        <Button variant="outlined" onClick={() => navigate(`/onboarding/application/${applicationId}/${application.verification === 'DOCUMENTS' ? 'documents' : 'company-data'}`)}>
          {t('back')}
        </Button>
        <Button variant="contained" startIcon={<SendOutlinedIcon />} disabled={missing > 0 || terms.length === 0 || busy} onClick={submit}>
          {busy ? t('terms.submitting') : t('terms.submit')}
        </Button>
      </Box>
      <TermsViewer
        term={viewing}
        preferred={language}
        onCancel={() => setViewing(null)}
        onAccept={(term, read) => {
          setAccepted((current) => ({ ...current, [termKey(term)]: read }));
          setViewing(null);
          setToast(t('terms.acceptedToast', { title: term.title, language: t(`enum.language.${read}`) }));
        }}
      />
      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
