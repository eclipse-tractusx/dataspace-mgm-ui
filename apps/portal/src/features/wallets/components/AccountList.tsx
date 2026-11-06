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

import type { WalletAccountItem } from '@dataspace-mgm/c4-m2-core';
import { Box, Card, alpha, tractusx } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { WALLETS_NS } from '../i18n';
import { MONO } from '../utils/mono';
import { CREDENTIALS_STATE_TONE } from '../utils/walletTone';
import { ToneChip } from './ToneChip';

interface AccountListProps {
  items: ReadonlyArray<WalletAccountItem>;
  selectedId: string;
  onSelect: (technicalUserId: string) => void;
}

/** The technical users with wallet access: name, client ID and the state of the access data; the selected one framed. */
export function AccountList({ items, selectedId, onSelect }: AccountListProps) {
  const { t } = useTranslation(WALLETS_NS);
  return (
    <Card component="nav" aria-label={t('walletAccounts.listLabel')} sx={{ p: 1, display: 'grid', gap: 0.5, '&:hover': { boxShadow: 'none' } }}>
      {items.map(({ technicalUser, account }) => {
        const selected = technicalUser.id === selectedId;
        return (
          <Box
            key={technicalUser.id}
            component="button"
            type="button"
            aria-current={selected ? 'true' : undefined}
            onClick={() => onSelect(technicalUser.id)}
            sx={{
              font: 'inherit',
              color: 'inherit',
              textAlign: 'left',
              display: 'grid',
              gap: 0.5,
              p: '12px 14px',
              borderRadius: 1,
              border: 1,
              borderColor: selected ? 'primary.main' : 'transparent',
              bgcolor: selected ? alpha(tractusx.orange, 0.1) : 'transparent',
              cursor: 'pointer',
              '&:hover': { bgcolor: alpha(tractusx.orange, 0.08) },
              '&:focus-visible': { outline: `2px solid ${tractusx.orange}`, outlineOffset: '2px' },
            }}
          >
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
              <Box component="span" sx={{ fontWeight: 600 }}>
                {technicalUser.name}
              </Box>
              {account ? (
                <ToneChip tone={CREDENTIALS_STATE_TONE[account.credentialsState]} label={t(`credentialsState.${account.credentialsState}`)} />
              ) : (
                <ToneChip tone="default" label={t('walletAccounts.noAccount')} />
              )}
            </Box>
            <Box component="span" sx={{ fontFamily: MONO, fontSize: '0.8125rem', color: 'text.secondary' }}>
              {technicalUser.iamClientId}
            </Box>
          </Box>
        );
      })}
    </Card>
  );
}
