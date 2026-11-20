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

import { describe, expect, it } from 'vitest';
import { meOf } from './me-of.ts';

describe('GET /me', () => {
  it('has the shape of the development BFF, from the claims of the access token', () => {
    const claims = {
      sub: '5a1c0021-0000-4000-8000-000000000021',
      given_name: 'Pia',
      family_name: 'Provider',
      preferred_username: 'pia',
      company_id: '11111111-1111-4111-8111-111111111111',
      bpn: 'BPNL00000000OSPA',
      resource_access: { 'portal-core': { roles: ['view_company', 7] }, other: { roles: ['not-a-permission'] } },
    };
    expect(meOf({ subject: claims.sub, username: null, claims, csrfToken: 'csrf' })).toEqual({
      id: '5a1c0021-0000-4000-8000-000000000021',
      name: 'Pia Provider',
      username: 'pia',
      company_id: '11111111-1111-4111-8111-111111111111',
      bpn: 'BPNL00000000OSPA',
      permissions: ['view_company'],
      csrf_token: 'csrf',
    });
  });

  it('falls back for a person without names, company or roles', () => {
    expect(meOf({ subject: 'sub-1', username: 'otto', claims: {}, csrfToken: 'c' })).toEqual({
      id: 'sub-1',
      name: 'otto',
      username: 'otto',
      company_id: null,
      bpn: null,
      permissions: [],
      csrf_token: 'c',
    });
    expect(meOf({ subject: 'sub-1', username: null, claims: { resource_access: 'x', company_id: 5 }, csrfToken: 'c' })).toMatchObject({
      name: 'sub-1',
      username: 'sub-1',
      company_id: null,
      permissions: [],
    });
  });
});
