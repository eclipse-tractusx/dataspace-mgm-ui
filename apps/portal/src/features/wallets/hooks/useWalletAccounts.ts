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

import { useCallback, useEffect, useState } from 'react';
import type { C4M2Module, ListWalletAccountsResult, WalletAccountItem } from '@dataspace-mgm/c4-m2-core';
import { WALLETS_PERMISSIONS } from '../permissions';
import { useWalletAccess } from './useWalletAccess';
import type { WalletsBlocked } from './useWalletsAccess';

export type WalletAccountsState =
  | WalletsBlocked
  | {
      status: 'found';
      items: ReadonlyArray<WalletAccountItem>;
      /** The session has retrieve_wallet_credentials (hides the button only; the API checks it again). */
      mayRetrieve: boolean;
      c4m2: C4M2Module;
      /** Loads the list again, e.g. after a retrieval changed `credentialsState`. */
      reload: () => void;
    }
  | Exclude<ListWalletAccountsResult, { status: 'found' }>;

/** The technical users with wallet access and their wallet accounts (C4-M2 `getWalletAccount` per technical user). */
export function useWalletAccounts(): WalletAccountsState {
  const access = useWalletAccess(WALLETS_PERMISSIONS.viewDataspaceWallet);
  const c4m2 = access.status === 'ready' ? access.c4m2 : null;
  const companyId = access.status === 'ready' ? access.session.companyId : null;
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<{ c4m2: C4M2Module; companyId: string | null; value: ListWalletAccountsResult } | null>(null);

  useEffect(() => {
    if (!c4m2) {
      return;
    }
    let active = true;
    c4m2.listWalletAccounts.execute(companyId).then((value) => {
      if (active) {
        setResult({ c4m2, companyId, value });
      }
    });
    return () => {
      active = false;
    };
  }, [c4m2, companyId, version]);
  const reload = useCallback(() => setVersion((value) => value + 1), []);

  if (access.status !== 'ready') {
    return access;
  }
  // While it reloads, the list stays on the screen (the detail and the access data stay where they are).
  const shown = result && result.c4m2 === access.c4m2 && result.companyId === companyId ? result.value : null;
  if (!shown) {
    return { status: 'loading' };
  }
  if (shown.status !== 'found') {
    return shown;
  }
  return {
    status: 'found',
    items: shown.items,
    mayRetrieve: access.session.permissions.includes(WALLETS_PERMISSIONS.retrieveWalletCredentials),
    c4m2: access.c4m2,
    reload,
  };
}
