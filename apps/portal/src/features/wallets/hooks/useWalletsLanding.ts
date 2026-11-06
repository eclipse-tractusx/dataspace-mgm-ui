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

import { useSession } from '../../../core/CoreModulesContext';
import { WALLETS_PERMISSIONS } from '../permissions';
import { visibleTabs } from '../tabs';

export type WalletsLandingState =
  | { status: 'loading' }
  | { status: 'signed-out' }
  | { status: 'session-failed'; message: string }
  | { status: 'no-access' }
  /** The person may see the dataspace wallet: /wallets shows it. */
  | { status: 'wallet' }
  /** The first tab the person may see. */
  | { status: 'redirect'; to: string };

/**
 * What /wallets shows the signed-in person: the dataspace wallet with view_dataspace_wallet, else the first feature tab
 * their permission keys show.
 */
export function useWalletsLanding(): WalletsLandingState {
  const session = useSession();
  switch (session.status) {
    case 'loading':
    case 'signed-out':
      return { status: session.status };
    case 'failed':
      return { status: 'session-failed', message: session.message };
    default: {
      if (session.session.permissions.includes(WALLETS_PERMISSIONS.viewDataspaceWallet)) {
        return { status: 'wallet' };
      }
      const [first] = visibleTabs(session.session.permissions);
      return first ? { status: 'redirect', to: first.path } : { status: 'no-access' };
    }
  }
}
