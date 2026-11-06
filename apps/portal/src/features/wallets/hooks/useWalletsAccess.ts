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

import type { C4M1Module } from '@dataspace-mgm/c4-m1-core';
import type { SessionAnemic } from '@dataspace-mgm/identity-core';
import { useCoreModules, useSession } from '../../../core/CoreModulesContext';
import type { WalletsPermission } from '../permissions';

/** Why a page of the feature cannot show its data (yet). */
export type WalletsBlocked =
  | { status: 'loading' }
  | { status: 'signed-out' }
  | { status: 'session-failed'; message: string }
  /** The proof of concept runs without C4-M1 outside mock mode. */
  | { status: 'not-connected' }
  /** The session lacks the permission of the page: the page is hidden, nothing is called. */
  | {
      status: 'no-access';
      /** The person belongs to no company (OSP staff): the page says so instead of "ask your Company Admin". */
      withoutCompany?: boolean;
    };

export type WalletsAccess = WalletsBlocked | { status: 'ready'; session: SessionAnemic; c4m1: C4M1Module };

/** The session and the C4-M1 module for a page that needs `permission`. */
export function useWalletsAccess(permission: WalletsPermission): WalletsAccess {
  const { c4m1 } = useCoreModules();
  const session = useSession();
  switch (session.status) {
    case 'loading':
    case 'signed-out':
      return { status: session.status };
    case 'failed':
      return { status: 'session-failed', message: session.message };
    default:
      if (!c4m1) {
        return { status: 'not-connected' };
      }
      if (!session.session.permissions.includes(permission)) {
        return { status: 'no-access' };
      }
      return { status: 'ready', session: session.session, c4m1 };
  }
}
