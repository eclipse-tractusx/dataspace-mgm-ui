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
import { ArrowForwardIcon, Box, Button } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { AttestationCard } from '../components/AttestationCard';
import { CompanyCard } from '../components/CompanyCard';
import { PageFrame } from '../components/PageFrame';
import { StateView } from '../components/StateView';
import { Toast } from '../components/Toast';
import { useApplicationActions, useCountries, useIdentifierTypes, useOwnApplication } from '../hooks/useApplications';
import { ONBOARDING_NS } from '../i18n';
import { stepsOf } from './flowSteps';

/** Company data (mockup view 2, decided: comparison=badges · editing=button). */
export default function CompanyDataPage() {
  const { t } = useTranslation(ONBOARDING_NS);
  const navigate = useNavigate();
  const { applicationId = '' } = useParams();
  const { state, reload } = useOwnApplication(applicationId);
  const countries = useCountries().state;
  const country = state.status === 'found' ? state.application.companyData.address.countryCode : 'DE';
  const types = useIdentifierTypes(country).state;
  const actions = useApplicationActions(applicationId);
  const [toast, setToast] = useState<string | null>(null);
  const returnTo = `/onboarding/application/${applicationId}/company-data`;

  if (state.status !== 'found' || !actions) {
    return (
      <PageFrame titleKey="company.title">
        <StateView state={state} returnTo={returnTo} />
      </PageFrame>
    );
  }
  const { application } = state;
  const documents = application.verification === 'DOCUMENTS';
  return (
    <PageFrame titleKey="company.title" steps={{ keys: stepsOf(application.verification), current: 2 }}>
      {application.attestation && <AttestationCard attestation={application.attestation} />}
      <CompanyCard
        application={application}
        countries={countries.status === 'found' ? countries.countries : []}
        identifierTypes={types.status === 'found' ? types.identifierTypes.filter((type) => type.type !== 'EBWOID') : []}
        onSave={actions.update}
        onSaved={() => {
          reload();
          setToast(t('company.saved'));
        }}
      />
      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={() => navigate(`/onboarding/application/${applicationId}`)}>
          {t('back')}
        </Button>
        <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => navigate(`/onboarding/application/${applicationId}/${documents ? 'documents' : 'terms'}`)}>
          {t('continue')}
        </Button>
      </Box>
      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
