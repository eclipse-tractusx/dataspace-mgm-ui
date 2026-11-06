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

import type { CompanyRoleStateAnemic } from '@dataspace-mgm/c3-m1-core';
import { AddIcon, Box, Button, Card, CardActions, CardContent, CheckIcon, RadioButtonUncheckedIcon, Stack, Typography, tractusx } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../../i18n';
import { formatDate } from '../../utils/format';
import { StatusChip } from '../StatusChip';
import { TermsLink } from './TermsLink';

interface RoleCardProps {
  role: CompanyRoleStateAnemic;
  canAdd: boolean;
  canRemove: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

/** One company role with its terms, always listed (configurator choice layout=cards, terms=always). */
export function RoleCard({ role, canAdd, canRemove, onAdd, onRemove }: RoleCardProps) {
  const { t, i18n } = useTranslation(PARTICIPANTS_NS);
  const name = t(`roles.${role.companyRole}`, { defaultValue: role.companyRole });
  return (
    <Card component="article" aria-label={name} variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '10px', borderColor: role.status === 'ACTIVE' ? tractusx.orange : undefined }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h3" component="h2" sx={{ fontSize: 20 }}>{name}</Typography>
          <StatusChip kind="roleStatus" value={role.status} />
        </Stack>
        <Typography color="text.secondary" sx={{ mb: 2 }}>{role.description}</Typography>
        <Typography variant="overline" color="text.secondary" component="h3">{t('roleCards.terms')}</Typography>
        <Stack component="ul" spacing={1} sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {role.agreements.map((agreement) => {
            const accepted = agreement.consentStatus === 'ACTIVE';
            return (
              <Stack component="li" key={agreement.agreementKey} direction="row" spacing={1}>
                {accepted ? <CheckIcon fontSize="small" color="success" aria-hidden /> : <RadioButtonUncheckedIcon fontSize="small" color="disabled" aria-hidden />}
                <Box>
                  <TermsLink agreement={agreement} />
                  <Typography variant="body2" color="text.secondary">
                    {accepted
                      ? t('roleCards.accepted', { version: agreement.consentedVersion, date: formatDate(agreement.consentedAt, i18n.language) })
                      : t('roleCards.notAccepted', { version: agreement.version })}
                  </Typography>
                </Box>
              </Stack>
            );
          })}
          {role.agreements.length === 0 && <Typography component="li" color="text.secondary">{t('roleCards.noTerms')}</Typography>}
        </Stack>
      </CardContent>
      {(canAdd || canRemove) && (
        <CardActions sx={{ px: 2, pb: 2 }}>
          {canAdd && <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={onAdd}>{t('roleCards.add')}</Button>}
          {canRemove && <Button variant="outlined" size="small" onClick={onRemove}>{t('roleCards.remove')}</Button>}
        </CardActions>
      )}
    </Card>
  );
}
