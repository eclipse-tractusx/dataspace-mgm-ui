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

import type { WalletAccountCredentialsAnemic, WalletAccountRepository } from '@dataspace-mgm/c4-m2-core';
import {
  EDC_CONNECTOR_PRODUCTION,
  SUPPLIER_DATA_INTEGRATION,
  WALLET_ACCOUNT_CREDENTIALS,
  type InMemoryWalletAccountRepository,
} from '@dataspace-mgm/c4-m2-core/testing';
import { CoreHttpException } from '@dataspace-mgm/core-http';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { walletsTranslations } from './i18n';
import { ERIKA, MAX, OTTO, atFixturesNow, recordingC4M2, showWallets } from './walletsTestApp';

beforeAll(() => walletsTranslations.load());
beforeEach(atFixturesNow);
afterEach(() => vi.useRealTimers());

const PATH = '/wallets/wallet-accounts';
const list = () => screen.findByRole('navigation', { name: 'Technical users with wallet access' });
const detail = () => screen.getByRole('region', { name: /^EDC connector/ });
const secret = WALLET_ACCOUNT_CREDENTIALS.clientSecret;

/** The accounts of the fixtures, with another answer of the retrieval. */
const retrievalAnswers =
  (retrieveCredentials: WalletAccountRepository['retrieveCredentials']) =>
  (inner: InMemoryWalletAccountRepository): WalletAccountRepository => ({
    getWalletAccount: (technicalUserId) => inner.getWalletAccount(technicalUserId),
    retrieveCredentials,
  });

async function retrieveNow() {
  fireEvent.click(await screen.findByRole('button', { name: 'Retrieve access data' }));
  const dialog = await screen.findByRole('dialog', { name: 'Retrieve the access data?' });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Retrieve now' }));
}

