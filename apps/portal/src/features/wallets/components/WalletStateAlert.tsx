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

import type { WalletAnemic } from '@dataspace-mgm/c4-m2-core';
import { Alert, Box, ErrorOutlineOutlinedIcon, HourglassTopOutlinedIcon } from '@dataspace-mgm/ui-mui';
import { Trans, useTranslation } from 'react-i18next';
import { WALLETS_NS } from '../i18n';
import { MONO } from '../utils/mono';

/** The alert above the wallet while its DID document is checked, or when it could not be set up (with the reason). */
export function WalletStateAlert({ wallet }: { wallet: WalletAnemic }) {
  const { t } = useTranslation(WALLETS_NS);
  if (wallet.status === 'VALIDATING') {
    return (
      <Alert severity="info" icon={<HourglassTopOutlinedIcon />} sx={{ mb: 3 }}>
        <Trans t={t} i18nKey="wallet.alert.validating" components={{ strong: <strong /> }} />
      </Alert>
    );
  }
  if (wallet.status === 'FAILED') {
    const reason = wallet.failureReason ? t(`walletFailure.${wallet.failureReason}`) : '';
    return (
      <Alert severity="error" role="alert" icon={<ErrorOutlineOutlinedIcon />} sx={{ mb: 3 }}>
        <div>
          <Trans t={t} i18nKey="wallet.alert.failed" values={{ reason }} components={{ strong: <strong /> }} />
        </div>
        {wallet.failureReason && (
          <Box component="code" sx={{ display: 'block', fontFamily: MONO, fontSize: '0.8125rem', mt: 0.5 }}>
            {t('wallet.alert.failureCode', { reason: wallet.failureReason })}
          </Box>
        )}
      </Alert>
    );
  }
  return null;
}
