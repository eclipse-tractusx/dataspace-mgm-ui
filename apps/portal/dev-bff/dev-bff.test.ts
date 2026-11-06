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

import { describe, expect, it } from 'vitest';
import { PERSON_COOKIE, claimsOf, devBffOptions, meOf, personFrom, safeReturnTo } from './dev-bff';

const token = (claims: object) => `x.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.y`;

describe('dev BFF', () => {
  it('builds GET /me from the claims of the person token', () => {
    const claims = claimsOf(
      token({
        sub: '5a1c0021-0000-4000-8000-000000000021',
        given_name: 'Pia',
        family_name: 'Provider',
        company_id: '11111111-1111-4111-8111-111111111111',
        bpn: 'BPNL00000000OSPA',
        resource_access: { 'portal-core': { roles: ['view_company'] } },
      }),
    );
    expect(meOf('pia', claims, 'csrf')).toEqual({
      id: '5a1c0021-0000-4000-8000-000000000021',
      name: 'Pia Provider',
      username: 'pia',
      company_id: '11111111-1111-4111-8111-111111111111',
      bpn: 'BPNL00000000OSPA',
      permissions: ['view_company'],
      csrf_token: 'csrf',
    });
    expect(meOf('otto', { sub: 'x' }, 'c')).toMatchObject({ name: 'otto', company_id: null, permissions: [] });
  });

  it('signs in the default person, the cookie person, or nobody after logout', () => {
    expect(personFrom(undefined, 'pia')).toBe('pia');
    expect(personFrom(`a=b; ${PERSON_COOKIE}=otto`, 'pia')).toBe('otto');
    expect(personFrom(`${PERSON_COOKIE}=-`, 'pia')).toBeNull();
    expect(personFrom(`${PERSON_COOKIE}=../x`, 'pia')).toBeNull();
  });

  it('returns only to paths of the app', () => {
    expect(safeReturnTo('/participants')).toBe('/participants');
    for (const bad of [null, 'https://evil.example', '//evil.example', '/\\evil.example']) {
      expect(safeReturnTo(bad)).toBe('/');
    }
  });

  it('reads its options from DEV_BFF_* with defaults for the hackathon set-up', () => {
    expect(devBffOptions({}, '/w/ui')).toEqual({
      apiUrl: 'http://localhost:8000',
      person: 'pia',
      realm: 'CX-Central',
      token: undefined,
      tokenCommand: undefined,
      serviceDir: '/w/dataspace-mgm-service',
    });
    expect(devBffOptions({ DEV_BFF_API_URL: 'http://localhost:8001/', DEV_BFF_REALM: 'CX-Central-B' }, '/w/ui')).toMatchObject({
      apiUrl: 'http://localhost:8001',
      realm: 'CX-Central-B',
    });
  });
});
