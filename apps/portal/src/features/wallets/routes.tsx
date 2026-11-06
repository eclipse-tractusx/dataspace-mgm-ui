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

import { AccountBalanceWalletOutlinedIcon } from '@dataspace-mgm/ui-mui';
import type { FeatureConfig } from '../../types/routing';
import { walletsTranslations } from './i18n';
import AllCredentials from './pages/AllCredentials';
import Credential from './pages/Credential';
import WalletAccounts from './pages/WalletAccounts';
import WalletsLanding from './pages/WalletsLanding';
import YourCredentials from './pages/YourCredentials';

/**
 * Wallets as a service. Its backend modules are C4-M1 Credentials and C4-M2 Dataspace Wallet Interface; the version is
 * the API version of the modules. A proof of concept on the in-memory adapters (skill build-poc): routed only in mock
 * mode, "coming soon" otherwise.
 */
export const walletsFeature: FeatureConfig = {
  id: 'wallets',
  version: '0.2.0',
  category: 'as-a-service',
  icon: <AccountBalanceWalletOutlinedIcon />,
  navigationPath: '/wallets',
  disabled: false,
  stage: 'poc',
  translations: walletsTranslations,
  routes: [
    // The dataspace wallet with view_dataspace_wallet (C4-M2 getWallet), else the first tab the person may see.
    { path: 'wallets', element: <WalletsLanding />, meta: { title: 'landing.title' } },
    // Permission view_credentials (C4-M1 listCompanyCredentials).
    { path: 'wallets/credentials', element: <YourCredentials />, meta: { title: 'yourCredentials.title' } },
    // Permission manage_credentials (C4-M1 listCredentials, confirmRevocation).
    { path: 'wallets/all-credentials', element: <AllCredentials />, meta: { title: 'allCredentials.title', description: 'allCredentials.lead' } },
    { path: 'wallets/all-credentials/:credentialId', element: <Credential />, meta: { title: 'credential.title' } },
    // Permission view_dataspace_wallet (C4-M2 getWalletAccount); the retrieval needs retrieve_wallet_credentials.
    { path: 'wallets/wallet-accounts', element: <WalletAccounts />, meta: { title: 'walletAccounts.title' } },
  ],
};
