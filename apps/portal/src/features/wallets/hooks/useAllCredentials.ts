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

import { useCallback, useMemo, useState } from 'react';
import type {
  C4M1Failed,
  CredentialQuery,
  CredentialStatus,
  CredentialStatusCount,
  CredentialType,
  ListCredentialsResult,
  ListOpenItemsResult,
} from '@dataspace-mgm/c4-m1-core';
import { WALLETS_PERMISSIONS } from '../permissions';
import { CREDENTIALS_PAGE_SIZE, FILTER_STATUSES, NO_FILTERS, type CredentialFilters } from './credentialFilters';
import { useUseCaseResult } from './useUseCaseResult';
import { useWalletsAccess, type WalletsBlocked } from './useWalletsAccess';

export interface AllCredentialsLoaded {
  status: 'loaded';
  attention: Extract<ListOpenItemsResult, { status: 'found' }>;
  counts: ReadonlyArray<CredentialStatusCount>;
  /** null while the list for the current filters loads. */
  list: ListCredentialsResult | null;
  filters: CredentialFilters;
  toggleStatus: (status: CredentialStatus) => void;
  toggleOpenOnly: () => void;
  setCredentialType: (credentialType: CredentialType | null) => void;
  setPage: (page: number) => void;
  reset: () => void;
}

export type AllCredentialsState =
  | WalletsBlocked
  | { status: 'forbidden' }
  | C4M1Failed
  | AllCredentialsLoaded;

/**
 * "Credentials of all companies" for OSP staff (permission manage_credentials): the "Needs attention" queue
 * (`listOpenItems`), the counts of the status chips (`countCredentialsByStatus`) and one page of `listCredentials` for
 * the filters. "Open for more than X h" sends the `requestedBefore` the queue used, so both agree.
 */
export function useAllCredentials(): AllCredentialsState {
  const access = useWalletsAccess(WALLETS_PERMISSIONS.manageCredentials);
  const c4m1 = access.status === 'ready' ? access.c4m1 : null;
  const [filters, setFilters] = useState<CredentialFilters>(NO_FILTERS);

  const attention = useUseCaseResult(useMemo(() => (c4m1 ? () => c4m1.listOpenItems.execute() : null), [c4m1]));
  const counts = useUseCaseResult(
    useMemo(() => (c4m1 ? () => c4m1.countCredentialsByStatus.execute(FILTER_STATUSES) : null), [c4m1]),
  );
  const openBefore = attention?.status === 'found' && filters.openOnly ? attention.requestedBefore : null;
  const list = useUseCaseResult(
    useMemo(() => {
      if (!c4m1 || (filters.openOnly && !openBefore)) {
        return null;
      }
      const query: CredentialQuery = {
        status: openBefore ? ['REQUESTED'] : filters.status,
        credentialType: filters.credentialType ?? undefined,
        requestedBefore: openBefore ?? undefined,
        page: filters.page,
        size: CREDENTIALS_PAGE_SIZE,
      };
      return () => c4m1.listCredentials.execute(query);
    }, [c4m1, filters, openBefore]),
  );

  // A status chip and "open orders" exclude each other: an open order is always REQUESTED.
  const toggleStatus = useCallback(
    (status: CredentialStatus) =>
      setFilters((current) => ({
        ...NO_FILTERS,
        credentialType: current.credentialType,
        status: current.status.includes(status) ? current.status.filter((item) => item !== status) : [...current.status, status],
      })),
    [],
  );
  const toggleOpenOnly = useCallback(
    () => setFilters((current) => ({ ...NO_FILTERS, credentialType: current.credentialType, openOnly: !current.openOnly })),
    [],
  );
  const setCredentialType = useCallback(
    (credentialType: CredentialType | null) => setFilters((current) => ({ ...current, credentialType, page: 0 })),
    [],
  );
  const setPage = useCallback((page: number) => setFilters((current) => ({ ...current, page })), []);
  const reset = useCallback(() => setFilters(NO_FILTERS), []);

  if (access.status !== 'ready') {
    return access;
  }
  if (!attention || !counts) {
    return { status: 'loading' };
  }
  if (attention.status === 'forbidden' || counts.status === 'forbidden' || list?.status === 'forbidden') {
    return { status: 'forbidden' };
  }
  if (attention.status === 'failed') {
    return { status: 'failed', error: attention.error };
  }
  if (counts.status === 'failed') {
    return { status: 'failed', error: counts.error };
  }
  return { status: 'loaded', attention, counts: counts.counts, list, filters, toggleStatus, toggleOpenOnly, setCredentialType, setPage, reset };
}
