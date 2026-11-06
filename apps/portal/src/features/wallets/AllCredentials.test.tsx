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

import { c4m1Problem, type InMemoryCredentialCall } from '@dataspace-mgm/c4-m1-core/testing';
import { fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { walletsTranslations } from './i18n';
import { OTTO, ROLF, atFixturesNow, recordingC4M1, showWallets } from './walletsTestApp';

beforeAll(() => walletsTranslations.load());
beforeEach(atFixturesNow);
afterEach(() => vi.useRealTimers());

const lastQuery = (calls: ReadonlyArray<InMemoryCredentialCall>) => {
  const lists = calls.filter((call) => call.method === 'listCredentials');
  const last = lists[lists.length - 1];
  return last?.method === 'listCredentials' ? last.query : null;
};

const table = () => screen.findByRole('table', { name: 'All credentials' });

describe('Wallets as a service: credentials of all companies (C4-M1 listCredentials)', () => {
  it('shows what needs attention first, then all credentials newest change first', async () => {
    showWallets('/wallets/all-credentials', { session: OTTO, c4m1: recordingC4M1().module });

    const queue = await screen.findByRole('region', { name: /Needs attention/ });
    const cards = within(queue).getAllByRole('article');
    expect(cards).toHaveLength(3);
    expect(cards[0]).toHaveTextContent('Revocation pending');
    expect(cards[0]).toHaveTextContent('Revoke at the Credential Issuer by hand, then confirm');
    expect(cards[1]).toHaveTextContent('The credential request ended in state ERROR at the IssuerService.');
    expect(cards[2]).toHaveTextContent('for 2 days');

    const rows = within(await table()).getAllByRole('row').slice(1);
    expect(rows).toHaveLength(10);
    expect(rows[0]).toHaveTextContent('BPNL0000000INA01');
    expect(rows[1]).toHaveTextContent('Ohne Zustimmung GmbH');
    expect(rows[1]).toHaveTextContent('BPNL00000000U3OZ');
    expect(rows[1]).toHaveTextContent('for 20 h');
    expect(rows[1]).toHaveTextContent('05 Nov 2026, 16:10');
    expect(screen.getByText('16 credentials')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });

  it('filters by a status chip with its count, and pages', async () => {
    const { module, credentialRepository } = recordingC4M1();
    showWallets('/wallets/all-credentials', { session: OTTO, c4m1: module });

    const issued = await screen.findByRole('button', { name: 'Issued 11' });
    fireEvent.click(issued);
    expect(issued).toHaveAttribute('aria-pressed', 'true');
    expect(await screen.findByText('11 credentials')).toBeInTheDocument();
    expect(lastQuery(credentialRepository.calls)).toMatchObject({ status: ['ISSUED'], page: 0, size: 10 });

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByText('Page 2 of 2')).toBeInTheDocument();
    expect(lastQuery(credentialRepository.calls)).toMatchObject({ status: ['ISSUED'], page: 1 });

    fireEvent.click(issued);
    expect(await screen.findByText('16 credentials')).toBeInTheDocument();
    expect(lastQuery(credentialRepository.calls)).toMatchObject({ status: [], page: 0 });
  });

  it('shows the orders open for more than 24 h with the requestedBefore of the queue', async () => {
    const { module, credentialRepository } = recordingC4M1();
    showWallets('/wallets/all-credentials', { session: OTTO, c4m1: module });

    fireEvent.click(await screen.findByRole('button', { name: 'Open for more than 24 h' }));
    expect(await screen.findByText('1 credential')).toBeInTheDocument();
    expect(lastQuery(credentialRepository.calls)).toMatchObject({ status: ['REQUESTED'], requestedBefore: '2026-11-05T12:00:00.000Z' });
    expect(within(await table()).getAllByRole('row')[1]).toHaveTextContent('BPNL00000000IH01');
  });

  it('filters by the credential type', async () => {
    const { module, credentialRepository } = recordingC4M1();
    showWallets('/wallets/all-credentials', { session: OTTO, c4m1: module });

    fireEvent.mouseDown(await screen.findByRole('combobox', { name: 'Credential type' }));
    fireEvent.click(await screen.findByRole('option', { name: 'BPN credential' }));
    expect(await screen.findByText('8 credentials')).toBeInTheDocument();
    expect(lastQuery(credentialRepository.calls)).toMatchObject({ credentialType: 'BPN' });
  });

  it('says when no credential matches and resets the filters', async () => {
    showWallets('/wallets/all-credentials', { session: OTTO, c4m1: recordingC4M1().module });

    fireEvent.click(await screen.findByRole('button', { name: 'Revocation pending 1' }));
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Credential type' }));
    fireEvent.click(await screen.findByRole('option', { name: 'BPN credential' }));
    expect(await screen.findByRole('heading', { name: 'No credential matches the filters' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }));
    expect(await screen.findByText('16 credentials')).toBeInTheDocument();
  });

  it('opens a credential on its own page from a row', async () => {
    showWallets('/wallets/all-credentials', { session: OTTO, c4m1: recordingC4M1().module });
    const rows = within(await table()).getAllByRole('row');
    fireEvent.click(within(rows[2]).getByText('BPN'));
    expect(await screen.findByRole('heading', { level: 1, name: 'BPN credential' })).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/wallets/all-credentials/c4c00002-0000-4000-8000-000000000002');
  });

  it('opens the confirmation from the "Needs attention" card', async () => {
    showWallets('/wallets/all-credentials', { session: OTTO, c4m1: recordingC4M1().module });
    const queue = await screen.findByRole('region', { name: /Needs attention/ });
    fireEvent.click(within(queue).getByRole('button', { name: 'Confirm revocation' }));
    expect(await screen.findByRole('dialog', { name: 'Confirm the revocation' })).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('?confirm=1');
  });

  it('says it is loading', () => {
    showWallets('/wallets/all-credentials', { session: OTTO, c4m1: recordingC4M1().module });
    expect(screen.getByRole('status', { name: 'Loading the credentials…' })).toBeInTheDocument();
  });

  it('hides the page from a person without manage_credentials and does not call the module', async () => {
    const { module, credentialRepository } = recordingC4M1();
    showWallets('/wallets/all-credentials', { session: ROLF, c4m1: module });
    expect(await screen.findByText(/This needs the role OSP Admin/)).toBeInTheDocument();
    expect(credentialRepository.calls).toEqual([]);
  });

  it('shows a 403 of the module with its Problem Details type', async () => {
    showWallets('/wallets/all-credentials', { session: OTTO, c4m1: recordingC4M1({ credentialFailure: c4m1Problem(403, 'forbidden') }).module });
    expect(await screen.findByText(/\(HTTP 403\)\. This needs the role OSP Admin/)).toBeInTheDocument();
    expect(screen.getByText('urn:c4-m1:problem:forbidden')).toBeInTheDocument();
  });

  it('shows the feature tab of OSP staff', async () => {
    showWallets('/wallets/all-credentials', { session: OTTO, c4m1: recordingC4M1().module });
    const tabs = await screen.findByRole('navigation', { name: 'Wallets as a service' });
    expect(within(tabs).getAllByRole('tab').map((tab) => tab.textContent)).toEqual(['Credentials of all companies']);
  });
});
