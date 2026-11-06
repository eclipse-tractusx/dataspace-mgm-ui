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
import { AccountBalanceWalletOutlinedIcon, Box } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import type { WalletCompany } from '../hooks/useDataspaceWallet';
import { useTimeTexts } from '../hooks/useTimeTexts';
import { WALLETS_NS } from '../i18n';
import { MONO } from '../utils/mono';
import { WALLET_STATUS_TONE } from '../utils/walletTone';
import { PASS_LABEL_SX, PassCopyValue, PassField, PassIconSlot } from './PassParts';
import { PassSurface } from './PassSurface';
import { StatusPill } from './StatusPill';

/**
 * The dataspace wallet of the company as a carbon pass: the dataspace with "Dataspace wallet", the status, the company,
 * BPN, provider and activation date, and the DID in full with a copy button (no QR code: open point in the README).
 */
export function WalletPass({ wallet, company }: { wallet: WalletAnemic; company: WalletCompany }) {
  const { t } = useTranslation(WALLETS_NS);
  const time = useTimeTexts();
  const none = t('common.none');

  return (
    <PassSurface skin="carbon" muted={wallet.status === 'FAILED'} label={t('wallet.pass.label')}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <PassIconSlot>
          <AccountBalanceWalletOutlinedIcon />
        </PassIconSlot>
        <Box sx={{ flex: 1, minWidth: 0, fontWeight: 700, fontSize: '0.9375rem', lineHeight: 1.2 }}>
          {company.dataspaceName && <Box component="span" sx={{ display: 'block' }}>{company.dataspaceName}</Box>}
          <Box component="small" sx={{ display: 'block', fontWeight: 500, fontSize: '0.75rem', color: 'var(--pass-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {t('wallet.pass.kind')}
          </Box>
        </Box>
        <StatusPill tone={WALLET_STATUS_TONE[wallet.status]} label={t(`walletStatus.${wallet.status}`)} />
      </Box>

      <Box sx={{ display: 'grid', gap: '4px' }}>
        <Box component="span" sx={PASS_LABEL_SX}>
          {t('wallet.pass.company')}
        </Box>
        <Box
          component="strong"
          sx={{ fontWeight: 800, fontSize: '1.5rem', lineHeight: 1.15, letterSpacing: '-0.01em', overflowWrap: 'anywhere', ...(!company.name && { fontFamily: MONO }) }}
        >
          {company.name ?? company.bpn ?? none}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '14px 36px' }}>
        <PassField label={t('wallet.pass.bpn')} mono>
          {company.bpn ?? none}
        </PassField>
        <PassField label={t('wallet.pass.provider')}>{t(`walletProviderShort.${wallet.provider}`)}</PassField>
        <PassField label={t('wallet.pass.activeSince')}>{time.date(wallet.activatedAt)}</PassField>
      </Box>

      <Box sx={{ display: 'grid', gap: '4px', pt: 2, borderTop: '1px dashed var(--pass-line)' }}>
        <Box component="span" sx={PASS_LABEL_SX}>
          {t('wallet.pass.did')}
        </Box>
        {wallet.did ? (
          <PassCopyValue value={wallet.did} />
        ) : (
          <Box component="span" sx={{ color: 'var(--pass-muted)', fontStyle: 'italic', fontSize: '0.875rem' }}>
            {t('common.notKnown')}
          </Box>
        )}
      </Box>
    </PassSurface>
  );
}
