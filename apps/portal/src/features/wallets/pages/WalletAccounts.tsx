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
import { C4M2_PROBLEM } from '@dataspace-mgm/c4-m2-core';
import { Alert, Typography } from '@dataspace-mgm/ui-mui';
import { Trans, useTranslation } from 'react-i18next';
import { BlockedState } from '../components/BlockedState';
import { NoAccountsCard } from '../components/NoAccountsCard';
import { PageFailedAlert } from '../components/PageFailedAlert';
import { ProblemAlert } from '../components/ProblemAlert';
import { WalletAccountsView } from '../components/WalletAccountsView';
import { WalletsPage } from '../components/WalletsPage';
import { useWalletAccounts } from '../hooks/useWalletAccounts';
import { WALLETS_NS } from '../i18n';
import { WALLETS_PATHS } from '../paths';

/**
 * "Wallet accounts" (C4-M2 `getWalletAccount`, `retrieveWalletAccountCredentials`): the technical users with wallet
 * access and, for the selected one, its wallet account and the one-time retrieval of its access data.
 */
export default function WalletAccounts() {
  const { t } = useTranslation(WALLETS_NS);
  const state = useWalletAccounts();

  let body: ReactNode;
  switch (state.status) {
    case 'loading':
    case 'signed-out':
    case 'session-failed':
    case 'not-connected':
    case 'no-access':
      body = (
        <BlockedState state={state} loadingLabel={t('walletAccounts.loading')} noAccess={t('walletAccounts.noAccess')} returnTo={WALLETS_PATHS.walletAccounts} loadingBlocks={2} />
      );
      break;
    case 'forbidden':
      body = (
        <ProblemAlert severity="error" problemType={C4M2_PROBLEM.forbidden}>
          {t('walletAccounts.forbidden')}
        </ProblemAlert>
      );
      break;
    case 'no-company':
      body = <Alert severity="info">{t('walletAccounts.noCompany')}</Alert>;
      break;
    case 'failed':
      body = <PageFailedAlert page="walletAccounts" error={state.error} />;
      break;
    default:
      body = (
        <>
          <Typography color="text.secondary" sx={{ maxWidth: 760, mb: 3.5 }}>
            <Trans t={t} i18nKey="walletAccounts.lead" components={{ strong: <strong /> }} />
          </Typography>
          {state.items.length ? <WalletAccountsView items={state.items} mayRetrieve={state.mayRetrieve} c4m2={state.c4m2} reload={state.reload} /> : <NoAccountsCard />}
        </>
      );
  }

  return (
    <WalletsPage overline={t('overline')} title={t('walletAccounts.title')}>
      {body}
    </WalletsPage>
  );
}
