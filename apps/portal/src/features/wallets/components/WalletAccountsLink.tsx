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

import { Box, Card, ChevronRightOutlinedIcon, KeyOutlinedIcon, Typography, alpha, tractusx } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { WALLETS_NS } from '../i18n';
import { WALLETS_PATHS } from '../paths';

/** The action card "Wallet accounts — N technical users can sign in", a link to the wallet accounts page. */
export function WalletAccountsLink({ count }: { count: number | null }) {
  const { t } = useTranslation(WALLETS_NS);
  return (
    <Card
      component={RouterLink}
      to={WALLETS_PATHS.walletAccounts}
      sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '18px 20px', textDecoration: 'none', color: 'inherit', '&:hover': { borderColor: 'primary.main' } }}
    >
      <Box aria-hidden sx={{ width: 40, height: 40, borderRadius: '50%', display: 'grid', placeItems: 'center', flex: '0 0 auto', bgcolor: alpha(tractusx.orange, 0.15), color: 'primary.main' }}>
        <KeyOutlinedIcon />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography component="span" sx={{ display: 'block', fontWeight: 600, fontSize: '1.0625rem' }}>
          {t('wallet.accountsLink.title')}
        </Typography>
        <Typography component="span" color="text.secondary" sx={{ fontSize: '0.9375rem' }}>
          {count === null ? t('wallet.accountsLink.unknown') : t('wallet.accountsLink.count', { count })}
        </Typography>
      </Box>
      <ChevronRightOutlinedIcon aria-hidden />
    </Card>
  );
}
