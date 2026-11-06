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

import {
  FAILED_CREDENTIAL,
  InMemoryCredentialRepository,
  REQUESTED_CREDENTIAL,
  REVOCATION_PENDING_CREDENTIAL,
  c4m1Problem,
} from '@dataspace-mgm/c4-m1-core/testing';
import { fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { walletsTranslations } from './i18n';
import { OTTO, ROLF, atFixturesNow, recordingC4M1, showWallets } from './walletsTestApp';

beforeAll(() => walletsTranslations.load());
beforeEach(atFixturesNow);
afterEach(() => vi.useRealTimers());

const path = (id: string) => `/wallets/all-credentials/${id}`;

async function openDialog() {
  fireEvent.click(await screen.findByRole('button', { name: 'Confirm revocation' }));
  return screen.findByRole('dialog', { name: 'Confirm the revocation' });
}

describe('Wallets as a service: one credential (C4-M1 getCredential, confirmRevocation)', () => {
  it('shows a credential waiting for a revocation by hand, by topic', async () => {
    showWallets(path(REVOCATION_PENDING_CREDENTIAL.id), { session: OTTO, c4m1: recordingC4M1().module });

    expect(await screen.findByRole('heading', { level: 1, name: 'Membership credential' })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Revoke this credential at the Credential Issuer by hand. The route Credential Issuer cannot revoke it by itself.',
    );
    expect(screen.getByText('Company deactivated')).toBeInTheDocument();
    expect(screen.getByText('MembershipCredential')).toBeInTheDocument();
    const issuer = screen.getByRole('region', { name: 'Issuer and holder' });
    expect(issuer).toHaveTextContent('Credential Issuer of this OSP (no DID for this route)');
    expect(within(issuer).getByRole('button', { name: `Copy ${REVOCATION_PENDING_CREDENTIAL.holderDid}` })).toBeInTheDocument();
    const lifeCycle = screen.getByRole('region', { name: 'Life cycle' });
    expect(within(lifeCycle).getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Requested (attempt 1)02 Nov 2026, 15:04',
      'Issued02 Nov 2026, 15:05',
      'Revocation pending06 Nov 2026, 09:41',
    ]);
    expect(screen.getByRole('link', { name: 'Credentials of all companies' })).toHaveAttribute('href', '/wallets/all-credentials');
  });

  it('checks the note before it sends the confirmation', async () => {
    const { module, credentialRepository } = recordingC4M1();
    showWallets(path(REVOCATION_PENDING_CREDENTIAL.id), { session: OTTO, c4m1: module });
    const dialog = await openDialog();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm revocation' }));
    expect(await within(dialog).findByText('Enter a note of 1 to 500 characters.')).toBeInTheDocument();
    expect(credentialRepository.calls.some((call) => call.method === 'confirmRevocation')).toBe(false);
  });

  it('confirms the revocation and shows the credential as revoked', async () => {
    const { module, credentialRepository } = recordingC4M1();
    showWallets(path(REVOCATION_PENDING_CREDENTIAL.id), { session: OTTO, c4m1: module });
    const dialog = await openDialog();

    fireEvent.change(within(dialog).getByRole('textbox', { name: 'Note on the revocation' }), { target: { value: '  Revoked at the issuer, ticket OPS-4711  ' } });
    expect(within(dialog).getByText('42 / 500')).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm revocation' }));

    expect(await screen.findByText('Revocation confirmed')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Confirm revocation' })).not.toBeInTheDocument();
    expect(within(screen.getByRole('region', { name: 'Life cycle' })).getByText('Revoked')).toBeInTheDocument();
    expect(credentialRepository.calls).toContainEqual({
      method: 'confirmRevocation',
      credentialId: REVOCATION_PENDING_CREDENTIAL.id,
      note: 'Revoked at the issuer, ticket OPS-4711',
    });
  });

  it('shows a conflict when the credential changed meanwhile (409)', async () => {
    const changed = new InMemoryCredentialRepository([{ ...REVOCATION_PENDING_CREDENTIAL, status: 'ISSUED' }]);
    showWallets(path(REVOCATION_PENDING_CREDENTIAL.id), { session: OTTO, c4m1: recordingC4M1({ confirmWith: changed }).module });
    const dialog = await openDialog();

    fireEvent.change(within(dialog).getByRole('textbox', { name: 'Note on the revocation' }), { target: { value: 'Ticket OPS-4711' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm revocation' }));
    expect(await within(dialog).findByText(/no longer waiting for a revocation \(HTTP 409\)/)).toBeInTheDocument();
    expect(within(dialog).getByText('urn:c4-m1:problem:invalid-state')).toBeInTheDocument();
  });

  it('shows the message of the issuer of a failed credential and no confirmation', async () => {
    showWallets(path(FAILED_CREDENTIAL.id), { session: OTTO, c4m1: recordingC4M1().module });
    expect(await screen.findByText('Message of the issuer')).toBeInTheDocument();
    expect(screen.getByText(FAILED_CREDENTIAL.failureReason ?? '')).toBeInTheDocument();
    expect(screen.getByText('Beispiel Logistik GmbH · BPNL00000000U2LG', { selector: 'div' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Confirm revocation' })).not.toBeInTheDocument();
  });

  it('shows that an order waits for the issuer', async () => {
    showWallets(path(REQUESTED_CREDENTIAL.id), { session: OTTO, c4m1: recordingC4M1().module });
    expect(await screen.findByText('Waiting for the status report of the issuer since 05 Nov 2026, 16:10 (attempt 1).')).toBeInTheDocument();
  });

  it('says when the credential does not exist', async () => {
    showWallets(path('c4c00999-0000-4000-8000-000000000999'), { session: OTTO, c4m1: recordingC4M1().module });
    expect(await screen.findByText('This credential does not exist at this onboarding service provider.')).toBeInTheDocument();
    expect(screen.getByText('urn:c4-m1:problem:not-found')).toBeInTheDocument();
  });

  it('says it is loading', () => {
    showWallets(path(REVOCATION_PENDING_CREDENTIAL.id), { session: OTTO, c4m1: recordingC4M1().module });
    expect(screen.getByRole('status', { name: 'Loading the credential…' })).toBeInTheDocument();
  });

  it('hides the credential from a person without manage_credentials', async () => {
    const { module, credentialRepository } = recordingC4M1();
    showWallets(path(REVOCATION_PENDING_CREDENTIAL.id), { session: ROLF, c4m1: module });
    expect(await screen.findByText(/This needs the role OSP Admin/)).toBeInTheDocument();
    expect(credentialRepository.calls).toEqual([]);
  });

  it('shows a 403 of the module', async () => {
    showWallets(path(REVOCATION_PENDING_CREDENTIAL.id), { session: OTTO, c4m1: recordingC4M1({ credentialFailure: c4m1Problem(403, 'forbidden') }).module });
    expect(await screen.findByText(/\(HTTP 403\)/)).toBeInTheDocument();
    expect(screen.getByText('urn:c4-m1:problem:forbidden')).toBeInTheDocument();
  });
});
