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
import type { CompanyDetailAnemic } from '@dataspace-mgm/c3-m1-core';
import { Card, CardContent, Chip, Grid, Stack, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../../i18n';
import { formatDate, formatDateTime, shortId } from '../../utils/format';
import { AddressLines } from '../AddressLines';
import { CopyableValue } from '../CopyableValue';
import { Field } from '../Field';
import { IdentifierList } from '../IdentifierList';
import { KeyValues } from './KeyValues';

/** The main column: core data and identifiers (configurator choice layout=sections). */
export function CompanyMainSections({ company }: { company: CompanyDetailAnemic }) {
  const { t, i18n } = useTranslation(PARTICIPANTS_NS);
  return (
    <Stack spacing={2}>
      <Card variant="outlined" component="section" aria-labelledby="core-title">
        <CardContent>
          <Typography id="core-title" variant="h3" component="h2" sx={{ fontSize: 20, mb: 2 }}>{t('detail.coreData')}</Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}><Field name={t('fields.name')}>{company.name}</Field></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Field name={t('fields.shortName')}>{company.shortName ?? t('profile.noShortName')}</Field></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Field name={t('fields.address')}><AddressLines address={company.postalAddress} /></Field></Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Field name={t('fields.coreData')}>
                {t(`coreDataSource.${company.coreDataSource}`)}
                <Typography variant="body2" color="text.secondary">{t('profile.verifiedAt', { date: formatDateTime(company.coreDataVerifiedAt, i18n.language) })}</Typography>
                {company.verificationRef && <Typography variant="body2" color="text.secondary">{t('detail.verification', { id: shortId(company.verificationRef) })}</Typography>}
              </Field>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card variant="outlined" component="section" aria-labelledby="ids-title">
        <CardContent>
          <Typography id="ids-title" variant="h3" component="h2" sx={{ fontSize: 20, mb: 2 }}>{t('fields.identifiers')}</Typography>
          <IdentifierList identifiers={company.identifiers} />
        </CardContent>
      </Card>
    </Stack>
  );
}

/** The side column: company roles and the record of the company. */
export function CompanySideSections({ company }: { company: CompanyDetailAnemic }) {
  const { t, i18n } = useTranslation(PARTICIPANTS_NS);
  const date = (value: string | null) => formatDateTime(value, i18n.language);
  const record: Array<[string, ReactNode]> = [
    [t('detail.companyId'), <CopyableValue key="id" value={company.id} empty="–" />],
    [t('detail.application'), company.applicationId ? <CopyableValue key="app" value={company.applicationId} empty="–" /> : t('detail.seedData')],
    [t('detail.created'), date(company.createdAt)],
    [t('detail.bpnAssigned'), date(company.bpnAssignedAt)],
    [t('detail.activated'), date(company.activatedAt)],
    [t('detail.changed'), date(company.changedAt)],
  ];
  if (company.deactivatedAt) {
    record.push([t('detail.deactivated'), `${date(company.deactivatedAt)}${company.deactivationReason ? ` · ${t(`deactivationReason.${company.deactivationReason}`)}` : ''}`]);
  }
  if (company.reactivatedAt) {
    record.push([t('detail.reactivated'), date(company.reactivatedAt)]);
  }
  if (company.rejectedAt) {
    record.push([t('detail.rejected'), date(company.rejectedAt)]);
  }
  return (
    <Stack spacing={2}>
      <Card variant="outlined" component="section" aria-labelledby="roles-title">
        <CardContent>
          <Typography id="roles-title" variant="h3" component="h2" sx={{ fontSize: 18, mb: 2 }}>{t('fields.roles')}</Typography>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            {company.companyRoles.length
              ? company.companyRoles.map((role) => <Chip key={role} size="small" label={t(`roles.${role}`, { defaultValue: role })} />)
              : <Typography color="text.secondary">{t('companies.noActiveRoles')}</Typography>}
          </Stack>
          {company.activatedAt && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{t('detail.since', { date: formatDate(company.activatedAt, i18n.language) })}</Typography>}
        </CardContent>
      </Card>
      <Card variant="outlined" component="section" aria-labelledby="record-title">
        <CardContent>
          <Typography id="record-title" variant="h3" component="h2" sx={{ fontSize: 18, mb: 2 }}>{t('detail.record')}</Typography>
          <KeyValues rows={record} />
        </CardContent>
      </Card>
    </Stack>
  );
}
