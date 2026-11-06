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

import type { ReactNode } from 'react';
import type { WalletAccountItem } from '@dataspace-mgm/c4-m2-core';
import { Alert, Box, Button, Card, KeyOutlinedIcon, TaskAltOutlinedIcon, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useTimeTexts } from '../hooks/useTimeTexts';
import { WALLETS_NS } from '../i18n';
import { ACCOUNT_STATUS_TONE, CREDENTIALS_STATE_TONE } from '../utils/walletTone';
import { CopyValue } from './CopyValue';
import { Field, Fields } from './Field';
import { ToneChip } from './ToneChip';

interface AccountDetailProps {
  item: WalletAccountItem;
  /** "Retrieve access data", shown only when the access data are AVAILABLE and the person may retrieve them. */
  onRetrieve?: () => void;
  retrieving: boolean;
  /** The access data or the problem of the retrieval, below the detail. */
  children?: ReactNode;
}

const STATE_SEVERITY = { AVAILABLE: 'info', RETRIEVED: 'success', EXPIRED: 'warning', NONE: 'info' } as const;

/** The wallet account of the selected technical user: fields, the sentence on its access data and the retrieval. */
export function AccountDetail({ item, onRetrieve, retrieving, children }: AccountDetailProps) {
  const { t } = useTranslation(WALLETS_NS);
  const time = useTimeTexts();
  const { technicalUser, account } = item;

  return (
    <Card component="section" aria-labelledby="wallet-account" sx={{ p: { xs: 3, md: 3.5 }, display: 'grid', gap: 3, '&:hover': { boxShadow: 'none' } }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography id="wallet-account" variant="h2" sx={{ fontSize: '1.375rem', fontWeight: 600 }}>
            {technicalUser.name}
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: '0.9375rem', mt: 0.5 }}>
            {technicalUser.description ?? t('walletAccounts.noDescription')}
          </Typography>
        </Box>
        {account && <ToneChip tone={ACCOUNT_STATUS_TONE[account.status]} label={t(`accountStatus.${account.status}`)} />}
      </Box>

      <Fields columns={2}>
        <Field label={t('walletAccounts.fields.clientId')}>
          <CopyValue value={technicalUser.iamClientId} />
        </Field>
        <Field label={t('walletAccounts.fields.wallet')}>{account ? t(`walletProvider.${account.provider}`) : t('common.none')}</Field>
        <Field label={t('walletAccounts.fields.accessData')}>
          {account ? <ToneChip tone={CREDENTIALS_STATE_TONE[account.credentialsState]} label={t(`credentialsState.${account.credentialsState}`)} /> : t('common.none')}
        </Field>
        <Field label={t('walletAccounts.fields.retrievableUntil')}>
          {account?.credentialsState === 'AVAILABLE' ? time.dateTime(account.credentialsExpireAt) : t('common.none')}
        </Field>
        <Field label={t('walletAccounts.fields.created')}>{account ? time.dateTime(account.createdAt) : t('common.none')}</Field>
        <Field label={t('walletAccounts.fields.walletAccountRef')}>
          <CopyValue value={account?.walletAccountRef ?? null} />
        </Field>
      </Fields>

      {account ? (
        <Alert
          severity={STATE_SEVERITY[account.credentialsState]}
          icon={account.credentialsState === 'AVAILABLE' ? <KeyOutlinedIcon /> : account.credentialsState === 'RETRIEVED' ? <TaskAltOutlinedIcon /> : undefined}
        >
          {t(`walletAccounts.stateText.${account.credentialsState}`, { date: time.date(account.credentialsExpireAt) })}
        </Alert>
      ) : (
        <Alert severity="info">{t('walletAccounts.noAccountText')}</Alert>
      )}

      {onRetrieve && (
        <Box>
          <Button variant="contained" size="large" startIcon={<KeyOutlinedIcon />} onClick={onRetrieve} disabled={retrieving}>
            {t('walletAccounts.retrieve')}
          </Button>
        </Box>
      )}
      {children}
    </Card>
  );
}
