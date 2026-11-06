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

import type { AttestationSummaryAnemic } from '@dataspace-mgm/c1-m2-core';
import { Box, Card, CardContent, Chip, Stack, Typography, VerifiedUserOutlinedIcon } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useDate } from '../hooks/useOnboarding';
import { ONBOARDING_NS } from '../i18n';
import { Field } from './Field';
import { IconTile } from './IconTile';

/** What the Business Wallet confirmed: the extract of the verification attestation (AttestationSummary). */
export function AttestationCard({ attestation }: { attestation: AttestationSummaryAnemic }) {
  const { t } = useTranslation(ONBOARDING_NS);
  const date = useDate();
  const { person, representation } = attestation;
  return (
    <Card>
      <CardContent sx={{ p: { xs: 3, md: 3.5 }, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <IconTile>
          <VerifiedUserOutlinedIcon />
        </IconTile>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h3" component="h2" sx={{ fontSize: 20, fontWeight: 700 }}>
              {t('company.verifiedTitle')}
            </Typography>
            <Chip
              label={t(representation.confirmed ? 'company.representationConfirmed' : 'company.representationNotConfirmed')}
              color={representation.confirmed ? 'success' : 'warning'}
              variant="outlined"
              size="small"
              sx={{ alignSelf: 'flex-start' }}
            />
          </Stack>
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
            <Field name={t('company.representative')}>{`${person.givenName} ${person.familyName}`}</Field>
            {representation.role && (
              <Field name={t('company.role')}>{t('company.roleUntil', { role: representation.role, date: date(representation.validUntil) })}</Field>
            )}
            <Field name={t('company.verifiedOn')}>{date(attestation.verifiedAt)}</Field>
            <Field name={t('company.validUntil')}>{date(attestation.expiresAt)}</Field>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
