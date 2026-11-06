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
import { PERSON_NAMES } from './fixtures/sessions.fixture';

/**
 * The signed-in person as the fake backend sees it: the claims of the token that C1-M2 reads (README 4: `sub`,
 * `given_name`, `family_name`, `company_id`, permissions). Over HTTP the session cookie carries them.
 */
export interface CallerFixture {
  sub: string;
  givenName: string;
  familyName: string;
  companyId: string | null;
  permissions: ReadonlyArray<string>;
}

/** A caller without any permission, e.g. signed out in mock mode (every call answers 403 `forbidden`). */
export const NO_PERMISSIONS_CALLER: CallerFixture = {
  sub: '00000000-0000-4000-8000-000000000000',
  givenName: 'Nobody',
  familyName: 'Signed-Out',
  companyId: null,
  permissions: [],
};

/**
 * The caller of a session. Given and family name come from the test persons; for another session `user.name` is split
 * at the last space (fallback: SessionAnemic has one `name`, GET /me does not return both names yet).
 */
export function callerOf(session: SessionAnemic): CallerFixture {
  const known = PERSON_NAMES[session.user.id];
  const name = session.user.name.trim();
  const split = name.lastIndexOf(' ');
  return {
    sub: session.user.id,
    givenName: known?.givenName ?? (split > 0 ? name.slice(0, split) : name),
    familyName: known?.familyName ?? (split > 0 ? name.slice(split + 1) : ''),
    companyId: session.companyId,
    permissions: session.permissions,
  };
}
