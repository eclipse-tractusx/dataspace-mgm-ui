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
import Companies from './Companies';

beforeAll(() => participantsTranslations.load());

const show = (person: string, options = {}) => renderParticipantsPage(<Companies />, { path: '/participants/companies', person, ...options });
const rows = () => within(screen.getByRole('table', { name: 'Companies' })).getAllByRole('row').slice(1);

describe('View 5 · Companies', () => {
  it('lists the companies newest first with BPN, status and source (Rolf, OSP Reviewer)', async () => {
    show('rolf');
    expect(await screen.findByText('5 companies')).toBeInTheDocument();
    expect(rows().map((row) => within(row).getAllByRole('cell')[0].querySelector('p')?.textContent)).toEqual([
      'Ohne Zustimmung GmbH',
      'Andere Beispiel AG',
      'Beispiel Logistik GmbH',
      'Beispiel Maschinenbau GmbH',
      'OSP A Beispiel GmbH',
    ]);
    expect(rows()[0]).toHaveTextContent('BPNL00000000U3OZ');
    expect(rows()[0]).toHaveTextContent('Requested');
  });

  it('filters by status chip and resets', async () => {
    show('rolf');
    await screen.findByText('5 companies');
    fireEvent.click(screen.getByRole('button', { name: 'Requested' }));
    expect(await screen.findByText('1 company')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }));
    expect(await screen.findByText('5 companies')).toBeInTheDocument();
  });

  it('searches by name and shows the empty state', async () => {
    show('rolf');
    await screen.findByText('5 companies');
    fireEvent.change(screen.getByRole('textbox', { name: 'Search by name or BPN' }), { target: { value: 'Beispiel Logistik SE' } });
    expect(await screen.findByText('No company matches the filters', {}, { timeout: 2000 })).toBeInTheDocument();
  });

  it('opens a company with the keyboard', async () => {
    show('rolf');
    await screen.findByText('5 companies');
    fireEvent.keyDown(screen.getByRole('row', { name: 'Open Andere Beispiel AG' }), { key: 'Enter' });
    await waitFor(() => expect(screen.getByTestId('path')).toHaveTextContent('/participants/companies/c0000004-0000-4000-8000-000000000004'));
  });

  it('is closed to a Company Admin (Erika has no view_companies)', async () => {
    show('erika');
    expect(await screen.findByText(/Only staff of the onboarding service provider see all companies/)).toBeInTheDocument();
  });

  it('explains a 403 of the module and a 400 validation with reset', async () => {
    show('rolf', { participants: { failure: new CoreHttpException(403, 'urn:c3-m1:problem:forbidden', 'forbidden') } });
    expect(await screen.findByText(/Only staff of the onboarding service provider/)).toBeInTheDocument();
  });

  it('offers to reset the filters after 400 validation', async () => {
    show('rolf', { participants: { failure: new CoreHttpException(400, 'urn:c3-m1:problem:validation', 'validation') } });
    expect(await screen.findByText('A value is not valid. Check your input.')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Reset filters' }).length).toBeGreaterThan(0);
  });
});
