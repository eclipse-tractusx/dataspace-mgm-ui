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

import type { CompanyAnemic, OperationResult } from '@dataspace-mgm/c3-m1-core';
import {
  Box,
  BusinessOutlinedIcon,
  Card,
  CardContent,
  Chip,
  Divider,
  FactCheckOutlinedIcon,
  Grid,
  Link,
  Stack,
  Typography,
  VerifiedUserOutlinedIcon,
  alpha,
  tractusx,
} from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { PARTICIPANTS_NS } from '../../i18n';
import { participantsPath } from '../../paths';
import { formatDate, formatDateTime } from '../../utils/format';
import { AddressLines } from '../AddressLines';
import { CopyableValue } from '../CopyableValue';
import { Field } from '../Field';
import { IdentifierList } from '../IdentifierList';
import { StatusChip } from '../StatusChip';
import { ShortNameEditor } from './ShortNameEditor';

interface CompanyCardProps {
  company: CompanyAnemic;
  canEditShortName: boolean;
  canManageRoles: boolean;
  onSaveShortName: (shortName: string) => Promise<OperationResult<CompanyAnemic>>;
}

/** The company in one card (configurator choice layout=hero, verification=badge). */
export function CompanyCard({ company, canEditShortName, canManageRoles, onSaveShortName }: CompanyCardProps) {
  const { t, i18n } = useTranslation(PARTICIPANTS_NS);
  const wallet = company.coreDataSource === 'EBW';
  return (
    <Card sx={{ borderRadius: '10px', boxShadow: `0 0 32px ${alpha(tractusx.orange, 0.12)}` }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' }, mb: 4 }}>
          <Box aria-hidden sx={{ width: 52, height: 52, borderRadius: '10px', display: 'grid', placeItems: 'center', color: tractusx.orange, bgcolor: alpha(tractusx.orange, 0.15) }}>
            <BusinessOutlinedIcon />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography id="company-name" variant="h2" component="h2" sx={{ fontSize: 28 }}>
              {company.name}
            </Typography>
            {company.dataspaceName && <Typography color="text.secondary">{t('participantOf', { dataspace: company.dataspaceName })}</Typography>}
          </Box>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Chip
              size="small"
              icon={wallet ? <VerifiedUserOutlinedIcon /> : <FactCheckOutlinedIcon />}
              color={wallet ? 'success' : 'default'}
              variant="outlined"
              label={t(`coreDataSource.${company.coreDataSource}`)}
            />
            <StatusChip kind="status" value={company.status} />
          </Stack>
        </Stack>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Field name={t('fields.name')}>{company.name}</Field>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Field name={t('fields.shortName')}>
              <ShortNameEditor shortName={company.shortName} editable={canEditShortName} onSave={onSaveShortName} />
            </Field>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Field name={t('fields.bpn')}>
              <CopyableValue value={company.bpn} empty={t('bpnNotAssigned')} />
            </Field>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Field name={t('fields.address')}>
              <AddressLines address={company.postalAddress} />
            </Field>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Field name={t('fields.coreData')}>
              {t(`coreDataSource.${company.coreDataSource}`)}
              <Typography variant="body2" color="text.secondary">
                {t('profile.verifiedAt', { date: formatDateTime(company.coreDataVerifiedAt, i18n.language) })}
              </Typography>
            </Field>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Field name={t('fields.memberSince')}>{formatDate(company.activatedAt, i18n.language)}</Field>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field name={t('fields.identifiers')}>
              <IdentifierList identifiers={company.identifiers} />
            </Field>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field name={t('fields.roles')}>
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', pt: 0.5 }}>
                {company.companyRoles.map((role) => (
                  <Chip key={role} label={t(`roles.${role}`, { defaultValue: role })} size="small" />
                ))}
              </Stack>
              <Link component={RouterLink} to={participantsPath.companyRoles()} sx={{ display: 'inline-block', mt: 2 }}>
                {canManageRoles ? t('profile.manageRoles') : t('profile.seeRoles')}
              </Link>
            </Field>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
