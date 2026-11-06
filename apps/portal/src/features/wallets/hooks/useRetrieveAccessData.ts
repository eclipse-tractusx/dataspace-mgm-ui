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

import { useState } from 'react';
import type { C4M2Module, RetrieveWalletAccountCredentialsResult, WalletAccountCredentialsAnemic } from '@dataspace-mgm/c4-m2-core';

/** An answer of the retrieval other than the access data, shown under the account. */
export type RetrievalProblem = Exclude<RetrieveWalletAccountCredentialsResult, { status: 'retrieved' }>;

/**
 * The retrieval of the access data of one wallet account: ask first (they are shown once), retrieve, show them inline
 * until the person has entered them. The access data live only in this component state: never in Redux, the URL,
 * storage or logs.
 */
export type RetrievalState =
  | { phase: 'idle' }
  | { phase: 'confirm'; technicalUserId: string }
  | { phase: 'retrieving'; technicalUserId: string }
  | { phase: 'revealed'; technicalUserId: string; credentials: WalletAccountCredentialsAnemic }
  | { phase: 'problem'; technicalUserId: string; problem: RetrievalProblem };

export interface Retrieval {
  state: RetrievalState;
  /** Opens the confirmation for the technical user. */
  ask: (technicalUserId: string) => void;
  cancel: () => void;
  /** "Retrieve now": calls C4-M2 `retrieveWalletAccountCredentials`, then `onDone` (the list reloads). */
  confirm: () => void;
  /** "I have entered them": forgets the access data. */
  done: () => void;
}

export function useRetrieveAccessData(c4m2: C4M2Module | null, onDone: () => void): Retrieval {
  const [state, setState] = useState<RetrievalState>({ phase: 'idle' });
  const confirm = () => {
    if (state.phase !== 'confirm' || !c4m2) {
      return;
    }
    const { technicalUserId } = state;
    setState({ phase: 'retrieving', technicalUserId });
    c4m2.retrieveWalletAccountCredentials.execute(technicalUserId).then((result) => {
      setState(
        result.status === 'retrieved'
          ? { phase: 'revealed', technicalUserId, credentials: result.credentials }
          : { phase: 'problem', technicalUserId, problem: result },
      );
      onDone();
    });
  };
  return {
    state,
    ask: (technicalUserId) => setState({ phase: 'confirm', technicalUserId }),
    cancel: () => setState({ phase: 'idle' }),
    confirm,
    done: () => setState({ phase: 'idle' }),
  };
}
