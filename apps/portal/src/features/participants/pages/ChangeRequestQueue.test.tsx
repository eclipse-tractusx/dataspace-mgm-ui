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

import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { participantsTranslations } from '../i18n';
import { renderParticipantsPage } from '../testing/renderParticipantsPage';
import ChangeRequestQueue from './ChangeRequestQueue';

beforeAll(() => participantsTranslations.load());

const show = (person: string, options = {}) => renderParticipantsPage(<ChangeRequestQueue />, { path: '/participants/change-requests', person, ...options });

describe('View 8 · Change requests to review', () => {
  it('lists the open requests oldest first with change, documents and waiting time (Rolf)', async () => {
    show('rolf');
    const table = await screen.findByRole('table', { name: 'Change requests to review' });
    const rows = within(table).getAllByRole('row').slice(1);
    expect(rows.map((row) => within(row).getAllByRole('cell')[0].textContent)).toEqual(['Beispiel Logistik GmbH', 'Beispiel Maschinenbau GmbH']);
    expect(rows[0]).toHaveTextContent('Legal name');
    expect(rows[0]).toHaveTextContent('2 documents');
    expect(within(table).getByRole('columnheader', { name: 'Waiting' })).toBeInTheDocument();
  });

  it('filters by status tab', async () => {
    show('rolf');
    await screen.findByRole('table', { name: 'Change requests to review' });
    fireEvent.click(screen.getByRole('tab', { name: 'Approved' }));
    await waitFor(() => expect(screen.getByRole('table', { name: 'Change requests to review' })).toHaveTextContent('OSP A Beispiel GmbH'));
    expect(screen.getByRole('columnheader', { name: 'Date' })).toBeInTheDocument();
  });

  it('opens a request', async () => {
    show('rolf');
    fireEvent.click(await screen.findByRole('row', { name: 'Review the change request of Beispiel Logistik GmbH' }));
    await waitFor(() => expect(screen.getByTestId('path')).toHaveTextContent('/participants/change-requests/e0000002-0000-4000-8000-000000000002'));
  });

  it('shows the empty state', async () => {
    show('rolf', { participants: { changeRequests: [] } });
    expect(await screen.findByText('No open change requests')).toBeInTheDocument();
  });

  it('is closed to a Company Admin', async () => {
    show('erika');
    expect(await screen.findByText(/Only the staff of the onboarding service provider review change requests/)).toBeInTheDocument();
  });
});
