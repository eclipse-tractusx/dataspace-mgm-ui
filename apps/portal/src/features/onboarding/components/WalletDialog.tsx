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

import { useEffect, useState } from 'react';
import {
  AccountBalanceWalletOutlinedIcon,
  Box,
  Button,
  CheckCircleOutlinedIcon,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  QrCode,
  RadioButtonUncheckedIcon,
  Stack,
  Typography,
} from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { ONBOARDING_NS } from '../i18n';

/** What the wallets share, in the order the person confirms it. */
const APPROVALS = ['wallet.pidShared', 'wallet.mandateShared', 'wallet.lpidShared'] as const;

/** One approval of the wallet: pending, confirming now, or done. */
function ApprovalRow({ label, state }: { label: string; state: 'pending' | 'active' | 'done' }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minHeight: 28 }}>
      <Box sx={{ width: 22, display: 'flex', justifyContent: 'center' }}>
        {state === 'done' && <CheckCircleOutlinedIcon fontSize="small" sx={{ color: 'success.main' }} />}
        {state === 'active' && <CircularProgress size={18} />}
        {state === 'pending' && <RadioButtonUncheckedIcon fontSize="small" sx={{ color: 'text.disabled' }} />}
      </Box>
      <Typography color={state === 'pending' ? 'text.secondary' : 'text.primary'}>{label}</Typography>
    </Stack>
  );
}

/** How many approvals are done while `running`, one more every `stepMs`; back to 0 when it stops. */
function useApprovalProgress(running: boolean, stepMs: number | undefined): number {
  const [done, setDone] = useState(0);
  useEffect(() => {
    if (!running || !stepMs) {
      return;
    }
    const timers = APPROVALS.map((_, index) => setTimeout(() => setDone(index + 1), stepMs * (index + 1)));
    return () => {
      timers.forEach(clearTimeout);
      setDone(0);
    };
  }, [running, stepMs]);
  return running && stepMs ? done : 0;
}

/**
 * The wallet step: what the EBW-Connector asks the wallets for, then "Open wallet". With `walletRequest` (the
 * OpenID4VP request of the EBW-Connector) it also shows the request as a QR code, for the EUDI Wallet on a phone.
 * With `approvalStepMs` (mock mode) the waiting shows the approvals in the wallet one by one, then "approved".
 */
export function WalletDialog({
  open,
  waiting,
  walletRequest,
  approvalStepMs,
  onOpenWallet,
  onClose,
}: {
  open: boolean;
  waiting: boolean;
  walletRequest?: string;
  approvalStepMs?: number;
  onOpenWallet: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation(ONBOARDING_NS);
  const done = useApprovalProgress(waiting, approvalStepMs);
  const showApprovals = waiting && approvalStepMs !== undefined;
  return (
    <Dialog open={open} onClose={waiting ? undefined : onClose} aria-labelledby="wallet-title" maxWidth="sm" fullWidth>
      <DialogTitle id="wallet-title">{t('wallet.title')}</DialogTitle>
      <DialogContent>
        {showApprovals ? (
          <Stack spacing={1.25} sx={{ mb: 1 }} role="status" aria-live="polite">
            <Typography color="text.secondary" sx={{ mb: 0.5 }}>
              {t('wallet.approving')}
            </Typography>
            {APPROVALS.map((key, index) => (
              <ApprovalRow key={key} label={t(key)} state={index < done ? 'done' : index === done ? 'active' : 'pending'} />
            ))}
            {done === APPROVALS.length && (
              <Typography sx={{ pt: 1, fontWeight: 600, color: 'success.main' }}>{t('wallet.approved')}</Typography>
            )}
          </Stack>
        ) : (
          <>
            <Typography color="text.secondary">{t('wallet.intro')}</Typography>
            <Box component="ol" sx={{ pl: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <li>{t('wallet.pid')}</li>
              <li>{t('wallet.mandate')}</li>
              <li>{t('wallet.lpid')}</li>
            </Box>
            {walletRequest && (
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2.5}
                sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2, p: 2, borderRadius: '10px', border: 1, borderColor: 'divider' }}
              >
                <QrCode value={walletRequest} label={t('wallet.qrLabel')} size={148} />
                <Box>
                  <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{t('wallet.scanTitle')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('wallet.scanHint')}
                  </Typography>
                </Box>
              </Stack>
            )}
            {waiting && (
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }} role="status">
                <CircularProgress size={20} />
                <Typography>{t('wallet.waiting')}</Typography>
              </Stack>
            )}
          </>
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
