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

import { CREDENTIALS_OF_ALL_COMPANIES, FAILED_CREDENTIAL, c4m1Problem, type InMemoryCredentialCall } from '@dataspace-mgm/c4-m1-core/testing';
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

  it('disables the status chips while the open orders are shown, and says why', async () => {
    const { module, credentialRepository } = recordingC4M1();
    showWallets('/wallets/all-credentials', { session: OTTO, c4m1: module });

    const failed = await screen.findByRole('button', { name: 'Failed 1' });
    fireEvent.click(failed);
    fireEvent.click(screen.getByRole('button', { name: 'Open for more than 24 h' }));
    expect(await screen.findByText('1 credential')).toBeInTheDocument();
    expect(failed).toHaveAttribute('aria-pressed', 'false');
    expect(failed).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(failed);
    expect(failed).toHaveAttribute('aria-pressed', 'false');
    expect(lastQuery(credentialRepository.calls)).toMatchObject({ status: ['REQUESTED'] });
    fireEvent.mouseOver(failed);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Turn off "Open for more than 24 h" to filter by status.');
  });

  it('keeps the filters in the address, so they survive a visit of a credential', async () => {
    showWallets('/wallets/all-credentials', { session: OTTO, c4m1: recordingC4M1().module });

    fireEvent.click(await screen.findByRole('button', { name: 'Issued 11' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Next' }));
    expect(await screen.findByText('Page 2 of 2')).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/wallets/all-credentials?status=ISSUED&page=2');

    fireEvent.click(within(await table()).getAllByRole('row')[1].querySelector('a') as HTMLElement);
    expect(await screen.findByRole('heading', { level: 1, name: 'BPN credential' })).toBeInTheDocument();
    fireEvent.click(await screen.findByRole('link', { name: 'Credentials of all companies' }));
    expect(await screen.findByText('Page 2 of 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Issued 11' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('goes to the last page when the page of the address is past the end', async () => {
    const { module, credentialRepository } = recordingC4M1();
    showWallets('/wallets/all-credentials?page=9', { session: OTTO, c4m1: module });
    expect(await screen.findByText('Page 2 of 2')).toBeInTheDocument();
    expect(lastQuery(credentialRepository.calls)).toMatchObject({ page: 1 });
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

  it('shows the full number of open items when the queue holds only the first page of each kind', async () => {
    const failed = Array.from({ length: 101 }, (_, index) => ({ ...FAILED_CREDENTIAL, id: `c4c10000-0000-4000-8000-${String(index).padStart(12, '0')}` }));
    showWallets('/wallets/all-credentials', { session: OTTO, c4m1: recordingC4M1({ credentials: [...CREDENTIALS_OF_ALL_COMPANIES, ...failed] }).module });
    const queue = await screen.findByRole('region', { name: /Needs attention/ });
    expect(within(queue).getByRole('heading', { level: 2 })).toHaveTextContent('Needs attention104');
    expect(within(queue).getByText('Showing 102 of 104.')).toBeInTheDocument();
  });

  it('names a company that has neither a name nor a BPN yet', async () => {
    const unknown = { ...FAILED_CREDENTIAL, companyName: null, bpn: null };
    showWallets('/wallets/all-credentials', { session: OTTO, c4m1: recordingC4M1({ credentials: [unknown] }).module });
    expect(await screen.findByRole('article', { name: 'Membership credential of Not known yet' })).toBeInTheDocument();
    expect(within(await table()).getByRole('link', { name: 'Not known yet' })).toBeInTheDocument();
  });

  it('shows another error of the queue with its HTTP status', async () => {
    showWallets('/wallets/all-credentials', { session: OTTO, c4m1: recordingC4M1({ credentialFailure: c4m1Problem(503, 'unavailable', 'try later') }).module });
    expect(await screen.findByText(/HTTP 503/)).toHaveTextContent('try later');
    expect(screen.getByText('urn:c4-m1:problem:unavailable')).toBeInTheDocument();
  });

  it('says when the module does not accept the filters (400)', async () => {
    showWallets('/wallets/all-credentials', { session: OTTO, c4m1: recordingC4M1({ listFailure: c4m1Problem(400, 'validation') }).module });
    expect(await screen.findByText('The onboarding service provider did not accept the filters (HTTP 400).')).toBeInTheDocument();
    expect(screen.getByText('urn:c4-m1:problem:validation')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /Needs attention/ })).toBeInTheDocument();
  });

  it('shows another error of the list with its HTTP status', async () => {
    showWallets('/wallets/all-credentials', { session: OTTO, c4m1: recordingC4M1({ listFailure: c4m1Problem(502, 'upstream-error', 'issuer down') }).module });
    expect(await screen.findByText(/HTTP 502/)).toHaveTextContent('issuer down');
    expect(screen.getByText('urn:c4-m1:problem:upstream-error')).toBeInTheDocument();
  });

  it('shows the feature tab of OSP staff', async () => {
    showWallets('/wallets/all-credentials', { session: OTTO, c4m1: recordingC4M1().module });
    const tabs = await screen.findByRole('navigation', { name: 'Wallets as a service' });
    expect(within(tabs).getAllByRole('tab').map((tab) => tab.textContent)).toEqual(['Credentials of all companies']);
  });
});
