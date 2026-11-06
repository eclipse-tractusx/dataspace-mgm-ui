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

import { AccountBalanceWalletOutlinedIcon, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { ONBOARDING_NS } from '../i18n';

/** The wallet step: what the EBW-Connector asks the wallets for, then "Open wallet". */
export function WalletDialog({ open, waiting, onOpenWallet, onClose }: { open: boolean; waiting: boolean; onOpenWallet: () => void; onClose: () => void }) {
  const { t } = useTranslation(ONBOARDING_NS);
  return (
    <Dialog open={open} onClose={waiting ? undefined : onClose} aria-labelledby="wallet-title" maxWidth="sm" fullWidth>
      <DialogTitle id="wallet-title">{t('wallet.title')}</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">{t('wallet.intro')}</Typography>
        <Box component="ol" sx={{ pl: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <li>{t('wallet.pid')}</li>
          <li>{t('wallet.mandate')}</li>
          <li>{t('wallet.lpid')}</li>
        </Box>
        {waiting && (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }} role="status">
            <CircularProgress size={20} />
            <Typography>{t('wallet.waiting')}</Typography>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={onClose} disabled={waiting}>
          {t('cancel')}
        </Button>
        <Button variant="contained" startIcon={<AccountBalanceWalletOutlinedIcon />} onClick={onOpenWallet} disabled={waiting}>
          {t('wallet.openWallet')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
