/********************************************************************************
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
 * Assisted-By: Claude Code (claude-fable-5-2)
 ********************************************************************************/

import type { MandateJoinResult } from '@dataspace-mgm/c2-m2-core';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { accessControlApi } from '../state/access-control.api';
import { companyTranslations } from './i18n';
import { AcceptInvitationSection } from './invitations';
import de from './locales/de/company.json';
import en from './locales/en/company.json';

beforeAll(() => companyTranslations.load());

function Address() {
  const { pathname, search } = useLocation();
  return <output aria-label="address">{`${pathname}${search}`}</output>;
}

/** The section on the page `/access-control`, with the use case "accept with a mandate" answering `outcome`. */
function page(outcome: MandateJoinResult | Promise<MandateJoinResult>, address = '/access-control', withMandate = true) {
  const execute = vi.fn(async () => outcome);
  const store = configureStore({
    reducer: { [accessControlApi.reducerPath]: accessControlApi.reducer },
    middleware: (defaults) =>
      defaults({ thunk: { extraArgument: { c2m2: { acceptInvitation: { execute: vi.fn() }, acceptInvitationWithMandate: { execute } } } } }).concat(accessControlApi.middleware),
  });
  const onAccepted = vi.fn();
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[address]}>
        <AcceptInvitationSection onAccepted={onAccepted} withMandate={withMandate} />
        <Address />
      </MemoryRouter>
    </Provider>,
  );
  return { execute, onAccepted };
}

const JOINED: MandateJoinResult = { status: 'joined', data: { invitationId: 'inv-1', kind: 'COMPANY', userId: 'user-max', companyId: 'company', roles: ['Member'] } };

describe('accepting an invitation with a mandate', () => {
  it('offers the mandate next to the code only where the wallet step is connected', () => {
    page(JOINED, '/access-control', false);
    expect(screen.getByRole('button', { name: 'Accept invitation' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Join with a mandate' })).not.toBeInTheDocument();
  });

  it('starts the wallet step with this page as the place to come back to', async () => {
    const never = new Promise<MandateJoinResult>(() => undefined);
    const { execute } = page(never);
    fireEvent.click(screen.getByRole('button', { name: 'Join with a mandate' }));
    await waitFor(() => expect(execute).toHaveBeenCalledWith('/access-control'));
    // The browser is on its way to the wallet: the button waits, nothing is shown yet.
    expect(screen.getByRole('button', { name: 'Join with a mandate' })).toBeDisabled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('collects the outcome once after the return from the wallet, clears the mark and offers the new session', async () => {
    const { execute, onAccepted } = page(JOINED, '/access-control?wallet=returned');
    expect(await screen.findByText('Invitation accepted. Refresh your session to load your company access.')).toBeInTheDocument();
    expect(execute).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('address')).toHaveTextContent(/^\/access-control$/);
    fireEvent.click(screen.getByRole('button', { name: 'Refresh session' }));
    expect(onAccepted).toHaveBeenCalledTimes(1);
  });

  it('does not start anything on a plain visit of the page', async () => {
    const { execute } = page(JOINED);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Join with a mandate' })).toBeEnabled());
    expect(execute).not.toHaveBeenCalled();
  });

  it.each([
    [{ status: 'cancelled' }, 'You declined the request in the wallet. Nothing was changed.'],
    [{ status: 'wallet-failed', message: 'The wallet step failed (CREDENTIAL_REVOKED).' }, 'The check in the wallet failed. Try again.'],
    [{ status: 'failed', message: 'upstream' }, 'Joining failed. Try again later.'],
    [{ status: 'refused', reason: 'representation-not-confirmed', causes: [] }, 'The mandate was not confirmed. Ask your company to issue a new mandate.'],
    [{ status: 'refused', reason: 'representation-not-confirmed', causes: ['EXPIRED'] }, 'The mandate has expired. Ask your company to issue a new mandate.'],
    [
      { status: 'refused', reason: 'representation-not-confirmed', causes: ['PERSON_MISMATCH', 'TYPE_NOT_ACCEPTED'] },
      'The mandate was issued to another person than your personal identification. This kind of mandate is not accepted here.',
    ],
    [{ status: 'refused', reason: 'invitation-not-found', causes: [] }, 'Your company has not added you in this portal yet. Contact your Company Admin.'],
    [{ status: 'refused', reason: 'name-mismatch', causes: [] }, 'The name in the wallet does not match your account.'],
  ] as Array<[MandateJoinResult, string]>)('shows the outcome %o in words', async (outcome, text) => {
    page(outcome, '/access-control?wallet=returned');
    expect(await screen.findByText(text)).toBeInTheDocument();
    expect(screen.queryByText('Invitation accepted. Refresh your session to load your company access.')).not.toBeInTheDocument();
  });

  it('has a text for every refusal and every reason of an unconfirmed mandate in both languages', () => {
    const refusals = ['attestation-invalid', 'representation-not-confirmed', 'name-mismatch', 'invitation-not-found', 'company-not-active', 'user-already-bound', 'staff-company-conflict'];
    expect(Object.keys(en.mandateJoinRefused).sort()).toEqual([...refusals].sort());
    expect(Object.keys(de.mandateJoinRefused).sort()).toEqual([...refusals].sort());
    const causes = ['COMPANY_MISMATCH', 'EXPIRED', 'ISSUER_NOT_TRUSTED', 'PERSON_MISMATCH', 'TYPE_NOT_ACCEPTED'];
    expect(Object.keys(en.mandateJoinNotConfirmed).sort()).toEqual(causes);
    expect(Object.keys(de.mandateJoinNotConfirmed).sort()).toEqual(causes);
    expect(Object.keys(de).sort()).toEqual(Object.keys(en).sort());
  });
});
