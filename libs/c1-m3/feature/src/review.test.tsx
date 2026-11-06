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
 * to the project's license. Human review is required before committing.
 *
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: Codex (GPT-6)
 ********************************************************************************/

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ColorModeProvider } from '@dataspace-mgm/ui-mui';
import { createMockReviewModule, REVIEW_ACTORS } from '@dataspace-mgm/c1-m3-core';
import { reviewFixtures } from '@dataspace-mgm/c1-m3-core/testing';
import { createReviewStore, reviewApi } from '@dataspace-mgm/c1-m3-state';
import ReviewsPage from './pages/reviews.page';
import ReviewDetailPage from './pages/review-detail.page';

const stores: ReturnType<typeof createReviewStore>[] = [];
afterEach(() => {
  cleanup();
  for (const store of stores) {
    store.dispatch(reviewApi.util.resetApiState());
  }
  stores.length = 0;
});
function setup(n?: number) {
  const mock = createMockReviewModule();
  const store = createReviewStore({
    useCases: { review: mock.module },
    mock: mock.server,
  });
  stores.push(store);
  render(
    <Provider store={store}>
      <ColorModeProvider>
        <MemoryRouter initialEntries={[n ? `/onboarding/reviews/${reviewFixtures()[n - 1].id}` : '/onboarding']}>
          <Routes>
            <Route path="/onboarding" element={<ReviewsPage />} />
            <Route path="/onboarding/reviews/:reviewCaseId" element={<ReviewDetailPage />} />
          </Routes>
        </MemoryRouter>
      </ColorModeProvider>
    </Provider>,
  );
  return store;
}
describe('Review workbench', () => {
  it('opens a review by clicking the card body, approves and keeps the embedded application after refetch', async () => {
    setup();
    const links = await screen.findAllByRole('link', {
      name: 'Beispiel Maschinenbau GmbH',
    });
    fireEvent.click(within(links[0]).getByText('Passed: 6'));
    await screen.findByRole('heading', { name: 'Application details' });
    fireEvent.click(screen.getByRole('button', { name: 'Approve application' }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm decision' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(await screen.findByText('Decision saved.')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Application details' })).toBeTruthy();
    await waitFor(() =>
      expect(
        (
          screen.getByRole('button', {
            name: 'Approve application',
          }) as HTMLButtonElement
        ).disabled,
      ).toBe(false),
    );
  });
  it('requires a reason and performs the two-person document review across actor changes', async () => {
    setup(3);
    await screen.findByRole('heading', { name: 'Application details' });
    fireEvent.click(screen.getByRole('button', { name: 'Decline application' }));
    expect(
      (
        screen.getByRole('button', {
          name: 'Confirm decision',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    fireEvent.click(screen.getByRole('button', { name: 'Approve application' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm decision' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await screen.findByText(/First approval: Rolf/);
    fireEvent.change(screen.getByLabelText('Acting reviewer'), {
      target: { value: REVIEW_ACTORS[1].id },
    });
    await waitFor(() =>
      expect(
        (
          screen.getByRole('button', {
            name: 'Approve application',
          }) as HTMLButtonElement
        ).disabled,
      ).toBe(false),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Approve application' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm decision' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await screen.findByText(/Decision: Approved/);
  });
  it.each([
    [2, 'A comment is required because a check failed.'],
    [5, 'Some checks are incomplete or unavailable.'],
    [8, 'You cannot decide on your own application.'],
    [12, 'An expected CSP match is required for this application.'],
    [14, 'The applicant has withdrawn this application.'],
  ] as const)('lets the API evaluate approval for fixture %s and displays its error', async (fixture, message) => {
    setup(fixture);
    await screen.findByRole('heading', { name: 'Application details' });
    const approve = screen.getByRole('button', { name: 'Approve application' }) as HTMLButtonElement;
    expect(approve.disabled).toBe(false);
    fireEvent.click(approve);
    const dialog = await screen.findByRole('dialog');
    expect((within(dialog).getByRole('textbox') as HTMLTextAreaElement).required).toBe(false);
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm decision' }));
    expect(await within(dialog).findByText(message)).toBeTruthy();
  });
  it('lets the API require a comment, then retries successfully with the entered comment', async () => {
    setup(2);
    await screen.findByRole('heading', { name: 'Application details' });
    fireEvent.click(screen.getByRole('button', { name: 'Approve application' }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm decision' }));
    await within(dialog).findByText('A comment is required because a check failed.');
    fireEvent.change(within(dialog).getByRole('textbox'), { target: { value: 'Evidence reviewed.' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm decision' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await screen.findByText(/First approval: Rolf/);
  });
  it('shows permission errors, outage recovery and reset in English without a language selector', async () => {
    setup();
    await screen.findAllByRole('link', { name: 'Beispiel Maschinenbau GmbH' });
    fireEvent.change(screen.getByLabelText('Acting reviewer'), {
      target: { value: REVIEW_ACTORS[3].id },
    });
    await screen.findByText('You do not have permission to view reviews.');
    fireEvent.change(screen.getByLabelText('Acting reviewer'), {
      target: { value: REVIEW_ACTORS[0].id },
    });
    fireEvent.click(screen.getByLabelText('Simulate service outage'));
    await screen.findByText('A required service is unavailable. Please try again.');
    fireEvent.click(screen.getByRole('button', { name: 'Reset demo' }));
    await screen.findAllByRole('link', { name: 'Beispiel Maschinenbau GmbH' });
    expect(screen.queryByRole('combobox', { name: /language/i })).toBeNull();
    expect(screen.getByRole('heading', { name: 'Application review' })).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Application type'), {
      target: { value: 'TRANSFER' },
    });
    await screen.findAllByRole('link', { name: 'Andere Beispiel AG' });
    await waitFor(() => expect(screen.queryByRole('link', { name: 'Beispiel Maschinenbau GmbH' })).toBeNull());
  });
});