describe('Wallets as a service: wallet accounts (C4-M2 getWalletAccount, retrieveWalletAccountCredentials)', () => {
  it('lists the technical users with wallet access and shows the first one in the detail', async () => {
    const { module, accountRepository } = recordingC4M2();
    showWallets(PATH, { session: ERIKA, c4m2: module });
    const users = await list();
    const items = within(users).getAllByRole('button');
    expect(items.map((item) => item.textContent)).toEqual(['EDC connector productionReady to retrievesa201', 'EDC connector testRetrievedsa202']);
    expect(items[0]).toHaveAttribute('aria-current', 'true');
    expect(within(users).queryByText(SUPPLIER_DATA_INTEGRATION.name)).not.toBeInTheDocument();

    const account = detail();
    expect(within(account).getByRole('heading', { name: 'EDC connector production' })).toBeInTheDocument();
    expect(within(account).getByText('Connector of the plant in Stuttgart')).toBeInTheDocument();
    expect(within(account).getByText('Dataspace wallet of the CSP')).toBeInTheDocument();
    expect(within(account).getByText('05 Dec 2026, 08:12')).toBeInTheDocument();
    // The wallet account reference is cut in the middle, as in the mockup; the title and the copy keep it in full.
    expect(within(account).getByText('b7a10001…00000001')).toHaveAttribute('title', 'b7a10001-0000-4000-8000-000000000001');
    expect(within(account).getByRole('button', { name: 'Copy b7a10001-0000-4000-8000-000000000001' })).toBeInTheDocument();
    expect(within(account).getByText('Ready to retrieve until 05 Dec 2026.')).toBeInTheDocument();
    expect(within(account).getByRole('button', { name: 'Retrieve access data' })).toBeInTheDocument();
    expect(screen.getByText(/can be retrieved/)).toHaveTextContent('The access data of a wallet account can be retrieved once;');
    expect(accountRepository.calls.map((call) => call.operation)).toEqual(['getWalletAccount', 'getWalletAccount']);
  });

  it('shows another technical user on a click, without the button when the access data were retrieved', async () => {
    showWallets(PATH, { session: ERIKA, c4m2: recordingC4M2().module });
    fireEvent.click(within(await list()).getByRole('button', { name: /EDC connector test/ }));
    const account = detail();
    expect(within(account).getByRole('heading', { name: 'EDC connector test' })).toBeInTheDocument();
    expect(within(account).getByText('Retrieved. If they are lost, delete the technical user and create it again.')).toBeInTheDocument();
    expect(within(account).queryByRole('button', { name: 'Retrieve access data' })).not.toBeInTheDocument();
  });

  it('asks first and retrieves nothing on cancel', async () => {
    const { module, accountRepository } = recordingC4M2();
    showWallets(PATH, { session: ERIKA, c4m2: module });
    fireEvent.click(await screen.findByRole('button', { name: 'Retrieve access data' }));
    const dialog = await screen.findByRole('dialog', { name: 'Retrieve the access data?' });
    expect(dialog).toHaveTextContent('The token address, client ID and client secret of EDC connector production for your dataspace wallet.');
    expect(dialog).toHaveTextContent('They are shown only once.');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(accountRepository.calls.filter((call) => call.operation === 'retrieveCredentials')).toEqual([]);
  });

  it('shows the access data inline once, the secret masked until shown, and forgets them when entered', async () => {
    const { module, accountRepository } = recordingC4M2();
    showWallets(PATH, { session: ERIKA, c4m2: module });
    await retrieveNow();

    const panel = await screen.findByRole('region', { name: 'Access data of the wallet account' });
    expect(within(panel).getByText('Shown only once. Copy them into the connector now.')).toBeInTheDocument();
    expect(within(panel).getByText(WALLET_ACCOUNT_CREDENTIALS.tokenUrl)).toBeInTheDocument();
    expect(within(panel).getByText(WALLET_ACCOUNT_CREDENTIALS.clientId)).toBeInTheDocument();
    expect(within(panel).getByText('did:web:csp-wallet.example.org:BPNLIUK2REMLK3F4')).toBeInTheDocument();
    expect(within(panel).queryByText(secret)).not.toBeInTheDocument();
    expect(within(panel).getByRole('button', { name: 'Copy Client secret' })).toBeInTheDocument();

    fireEvent.click(within(panel).getByRole('button', { name: 'Show the client secret' }));
    expect(within(panel).getByText(secret)).toBeInTheDocument();
    fireEvent.click(within(panel).getByRole('button', { name: 'Hide the client secret' }));
    expect(within(panel).queryByText(secret)).not.toBeInTheDocument();

    // The list reloads: the account reports RETRIEVED, the button is gone.
    expect(await within(detail()).findByText(/^Retrieved\. If they are lost/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Retrieve access data' })).not.toBeInTheDocument();
    expect(accountRepository.calls.filter((call) => call.operation === 'retrieveCredentials')).toEqual([
      { operation: 'retrieveCredentials', technicalUserId: EDC_CONNECTOR_PRODUCTION.id },
    ]);

    fireEvent.click(within(panel).getByRole('button', { name: 'I have entered them' }));
    expect(screen.queryByRole('region', { name: 'Access data of the wallet account' })).not.toBeInTheDocument();
    expect(screen.queryByText(secret)).not.toBeInTheDocument();
  });

  it('warns with the problem type when someone else retrieved the access data meanwhile (410)', async () => {
    const { module } = recordingC4M2();
    showWallets(PATH, { session: ERIKA, c4m2: module });
    await screen.findByRole('button', { name: 'Retrieve access data' });
    await module.retrieveWalletAccountCredentials.execute(EDC_CONNECTOR_PRODUCTION.id);
    await retrieveNow();
    expect(await screen.findByText('Another person of your company retrieved the access data of EDC connector production a moment ago (HTTP 410).')).toBeInTheDocument();
    expect(screen.getByText('urn:c4-m2:problem:already-retrieved')).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Access data of the wallet account' })).not.toBeInTheDocument();
  });

  it('hides the retrieval from a person without retrieve_wallet_credentials', async () => {
    showWallets(PATH, { session: { ...ERIKA, permissions: ['view_dataspace_wallet'] }, c4m2: recordingC4M2().module });
    expect(await within(await list()).findByText('EDC connector production')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Retrieve access data' })).not.toBeInTheDocument();
  });

  it('shows an empty card when no technical user has wallet access', async () => {
    showWallets(PATH, { session: ERIKA, c4m2: recordingC4M2({ technicalUsers: [SUPPLIER_DATA_INTEGRATION] }).module });
    expect(await screen.findByRole('heading', { name: 'No technical user with wallet access' })).toBeInTheDocument();
    const button = screen.getByRole('button', { name: 'Technical users' });
    expect(button).toBeDisabled();
    // A disabled button shows no tooltip, so the hint is a visible caption it points to.
    expect(button).toHaveAccessibleDescription('Technical users (C2-M3), coming soon');
  });

  it('shows a 403 with its Problem Details type', async () => {
    const forbidden = new CoreHttpException(403, 'urn:c4-m2:problem:forbidden', 'forbidden');
    showWallets(PATH, { session: ERIKA, c4m2: recordingC4M2({ technicalUserFailure: forbidden }).module });
    expect(await screen.findByText(/wallet accounts of your company \(HTTP 403\)/)).toBeInTheDocument();
    expect(screen.getByText('urn:c4-m2:problem:forbidden')).toBeInTheDocument();
  });

  it('shows another error with its HTTP status', async () => {
    const unavailable = new CoreHttpException(503, 'urn:c4-m2:problem:unavailable', 'try later');
    showWallets(PATH, { session: ERIKA, c4m2: recordingC4M2({ technicalUserFailure: unavailable }).module });
    expect(await screen.findByText('The wallet accounts could not be loaded (HTTP 503): try later')).toBeInTheDocument();
  });

  it('tells a person without a company', async () => {
    showWallets(PATH, { session: { ...OTTO, permissions: ['view_dataspace_wallet'] }, c4m2: recordingC4M2().module });
    expect(await screen.findByText(/Wallet accounts belong to the technical users of a company/)).toBeInTheDocument();
  });

  it.each([
    ['expired', 410, 'urn:c4-m2:problem:credentials-expired', 'Warning', 'The access data of EDC connector production were not retrieved in time and are deleted (HTTP 410).'],
    ['no-credentials', 409, 'urn:c4-m2:problem:no-credentials', 'Warning', 'The wallet account of EDC connector production has no access data to retrieve (HTTP 409).'],
    ['invalid-state', 409, 'urn:c4-m2:problem:invalid-state', 'Warning', 'The wallet account of EDC connector production is not active (HTTP 409).'],
    ['forbidden', 403, 'urn:c4-m2:problem:forbidden', 'Error', 'You may not retrieve access data of wallet accounts (HTTP 403). Ask your Company Admin for the role IT Admin.'],
    ['failed', 500, 'urn:c4-m2:problem:internal', 'Error', 'The access data of EDC connector production could not be retrieved (HTTP 500): broken'],
    ['failed', 409, 'urn:c4-m2:problem:wallet-not-active', 'Error', 'The access data of EDC connector production could not be retrieved (HTTP 409): broken'],
  ])('says %s (HTTP %i) with the Problem Details type of the retrieval', async (_status, httpStatus, problemType, severity, text) => {
    const failing = retrievalAnswers(() => Promise.reject(new CoreHttpException(httpStatus, problemType, 'broken')));
    showWallets(PATH, { session: ERIKA, c4m2: recordingC4M2({ accounts: failing }).module });
    await retrieveNow();
    const alert = (await screen.findByText(text)).closest('[role="alert"]') as HTMLElement;
    expect(within(alert).getByText(problemType)).toBeInTheDocument();
    expect(alert).toHaveClass(`MuiAlert-color${severity}`);
    expect(screen.queryByRole('region', { name: 'Access data of the wallet account' })).not.toBeInTheDocument();
  });

  it('says not-found (HTTP 404) when the technical user has no wallet account meanwhile', async () => {
    showWallets(PATH, { session: ERIKA, c4m2: recordingC4M2({ accounts: retrievalAnswers(() => Promise.resolve(null)) }).module });
    await retrieveNow();
    expect(await screen.findByText('EDC connector production has no wallet account at your onboarding service provider (HTTP 404).')).toBeInTheDocument();
    expect(screen.getByText('urn:c4-m2:problem:not-found')).toBeInTheDocument();
  });

  it('keeps the person on the technical user while the access data are retrieved and shown', async () => {
    let answer: (credentials: WalletAccountCredentialsAnemic) => void = () => undefined;
    const late = retrievalAnswers(() => new Promise((resolve) => (answer = resolve)));
    showWallets(PATH, { session: ERIKA, c4m2: recordingC4M2({ accounts: late }).module });
    await retrieveNow();
    const other = within(await list()).getByRole('button', { name: /EDC connector test/ });
    await waitFor(() => expect(other).toBeDisabled());
    expect(other).toHaveAccessibleDescription('Enter the access data into the connector first. Then you can choose another technical user.');
    fireEvent.click(other);
    expect(within(detail()).getByRole('heading', { name: 'EDC connector production' })).toBeInTheDocument();

    await act(async () => answer(WALLET_ACCOUNT_CREDENTIALS));
    const panel = await screen.findByRole('region', { name: 'Access data of the wallet account' });
    expect(within(panel).getByText(WALLET_ACCOUNT_CREDENTIALS.tokenUrl)).toBeInTheDocument();
    expect(other).toBeDisabled();

    fireEvent.click(within(panel).getByRole('button', { name: 'I have entered them' }));
    expect(other).toBeEnabled();
    fireEvent.click(other);
    expect(within(detail()).getByRole('heading', { name: 'EDC connector test' })).toBeInTheDocument();
  });

  it('keeps the access data on the screen when the list cannot be loaded again after the retrieval', async () => {
    let retrieved = false;
    const flaky = (inner: InMemoryWalletAccountRepository): WalletAccountRepository => ({
      getWalletAccount: (technicalUserId) =>
        retrieved ? Promise.reject(new CoreHttpException(503, 'urn:c4-m2:problem:unavailable', 'try later')) : inner.getWalletAccount(technicalUserId),
      retrieveCredentials: async (technicalUserId) => {
        const credentials = await inner.retrieveCredentials(technicalUserId);
        retrieved = true;
        return credentials;
      },
    });
    showWallets(PATH, { session: ERIKA, c4m2: recordingC4M2({ accounts: flaky }).module });
    await retrieveNow();
    expect(await screen.findByText('The wallet accounts could not be loaded (HTTP 503): try later')).toBeInTheDocument();
    const panel = screen.getByRole('region', { name: 'Access data of the wallet account' });
    expect(within(panel).getByText(WALLET_ACCOUNT_CREDENTIALS.clientId)).toBeInTheDocument();
    fireEvent.click(within(panel).getByRole('button', { name: 'I have entered them' }));
    expect(screen.queryByRole('region', { name: 'Access data of the wallet account' })).not.toBeInTheDocument();
  });

  it('tells a person of no company without view_dataspace_wallet that wallet accounts belong to a company', async () => {
    showWallets(PATH, { session: OTTO, c4m2: recordingC4M2().module });
    expect(await screen.findByText(/Wallet accounts belong to the technical users of a company/)).toBeInTheDocument();
    expect(screen.queryByText(/Ask your Company Admin/)).not.toBeInTheDocument();
  });

  it('hides the page from a person without view_dataspace_wallet', async () => {
    showWallets(PATH, { session: MAX, c4m2: recordingC4M2().module });
    expect(await screen.findByText('You may not see the wallet accounts of your company. Ask your Company Admin for the role IT Admin.')).toBeInTheDocument();
  });

  it('says it is loading', async () => {
    showWallets(PATH, { session: ERIKA, c4m2: recordingC4M2().module });
    expect(screen.getByRole('status', { name: 'Loading the wallet accounts…' })).toBeInTheDocument();
    await list();
  });

  it('shows the feature tabs with the wallet accounts selected', async () => {
    showWallets(PATH, { session: ERIKA, c4m2: recordingC4M2().module });
    const tabs = await screen.findByRole('navigation', { name: 'Wallets as a service' });
    expect(within(tabs).getByRole('tab', { name: 'Wallet accounts' })).toHaveAttribute('aria-selected', 'true');
    await list();
  });
});
