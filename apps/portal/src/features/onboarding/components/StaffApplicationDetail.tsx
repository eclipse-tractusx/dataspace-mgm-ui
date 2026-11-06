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

import type { ApplicationWithReviewAnemic } from '@dataspace-mgm/c1-m2-core';
import { Box, DescriptionOutlinedIcon, Link, Stack, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useDate } from '../hooks/useOnboarding';
import { ONBOARDING_NS } from '../i18n';
import { DataRows } from './DataRows';
import { mono } from './styles';

const heading = { fontSize: 18, fontWeight: 700 } as const;

/** One application for OSP staff (GET /osp/applications/{id}), inside the list's card. */
export function StaffApplicationDetail({ application, roleName, onOpenDocument }: { application: ApplicationWithReviewAnemic; roleName: (role: string) => string; onOpenDocument: (documentId: string) => void }) {
  const { t } = useTranslation(ONBOARDING_NS);
  const date = useDate();
  const { companyData: data } = application;
  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
        <Stack spacing={1}>
          <Typography variant="h3" component="h3" sx={heading}>
            {t('staff.application')}
          </Typography>
          <DataRows
            rows={[
              { label: t('staff.columns.kind'), value: t(`enum.kind.${application.kind}`) },
              { label: t('staff.columns.verification'), value: t(`enum.verification.${application.verification}`) },
              { label: t('staff.roles'), value: application.companyRoles.map(roleName).join(', ') },
              { label: t('staff.columns.created'), value: date(application.createdAt) },
              { label: t('staff.columns.submitted'), value: date(application.submittedAt) },
              { label: t('staff.applicant'), value: `${application.applicant.givenName} ${application.applicant.familyName}` },
              { label: t('staff.reviewCase'), value: t(`enum.reviewStatus.${application.reviewStatus}`) },
              { label: t('staff.companyId'), value: <Box component="span" sx={mono}>{application.companyId}</Box> },
            ]}
          />
        </Stack>
        <Stack spacing={1}>
          <Typography variant="h3" component="h3" sx={heading}>
            {t('staff.companyData')}
          </Typography>
          <DataRows
            rows={[
              { label: t('application.address'), value: `${data.address.streetName} ${data.address.streetNumber ?? ''}, ${data.address.postalCode ?? ''} ${data.address.city}`.replace(/\s+/g, ' ') },
              ...data.identifiers.map((i) => ({ label: t(`enum.identifier.${i.type}`), value: <Box component="span" sx={mono}>{i.value}</Box> })),
            ]}
          />
          {application.comparison.length > 0 && (
            <>
              <Typography variant="h3" component="h3" sx={{ ...heading, pt: 2 }}>
                {t('staff.comparison')}
              </Typography>
              <Stack component="ul" spacing={0.5} sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {application.comparison.map((entry) => (
                  <li key={entry.field}>{t('staff.comparisonEntry', { field: t(`enum.field.${entry.field}`), result: t(`enum.comparison.${entry.result}`) })}</li>
                ))}
              </Stack>
            </>
          )}
          {application.documents.length > 0 && (
            <>
              <Typography variant="h3" component="h3" sx={{ ...heading, pt: 2 }}>
                {t('staff.documents')}
              </Typography>
              <Stack component="ul" spacing={0.5} sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {application.documents.map((document) => (
                  <Stack component="li" key={document.documentId} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <DescriptionOutlinedIcon sx={{ fontSize: 18 }} />
                    <Link component="button" type="button" onClick={() => onOpenDocument(document.documentId)}>
                      {document.fileName}
                    </Link>
                    <Typography variant="body2" color="text.secondary">
                      {t(`enum.documentType.${document.documentType}`)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </>
          )}
        </Stack>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {t('staff.decisionElsewhere')}
      </Typography>
    </Stack>
  );
}
