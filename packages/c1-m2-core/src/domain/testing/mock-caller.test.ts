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

import { PIA_SESSION } from '@dataspace-mgm/identity-core/testing';
import { describe, expect, it } from 'vitest';
import { ERIKA_SESSION, LIESCHEN_SESSION } from './fixtures/sessions.fixture';
import { callerOf } from './mock-caller';

describe('callerOf', () => {
  it('takes the names of a test person by sub', () => {
    expect(callerOf(ERIKA_SESSION)).toEqual({
      sub: '5a1c0001-0000-4000-8000-000000000001',
      givenName: 'Erika',
      familyName: 'Mustermann',
      companyId: null,
      permissions: ['register_company', 'accept_invitation', 'view_notifications'],
    });
    expect(callerOf(LIESCHEN_SESSION)).toMatchObject({ givenName: 'Lieschen', familyName: 'Müller' });
  });

  it('splits the name at the last space for another session', () => {
    expect(callerOf(PIA_SESSION)).toEqual({ sub: PIA_SESSION.user.id, givenName: 'Pia', familyName: 'Provider', companyId: PIA_SESSION.companyId, permissions: PIA_SESSION.permissions });
    expect(callerOf({ ...PIA_SESSION, user: { ...PIA_SESSION.user, name: 'Anna Maria von Beispiel' } })).toMatchObject({ givenName: 'Anna Maria von', familyName: 'Beispiel' });
    expect(callerOf({ ...PIA_SESSION, user: { ...PIA_SESSION.user, name: 'Cher' } })).toMatchObject({ givenName: 'Cher', familyName: '' });
  });
});
