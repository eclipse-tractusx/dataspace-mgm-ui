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

import { useEffect, useState } from 'react';
import type { ApplicationKind } from '@dataspace-mgm/c1-m2-core';
import { ArrowForwardIcon, Box, Button, Card, CardContent, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { CompanyForm, type CompanyFormValue } from '../components/CompanyForm';
import { OutcomeAlert } from '../components/OutcomeAlert';
import { PageFrame } from '../components/PageFrame';
import { StateView } from '../components/StateView';
import { useCountries, useIdentifierTypes } from '../hooks/useApplications';
import { useReadiness } from '../hooks/useLoad';
import { useStartApplication } from '../hooks/useStartApplication';
import { ONBOARDING_NS } from '../i18n';
import { DOCUMENTS_STEPS } from './flowSteps';

const EMPTY: CompanyFormValue = {
  legalName: '',
  shortName: '',
  address: { streetName: '', streetNumber: null, postalCode: null, city: '', region: null, countryCode: 'DE' },
  identifiers: [{ type: 'COMMERCIAL_REG_NUMBER', value: '' }],
};

/** Company data in the verification path DOCUMENTS: the person enters everything; POST /applications creates it. */
export default function NewApplicationPage() {
  const { t } = useTranslation(ONBOARDING_NS);
  const navigate = useNavigate();
  const choice = (useLocation().state as { kind?: ApplicationKind; bpn?: string } | null) ?? {};
  const readiness = useReadiness();
  const [form, setForm] = useState<CompanyFormValue>(EMPTY);
  const countries = useCountries().state;
  const types = useIdentifierTypes(form.address.countryCode).state;
  const { state, withDocuments } = useStartApplication();

  useEffect(() => {
    if (state.status === 'created' || state.status === 'repeated') {
      navigate(`/onboarding/application/${state.application.id}/documents`);
    }
  }, [state, navigate]);

  if (readiness.status !== 'ready') {
    return (
      <PageFrame titleKey="company.title">
        <StateView state={readiness} returnTo="/onboarding/start" />
      </PageFrame>
    );
  }
  const create = () =>
    withDocuments(
      { kind: choice.kind ?? 'ONBOARDING', bpn: choice.bpn },
      {
        legalName: form.legalName,
        ...(form.shortName ? { shortName: form.shortName } : {}),
        address: form.address,
        identifiers: form.identifiers.filter((identifier) => identifier.value.trim()),
      },
    );
  return (
    <PageFrame titleKey="company.title" steps={{ keys: DOCUMENTS_STEPS, current: 2 }}>
      {state.status !== 'idle' && state.status !== 'working' && state.status !== 'created' && state.status !== 'repeated' && state.status !== 'cancelled' && (
        <OutcomeAlert outcome={state} />
      )}
      <Card component="section" aria-labelledby="company-title">
        <CardContent sx={{ p: { xs: 3, md: 3.5 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography id="company-title" variant="h3" component="h2" sx={{ fontSize: 20, fontWeight: 700 }}>
            {t('company.yourCompany')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('company.documentsIntro')}
          </Typography>
          <CompanyForm
            value={form}
            onChange={setForm}
            countries={countries.status === 'found' ? countries.countries : []}
            identifierTypes={types.status === 'found' ? types.identifierTypes.filter((type) => type.type !== 'EBWOID') : []}
          />
        </CardContent>
      </Card>
      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={() => navigate('/onboarding/start')}>
          {t('back')}
        </Button>
        <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={create} disabled={state.status === 'working'}>
          {t('company.create')}
        </Button>
      </Box>
    </PageFrame>
  );
}
