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
import type {
  ApplicationAnemic,
  ApplicationUpdateInput,
  ComparisonField,
  CountryAnemic,
  FailedOutcome,
  IdentifierTypeInfoAnemic,
  ProblemOutcome,
  UpdateApplicationResult,
} from '@dataspace-mgm/c1-m2-core';
import { Box, Button, Card, CardContent, EditOutlinedIcon, Stack, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { ONBOARDING_NS } from '../i18n';
import { CompanyForm, type CompanyFormValue } from './CompanyForm';
import { DataRows } from './DataRows';
import { OutcomeAlert } from './OutcomeAlert';
import { SourceBadge, type Source } from './SourceBadge';
import { mono } from './styles';

const formOf = (application: ApplicationAnemic): CompanyFormValue => ({
  legalName: application.companyData.legalName,
  shortName: application.companyData.shortName ?? '',
  address: application.companyData.address,
  identifiers: application.companyData.identifiers.filter((i) => i.source === 'APPLICANT').map(({ type, value }) => ({ type, value })),
});

interface CompanyCardProps {
  application: ApplicationAnemic;
  countries: ReadonlyArray<CountryAnemic>;
  /** DOCUMENTS: the identifier types of the company's country. */
  identifierTypes?: ReadonlyArray<IdentifierTypeInfoAnemic>;
  onSave: (input: ApplicationUpdateInput) => Promise<UpdateApplicationResult>;
  onSaved: () => void;
}

/** "Your company": read-only with a source badge per field; Edit switches to the form, Save and Cancel switch back. */
export function CompanyCard({ application, countries, identifierTypes, onSave, onSaved }: CompanyCardProps) {
  const { t } = useTranslation(ONBOARDING_NS);
  const [form, setForm] = useState<CompanyFormValue | null>(null);
  const [outcome, setOutcome] = useState<ProblemOutcome | FailedOutcome | null>(null);
  const { companyData, comparison, verification } = application;
  const result = (field: ComparisonField): Source | undefined => comparison.find((entry) => entry.field === field)?.result;
  const country = countries.find((c) => c.code === companyData.address.countryCode)?.name ?? companyData.address.countryCode;
  const badge = (source: Source | undefined) => (source ? <SourceBadge source={source} /> : undefined);
  const address = companyData.address;
  const ebw = verification === 'EBW';
  const rows = [
    { label: t('company.fields.legalName'), value: companyData.legalName, note: badge(ebw ? result('LEGAL_NAME') : 'APPLICANT') },
    { label: t('company.fields.shortName'), value: companyData.shortName ?? '–', note: badge(companyData.shortName ? 'APPLICANT' : undefined) },
    { label: t('company.fields.street'), value: [address.streetName, address.streetNumber].filter(Boolean).join(' '), note: badge(ebw ? result('STREET') : 'APPLICANT') },
    { label: t('company.fields.postalCode'), value: address.postalCode ?? '–', note: badge(ebw ? result('POSTAL_CODE') : address.postalCode ? 'APPLICANT' : undefined) },
    { label: t('company.fields.city'), value: address.city, note: badge(ebw ? result('CITY') : 'APPLICANT') },
    { label: t('company.fields.country'), value: country, note: badge(ebw ? result('COUNTRY') : 'APPLICANT') },
    ...companyData.identifiers.map((i) => ({
      label: t(`enum.identifier.${i.type}`),
      value: <Box component="span" sx={mono}>{i.value}</Box>,
      note: badge(i.source === 'ATTESTATION' ? (result(i.type as ComparisonField) ?? 'FROM_ATTESTATION') : 'APPLICANT'),
    })),
  ];

  const save = async () => {
    if (!form) {
      return;
    }
    const answer = await onSave({ legalName: form.legalName, shortName: form.shortName || null, address: form.address, identifiers: form.identifiers });
    if (answer.status === 'updated') {
      setForm(null);
      setOutcome(null);
      onSaved();
    } else {
      setOutcome(answer);
    }
  };

  return (
    <Card component="section" aria-labelledby="company-title">
      <CardContent sx={{ p: { xs: 3, md: 3.5 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography id="company-title" variant="h3" component="h2" sx={{ fontSize: 20, fontWeight: 700 }}>
            {t('company.yourCompany')}
          </Typography>
          {!form && application.status === 'CREATED' && (
            <Button variant="outlined" startIcon={<EditOutlinedIcon />} onClick={() => setForm(formOf(application))}>
              {t('edit')}
            </Button>
          )}
        </Stack>
        {outcome && <OutcomeAlert outcome={outcome} />}
        {form ? (
          <>
            <CompanyForm value={form} onChange={setForm} locked={ebw ? { countryName: country, identifiers: companyData.identifiers } : undefined} countries={countries} identifierTypes={identifierTypes} />
            <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => { setForm(null); setOutcome(null); }}>
                {t('cancel')}
              </Button>
              <Button variant="contained" onClick={save}>
                {t('save')}
              </Button>
            </Stack>
          </>
        ) : (
          <DataRows rows={rows} />
        )}
      </CardContent>
    </Card>
  );
}
