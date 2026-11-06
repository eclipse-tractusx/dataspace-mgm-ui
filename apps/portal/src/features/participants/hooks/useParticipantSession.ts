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

import type { SessionAnemic } from '@dataspace-mgm/identity-core';
import { useSession } from '../../../core/CoreModulesContext';

/** The permission keys of C3-M1 and C3-M2 the pages use to hide what the person may not do (the API enforces them). */
export type ParticipantsPermission =
  | 'view_company'
  | 'edit_company'
  | 'edit_company_roles'
  | 'view_companies'
  | 'manage_companies'
  | 'review_company_changes'
  | 'view_csp_registration';

/** True when the signed-in person has the permission key (GET /me). Only hides UI; the API decides. */
export function hasPermission(session: SessionAnemic | null, permission: ParticipantsPermission): boolean {
  return Boolean(session?.permissions.includes(permission));
}

/** The session of the signed-in person, or null, and a permission check for the UI. */
export function useParticipantSession(): { session: SessionAnemic | null; can: (permission: ParticipantsPermission) => boolean } {
  const state = useSession();
  const session = state.status === 'signed-in' ? state.session : null;
  return { session, can: (permission) => hasPermission(session, permission) };
}
