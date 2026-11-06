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

import type { ApplicationAnemic, CompanyRoleInfoAnemic } from '@dataspace-mgm/c1-m2-core';
import { Box, Card, CardContent, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { ONBOARDING_NS } from '../i18n';
import { Field } from './Field';

/** "Your application" above the roles (decided: summary=top). */
export function ApplicationSummary({ application, roles }: { application: ApplicationAnemic; roles: ReadonlyArray<CompanyRoleInfoAnemic> }) {
  const { t } = useTranslation(ONBOARDING_NS);
  const roleNames = application.companyRoles.map((role) => roles.find((r) => r.role === role)?.name ?? role).join(', ');
  return (
    <Card component="section" aria-labelledby="summary-title">
      <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
        <Typography id="summary-title" variant="h3" component="h2" sx={{ fontSize: 20, fontWeight: 700, mb: 2 }}>
          {t('terms.summary')}
        </Typography>
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
          <Field name={t('terms.summaryCompany')}>{application.companyData.legalName}</Field>
          <Field name={t('terms.summaryProof')}>{t(`enum.verification.${application.verification}`)}</Field>
          <Field name={t('terms.summaryKind')}>{t(`enum.kind.${application.kind}`)}</Field>
          <Field name={t('terms.summaryRoles')}>{roleNames || '–'}</Field>
        </Box>
      </CardContent>
    </Card>
  );
}
