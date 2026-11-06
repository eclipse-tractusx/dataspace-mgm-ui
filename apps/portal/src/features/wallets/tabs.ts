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

import { WALLETS_PATHS } from './paths';
import { WALLETS_PERMISSIONS, type WalletsPermission } from './permissions';

/** A tab of the feature under the page title. */
export interface WalletsTab {
  path: string;
  /** i18n key of the feature namespace. */
  label: string;
  /** Shown only to a person with this permission (hiding only; the API checks it). */
  permission: WalletsPermission;
  /** Active only on its own path, not on the paths below it (the index route /wallets). */
  exact?: boolean;
}

/**
 * The feature tabs, in their order: the dataspace wallet, the credentials and the wallet accounts for the people of a
 * company, the credentials of all companies for OSP staff. The landing page opens the first one the person may see.
 */
export const WALLETS_TABS: ReadonlyArray<WalletsTab> = [
  { path: WALLETS_PATHS.landing, label: 'tabs.wallet', permission: WALLETS_PERMISSIONS.viewDataspaceWallet, exact: true },
  { path: WALLETS_PATHS.credentials, label: 'tabs.credentials', permission: WALLETS_PERMISSIONS.viewCredentials },
  { path: WALLETS_PATHS.walletAccounts, label: 'tabs.walletAccounts', permission: WALLETS_PERMISSIONS.viewDataspaceWallet },
  { path: WALLETS_PATHS.allCredentials, label: 'tabs.allCredentials', permission: WALLETS_PERMISSIONS.manageCredentials },
];

/** The tabs a person with these permission keys sees. */
export const visibleTabs = (permissions: ReadonlyArray<string>): ReadonlyArray<WalletsTab> =>
  WALLETS_TABS.filter((tab) => permissions.includes(tab.permission));

/** Whether `tab` is the tab of `pathname` (its path, or a path below it unless the tab is exact). */
export const matchesTab = (tab: WalletsTab, pathname: string): boolean =>
  pathname === tab.path || (!tab.exact && pathname.startsWith(`${tab.path}/`));
