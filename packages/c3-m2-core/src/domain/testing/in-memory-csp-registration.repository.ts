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

import { CoreHttpException } from '@dataspace-mgm/core-http';
import type { CspRegistrationAnemic } from '../anemics/csp-registration.anemic';
import type { CspRegistrationRepository } from '../repositories/csp-registration.repository';

/**
 * In-memory adapter of the port for tests and mock mode: fixtures, 404 for a company without registration (like the
 * module), and an injected failure. Permissions are C3-M2's (`view_csp_registration`), not checked here.
 */
export class InMemoryCspRegistrationRepository implements CspRegistrationRepository {
  public readonly calls: string[] = [];

  constructor(
    private readonly registrations: ReadonlyArray<CspRegistrationAnemic> = [],
    private readonly failure: Error | null = null,
  ) {}

  public async get(companyId: string): Promise<CspRegistrationAnemic> {
    this.calls.push(companyId);
    if (this.failure) {
      throw this.failure;
    }
    const registration = this.registrations.find((item) => item.companyId === companyId);
    if (!registration) {
      throw new CoreHttpException(404, 'urn:c3-m2:problem:not-found', 'not-found');
    }
    return registration;
  }
}

const registration = (input: Partial<CspRegistrationAnemic> & Pick<CspRegistrationAnemic, 'companyId' | 'status'>): CspRegistrationAnemic => ({
  bpn: null,
  failureReason: null,
  did: null,
  membership: 'NONE',
  registeredAt: null,
  updatedAt: null,
  ...input,
});

/**
 * C3-M2 registrations of the test data (mockups/participants/shared/data.js, C3-M2 14). Beispiel Logistik and Andere
 * Beispiel carry the `cspVariants` pending and failed of the mockup, so mock mode shows those states too.
 */
export const CSP_REGISTRATIONS: ReadonlyArray<CspRegistrationAnemic> = [
  registration({
    companyId: 'c0000001-0000-4000-8000-000000000001',
    bpn: 'BPNLIUK2REMLK3F4',
    status: 'REGISTERED',
    did: 'did:web:csp-wallet.example.org:BPNLIUK2REMLK3F4',
    membership: 'REGISTERED',
    registeredAt: '2026-11-03T09:57:00Z',
    updatedAt: '2026-11-03T10:03:00Z',
  }),
  registration({ companyId: 'c0000002-0000-4000-8000-000000000002', status: 'PENDING', updatedAt: '2026-11-04T11:02:00Z' }),
  registration({
    companyId: 'c0000003-0000-4000-8000-000000000003',
    bpn: 'BPNL00000000U3OZ',
    status: 'REGISTERED',
    registeredAt: '2026-11-05T16:01:00Z',
    updatedAt: '2026-11-05T16:01:00Z',
  }),
  registration({
    companyId: 'c0000004-0000-4000-8000-000000000004',
    status: 'FAILED',
    failureReason: 'REGISTERED_AT_OTHER_OSP',
    updatedAt: '2026-11-05T10:40:00Z',
  }),
  registration({
    companyId: '11111111-1111-4111-8111-111111111111',
    bpn: 'BPNL00000000OSPA',
    status: 'REGISTERED',
    membership: 'REGISTERED',
    registeredAt: '2026-11-01T07:00:00Z',
    updatedAt: '2026-11-01T07:00:00Z',
  }),
];
