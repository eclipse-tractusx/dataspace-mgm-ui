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

import { useLocation } from 'react-router-dom';
import { WALLETS_PATHS } from '../paths';

/** The router state a link from the list hands to a credential, so the way back keeps the filters. */
export interface ListReturnState {
  listSearch: string;
}

/** The state for a link from "Credentials of all companies" to a credential: the filters in the address. */
export function useListLinkState(): ListReturnState {
  const { search } = useLocation();
  return { listSearch: search };
}

/** The way back from a credential to the list, with the filters it was opened with (none for a direct link). */
export function useBackToList(): string {
  const { state } = useLocation();
  const listSearch = (state as Partial<ListReturnState> | null)?.listSearch;
  return `${WALLETS_PATHS.allCredentials}${typeof listSearch === 'string' ? listSearch : ''}`;
}
