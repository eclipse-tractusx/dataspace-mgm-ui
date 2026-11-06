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

import type { WalletAccountCredentialsAnemic } from '@dataspace-mgm/c4-m2-core';
import { Box, Button, WarningAmberOutlinedIcon, alpha, tractusx } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { WALLETS_NS } from '../i18n';
import { ValueBlock } from './ValueBlock';

interface AccessDataPanelProps {
  credentials: WalletAccountCredentialsAnemic;
  /** "I have entered them": the page forgets the access data. */
  onDone: () => void;
}

/**
 * The access data of a wallet account, inline under its detail (the one time they are shown): token address, client
 * ID, the client secret masked with show/hide and copy, DID and credential service.
 */
export function AccessDataPanel({ credentials, onDone }: AccessDataPanelProps) {
  const { t } = useTranslation(WALLETS_NS);
  return (
    <Box
      component="section"
      aria-label={t('walletAccounts.access.title')}
      sx={{
        display: 'grid',
        gap: 1.75,
        p: 2.5,
        border: 1,
        borderColor: 'primary.main',
        borderRadius: 1.25,
        bgcolor: 'background.default',
        boxShadow: `0 0 0 4px ${alpha(tractusx.orange, 0.12)}`,
      }}
    >
      <Box role="alert" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'warning.main', fontWeight: 600, fontSize: '0.875rem' }}>
        <WarningAmberOutlinedIcon fontSize="small" />
        {t('walletAccounts.access.once')}
      </Box>
      <ValueBlock label={t('walletAccounts.access.tokenUrl')} value={credentials.tokenUrl} />
      <ValueBlock label={t('walletAccounts.access.clientId')} value={credentials.clientId} />
      <ValueBlock label={t('walletAccounts.access.clientSecret')} value={credentials.clientSecret} secret />
      {credentials.did && <ValueBlock label={t('walletAccounts.access.did')} value={credentials.did} />}
      {credentials.credentialServiceUrl && <ValueBlock label={t('walletAccounts.access.credentialService')} value={credentials.credentialServiceUrl} />}
      <Box sx={{ mt: 0.5 }}>
        <Button variant="outlined" size="small" onClick={onDone}>
          {t('walletAccounts.access.done')}
        </Button>
      </Box>
    </Box>
  );
}
