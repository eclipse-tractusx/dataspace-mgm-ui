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
import type { C1M2Module, FailedOutcome } from '@dataspace-mgm/c1-m2-core';
import { useCoreModules, useSession } from '../../../core/CoreModulesContext';

/** The states every page of the feature has besides the results of its use case. */
export type LoadState<R> = { status: 'loading' } | { status: 'signed-out' } | { status: 'not-connected' } | FailedOutcome | R;

/**
 * Runs a read use case of C1-M2 for the signed-in person and returns its result as state. The module is optional
 * while the feature is a proof of concept (CoreModules.c1m2): without it the page shows "not connected".
 */
export function useLoad<R>(load: ((c1m2: C1M2Module) => Promise<R>) | null, deps: ReadonlyArray<unknown>): { state: LoadState<R>; reload: () => void } {
  const { c1m2 } = useCoreModules();
  const session = useSession();
  const [result, setResult] = useState<{ key: string; value: R } | null>(null);
  const [round, setRound] = useState(0);
  const key = JSON.stringify([...deps, round]);
  const signedIn = session.status === 'signed-in';

  useEffect(() => {
    if (!signedIn || !c1m2 || !load) {
      return;
    }
    let active = true;
    load(c1m2).then((value) => {
      if (active) {
        setResult({ key, value });
      }
    });
    return () => {
      active = false;
    };
    // `load` is rebuilt on every render; `key` carries what it depends on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c1m2, signedIn, key]);

  const reload = useCallback(() => setRound((n) => n + 1), []);
  if (session.status === 'signed-out') {
    return { state: { status: 'signed-out' }, reload };
  }
  if (session.status === 'failed') {
    return { state: { status: 'failed', error: { status: null, problemType: null, message: session.message } }, reload };
  }
  if (!c1m2) {
    return { state: { status: 'not-connected' }, reload };
  }
  if (session.status === 'loading' || !result || result.key !== key) {
    return { state: { status: 'loading' }, reload };
  }
  return { state: result.value, reload };
}

/** For pages without a read: whether the person is signed in and the module is there. */
export function useReadiness(): { status: 'ready' } | { status: 'loading' } | { status: 'signed-out' } | { status: 'not-connected' } | FailedOutcome {
  const { c1m2 } = useCoreModules();
  const session = useSession();
  if (session.status === 'loading') {
    return { status: 'loading' };
  }
  if (session.status === 'signed-out') {
    return { status: 'signed-out' };
  }
  if (session.status === 'failed') {
    return { status: 'failed', error: { status: null, problemType: null, message: session.message } };
  }
  return c1m2 ? { status: 'ready' } : { status: 'not-connected' };
}
