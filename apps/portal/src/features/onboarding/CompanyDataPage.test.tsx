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

import { ERIKA_APPLICATION_CREATED, ERIKA_SESSION, HANS_APPLICATION_DOCUMENTS, HANS_SESSION, MAX_SESSION } from '@dataspace-mgm/c1-m2-core/testing';
import { fireEvent, screen, within } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { onboardingTranslations } from './i18n';
import { renderOnboarding } from './test-utils';

beforeAll(() => onboardingTranslations.load());

const rowOf = (label: string) => screen.getAllByText(label, { selector: 'dt' })[0].parentElement as HTMLElement;

describe('Onboarding: company data', () => {
  it('shows what the wallet confirmed and a source badge per field', async () => {
    renderOnboarding(`/onboarding/application/${ERIKA_APPLICATION_CREATED.id}/company-data`, { session: ERIKA_SESSION, c1m2: { applications: [ERIKA_APPLICATION_CREATED] } });
    expect(await screen.findByRole('heading', { name: 'Verified with the Business Wallet' })).toBeInTheDocument();
    expect(screen.getByText('Representation confirmed')).toBeInTheDocument();
    expect(within(rowOf('Legal name')).getByText('From the wallet')).toBeInTheDocument();
    expect(within(rowOf('VAT ID')).getByText('Entered by you')).toBeInTheDocument();
  });

  it('switches to the form on Edit and back to the view on Save, compared again', async () => {
    const { applicationRepository } = renderOnboarding(`/onboarding/application/${ERIKA_APPLICATION_CREATED.id}/company-data`, {
      session: ERIKA_SESSION,
      c1m2: { applications: [ERIKA_APPLICATION_CREATED] },
    });
    fireEvent.click(await screen.findByRole('button', { name: 'Edit' }));
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('EBWOID')).toHaveAttribute('readonly');
    fireEvent.change(screen.getByLabelText(/^Legal name/), { target: { value: 'Beispiel Maschinenbau AG' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Edited by you, differs from the wallet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(applicationRepository?.calls).toContain('update');
  });

  it('drops the input on Cancel', async () => {
    renderOnboarding(`/onboarding/application/${ERIKA_APPLICATION_CREATED.id}/company-data`, { session: ERIKA_SESSION, c1m2: { applications: [ERIKA_APPLICATION_CREATED] } });
    fireEvent.click(await screen.findByRole('button', { name: 'Edit' }));
    fireEvent.change(screen.getByLabelText(/^Legal name/), { target: { value: 'Something else' } });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(within(rowOf('Legal name')).getByText('Beispiel Maschinenbau GmbH')).toBeInTheDocument();
  });

  it('shows the documents path without attestation and goes on to the documents', async () => {
    renderOnboarding(`/onboarding/application/${HANS_APPLICATION_DOCUMENTS.id}/company-data`, { session: HANS_SESSION, c1m2: { applications: [HANS_APPLICATION_DOCUMENTS] } });
    expect(await screen.findByRole('heading', { name: 'Your company' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Verified with the Business Wallet' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(await screen.findByRole('heading', { name: 'Supporting documents' })).toBeInTheDocument();
  });

  it('says not found for the application of another person', async () => {
    renderOnboarding(`/onboarding/application/${ERIKA_APPLICATION_CREATED.id}/company-data`, { session: MAX_SESSION, c1m2: { applications: [ERIKA_APPLICATION_CREATED] } });
    expect(await screen.findByText('The application was not found.')).toBeInTheDocument();
  });

  it('creates an application in the documents path from the form', async () => {
    const { applicationRepository } = renderOnboarding('/onboarding/new', { session: HANS_SESSION });
    fireEvent.change(await screen.findByLabelText(/^Legal name/), { target: { value: 'Beispiel Logistik GmbH' } });
    fireEvent.change(screen.getByLabelText(/^Street/), { target: { value: 'Hafenstraße' } });
    fireEvent.change(screen.getByLabelText(/^City/), { target: { value: 'Mannheim' } });
    fireEvent.change(screen.getByLabelText('Value'), { target: { value: 'HRB 200002' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create application and continue' }));
    expect(await screen.findByRole('heading', { name: 'Supporting documents' })).toBeInTheDocument();
    expect(applicationRepository?.applications[0]).toMatchObject({ verification: 'DOCUMENTS', companyId: 'c0000002-0000-4000-8000-000000000002' });
  });

  it('shows the validation errors of the API', async () => {
    renderOnboarding('/onboarding/new', { session: HANS_SESSION });
    fireEvent.click(await screen.findByRole('button', { name: 'Create application and continue' }));
    expect(await screen.findByText('Some data cannot be accepted.')).toBeInTheDocument();
    expect(screen.getByText('urn:c1-m2:problem:validation')).toBeInTheDocument();
  });
});
