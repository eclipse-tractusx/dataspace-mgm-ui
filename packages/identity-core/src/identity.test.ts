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

import { CsrfTokenStore } from '@dataspace-mgm/core-http';
import { describe, expect, it } from 'vitest';
import { createIdentityModule } from './index';
import { SessionHttpRepository } from './infrastructure/repositories/session-http.repository';
import { InMemorySessionRepository, PIA_SESSION, RecordingRedirect } from './testing';

describe('identity-core', () => {
  it('reads the session and keeps its CSRF token in memory; logout clears it', async () => {
    const identity = createIdentityModule({ bffBaseUrl: '', sessions: new InMemorySessionRepository(PIA_SESSION) });
    expect(await identity.getCurrentSession.execute()).toEqual(PIA_SESSION);
    expect(CsrfTokenStore.get()).toBe('csrf-test');
    await identity.logout.execute();
    expect(CsrfTokenStore.get()).toBeNull();
    expect(await identity.getCurrentSession.execute()).toBeNull();
  });

  it('sends the sign-in only back to a path of the app', () => {
    const redirect = new RecordingRedirect();
    const identity = createIdentityModule({ bffBaseUrl: '', redirect });
    identity.login.execute('/participants');
    identity.login.execute('//evil.example');
    expect(redirect.logins).toEqual(['/participants', '/']);
  });

  it('maps GET /me and treats 401 as signed out', async () => {
    const me = {
      id: PIA_SESSION.user.id,
      name: 'Pia Provider',
      username: 'pia',
      company_id: PIA_SESSION.companyId,
      bpn: PIA_SESSION.bpn,
      permissions: ['view_company', 'edit_company'],
      csrf_token: 'csrf-test',
    };
    const answering = (status: number, body: unknown) =>
      new SessionHttpRepository('', (async () =>
        new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })) as typeof fetch);
    expect(await answering(200, me).getCurrent()).toEqual(PIA_SESSION);
    expect(await answering(401, {}).getCurrent()).toBeNull();
  });
});
