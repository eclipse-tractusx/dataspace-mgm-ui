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

import { useCallback, useEffect, useRef, useState } from 'react';

export interface Loaded<T> {
  /** null while loading (first load, a new key, or after reload()). */
  value: T | null;
  reload: () => void;
  /** Replaces the value without a call, e.g. with the answer of a write. */
  replace: (value: T) => void;
}

/**
 * Runs `load` (a use case) when `key` changes and keeps its result. A null key loads nothing (e.g. no session yet).
 * The page gets data, never HTTP; answers of an outdated key are dropped.
 */
export function useLoad<T>(key: string | null, load: () => Promise<T>): Loaded<T> {
  const loadRef = useRef(load);
  const [version, setVersion] = useState(0);
  const [state, setState] = useState<{ key: string; value: T } | null>(null);
  const current = key === null ? null : `${key}#${version}`;

  useEffect(() => {
    loadRef.current = load;
  });

  useEffect(() => {
    if (current === null) {
      return;
    }
    let active = true;
    loadRef.current().then((value) => {
      if (active) {
        setState({ key: current, value });
      }
    });
    return () => {
      active = false;
    };
  }, [current]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);
  const replace = useCallback((value: T) => {
    if (current !== null) {
      setState({ key: current, value });
    }
  }, [current]);

  return { value: state && state.key === current ? state.value : null, reload, replace };
}
