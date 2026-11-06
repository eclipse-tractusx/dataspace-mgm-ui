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

import { COMPANY_CREDENTIALS } from '@dataspace-mgm/c4-m1-core/testing';
import { BEISPIEL_MASCHINENBAU_WALLET_FAILED, BEISPIEL_MASCHINENBAU_WALLET_VALIDATING } from '@dataspace-mgm/c4-m2-core/testing';
import { CoreHttpException } from '@dataspace-mgm/core-http';
import { fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { walletsTranslations } from './i18n';
import { ERIKA, ERIKAS_COMPANY, MAX, OTTO, atFixturesNow, recordingC4M1, recordingC4M2, showWallets } from './walletsTestApp';

beforeAll(() => walletsTranslations.load());
beforeEach(atFixturesNow);
afterEach(() => vi.useRealTimers());

const companies = [ERIKAS_COMPANY];
const showWallet = (options: Partial<Parameters<typeof showWallets>[1]> = {}) =>
  showWallets('/wallets', { session: ERIKA, companies, c4m1: recordingC4M1({ companyCredentials: COMPANY_CREDENTIALS.twoDataspaces }).module, c4m2: recordingC4M2().module, ...options });
const front = () => screen.getByTestId('front-pass');

describe('Wallets as a service: your dataspace wallet (C4-M2 getWallet)', () => {
  it('shows the wallet as a pass with the company, BPN, provider, activation date and the DID in full', async () => {
    showWallet();
    const pass = await screen.findByRole('article', { name: 'Dataspace wallet' });
    expect(within(pass).getByText('Catena-X')).toBeInTheDocument();
    expect(within(pass).getByText('Active')).toBeInTheDocument();
    expect(within(pass).getByText('Beispiel Maschinenbau GmbH')).toBeInTheDocument();
    expect(within(within(pass).getByRole('group', { name: 'BPN' })).getByText('BPNLIUK2REMLK3F4')).toBeInTheDocument();
    expect(within(within(pass).getByRole('group', { name: 'Provider' })).getByText('CSP wallet')).toBeInTheDocument();
    expect(within(within(pass).getByRole('group', { name: 'Active since' })).getByText('03 Nov 2026')).toBeInTheDocument();
    expect(within(pass).getByText('did:web:csp-wallet.example.org:BPNLIUK2REMLK3F4')).toBeInTheDocument();
    expect(within(pass).getByRole('button', { name: 'Copy did:web:csp-wallet.example.org:BPNLIUK2REMLK3F4' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Your dataspace wallet' })).toBeInTheDocument();
  });

  it('lists the addresses for the connectors and links to the wallet accounts', async () => {
    showWallet();
    const connectors = await screen.findByRole('region', { name: 'For your connectors' });
    expect(within(connectors).getByText('https://csp-wallet.example.org/api/credentials/v1/participants/BPNLIUK2REMLK3F4')).toBeInTheDocument();
    expect(within(connectors).getByText('https://bdrs.example.org/api/directory')).toBeInTheDocument();
    expect(within(connectors).getByText('One per wallet account')).toBeInTheDocument();
    expect(within(connectors).getByText('https://csp-wallet.example.org/BPNLIUK2REMLK3F4/did.json')).toBeInTheDocument();
    expect(await screen.findByText('2 technical users can sign in')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Wallet accounts/ })).toHaveAttribute('href', '/wallets/wallet-accounts');
  });

  it('stacks the credentials: the first in front, the others as headers that bring theirs to the front', async () => {
    showWallet();
    const stack = await screen.findByRole('region', { name: 'Credentials' });
    expect(await within(stack).findByText('All issued')).toBeInTheDocument();
    expect(within(stack).getByRole('link', { name: 'Details →' })).toHaveAttribute('href', '/wallets/credentials');
    expect(within(front()).getByRole('article', { name: 'BPN credential of Catena-X' })).toBeInTheDocument();
    expect(within(front()).getByRole('img', { name: 'Catena-X' })).toHaveTextContent('CX');
    // The section heading "Credentials" is an h2, so the name of the pass in front is an h3.
    expect(within(front()).getByRole('heading', { level: 3, name: 'BPN credential' })).toBeInTheDocument();
    expect(within(stack).getByText('Select a card to bring it to the front.')).toBeInTheDocument();

    fireEvent.click(within(stack).getByRole('button', { name: 'Show the Membership credential of Semiconductor dataspace' }));
    expect(within(front()).getByRole('article', { name: 'Membership credential of Semiconductor dataspace' })).toBeInTheDocument();
    expect(within(front()).getByRole('img', { name: 'Semiconductor dataspace' })).toHaveTextContent('SC');
    expect(within(stack).getByRole('button', { name: 'Show the BPN credential of Catena-X' })).toBeInTheDocument();
    expect(within(stack).queryByRole('button', { name: 'Show the Membership credential of Semiconductor dataspace' })).not.toBeInTheDocument();
  });

  it('counts the issued credentials in the summary', async () => {
    showWallet({ c4m1: recordingC4M1({ companyCredentials: COMPANY_CREDENTIALS.requested }).module });
    expect(await screen.findByText('1 of 2 issued')).toBeInTheDocument();
  });

  it('shows the BPN of the session when C3-M1 does not know the company', async () => {
    showWallet({ companies: [] });
    const pass = await screen.findByRole('article', { name: 'Dataspace wallet' });
    expect(within(pass).getAllByText('BPNLIUK2REMLK3F4')).toHaveLength(2);
  });

  it('leaves out the credentials for a person without view_credentials', async () => {
    showWallet({ session: { ...ERIKA, permissions: ['view_dataspace_wallet'] } });
    expect(await screen.findByRole('article', { name: 'Dataspace wallet' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Credentials' })).not.toBeInTheDocument();
  });

  it('says that the wallet is being checked while the DID document is validated', async () => {
    showWallet({ c4m2: recordingC4M2({ wallets: [BEISPIEL_MASCHINENBAU_WALLET_VALIDATING] }).module });
    expect(await screen.findByText(/Your wallet is being checked\./)).toBeInTheDocument();
    expect(screen.getByText('Checking the DID')).toBeInTheDocument();
  });

  it('shows why the wallet could not be set up', async () => {
    showWallet({ c4m2: recordingC4M2({ wallets: [BEISPIEL_MASCHINENBAU_WALLET_FAILED] }).module });
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Your wallet could not be set up. The DID document of the wallet could not be found.');
    expect(within(alert).getByText('failureReason: DID_NOT_RESOLVABLE')).toBeInTheDocument();
  });

  it('shows an empty card when the company has no wallet yet (404)', async () => {
    showWallet({ c4m2: recordingC4M2({ wallets: [] }).module });
    expect(await screen.findByRole('heading', { name: 'Your company has no dataspace wallet yet' })).toBeInTheDocument();
    expect(screen.getByText('urn:c4-m2:problem:not-found')).toBeInTheDocument();
  });

  it('shows a 403 of the module with its Problem Details type', async () => {
    showWallet({ c4m2: recordingC4M2({ walletFailure: new CoreHttpException(403, 'urn:c4-m2:problem:forbidden', 'forbidden') }).module });
    expect(await screen.findByText(/dataspace wallet of your company \(HTTP 403\)/)).toBeInTheDocument();
    expect(screen.getByText('urn:c4-m2:problem:forbidden')).toBeInTheDocument();
  });

  it('shows another error of the module with its HTTP status', async () => {
    showWallet({ c4m2: recordingC4M2({ walletFailure: new CoreHttpException(503, 'urn:c4-m2:problem:unavailable', 'try later') }).module });
    expect(await screen.findByText('The dataspace wallet could not be loaded (HTTP 503): try later')).toBeInTheDocument();
  });

  it('tells a person without a company', async () => {
    showWallet({ session: { ...OTTO, permissions: ['view_dataspace_wallet'] } });
    expect(await screen.findByText(/A dataspace wallet belongs to a company/)).toBeInTheDocument();
  });

  it('says it is loading while the wallet loads', async () => {
    showWallet();
    // findBy throws when the loading state never shows; it is gone again once the wallet is there.
    await screen.findByRole('status', { name: 'Loading your dataspace wallet…' });
    expect(await screen.findByRole('article', { name: 'Dataspace wallet' })).toBeInTheDocument();
  });

  it('says so when C4-M2 is not connected', async () => {
    showWallet({ c4m2: undefined });
    expect(await screen.findByText(/not connected to its backend/)).toBeInTheDocument();
  });

  it('keeps the wallet from a person without view_dataspace_wallet', async () => {
    showWallet({ session: MAX });
    expect(await screen.findByText(/You may not see the credentials or wallets/)).toBeInTheDocument();
  });

  it('shows the feature tabs with the dataspace wallet selected', async () => {
    showWallet();
    const tabs = await screen.findByRole('navigation', { name: 'Wallets as a service' });
    expect(within(tabs).getAllByRole('tab').map((tab) => tab.textContent)).toEqual(['Dataspace wallet', 'Credentials', 'Wallet accounts']);
    expect(within(tabs).getByRole('tab', { name: 'Dataspace wallet' })).toHaveAttribute('aria-selected', 'true');
  });
});
