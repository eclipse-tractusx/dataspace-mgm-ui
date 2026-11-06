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
import type { GetCspRegistrationResult } from '@dataspace-mgm/c3-m2-core';
import { Alert, Box, Card, CardContent, Link, Stack, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { PARTICIPANTS_NS } from '../../i18n';
import { participantsPath } from '../../paths';
import { formatDateTime } from '../../utils/format';
import { CopyableValue } from '../CopyableValue';
import { LoadingState } from '../LoadingState';
import { failureText } from '../problems';
import { StatusChip } from '../StatusChip';
import { KeyValues } from './KeyValues';

/** "At the CSP": the registration of the company at the core service provider (C3-M2), in the side column (csp=side). */
export function CspSummaryCard({ companyId, result }: { companyId: string; result: GetCspRegistrationResult | null }) {
  const { t, i18n } = useTranslation(PARTICIPANTS_NS);
  let body: ReactNode;
  if (result === null) {
    body = <LoadingState text={t('csp.loading')} />;
  } else if (result.status === 'not-registered') {
    body = <Typography color="text.secondary">{t('csp.notRegisteredShort')}</Typography>;
  } else if (result.status === 'forbidden') {
    body = <Alert severity="info">{t('csp.forbidden')}</Alert>;
  } else if (result.status === 'failed') {
    body = <Alert severity="error">{failureText(t, result.error)}</Alert>;
  } else {
    const registration = result.registration;
    const rows: Array<[string, ReactNode]> = [
      [t('csp.registration'), <StatusChip key="s" kind="cspStatus" value={registration.status} />],
      [t('fields.bpn'), <CopyableValue key="b" value={registration.bpn} empty={t('bpnNotAssigned')} />],
      [t('csp.did'), registration.did ? <Box component="span" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{registration.did}</Box> : t('csp.notRegistered')],
      [t('csp.membership'), <StatusChip key="m" kind="membership" value={registration.membership} />],
      [t('csp.registeredAt'), formatDateTime(registration.registeredAt, i18n.language)],
      [t('csp.updatedAt'), formatDateTime(registration.updatedAt, i18n.language)],
    ];
    body = <KeyValues rows={rows} />;
  }
  return (
    <Card variant="outlined" component="section" aria-labelledby="csp-card-title">
      <CardContent>
        <Typography id="csp-card-title" variant="h3" component="h2" sx={{ fontSize: 18 }}>{t('csp.cardTitle')}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{t('csp.cardSubtitle')}</Typography>
        <Stack spacing={2}>
          {body}
          <Link component={RouterLink} to={participantsPath.cspRegistration(companyId)}>{t('csp.details')}</Link>
        </Stack>
      </CardContent>
    </Card>
  );
}
