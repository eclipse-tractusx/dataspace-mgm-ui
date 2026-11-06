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
import { Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useTimeTexts } from '../hooks/useTimeTexts';
import { WALLETS_NS } from '../i18n';

/** The line under a status: the message of the issuer, what to do by hand, or how long an order is open. */
export function StatusNote({ credential }: { credential: CredentialDetailAnemic }) {
  const { t } = useTranslation(WALLETS_NS);
  const time = useTimeTexts();
  switch (credential.status) {
    case 'FAILED':
      return credential.failureReason ? (
        <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
          {credential.failureReason}
        </Typography>
      ) : null;
    case 'REVOCATION_PENDING':
      return (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.8125rem' }}>
          {t('note.revokeByHand')}
        </Typography>
      );
    case 'REQUESTED':
      return credential.requestedAt ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.8125rem' }}>
          {credential.attempt > 1
            ? t('note.openForAttempt', { duration: time.duration(credential.requestedAt), attempt: credential.attempt })
            : t('note.openFor', { duration: time.duration(credential.requestedAt) })}
        </Typography>
      ) : null;
    default:
      return null;
  }
}
