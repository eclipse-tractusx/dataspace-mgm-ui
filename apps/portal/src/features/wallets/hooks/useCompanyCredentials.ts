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
import type { CredentialStatusAnemic, ListCompanyCredentialsResult } from '@dataspace-mgm/c4-m1-core';
import { WALLETS_PERMISSIONS } from '../permissions';
import { useUseCaseResult } from './useUseCaseResult';
import { useWalletsAccess, type WalletsBlocked } from './useWalletsAccess';

export type CompanyCredentialsState =
  | WalletsBlocked
  /** `bpn` of the session: the primary field of the BPN credential pass (CredentialStatusView has no BPN). */
  | { status: 'found'; credentials: ReadonlyArray<CredentialStatusAnemic>; bpn: string | null }
  | Exclude<ListCompanyCredentialsResult, { status: 'found' }>;

/** The credentials of the signed-in person's company (C4-M1 `listCompanyCredentials`, permission view_credentials). */
export function useCompanyCredentials(): CompanyCredentialsState {
  const access = useWalletsAccess(WALLETS_PERMISSIONS.viewCredentials);
  const c4m1 = access.status === 'ready' ? access.c4m1 : null;
  const companyId = access.status === 'ready' ? access.session.companyId : null;
  const run = useMemo(() => (c4m1 ? () => c4m1.listCompanyCredentials.execute(companyId) : null), [c4m1, companyId]);
  const result = useUseCaseResult(run);

  if (access.status !== 'ready') {
    return access;
  }
  if (!result) {
    return { status: 'loading' };
  }
  return result.status === 'found' ? { ...result, bpn: access.session.bpn } : result;
}
