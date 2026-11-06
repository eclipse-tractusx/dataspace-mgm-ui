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
import { screen } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { participantsTranslations } from '../i18n';
import { PARTICIPANTS_ROUTES } from '../paths';
import { renderParticipantsPage } from '../testing/renderParticipantsPage';
import CspRegistration from './CspRegistration';

beforeAll(() => participantsTranslations.load());

const show = (person: string, companyId: string, options = {}) =>
  renderParticipantsPage(<CspRegistration />, { path: `/participants/companies/${companyId}/csp`, route: `/${PARTICIPANTS_ROUTES.cspRegistration}`, person, ...options });

describe('View 7 · CSP registration', () => {
  it('shows a registered company with BPN, DID and membership (Otto)', async () => {
    show('otto', 'c0000001-0000-4000-8000-000000000001');
    expect(await screen.findByText('Catena-X knows Beispiel Maschinenbau GmbH by BPNLIUK2REMLK3F4')).toBeInTheDocument();
    expect(screen.getByText('did:web:csp-wallet.example.org:BPNLIUK2REMLK3F4')).toBeInTheDocument();
    expect(screen.getByText('Member')).toBeInTheDocument();
  });

  it('shows a running registration', async () => {
    show('otto', 'c0000002-0000-4000-8000-000000000002');
    expect(await screen.findByText('The CSP is processing the registration')).toBeInTheDocument();
  });

  it('shows a failed registration with its reason', async () => {
    show('otto', 'c0000004-0000-4000-8000-000000000004');
    expect(await screen.findByText('The CSP rejected the registration')).toBeInTheDocument();
    expect(screen.getAllByText(/already registered with another onboarding service provider/).length).toBeGreaterThan(0);
  });

  it('says when a company has no registration yet (404)', async () => {
    show('otto', 'c0000003-0000-4000-8000-000000000003', { cspRegistrations: [] });
    expect(await screen.findByText('Not registered at the CSP yet')).toBeInTheDocument();
  });

  it('is closed to the OSP Reviewer (no view_csp_registration)', async () => {
    show('rolf', 'c0000001-0000-4000-8000-000000000001');
    expect(await screen.findByText(/Only the OSP Admin sees the registration/)).toBeInTheDocument();
  });

  it('shows the C3-M2 stand-in that answers 501', async () => {
    show('otto', 'c0000001-0000-4000-8000-000000000001', { cspFailure: new CoreHttpException(501, 'urn:c3-m2:problem:not-implemented', 'not implemented') });
    expect(await screen.findByText(/not available yet/)).toBeInTheDocument();
    expect(screen.getByText('urn:c3-m2:problem:not-implemented')).toBeInTheDocument();
  });
});
