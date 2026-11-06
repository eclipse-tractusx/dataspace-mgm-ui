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
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { participantsTranslations } from '../i18n';
import { renderParticipantsPage } from '../testing/renderParticipantsPage';
import CompanyProfile from './CompanyProfile';

beforeAll(() => participantsTranslations.load());

const show = (person: string | null, options = {}) => renderParticipantsPage(<CompanyProfile />, { path: '/participants', person, ...options });

describe('View 1 · Your company', () => {
  it('shows the company with its BPN, identifiers with source, roles and the open change request (Erika)', async () => {
    show('erika');
    expect(await screen.findByRole('heading', { level: 2, name: 'Beispiel Maschinenbau GmbH' })).toBeInTheDocument();
    expect(within(screen.getByRole('group', { name: 'Business partner number' })).getByText('BPNLIUK2REMLK3F4')).toBeInTheDocument();
    expect(screen.getByText('VAT ID: DE123456789')).toBeInTheDocument();
    expect(screen.getAllByText('Business Wallet').length).toBeGreaterThan(0);
    expect(await screen.findByText(/A change request is open since .*LEI code/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Change company data' })).toHaveAttribute('href', '/participants/company/change');
    expect(screen.getByRole('link', { name: /Manage company roles/ })).toBeInTheDocument();
  });

  it('changes the short name inline and shows the saved value', async () => {
    show('erika');
    fireEvent.click(await screen.findByRole('button', { name: 'Change the short name' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Short name' }), { target: { value: 'Beispiel MB' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Beispiel MB')).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Short name' })).not.toBeInTheDocument();
  });

  it('is read only for a Member (Max): no change button, no short name edit', async () => {
    show('max');
    expect(await screen.findByRole('heading', { level: 2, name: 'Beispiel Maschinenbau GmbH' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change company data' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Change the short name' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /See company roles and terms/ })).toBeInTheDocument();
  });

  it('warns for a deactivated company and hides the edit actions', async () => {
    const { BEISPIEL_MASCHINENBAU } = await import('@dataspace-mgm/c3-m1-core/testing');
    show('erika', { participants: { companies: [{ ...BEISPIEL_MASCHINENBAU, status: 'INACTIVE' }] } });
    expect(await screen.findByText(/Your company is deactivated/)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change company data' })).not.toBeInTheDocument();
  });

  it('says that a person without view_company may not see it (Lieschen, applicant)', async () => {
    show('lieschen');
    expect(await screen.findByText(/permission to see your company/)).toBeInTheDocument();
  });

  it('sends OSP staff without a company of their own to the companies (Rolf)', async () => {
    show('rolf');
    await waitFor(() => expect(screen.getByTestId('path')).toHaveTextContent('/participants/companies'));
  });

  it('explains a backend that is not reachable through the BFF (502)', async () => {
    show('erika', { companyFailure: new CoreHttpException(502, 'urn:dev-bff:problem:upstream', 'bad gateway') });
    expect(await screen.findByText(/did not answer \(HTTP 502\)/)).toBeInTheDocument();
  });
});
