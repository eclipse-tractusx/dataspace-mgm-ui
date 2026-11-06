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

import { useMemo } from 'react';
import type { ListCompanyCredentialsResult } from '@dataspace-mgm/c4-m1-core';
import type { GetOwnWalletResult, WalletAnemic } from '@dataspace-mgm/c4-m2-core';
import { useCoreModules } from '../../../core/CoreModulesContext';
import { WALLETS_PERMISSIONS } from '../permissions';
import { useUseCaseResult } from './useUseCaseResult';
import { useWalletAccess } from './useWalletAccess';
import type { WalletsBlocked } from './useWalletsAccess';

/** The company on the wallet pass: C3-M1 `getOwnCompany`, else the BPN of the session (the Wallet has neither). */
export interface WalletCompany {
  name: string | null;
  bpn: string | null;
  /** C3-M1 `Company.dataspaceName`, the issuer line of the pass (the Wallet has no dataspace: open point). */
  dataspaceName: string | null;
}

/** The credentials column: C4-M1 `listCompanyCredentials`; hidden without view_credentials or without C4-M1. */
export type WalletCredentialsPart = { status: 'hidden' } | { status: 'loading' } | ListCompanyCredentialsResult;

export type DataspaceWalletState =
  | WalletsBlocked
  | {
      status: 'found';
      wallet: WalletAnemic;
      company: WalletCompany;
      credentials: WalletCredentialsPart;
      /** Technical users with wallet access (C4-M2 wallet accounts); null while loading or when it failed. */
      accountCount: number | null;
    }
  | Exclude<GetOwnWalletResult, { status: 'found' }>;

/**
 * The dataspace wallet of the signed-in person's company (C4-M2 `getWallet`, permission view_dataspace_wallet), with
 * the company name (C3-M1), the credentials (C4-M1) and the number of wallet accounts for the cards around it.
 */
export function useDataspaceWallet(): DataspaceWalletState {
  const { c3m1, c4m1 } = useCoreModules();
  const access = useWalletAccess(WALLETS_PERMISSIONS.viewDataspaceWallet);
  const ready = access.status === 'ready' ? access : null;
  const c4m2 = ready?.c4m2 ?? null;
  const companyId = ready?.session.companyId ?? null;
  const mayViewCredentials = !!ready?.session.permissions.includes(WALLETS_PERMISSIONS.viewCredentials);

  const wallet = useUseCaseResult(useMemo(() => (c4m2 ? () => c4m2.getOwnWallet.execute(companyId) : null), [c4m2, companyId]));
  const company = useUseCaseResult(useMemo(() => (c4m2 && companyId ? () => c3m1.getOwnCompany.execute(companyId) : null), [c3m1, c4m2, companyId]));
  const accounts = useUseCaseResult(useMemo(() => (c4m2 && companyId ? () => c4m2.listWalletAccounts.execute(companyId) : null), [c4m2, companyId]));
  const credentials = useUseCaseResult(
    useMemo(() => (c4m2 && c4m1 && mayViewCredentials ? () => c4m1.listCompanyCredentials.execute(companyId) : null), [c4m1, c4m2, companyId, mayViewCredentials]),
  );

  if (!ready) {
    return access as WalletsBlocked;
  }
  if (!wallet || (companyId && !company)) {
    return { status: 'loading' };
  }
  if (wallet.status !== 'found') {
    return wallet;
  }
  const found = company?.status === 'found' ? company.company : null;
  return {
    status: 'found',
    wallet: wallet.wallet,
    company: { name: found?.name ?? null, bpn: found?.bpn ?? ready.session.bpn, dataspaceName: found?.dataspaceName ?? null },
    credentials: !c4m1 || !mayViewCredentials ? { status: 'hidden' } : (credentials ?? { status: 'loading' }),
    accountCount: accounts?.status === 'found' ? accounts.items.length : null,
  };
}
