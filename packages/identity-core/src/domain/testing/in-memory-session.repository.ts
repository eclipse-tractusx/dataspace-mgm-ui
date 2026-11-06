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

import type { SessionAnemic } from '../anemics/session.anemic';
import type { RedirectPort, SessionRepository } from '../repositories/session.repository';

export class InMemorySessionRepository implements SessionRepository {
  constructor(private session: SessionAnemic | null = null) {}

  public async getCurrent(): Promise<SessionAnemic | null> {
    return this.session;
  }

  public async logout(): Promise<void> {
    this.session = null;
  }
}

export class RecordingRedirect implements RedirectPort {
  public readonly logins: string[] = [];

  public toLogin(returnTo: string): void {
    this.logins.push(returnTo);
  }
}

/** Pia Provider, Company Admin of the OSP company of OSP A (backend test data, testdata/persons-osp-a.json). */
export const PIA_SESSION: SessionAnemic = {
  user: { id: '5a1c0021-0000-4000-8000-000000000021', name: 'Pia Provider', username: 'pia' },
  companyId: '11111111-1111-4111-8111-111111111111',
  bpn: 'BPNL00000000OSPA',
  permissions: ['view_company', 'edit_company'],
  csrfToken: 'csrf-test',
};
