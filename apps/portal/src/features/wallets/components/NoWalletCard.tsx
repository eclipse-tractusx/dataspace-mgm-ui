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

import { AccountBalanceWalletOutlinedIcon, Box, Card, Typography, alpha, tractusx } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { WALLETS_NS } from '../i18n';
import { MONO } from '../utils/mono';

/** The empty card of a company without a dataspace wallet yet (404), with the Problem Details type. */
export function NoWalletCard({ problemType }: { problemType: string }) {
  const { t } = useTranslation(WALLETS_NS);
  return (
    <Card component="section" sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', display: 'grid', justifyItems: 'center', gap: 1.5, '&:hover': { boxShadow: 'none' } }}>
      <Box aria-hidden sx={{ width: 56, height: 56, borderRadius: '14px', display: 'grid', placeItems: 'center', bgcolor: alpha(tractusx.orange, 0.15), color: 'primary.main' }}>
        <AccountBalanceWalletOutlinedIcon />
      </Box>
      <Typography variant="h2" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
        {t('wallet.noWallet.title')}
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
        {t('wallet.noWallet.text')}
      </Typography>
      <Box component="code" sx={{ fontFamily: MONO, fontSize: '0.8125rem', color: 'text.secondary' }}>
        {problemType}
      </Box>
    </Card>
  );
}
