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
import { Box, Card, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { WALLETS_NS } from '../i18n';
import { CopyValue } from './CopyValue';

/** "For your connectors": the addresses a connector of the company needs to use the wallet, in full, to copy. */
export function ConnectorCard({ wallet }: { wallet: WalletAnemic }) {
  const { t } = useTranslation(WALLETS_NS);
  const rows: ReadonlyArray<{ label: string; value: string | null; empty?: string }> = [
    { label: t('wallet.connectors.credentialService'), value: wallet.credentialServiceUrl },
    { label: t('wallet.connectors.bdrs'), value: wallet.bdrsUrl },
    { label: t('wallet.connectors.sts'), value: wallet.stsTokenUrl, empty: t('wallet.connectors.stsPerAccount') },
    { label: t('wallet.connectors.didDocument'), value: wallet.didDocumentLocation },
  ];
  return (
    <Card component="section" aria-labelledby="wallet-connectors" sx={{ p: { xs: 3, md: 3.5 }, '&:hover': { boxShadow: 'none' } }}>
      <Typography id="wallet-connectors" variant="h2" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
        {t('wallet.connectors.title')}
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: '0.9375rem', mt: 0.5, mb: 2.5 }}>
        {t('wallet.connectors.lead')}
      </Typography>
      <Box component="dl" sx={{ m: 0, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'max-content minmax(0, 1fr)' }, gap: { xs: '4px 14px', sm: '10px 14px' }, fontSize: '0.875rem' }}>
        {rows.map((row) => (
          <Box key={row.label} sx={{ display: 'contents' }}>
            <Box component="dt" sx={{ color: 'text.secondary', mt: { xs: 1, sm: 0 } }}>
              {row.label}
            </Box>
            <Box component="dd" sx={{ m: 0, minWidth: 0 }}>
              <CopyValue value={row.value} empty={row.empty} />
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
