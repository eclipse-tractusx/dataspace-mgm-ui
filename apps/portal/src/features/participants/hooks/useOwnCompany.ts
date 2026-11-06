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

import { useEffect, useState } from 'react';
import type { GetOwnCompanyResult } from '@dataspace-mgm/c3-m1-core';
import { useCoreModules, useSession } from '../../../core/CoreModulesContext';

export type OwnCompanyState = { status: 'loading' } | { status: 'signed-out' } | GetOwnCompanyResult;

/**
 * The company of the signed-in person: the page calls this hook, the hook calls the use case of the core package,
 * the use case calls C3-M1. The page never sees HTTP. (Redux Toolkit / RTK Query takes this place once the portal has
 * a store: frontend architecture 06.)
 */
export function useOwnCompany(): OwnCompanyState {
  const { c3m1 } = useCoreModules();
  const session = useSession();
  const companyId = session.status === 'signed-in' ? session.session.companyId : null;
  const [result, setResult] = useState<{ companyId: string | null; value: GetOwnCompanyResult } | null>(null);

  useEffect(() => {
    if (session.status !== 'signed-in') {
      return;
    }
    let active = true;
    c3m1.getOwnCompany.execute(companyId).then((value) => {
      if (active) {
        setResult({ companyId, value });
      }
    });
    return () => {
      active = false;
    };
  }, [c3m1, session.status, companyId]);

  if (session.status === 'signed-out') {
    return { status: 'signed-out' };
  }
  if (session.status === 'failed') {
    return { status: 'failed', error: { status: null, problemType: null, message: session.message } };
  }
  if (session.status === 'loading' || !result || result.companyId !== companyId) {
    return { status: 'loading' };
  }
  return result.value;
}
