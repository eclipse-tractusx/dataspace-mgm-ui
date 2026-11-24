/********************************************************************************
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
 * Assisted-By: Claude Code (claude-fable-5-2)
 ********************************************************************************/

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

/** The mark the BFF adds to the address of the page the wallet step returns to (`GET /ebw/callback`). */
const WALLET_PARAM = 'wallet';
const WALLET_RETURNED = 'returned';

/**
 * The wallet step leaves the portal for the EBW-Connector and comes back to the page with `wallet=returned` in its
 * address. Then, once `ready`, this runs `resume` once with the other query parameters of the address (what the page
 * put there before it left), and clears the query, so a reload does not start the step again.
 */
export function useWalletReturn(ready: boolean, resume: (params: URLSearchParams) => void): void {
  const [params, setParams] = useSearchParams();
  const resumed = useRef(false);
  useEffect(() => {
    if (!ready || resumed.current || params.get(WALLET_PARAM) !== WALLET_RETURNED) {
      return;
    }
    resumed.current = true;
    const rest = new URLSearchParams(params);
    rest.delete(WALLET_PARAM);
    setParams(new URLSearchParams(), { replace: true });
    resume(rest);
  }, [ready, params, setParams, resume]);
}
