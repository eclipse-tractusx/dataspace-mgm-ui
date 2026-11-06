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

import { Box, Button, Card, KeyOutlinedIcon, Typography, alpha, tractusx } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { WALLETS_NS } from '../i18n';

/** No technical user of the company has wallet access: where to create one (C2-M3, coming soon). */
export function NoAccountsCard() {
  const { t } = useTranslation(WALLETS_NS);
  return (
    <Card component="section" sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', display: 'grid', justifyItems: 'center', gap: 1.5, '&:hover': { boxShadow: 'none' } }}>
      <Box aria-hidden sx={{ width: 56, height: 56, borderRadius: '14px', display: 'grid', placeItems: 'center', bgcolor: alpha(tractusx.orange, 0.15), color: 'primary.main' }}>
        <KeyOutlinedIcon />
      </Box>
      <Typography variant="h2" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
        {t('walletAccounts.empty.title')}
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
        {t('walletAccounts.empty.text')}
      </Typography>
      {/* A disabled button gets no focus or hover, so the hint is a visible caption it points to. */}
      <Button variant="outlined" disabled aria-describedby="wallet-accounts-coming-soon">
        {t('walletAccounts.empty.technicalUsers')}
      </Button>
      <Typography id="wallet-accounts-coming-soon" variant="caption" color="text.secondary">
        {t('walletAccounts.empty.comingSoon')}
      </Typography>
    </Card>
  );
}
