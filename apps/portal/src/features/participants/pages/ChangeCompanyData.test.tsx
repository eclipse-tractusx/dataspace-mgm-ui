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

import { CHANGE_REQUESTS, c3m1Problem } from '@dataspace-mgm/c3-m1-core/testing';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { participantsTranslations } from '../i18n';
import { renderParticipantsPage } from '../testing/renderParticipantsPage';
import ChangeCompanyData from './ChangeCompanyData';

beforeAll(() => participantsTranslations.load());

const show = (person: string, options = {}) => renderParticipantsPage(<ChangeCompanyData />, { path: '/participants/company/change', person, ...options });
const pdf = () => new File(['%PDF-1.7'], 'lei.pdf', { type: 'application/pdf' });

async function fillLeiRequest() {
  fireEvent.click(await screen.findByRole('button', { name: /Request a change with documents/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Add an identifier' }));
  const types = screen.getAllByRole('combobox', { name: 'Type' });
  fireEvent.mouseDown(types[types.length - 1]);
  fireEvent.click(await screen.findByRole('option', { name: 'LEI code' }));
  const values = screen.getAllByRole('textbox', { name: 'Value' });
  fireEvent.change(values[values.length - 1], { target: { value: '529900T8BM49AURSDO55' } });
  fireEvent.change(screen.getByRole('textbox', { name: /Comment for your onboarding service provider/ }), { target: { value: 'We add our LEI.' } });
  fireEvent.change(document.querySelector('input[type="file"]') as HTMLInputElement, { target: { files: [pdf()] } });
}

describe('View 2 · Change company data', () => {
  it('sends a change request with an identifier, a comment and a document (Erika, no open request)', async () => {
    const { store } = show('erika', { participants: { changeRequests: CHANGE_REQUESTS.filter((request) => request.status !== 'OPEN') } });
    await fillLeiRequest();
    expect(screen.getByText('lei.pdf')).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Your change request' })).toHaveTextContent('LEI code');
    fireEvent.click(screen.getByRole('button', { name: 'Send the change request' }));
    expect(await screen.findByText('Change request sent')).toBeInTheDocument();
    expect(store.changeRequests[0]).toMatchObject({ status: 'OPEN', changes: { identifiers: [{ type: 'VAT_ID' }, { type: 'LEI_CODE', value: '529900T8BM49AURSDO55' }] } });
  });

  it('locks legal name and address for a company with a Business Wallet', async () => {
    show('erika');
    fireEvent.click(await screen.findByRole('button', { name: /Request a change with documents/ }));
    expect(screen.getByText('They come from your Business Wallet and change only with it.')).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Legal name' })).not.toBeInTheDocument();
  });

  it('lets a company without a Business Wallet request a new legal name (Hans)', async () => {
    show('hans', { participants: { changeRequests: [] } });
    fireEvent.click(await screen.findByRole('button', { name: /Request a change with documents/ }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Legal name' }), { target: { value: 'Beispiel Logistik SE' } });
    expect(screen.getByRole('table', { name: 'Your change request' })).toHaveTextContent('Beispiel Logistik SE');
  });

  it('checks the form before sending: comment, documents, a change', async () => {
    const { store } = show('erika');
    fireEvent.click(await screen.findByRole('button', { name: /Request a change with documents/ }));
    const calls = store.calls.length;
    fireEvent.click(screen.getByRole('button', { name: 'Send the change request' }));
    expect(await screen.findByText('Required.')).toBeInTheDocument();
    expect(screen.getByText('Add at least one supporting document.')).toBeInTheDocument();
    expect(screen.getByText('Change at least one value.')).toBeInTheDocument();
    expect(store.calls).toHaveLength(calls);
  });

  it('marks a file of the wrong type before sending', async () => {
    show('erika');
    await fillLeiRequest();
    fireEvent.change(document.querySelector('input[type="file"]') as HTMLInputElement, { target: { files: [new File(['<html>'], 'page.html', { type: 'text/html' })] } });
    fireEvent.click(screen.getByRole('button', { name: 'Send the change request' }));
    expect(await screen.findByText('page.html is not a PDF, PNG or JPEG file.')).toBeInTheDocument();
  });

  it('shows the answer 409 change-request-open of the module', async () => {
    show('erika', { participants: { failures: { createChangeRequest: c3m1Problem(409, 'change-request-open') } } });
    await fillLeiRequest();
    fireEvent.click(screen.getByRole('button', { name: 'Send the change request' }));
    expect(await screen.findByText(/There is an open change request already/)).toBeInTheDocument();
    expect(screen.getByText('urn:c3-m1:problem:change-request-open')).toBeInTheDocument();
  });

  it('says that the Business Wallet way is not available yet, without starting anything', async () => {
    show('erika');
    fireEvent.click(await screen.findByRole('button', { name: /Verify with your Business Wallet/ }));
    expect(screen.getByText('Not available yet')).toBeInTheDocument();
  });

  it('is not open to a Member (Max): edit_company is missing', async () => {
    show('max');
    await waitFor(() => expect(screen.getByText(/Only the Company Admin changes the data/)).toBeInTheDocument());
  });
});
