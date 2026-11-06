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

import { COMPANY_CREDENTIALS, c4m1Problem } from '@dataspace-mgm/c4-m1-core/testing';
import { fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { walletsTranslations } from './i18n';
import { ERIKA, MAX, OTTO, atFixturesNow, recordingC4M1, showWallets } from './walletsTestApp';

beforeAll(() => walletsTranslations.load());
beforeEach(atFixturesNow);
afterEach(() => vi.useRealTimers());

const pass = (name: string) => screen.findByRole('article', { name });

describe('Wallets as a service: your credentials (C4-M1 listCompanyCredentials)', () => {
  it('shows the issued credentials as passes with the logo slot of their dataspace', async () => {
    const { module, companyRepository } = recordingC4M1();
    showWallets('/wallets/credentials', { session: ERIKA, c4m1: module });

    const bpn = await pass('BPN credential of Catena-X');
    expect(within(bpn).getByRole('img', { name: 'Catena-X' })).toHaveTextContent('CX');
    expect(within(bpn).getByRole('heading', { level: 2, name: 'BPN credential' })).toBeInTheDocument();
    expect(within(bpn).getByText('Business partner number')).toBeInTheDocument();
    expect(within(bpn).getByText('BPNLIUK2REMLK3F4')).toBeInTheDocument();
    expect(within(bpn).getAllByText('Issued')).toHaveLength(2);
    expect(within(within(bpn).getByRole('group', { name: 'Requested' })).getByText('03 Nov 2026')).toBeInTheDocument();
    expect(within(bpn).getByText('In your wallet since 03 Nov 2026, 10:00.')).toBeInTheDocument();

    const membership = await pass('Membership credential of Catena-X');
    expect(within(membership).getByText('Member of')).toBeInTheDocument();
    expect(within(membership).getAllByText('Catena-X').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 1, name: 'Your credentials' })).toBeInTheDocument();
    expect(companyRepository.calls).toEqual([ERIKA.companyId]);
  });

  it('explains a credential in the tooltip of its info button', async () => {
    showWallets('/wallets/credentials', { session: ERIKA, c4m1: recordingC4M1().module });
    fireEvent.mouseOver(await screen.findByRole('button', { name: 'What is the BPN credential?' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Proves the business partner number of your company');
  });

  it('lets credentials of two dataspaces live together, each with its own logo slot', async () => {
    showWallets('/wallets/credentials', { session: ERIKA, c4m1: recordingC4M1({ companyCredentials: COMPANY_CREDENTIALS.twoDataspaces }).module });
    const second = await pass('Membership credential of Semiconductor dataspace');
    expect(within(second).getByRole('img', { name: 'Semiconductor dataspace' })).toHaveTextContent('SC');
    expect(screen.getAllByRole('article', { name: / of / })).toHaveLength(3);
  });

  it('shows a credential being issued with the time since the request', async () => {
    showWallets('/wallets/credentials', { session: ERIKA, c4m1: recordingC4M1({ companyCredentials: COMPANY_CREDENTIALS.requested }).module });
    const membership = await pass('Membership credential of Catena-X');
    expect(within(membership).getByText('Being issued')).toBeInTheDocument();
    expect(within(membership).getByText(/^Requested 3 days ago\. The issuer puts it into your wallet/)).toBeInTheDocument();
  });

  it('shows a failed credential without the message of the issuer', async () => {
    showWallets('/wallets/credentials', { session: ERIKA, c4m1: recordingC4M1({ companyCredentials: COMPANY_CREDENTIALS.failed }).module });
    const membership = await pass('Membership credential of Catena-X');
    expect(within(membership).getByText('Failed')).toBeInTheDocument();
    expect(within(membership).getByText(/could not issue it\. Your onboarding service provider can start a new attempt/)).toBeInTheDocument();
  });

  it('shows a revoked credential with the date of the revocation', async () => {
    showWallets('/wallets/credentials', { session: ERIKA, c4m1: recordingC4M1({ companyCredentials: COMPANY_CREDENTIALS.revoked }).module });
    const membership = await pass('Membership credential of Catena-X');
    expect(within(within(membership).getByRole('group', { name: 'Revoked' })).getByText('06 Nov 2026')).toBeInTheDocument();
    expect(within(membership).getByText('Revoked on 06 Nov 2026, 09:30. Connectors no longer accept it.')).toBeInTheDocument();
  });

  it('shows credentials that were not requested yet', async () => {
    showWallets('/wallets/credentials', { session: ERIKA, c4m1: recordingC4M1({ companyCredentials: COMPANY_CREDENTIALS.none }).module });
    expect(await screen.findAllByText('Not requested yet')).toHaveLength(2);
    expect(screen.getAllByText('Requested during onboarding, after your dataspace wallet is set up.')).toHaveLength(2);
  });

  it('says it is loading while the session and the credentials load', () => {
    showWallets('/wallets/credentials', { session: ERIKA, c4m1: recordingC4M1().module });
    expect(screen.getByRole('status', { name: 'Loading your credentials…' })).toBeInTheDocument();
  });

  it('hides the credentials from a person without view_credentials and does not call the module', async () => {
    const { module, companyRepository } = recordingC4M1();
    showWallets('/wallets/credentials', { session: MAX, c4m1: module });
    expect(await screen.findByText(/You may not see the credentials of your company\. Ask your Company Admin/)).toBeInTheDocument();
    expect(companyRepository.calls).toEqual([]);
  });

  it('shows a 403 of the module with its Problem Details type', async () => {
    showWallets('/wallets/credentials', { session: ERIKA, c4m1: recordingC4M1({ companyCredentialFailure: c4m1Problem(403, 'forbidden') }).module });
    expect(await screen.findByText(/\(HTTP 403\)/)).toBeInTheDocument();
    expect(screen.getByText('urn:c4-m1:problem:forbidden')).toBeInTheDocument();
  });

  it('says when the credentials of the company are not found (404)', async () => {
    showWallets('/wallets/credentials', { session: ERIKA, c4m1: recordingC4M1({ companyCredentialFailure: c4m1Problem(404, 'not-found') }).module });
    expect(await screen.findByText('The credentials of your company were not found at your onboarding service provider.')).toBeInTheDocument();
    expect(screen.getByText('urn:c4-m1:problem:not-found')).toBeInTheDocument();
  });

  it('tells a person without a company and does not call the module', async () => {
    const { module, companyRepository } = recordingC4M1();
    showWallets('/wallets/credentials', { session: { ...OTTO, permissions: ['view_credentials'] }, c4m1: module });
    expect(await screen.findByText(/not bound to a company/)).toBeInTheDocument();
    expect(companyRepository.calls).toEqual([]);
  });

  it('shows another error of the module with its HTTP status', async () => {
    showWallets('/wallets/credentials', { session: ERIKA, c4m1: recordingC4M1({ companyCredentialFailure: c4m1Problem(503, 'unavailable', 'try later') }).module });
    expect(await screen.findByText(/HTTP 503/)).toHaveTextContent('try later');
    expect(screen.getByText('urn:c4-m1:problem:unavailable')).toBeInTheDocument();
  });

  it('says so when the module is not connected (outside mock mode)', async () => {
    showWallets('/wallets/credentials', { session: ERIKA });
    expect(await screen.findByText(/not connected to its backend/)).toBeInTheDocument();
  });

  it('shows the feature tabs the person may see', async () => {
    showWallets('/wallets/credentials', { session: ERIKA, c4m1: recordingC4M1().module });
    const tabs = await screen.findByRole('navigation', { name: 'Wallets as a service' });
    expect(within(tabs).getAllByRole('tab').map((tab) => tab.textContent)).toEqual(['Dataspace wallet', 'Credentials', 'Wallet accounts']);
    expect(within(tabs).getByRole('tab', { name: 'Credentials' })).toHaveAttribute('aria-selected', 'true');
  });
});
