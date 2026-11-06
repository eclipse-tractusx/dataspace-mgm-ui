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

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { SessionAnemic } from '@dataspace-mgm/identity-core';
import type { CoreModules } from './container';

const CoreModulesContext = createContext<CoreModules | null>(null);

/** The core packages of the app. Tests pass modules with in-memory repositories. */
export function useCoreModules(): CoreModules {
  const modules = useContext(CoreModulesContext);
  if (!modules) {
    throw new Error('useCoreModules() needs a <CoreModulesProvider> (App.tsx).');
  }
  return modules;
}

export type SessionState =
  | { status: 'loading' }
  | { status: 'signed-in'; session: SessionAnemic }
  | { status: 'signed-out' }
  | { status: 'failed'; message: string };

const SessionContext = createContext<SessionState>({ status: 'signed-out' });

/** Who is signed in (GET /me of the BFF), read once when the app starts. Outside a provider: signed out. */
export function useSession(): SessionState {
  return useContext(SessionContext);
}

export function CoreModulesProvider({ modules, children }: { modules: CoreModules; children: ReactNode }) {
  const [session, setSession] = useState<SessionState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    modules.identity.getCurrentSession
      .execute()
      .then((current) => {
        if (active) {
          setSession(current ? { status: 'signed-in', session: current } : { status: 'signed-out' });
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setSession({ status: 'failed', message: error instanceof Error ? error.message : String(error) });
        }
      });
    return () => {
      active = false;
    };
  }, [modules]);

  return (
    <CoreModulesContext.Provider value={modules}>
      <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
    </CoreModulesContext.Provider>
  );
}
