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
import { Alert, Box } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { BlockedState } from '../components/BlockedState';
import { ConnectorCard } from '../components/ConnectorCard';
import { NoWalletCard } from '../components/NoWalletCard';
import { PageFailedAlert } from '../components/PageFailedAlert';
import { ProblemAlert } from '../components/ProblemAlert';
import { WalletAccountsLink } from '../components/WalletAccountsLink';
import { WalletCredentials } from '../components/WalletCredentials';
import { WalletPass } from '../components/WalletPass';
import { WalletStateAlert } from '../components/WalletStateAlert';
import { WalletsPage } from '../components/WalletsPage';
import { useDataspaceWallet } from '../hooks/useDataspaceWallet';
import { WALLETS_NS } from '../i18n';
import { WALLETS_PATHS } from '../paths';

/** Below 1100 px the credentials column moves under the wallet. */
const NARROW = '@media (max-width: 1099.98px)';

/**
 * "Your dataspace wallet" (C4-M2 `getWallet`): on the left the wallet as a carbon pass, the addresses for the
 * connectors and the link to the wallet accounts; on the right the credentials (C4-M1) as a stack of passes.
 */
export default function DataspaceWallet() {
  const { t } = useTranslation(WALLETS_NS);
  const state = useDataspaceWallet();

  let body: ReactNode;
  switch (state.status) {
    case 'loading':
    case 'signed-out':
    case 'session-failed':
    case 'not-connected':
    case 'no-access':
      body = (
        <BlockedState state={state} loadingLabel={t('wallet.loading')} noAccess={t('wallet.noAccess')}
          noCompany={t('wallet.noCompany')}
          returnTo={WALLETS_PATHS.landing} loadingBlocks={2} />
      );
      break;
    case 'forbidden':
      body = (
        <ProblemAlert severity="error" problemType={C4M2_PROBLEM.forbidden}>
          {t('wallet.forbidden')}
        </ProblemAlert>
      );
      break;
    case 'no-company':
      body = <Alert severity="info">{t('wallet.noCompany')}</Alert>;
      break;
    case 'no-wallet':
      body = <NoWalletCard problemType={C4M2_PROBLEM.notFound} />;
      break;
    case 'failed':
      body = <PageFailedAlert page="wallet" error={state.error} />;
      break;
    default: {
      const withCredentials = state.credentials.status !== 'hidden';
      body = (
        <>
          <WalletStateAlert wallet={state.wallet} />
          <Box
            sx={{
              display: 'grid',
              gap: '40px',
              alignItems: 'start',
              gridTemplateColumns: withCredentials ? 'minmax(0, 1fr) minmax(0, 440px)' : 'minmax(0, 640px)',
              [NARROW]: { gridTemplateColumns: 'minmax(0, 1fr)' },
            }}
          >
            <Box sx={{ display: 'grid', gap: '20px', minWidth: 0 }}>
              <WalletPass wallet={state.wallet} company={state.company} />
              <ConnectorCard wallet={state.wallet} />
              <WalletAccountsLink count={state.accountCount} />
            </Box>
            {state.credentials.status !== 'hidden' && <WalletCredentials credentials={state.credentials} bpn={state.company.bpn} />}
          </Box>
        </>
      );
    }
  }

  return (
    <WalletsPage overline={t('overline')} title={t('wallet.title')}>
      {body}
    </WalletsPage>
  );
}
