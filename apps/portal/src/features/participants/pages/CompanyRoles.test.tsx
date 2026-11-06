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
import { c3m1Problem } from '@dataspace-mgm/c3-m1-core/testing';
import { fireEvent, screen, within } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { participantsTranslations } from '../i18n';
import { renderParticipantsPage } from '../testing/renderParticipantsPage';
import CompanyRoles from './CompanyRoles';

beforeAll(() => participantsTranslations.load());

const show = (person: string, options = {}) => renderParticipantsPage(<CompanyRoles />, { path: '/participants/company/roles', person, ...options });

describe('View 4 · Company roles', () => {
  it('shows every role with status and terms, with safe links to the documents', async () => {
    show('erika');
    const active = await screen.findByRole('article', { name: 'Active participant' });
    expect(within(active).getByText('Active')).toBeInTheDocument();
    expect(within(active).getByRole('link', { name: /Security regulations/ })).toHaveAttribute('rel', 'noopener noreferrer');
    expect(within(screen.getByRole('article', { name: 'App provider' })).getByText(/not accepted yet/)).toBeInTheDocument();
  });

  it('adds a role only after every term is accepted', async () => {
    show('erika');
    fireEvent.click(within(await screen.findByRole('article', { name: 'App provider' })).getByRole('button', { name: 'Add the role' }));
    const dialog = await screen.findByRole('dialog', { name: 'Add App provider' });
    const add = within(dialog).getByRole('button', { name: 'Add the role' });
    expect(add).toBeDisabled();
    fireEvent.click(within(dialog).getByRole('checkbox'));
    fireEvent.click(add);
    expect(await screen.findByText('App provider added')).toBeInTheDocument();
    expect(within(screen.getByRole('article', { name: 'App provider' })).getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('explains 409 last-role when the last active role is removed', async () => {
    show('erika', { participants: { failures: { removeCompanyRole: c3m1Problem(409, 'last-role') } } });
    fireEvent.click(within(await screen.findByRole('article', { name: 'Active participant' })).getByRole('button', { name: 'Remove' }));
    fireEvent.click(within(await screen.findByRole('dialog', { name: 'Remove the role?' })).getByRole('button', { name: 'Remove' }));
    expect(await screen.findByText(/needs at least one active role/)).toBeInTheDocument();
  });

  it('is read only for a Member', async () => {
    show('max');
    await screen.findByRole('article', { name: 'Active participant' });
    expect(screen.queryByRole('button', { name: 'Add the role' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument();
  });

  it('explains 502 upstream-error (terms of C1-M2 not readable)', async () => {
    show('erika', { participants: { failure: new CoreHttpException(502, 'urn:c3-m1:problem:upstream-error', 'upstream-error') } });
    expect(await screen.findByText(/did not answer \(HTTP 502\)/)).toBeInTheDocument();
  });
});
