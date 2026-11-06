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
import { PARTICIPANTS_ROUTES } from '../paths';
import { renderParticipantsPage } from '../testing/renderParticipantsPage';
import CompanyDetail from './CompanyDetail';

beforeAll(() => participantsTranslations.load());

const U1 = 'c0000001-0000-4000-8000-000000000001';
const U2 = 'c0000002-0000-4000-8000-000000000002';
const show = (person: string, companyId: string, options = {}) =>
  renderParticipantsPage(<CompanyDetail />, { path: `/participants/companies/${companyId}`, route: `/${PARTICIPANTS_ROUTES.companyDetail}`, person, ...options });

describe('View 6 · Company (OSP)', () => {
  it('shows all data, the open change request and the CSP status to the OSP Admin (Otto)', async () => {
    show('otto', U1);
    expect(await screen.findByRole('heading', { level: 1, name: /Beispiel Maschinenbau GmbH/ })).toBeInTheDocument();
    expect(screen.getByText('This company has an open change request.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Review' })).toHaveAttribute('href', '/participants/change-requests/e0000001-0000-4000-8000-000000000001');
    const csp = screen.getByRole('region', { name: 'At the CSP' });
    expect(await within(csp).findAllByText('Registered')).toHaveLength(2);
    expect(within(csp).getByText('did:web:csp-wallet.example.org:BPNLIUK2REMLK3F4')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Correct data' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Deactivate' })).toBeInTheDocument();
  });

  it('is read only for the OSP Reviewer (Rolf): no actions, no CSP card', async () => {
    show('rolf', U1);
    await screen.findByRole('heading', { level: 1, name: /Beispiel Maschinenbau GmbH/ });
    expect(screen.queryByRole('button', { name: 'Correct data' })).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'At the CSP' })).not.toBeInTheDocument();
  });

  it('deactivates after confirmation with a required reason; the status becomes Inactive', async () => {
    const { store } = show('otto', U2);
    fireEvent.click(await screen.findByRole('button', { name: 'Deactivate' }));
    const dialog = await screen.findByRole('dialog', { name: 'Deactivate the company?' });
    expect(within(dialog).getByText(/membership credential is revoked/)).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Deactivate company' }));
    expect(await within(dialog).findByText('Required.')).toBeInTheDocument();
    fireEvent.change(within(dialog).getByRole('textbox', { name: /Reason/ }), { target: { value: 'Contract ended' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Deactivate company' }));
    expect(await screen.findByText('Company deactivated')).toBeInTheDocument();
    expect(await screen.findByText(/The data cannot be corrected while the company is deactivated/)).toBeInTheDocument();
    expect(store.company(U2).status).toBe('INACTIVE');
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Deactivate' })).not.toBeInTheDocument());
  });

  it('corrects the short name with a reason', async () => {
    show('otto', U2);
    fireEvent.click(await screen.findByRole('button', { name: 'Correct data' }));
    const dialog = await screen.findByRole('dialog', { name: 'Correct the company data' });
    fireEvent.change(within(dialog).getByRole('textbox', { name: 'Short name' }), { target: { value: 'Beispiel Logistik' } });
    fireEvent.change(within(dialog).getByRole('textbox', { name: /Reason/ }), { target: { value: 'Register extract' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Save correction' }));
    expect(await screen.findByText('Correction saved')).toBeInTheDocument();
  });

  it('answers an unknown company with not found', async () => {
    show('otto', '00000000-0000-4000-8000-000000000000');
    expect(await screen.findByText('There is no company with this ID at your onboarding service provider.')).toBeInTheDocument();
  });

  it('shows a 401 of the module as an ended session', async () => {
    show('otto', U1, { participants: { failure: new CoreHttpException(401, 'urn:portal:problem:unauthorized', 'unauthorized') } });
    expect(await screen.findByText(/Your session has ended \(HTTP 401\)/)).toBeInTheDocument();
  });
});
