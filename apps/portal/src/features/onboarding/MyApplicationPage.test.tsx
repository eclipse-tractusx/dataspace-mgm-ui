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

import { ERIKA_APPLICATION_COMPLETED, ERIKA_APPLICATION_SUBMITTED, ERIKA_SESSION, HANS_APPLICATION_DECLINED, HANS_SESSION } from '@dataspace-mgm/c1-m2-core/testing';
import { fireEvent, screen, within } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { onboardingTranslations } from './i18n';
import { renderOnboarding } from './test-utils';

beforeAll(() => onboardingTranslations.load());

const pathOf = (id: string) => `/onboarding/application/${id}`;

describe('Onboarding: my application', () => {
  it('shows status, the stepper with the review, the details in tabs', async () => {
    renderOnboarding(pathOf(ERIKA_APPLICATION_SUBMITTED.id), { session: ERIKA_SESSION, c1m2: { applications: [ERIKA_APPLICATION_SUBMITTED] } });
    expect(await screen.findByRole('heading', { name: 'Beispiel Maschinenbau GmbH' })).toBeInTheDocument();
    expect(screen.getByText('Submitted', { selector: '.MuiChip-label' })).toBeInTheDocument();
    expect(screen.getByText('In review', { selector: 'p' }).closest('li')).toHaveAttribute('aria-current', 'step');
    fireEvent.click(screen.getByRole('tab', { name: 'Roles and terms' }));
    expect(within(screen.getByRole('tabpanel')).getByText(/osp-terms 1.0/)).toBeInTheDocument();
  });

  it('withdraws after confirmation', async () => {
    renderOnboarding(pathOf(ERIKA_APPLICATION_SUBMITTED.id), { session: ERIKA_SESSION, c1m2: { applications: [ERIKA_APPLICATION_SUBMITTED] } });
    fireEvent.click(await screen.findByRole('button', { name: 'Withdraw application' }));
    fireEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Withdraw application' }));
    expect(await screen.findByText('Withdrawn', { selector: '.MuiChip-label' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Withdraw the application' })).not.toBeInTheDocument();
  });

  it('shows already-decided when OSP staff approved meanwhile', async () => {
    const { applicationRepository } = renderOnboarding(pathOf(ERIKA_APPLICATION_SUBMITTED.id), { session: ERIKA_SESSION, c1m2: { applications: [ERIKA_APPLICATION_SUBMITTED] } });
    await screen.findByRole('heading', { name: 'Withdraw the application' });
    applicationRepository?.setReviewStatus(ERIKA_APPLICATION_SUBMITTED.id, 'APPROVED');
    fireEvent.click(screen.getByRole('button', { name: 'Withdraw application' }));
    fireEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Withdraw application' }));
    expect(await screen.findByText('urn:c1-m2:problem:already-decided')).toBeInTheDocument();
  });

  it('shows the approval and leads to the company', async () => {
    renderOnboarding(pathOf(ERIKA_APPLICATION_COMPLETED.id), { session: ERIKA_SESSION, c1m2: { applications: [ERIKA_APPLICATION_COMPLETED] } });
    expect(await screen.findByText('OSP staff approved the application.')).toBeInTheDocument();
    expect(screen.getByText('Beispiel Maschinenbau GmbH is active in the dataspace. You are its Company Admin.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Your company' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Withdraw the application' })).not.toBeInTheDocument();
  });

  it('offers the demo review only in mock mode', async () => {
    renderOnboarding(pathOf(ERIKA_APPLICATION_SUBMITTED.id), { session: ERIKA_SESSION, c1m2: { applications: [ERIKA_APPLICATION_SUBMITTED] } });
    await screen.findByRole('heading', { name: 'Beispiel Maschinenbau GmbH' });
    expect(screen.queryByRole('button', { name: 'Open in Application review' })).not.toBeInTheDocument();
  });

  it('shows the reason of a decline and offers a new application', async () => {
    renderOnboarding(pathOf(HANS_APPLICATION_DECLINED.id), { session: HANS_SESSION, c1m2: { applications: [HANS_APPLICATION_DECLINED] } });
    expect(await screen.findByText('OSP staff declined the application.')).toBeInTheDocument();
    expect(screen.getByText(/does not name the applicant/)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Withdraw the application' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Start a new application' }));
    expect(await screen.findByRole('heading', { name: 'What do you want to do?' })).toBeInTheDocument();
  });

  it('sends an applicant from /onboarding to the newest application, or to the start', async () => {
    renderOnboarding('/onboarding', { session: HANS_SESSION, c1m2: { applications: [HANS_APPLICATION_DECLINED] } });
    expect(await screen.findByText('OSP staff declined the application.')).toBeInTheDocument();
  });

  it('sends a person without application from /onboarding to the start', async () => {
    renderOnboarding('/onboarding', { session: ERIKA_SESSION });
    expect(await screen.findByRole('heading', { name: 'What do you want to do?' })).toBeInTheDocument();
  });
});
