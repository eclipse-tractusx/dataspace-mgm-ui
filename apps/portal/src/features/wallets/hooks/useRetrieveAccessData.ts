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

import { useEffect, useRef, useState } from 'react';
import type { RetrieveWalletAccountCredentialsResult, WalletAccountCredentialsAnemic } from '@dataspace-mgm/c4-m2-core';
import { useCoreModules } from '../../../core/CoreModulesContext';

/** An answer of the retrieval other than the access data, shown under the account. */
export type RetrievalProblem = Exclude<RetrieveWalletAccountCredentialsResult, { status: 'retrieved' }>;

/**
 * The retrieval of the access data of one wallet account: ask first (they are shown once), retrieve, show them inline
 * until the person has entered them. The access data live only in this hook's state: never in Redux, the URL,
 * storage or logs. The page holds it, outside the switch over the list, so a reload of the list cannot drop them.
 */
export type RetrievalState =
  | { phase: 'idle' }
  | { phase: 'confirm'; technicalUserId: string }
  | { phase: 'retrieving'; technicalUserId: string }
  | { phase: 'revealed'; technicalUserId: string; credentials: WalletAccountCredentialsAnemic }
  | { phase: 'problem'; technicalUserId: string; problem: RetrievalProblem };

export interface Retrieval {
  state: RetrievalState;
  /** While the access data are retrieved or shown, the person stays on this technical user (they are shown once). */
  locked: boolean;
  /** Opens the confirmation for the technical user. */
  ask: (technicalUserId: string) => void;
  cancel: () => void;
  /** "Retrieve now": calls C4-M2 `retrieveWalletAccountCredentials`, then `onDone` (the list reloads). */
  confirm: () => void;
  /** "I have entered them": forgets the access data. */
  done: () => void;
}

export function useRetrieveAccessData(onDone: () => void): Retrieval {
  const { c4m2 } = useCoreModules();
  const [state, setState] = useState<RetrievalState>({ phase: 'idle' });
  // Every step starts a new request; the answer of an older one is dropped instead of overwriting a newer state.
  const request = useRef(0);
  const latestOnDone = useRef(onDone);
  useEffect(() => {
    latestOnDone.current = onDone;
  }, [onDone]);

  const go = (next: RetrievalState) => {
    request.current += 1;
    setState(next);
  };
  const confirm = () => {
    // Without C4-M2 the page shows "not connected" and never asks.
    if (state.phase !== 'confirm' || !c4m2) {
      return;
    }
    const { technicalUserId } = state;
    go({ phase: 'retrieving', technicalUserId });
    const id = request.current;
    c4m2.retrieveWalletAccountCredentials.execute(technicalUserId).then((result) => {
      if (id !== request.current) {
        return;
      }
      setState(
        result.status === 'retrieved'
          ? { phase: 'revealed', technicalUserId, credentials: result.credentials }
          : { phase: 'problem', technicalUserId, problem: result },
      );
      latestOnDone.current();
    });
  };
  return {
    state,
    locked: state.phase === 'retrieving' || state.phase === 'revealed',
    ask: (technicalUserId) => go({ phase: 'confirm', technicalUserId }),
    cancel: () => go({ phase: 'idle' }),
    confirm,
    done: () => go({ phase: 'idle' }),
  };
}
