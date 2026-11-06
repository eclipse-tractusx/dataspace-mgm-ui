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

import { fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { features, getAllRoutes, isOpen } from '../main';
import { walletsTranslations } from './i18n';
import { walletsFeature } from './routes';
import { ERIKA, MAX, OTTO, atFixturesNow, recordingC4M1, showWallets } from './walletsTestApp';

beforeAll(() => walletsTranslations.load());
beforeEach(atFixturesNow);
afterEach(() => vi.useRealTimers());

describe('Wallets as a service: landing page', () => {
  it('opens "Your credentials" for a person of a company without the dataspace wallet', async () => {
    showWallets('/wallets', { session: { ...ERIKA, permissions: ['view_credentials'] }, c4m1: recordingC4M1().module });
    expect(await screen.findByRole('heading', { level: 1, name: 'Your credentials' })).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/wallets/credentials');
  });

  it('shows the dataspace wallet at /wallets for a person with view_dataspace_wallet', async () => {
    showWallets('/wallets', { session: ERIKA, c4m1: recordingC4M1().module, c4m2: true });
    expect(await screen.findByRole('heading', { level: 1, name: 'Your dataspace wallet' })).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/wallets$/);
  });

  it('opens "Credentials of all companies" for OSP staff', async () => {
    showWallets('/wallets', { session: OTTO, c4m1: recordingC4M1().module });
    expect(await screen.findByRole('heading', { level: 1, name: 'Credentials of all companies' })).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/wallets/all-credentials');
  });

  it('tells a person without a permission of the feature', async () => {
    showWallets('/wallets', { session: MAX, c4m1: recordingC4M1().module });
    expect(await screen.findByText(/You may not see the credentials or wallets/)).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/wallets$/);
  });

  it('asks a signed-out person to sign in, through the BFF', async () => {
    const { redirect } = showWallets('/wallets', { session: null, c4m1: recordingC4M1().module });
    fireEvent.click(await screen.findByRole('button', { name: 'Sign in' }));
    expect(redirect.logins).toEqual(['/wallets']);
  });
});

describe('Wallets as a service: registry', () => {
  it('is a proof of concept at /wallets: routed in mock mode only, "coming soon" otherwise', () => {
    expect(walletsFeature).toMatchObject({ id: 'wallets', version: '0.2.0', category: 'as-a-service', stage: 'poc', disabled: false });
    expect(isOpen(walletsFeature, true)).toBe(true);
    expect(isOpen(walletsFeature, false)).toBe(false);
    expect(features.find((item) => item.id === 'wallets')).toMatchObject({ path: '/wallets', disabled: true });
    expect(getAllRoutes().some((route) => route.path?.startsWith('wallets'))).toBe(false);
    expect(walletsFeature.routes.map((route) => route.path)).toEqual([
      'wallets',
      'wallets/credentials',
      'wallets/all-credentials',
      'wallets/all-credentials/:credentialId',
      'wallets/wallet-accounts',
    ]);
  });
});
