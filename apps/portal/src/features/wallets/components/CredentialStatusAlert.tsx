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

import type { CredentialDetailAnemic } from '@dataspace-mgm/c4-m1-core';
import { Alert, Box, ErrorOutlineOutlinedIcon, HourglassTopOutlinedIcon, PendingActionsOutlinedIcon, Typography } from '@dataspace-mgm/ui-mui';
import { Trans, useTranslation } from 'react-i18next';
import { useTimeTexts } from '../hooks/useTimeTexts';
import { WALLETS_NS } from '../i18n';

/** What the status of the credential means for OSP staff: the issuer's message, a revocation by hand, or waiting. */
export function CredentialStatusAlert({ credential }: { credential: CredentialDetailAnemic }) {
  const { t } = useTranslation(WALLETS_NS);
  const time = useTimeTexts();
  switch (credential.status) {
    case 'FAILED':
      return (
        <Alert severity="error" icon={<ErrorOutlineOutlinedIcon />} sx={{ mb: 3 }}>
          <Box component="strong" sx={{ display: 'block' }}>
            {t('credential.alert.failedTitle')}
          </Box>
          <div>{credential.failureReason ?? t('common.notKnown')}</div>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t('credential.alert.failedNext')}
          </Typography>
        </Alert>
      );
    case 'REVOCATION_PENDING':
      return (
        <Alert severity="warning" icon={<PendingActionsOutlinedIcon />} sx={{ mb: 3 }}>
          <Trans t={t} i18nKey="credential.alert.pending" values={{ route: t(`route.${credential.route}`) }} components={{ strong: <strong /> }} />
        </Alert>
      );
    case 'REQUESTED':
      return (
        <Alert severity="info" icon={<HourglassTopOutlinedIcon />} sx={{ mb: 3 }}>
          {t('credential.alert.waiting', { dateTime: time.dateTime(credential.requestedAt), attempt: credential.attempt })}
        </Alert>
      );
    default:
      return null;
  }
}
