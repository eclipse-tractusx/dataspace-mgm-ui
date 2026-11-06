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

import { ERIKA_APPLICATION_CREATED, ERIKA_SESSION, HANS_APPLICATION_DOCUMENTS, HANS_SESSION, mockAttestation, MASCHINENBAU_CLAIMS } from '@dataspace-mgm/c1-m2-core/testing';
import type { ApplicationWithReviewAnemic } from '@dataspace-mgm/c1-m2-core';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { onboardingTranslations } from './i18n';
import { NOW, renderOnboarding } from './test-utils';

beforeAll(() => onboardingTranslations.load());

const termsOf = (id: string) => `/onboarding/application/${id}/terms`;

/** Opens each terms document, scrolls it to the end and accepts it. */
async function acceptAll() {
  const buttons = await screen.findAllByRole('button', { name: /^Open: / });
  for (const name of buttons.map((button) => button.getAttribute('aria-label') as string)) {
    fireEvent.click(screen.getByRole('button', { name }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('button', { name: 'Accept' })).toBeDisabled();
    fireEvent.scroll(within(dialog).getByTestId('viewer-document'));
    fireEvent.click(within(dialog).getByRole('button', { name: 'Accept' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  }
}

describe('Onboarding: roles, terms and submission', () => {
  it('lists the required terms of the roles with Open; Accept only at the end of the document', async () => {
    renderOnboarding(termsOf(ERIKA_APPLICATION_CREATED.id), { session: ERIKA_SESSION, c1m2: { applications: [ERIKA_APPLICATION_CREATED] } });
    expect(await screen.findByRole('heading', { name: 'Your application' })).toBeInTheDocument();
    expect(await screen.findAllByRole('button', { name: /^Open: / })).toHaveLength(3);
    expect(screen.getByRole('button', { name: 'Submit application' })).toBeDisabled();
    expect(screen.getByText('Accept 3 more documents to submit.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open: Security regulations' }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText(/only in English/)).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Accept' })).toBeDisabled();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getAllByText('Not accepted yet')).toHaveLength(3);
  });

  it('submits with a consent per document, in the language read', async () => {
    const { applicationRepository } = renderOnboarding(termsOf(ERIKA_APPLICATION_CREATED.id), { session: ERIKA_SESSION, c1m2: { applications: [ERIKA_APPLICATION_CREATED] } });
    await acceptAll();
    expect(screen.getAllByText('Accepted · English')).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', { name: 'Submit application' }));
    expect(await screen.findByRole('heading', { name: 'Application submitted' })).toBeInTheDocument();
    expect(applicationRepository?.applications[0].consents.map((c) => `${c.agreementKey}@${c.version}:${c.language}`)).toEqual([
      'osp-terms@1.0:en',
      'terms-active-participant@1.0:en',
      'security-regulations@1.0:en',
    ]);
  });

  it('changes the roles with PATCH, and the terms follow', async () => {
    renderOnboarding(termsOf(ERIKA_APPLICATION_CREATED.id), { session: ERIKA_SESSION, c1m2: { applications: [ERIKA_APPLICATION_CREATED] } });
    fireEvent.click(await screen.findByRole('checkbox', { name: /App provider/ }));
    expect(await screen.findByRole('button', { name: 'Open: Terms and conditions app provider' })).toBeInTheDocument();
  });

  it('offers to verify again when the attestation is too old', async () => {
    const old = mockAttestation({ company: MASCHINENBAU_CLAIMS }, new Date(NOW.getTime() - 31 * 24 * 3600 * 1000));
    const issuedAt = new Date(NOW.getTime() - 31 * 24 * 3600 * 1000).toISOString();
    const application: ApplicationWithReviewAnemic = {
      ...ERIKA_APPLICATION_CREATED,
      attestation: { ...(ERIKA_APPLICATION_CREATED.attestation as NonNullable<ApplicationWithReviewAnemic['attestation']>), attestationId: 'old-jti', issuedAt, verifiedAt: issuedAt },
    };
    expect(old).toBeTruthy();
    renderOnboarding(termsOf(application.id), { session: ERIKA_SESSION, c1m2: { applications: [application] } });
    await acceptAll();
    fireEvent.click(screen.getByRole('button', { name: 'Submit application' }));
    expect(await screen.findByText(/verification with the Business Wallet is too old/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Verify again' }));
    expect(await screen.findByText('Verified again with the Business Wallet')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Submit application' }));
    expect(await screen.findByRole('heading', { name: 'Application submitted' })).toBeInTheDocument();
  });

  it('asks for the documents and the declaration in the documents path', async () => {
    renderOnboarding(termsOf(HANS_APPLICATION_DOCUMENTS.id), { session: HANS_SESSION, c1m2: { applications: [HANS_APPLICATION_DOCUMENTS] } });
    await acceptAll();
    fireEvent.click(screen.getByRole('button', { name: 'Submit application' }));
    expect(await screen.findByText('urn:c1-m2:problem:documents-incomplete')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Documents' }));
    expect(await screen.findByRole('heading', { name: 'Supporting documents' })).toBeInTheDocument();
  });
});
