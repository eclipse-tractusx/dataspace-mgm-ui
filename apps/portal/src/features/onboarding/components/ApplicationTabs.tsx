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
import type { ApplicationAnemic } from '@dataspace-mgm/c1-m2-core';
import { Box, Card, CardContent, CheckCircleOutlinedIcon, Chip, Stack, Tab, Tabs, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useDate } from '../hooks/useOnboarding';
import { ONBOARDING_NS } from '../i18n';
import { DataRows } from './DataRows';
import { mono } from './styles';

/** What the person sent, in tabs (decided: details=tabs). Role names come from GET /company-roles. */
export function ApplicationTabs({ application, roleName }: { application: ApplicationAnemic; roleName: (role: string) => string }) {
  const { t } = useTranslation(ONBOARDING_NS);
  const date = useDate();
  const [tab, setTab] = useState<'company' | 'terms' | 'proof'>('company');
  const { companyData: data, attestation } = application;
  const address = `${data.address.streetName} ${data.address.streetNumber ?? ''}, ${data.address.postalCode ?? ''} ${data.address.city}`.replace(/\s+/g, ' ');
  return (
    <Card component="section">
      <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 2 }} variant="scrollable" allowScrollButtonsMobile>
          <Tab value="company" label={t('application.tabs.company')} id="tab-company" aria-controls="pane-company" />
          <Tab value="terms" label={t('application.tabs.terms')} id="tab-terms" aria-controls="pane-terms" />
          <Tab value="proof" label={t('application.tabs.proof')} id="tab-proof" aria-controls="pane-proof" />
        </Tabs>
        <Box role="tabpanel" id={`pane-${tab}`} aria-labelledby={`tab-${tab}`}>
          {tab === 'company' && (
            <DataRows
              rows={[
                { label: t('company.fields.legalName'), value: data.legalName },
                { label: t('application.address'), value: address },
                ...data.identifiers.map((i) => ({ label: t(`enum.identifier.${i.type}`), value: <Box component="span" sx={mono}>{i.value}</Box> })),
              ]}
            />
          )}
          {tab === 'terms' && (
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                {application.companyRoles.map((role) => (
                  <Chip key={role} label={roleName(role)} size="small" />
                ))}
              </Stack>
              {application.consents.length === 0 ? (
                <Typography color="text.secondary">{t('application.noConsents')}</Typography>
              ) : (
                <Stack component="ul" spacing={1} sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {application.consents.map((consent) => (
                    <Stack component="li" key={consent.agreementKey} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <CheckCircleOutlinedIcon sx={{ fontSize: 18, color: 'success.main' }} />
                      <span>{t('application.consent', { key: consent.agreementKey, version: consent.version, language: t(`enum.language.${consent.language}`), date: date(consent.givenAt) })}</span>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Stack>
          )}
          {tab === 'proof' && (
            <Typography>
              {attestation
                ? t('application.proofEbw', { date: date(attestation.verifiedAt), name: `${attestation.person.givenName} ${attestation.person.familyName}`, role: attestation.representation.role ?? '' })
                : application.documents.length
                  ? t('application.proofDocuments', { files: application.documents.map((d) => d.fileName).join(', ') })
                  : t('application.proofDocumentsNone')}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
