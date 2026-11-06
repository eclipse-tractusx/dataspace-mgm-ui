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
import { c3m1Problem } from '@dataspace-mgm/c3-m1-core/testing';
import { fireEvent, screen, within } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { MOCK_PERSONS } from '../../../core/mock-persons';
import { participantsTranslations } from '../i18n';
import { PARTICIPANTS_ROUTES } from '../paths';
import { renderParticipantsPage } from '../testing/renderParticipantsPage';
import ChangeRequestReview from './ChangeRequestReview';

beforeAll(() => participantsTranslations.load());

const E2 = 'e0000002-0000-4000-8000-000000000002';
const show = (person: string, id: string, options = {}) =>
  renderParticipantsPage(<ChangeRequestReview />, { path: `/participants/change-requests/${id}`, route: `/${PARTICIPANTS_ROUTES.review}`, person, ...options });

describe('View 9 · Review change request', () => {
  it('compares now and requested, shows the reason and the documents (Rolf)', async () => {
    show('rolf', E2);
    const table = await screen.findByRole('table', { name: 'Requested changes' });
    expect(table).toHaveTextContent('Beispiel Logistik GmbH');
    expect(table).toHaveTextContent('Beispiel Logistik SE');
    expect(screen.getByText(/Change of the legal form to an SE/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download auszug.pdf' })).toBeInTheDocument();
    expect(screen.getByText('Opening a document is written to the audit log.')).toBeInTheDocument();
  });

  it('approves; the result replaces the decision bar', async () => {
    const { store } = show('rolf', E2);
    fireEvent.click(await screen.findByRole('button', { name: 'Approve' }));
    fireEvent.click(within(await screen.findByRole('dialog', { name: 'Approve the change request?' })).getByRole('button', { name: 'Approve' }));
    expect(await screen.findByText(/Approved\. The data of Beispiel Logistik GmbH is changed/)).toBeInTheDocument();
    expect(store.changeRequest(E2)).toMatchObject({ status: 'APPROVED', decidedBy: MOCK_PERSONS.rolf.user.id });
    expect(screen.queryByRole('region', { name: 'Decision' })).not.toBeInTheDocument();
  });

  it('needs a reason to decline', async () => {
    show('rolf', E2);
    fireEvent.click(await screen.findByRole('button', { name: 'Decline' }));
    const dialog = await screen.findByRole('dialog', { name: 'Decline the change request?' });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Decline' }));
    expect(await within(dialog).findByText('Required.')).toBeInTheDocument();
    fireEvent.change(within(dialog).getByRole('textbox', { name: /Reason/ }), { target: { value: 'Register extract missing' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Decline' }));
    expect(await screen.findByText(/Reason for the Company Admin: “Register extract missing”/)).toBeInTheDocument();
  });

  it('shows the four-eyes rule of the API (409 same-person) to the person who submitted the request', async () => {
    show('rolf', E2, { participants: { failures: { approveChangeRequest: c3m1Problem(409, 'same-person') } } });
    fireEvent.click(await screen.findByRole('button', { name: 'Approve' }));
    fireEvent.click(within(await screen.findByRole('dialog', { name: 'Approve the change request?' })).getByRole('button', { name: 'Approve' }));
    expect(await screen.findByText(/four-eyes principle/)).toBeInTheDocument();
    expect(screen.getByText('urn:c3-m1:problem:same-person')).toBeInTheDocument();
  });

  it('downloads a document through the use case', async () => {
    const { store } = show('rolf', E2);
    fireEvent.click(await screen.findByRole('button', { name: 'Download auszug.pdf' }));
    await screen.findByRole('button', { name: 'Download auszug.pdf' });
    expect(store.calls).toContain('getChangeRequestDocument');
  });

  it('answers an unknown request with not found', async () => {
    show('rolf', 'e0000099-0000-4000-8000-000000000099');
    expect(await screen.findByText('This change request does not exist.')).toBeInTheDocument();
  });

  it('shows 409 attestation-required from the module', async () => {
    show('rolf', E2, { participants: { failure: new CoreHttpException(409, 'urn:c3-m1:problem:attestation-required', 'attestation-required') } });
    expect(await screen.findByText(/change only with it, not with a change request/)).toBeInTheDocument();
  });
});
