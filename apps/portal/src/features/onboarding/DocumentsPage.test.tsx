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

import { HANS_APPLICATION_DOCUMENTS, HANS_SESSION } from '@dataspace-mgm/c1-m2-core/testing';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { onboardingTranslations } from './i18n';
import { renderOnboarding } from './test-utils';

beforeAll(() => onboardingTranslations.load());

const path = `/onboarding/application/${HANS_APPLICATION_DOCUMENTS.id}/documents`;
const upload = (type: string, content: string, name: string) =>
  fireEvent.change(screen.getByTestId(`file-${type}`), { target: { files: [new File([content], name, { type: 'application/pdf' })] } });

describe('Onboarding: supporting documents', () => {
  it('shows one section per document type; the uploaded extract with Open and Delete', async () => {
    renderOnboarding(path, { session: HANS_SESSION, c1m2: { applications: [HANS_APPLICATION_DOCUMENTS] } });
    expect(await screen.findByText('handelsregisterauszug-hrb-200002.pdf')).toBeInTheDocument();
    for (const title of ['Commercial register extract', 'Power of attorney', 'Other document']) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('uploads into a section, refuses a file that is no PDF, and deletes after confirmation', async () => {
    const { applicationRepository } = renderOnboarding(path, { session: HANS_SESSION, c1m2: { applications: [HANS_APPLICATION_DOCUMENTS] } });
    await screen.findByText('handelsregisterauszug-hrb-200002.pdf');
    fireEvent.click(screen.getByRole('heading', { name: 'Power of attorney' }));
    upload('POWER_OF_ATTORNEY', '%PDF-1.7\n%%EOF\n', 'vollmacht.pdf');
    expect(await screen.findByText('vollmacht.pdf')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('heading', { name: 'Other document' }));
    upload('OTHER', 'hello', 'notes.pdf');
    expect(await screen.findByText('urn:c1-m2:problem:validation')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    fireEvent.click(within(await screen.findByRole('dialog', { name: 'Delete the document?' })).getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(applicationRepository?.documents.map((d) => d.info.fileName)).toEqual(['vollmacht.pdf']));
  });

  it('sends the declaration on to the terms', async () => {
    renderOnboarding(path, { session: HANS_SESSION, c1m2: { applications: [HANS_APPLICATION_DOCUMENTS] } });
    fireEvent.click(await screen.findByRole('checkbox', { name: /I declare that I may represent/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(await screen.findByRole('heading', { name: 'Terms' })).toBeInTheDocument();
  });
});
