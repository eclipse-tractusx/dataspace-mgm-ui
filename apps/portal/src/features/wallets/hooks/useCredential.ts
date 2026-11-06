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
import type { ConfirmRevocationResult, CredentialDetailAnemic, GetCredentialResult } from '@dataspace-mgm/c4-m1-core';
import { WALLETS_PERMISSIONS } from '../permissions';
import { useUseCaseResult } from './useUseCaseResult';
import { useWalletsAccess, type WalletsBlocked } from './useWalletsAccess';

export type CredentialState =
  | WalletsBlocked
  | Exclude<GetCredentialResult, { status: 'found' }>
  | {
      status: 'found';
      credential: CredentialDetailAnemic;
      /** C4-M1 `confirmRevocation`; on success the page shows the credential the API returned. */
      confirm: (note: string) => Promise<ConfirmRevocationResult>;
    };

/** One credential for OSP staff (`getCredential`, permission manage_credentials) and the confirmation of its revocation. */
export function useCredential(credentialId: string): CredentialState {
  const access = useWalletsAccess(WALLETS_PERMISSIONS.manageCredentials);
  const c4m1 = access.status === 'ready' ? access.c4m1 : null;
  const result = useUseCaseResult(useMemo(() => (c4m1 ? () => c4m1.getCredential.execute(credentialId) : null), [c4m1, credentialId]));
  const [confirmed, setConfirmed] = useState<CredentialDetailAnemic | null>(null);

  const confirm = useCallback(
    async (note: string): Promise<ConfirmRevocationResult> => {
      if (!c4m1) {
        return { status: 'forbidden' };
      }
      const outcome = await c4m1.confirmRevocation.execute(credentialId, note);
      if (outcome.status === 'confirmed') {
        setConfirmed(outcome.credential);
      }
      return outcome;
    },
    [c4m1, credentialId],
  );

  if (access.status !== 'ready') {
    return access;
  }
  if (!result) {
    return { status: 'loading' };
  }
  if (result.status !== 'found') {
    return result;
  }
  const credential = confirmed?.id === result.credential.id ? confirmed : result.credential;
  return { status: 'found', credential, confirm };
}
