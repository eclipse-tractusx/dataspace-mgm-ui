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
import OwnChangeRequests from './OwnChangeRequests';

beforeAll(() => participantsTranslations.load());

const show = (person: string, options = {}) => renderParticipantsPage(<OwnChangeRequests />, { path: '/participants/company/change-requests', person, ...options });

describe('View 3 · Your change requests', () => {
  it('lists the requests newest first with status and the reason of a declined one', async () => {
    show('erika');
    const list = await screen.findByRole('list', { name: 'Your change requests' });
    const items = within(list).getAllByRole('listitem').filter((item) => item.parentElement === list);
    expect(items.map((item) => within(item).getByRole('heading').textContent)).toEqual(['LEI code', 'LEI code', 'EORI']);
    expect(within(items[0]).getByText('Open')).toBeInTheDocument();
    expect(within(items[1]).getByText(/does not show the LEI/)).toBeInTheDocument();
  });

  it('opens the details in place: decision, comparison, comment, documents', async () => {
    show('erika');
    fireEvent.click((await screen.findAllByRole('button', { name: 'Details' }))[1]);
    expect(screen.getByText(/Declined on/)).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'What changes' })).toHaveTextContent('529900T8BM49AURSDO55');
    expect(screen.getByText('“We add our LEI.”')).toBeInTheDocument();
  });

  it('withdraws the open request after confirmation', async () => {
    show('erika');
    fireEvent.click(await screen.findByRole('button', { name: 'Withdraw' }));
    const dialog = await screen.findByRole('dialog', { name: 'Withdraw the change request?' });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Withdraw' }));
    expect(await screen.findByText('Change request withdrawn')).toBeInTheDocument();
    expect(await screen.findAllByText('Withdrawn')).toHaveLength(2);
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Withdraw' })).not.toBeInTheDocument());
  });

  it('is read only for a Member: no new request, no withdraw', async () => {
    show('max');
    await screen.findByRole('list', { name: 'Your change requests' });
    expect(screen.queryByRole('button', { name: 'Withdraw' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'New change request' })).not.toBeInTheDocument();
  });

  it('shows the empty state', async () => {
    show('erika', { participants: { changeRequests: [] } });
    expect(await screen.findByText('No change requests yet')).toBeInTheDocument();
  });

  it('shows a stand-in that is not implemented yet (501)', async () => {
    show('erika', { participants: { failure: new CoreHttpException(501, 'urn:c3-m1:problem:not-implemented', 'not implemented') } });
    expect(await screen.findByText(/not available yet/)).toBeInTheDocument();
    expect(screen.getByText('urn:c3-m1:problem:not-implemented')).toBeInTheDocument();
  });
});
