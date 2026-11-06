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

import { C1M2ProblemException } from '@dataspace-mgm/c1-m2-core';
import { HANS_APPLICATION_DECLINED, HANS_APPLICATION_DOCUMENTS, MAX_APPLICATION_REACTIVATION, ROLF_SESSION } from '@dataspace-mgm/c1-m2-core/testing';
import { fireEvent, screen, within } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { onboardingTranslations } from './i18n';
import { renderOnboarding } from './test-utils';

beforeAll(() => onboardingTranslations.load());

const applications = [HANS_APPLICATION_DOCUMENTS, HANS_APPLICATION_DECLINED, MAX_APPLICATION_REACTIVATION];

describe('Onboarding: applications for OSP staff', () => {
  it('lists every application with the side filter and the count in one card', async () => {
    renderOnboarding('/onboarding', { session: ROLF_SESSION, c1m2: { applications } });
    expect(await screen.findByText('3 of 3 applications')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(4);
    fireEvent.click(within(screen.getByRole('group', { name: 'Proven with' })).getByRole('checkbox', { name: 'Supporting documents' }));
    expect(await screen.findByText('2 of 3 applications')).toBeInTheDocument();
  });

  it('shows an application in the same card, with a back button that keeps the filter', async () => {
    renderOnboarding('/onboarding', { session: ROLF_SESSION, c1m2: { applications } });
    fireEvent.click(await screen.findByText('Beispiel Werkzeugbau GmbH'));
    expect(await screen.findByRole('heading', { name: 'Comparison with the wallet' })).toBeInTheDocument();
    expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Applications' }));
    expect(await screen.findByRole('table')).toBeInTheDocument();
  });

  it('says when no application matches and resets the filter', async () => {
    renderOnboarding('/onboarding', { session: ROLF_SESSION, c1m2: { applications } });
    fireEvent.click(await screen.findByRole('checkbox', { name: 'Completed' }));
    expect(await screen.findByText('No application matches the filter')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reset filter' }));
    expect(await screen.findByText('3 of 3 applications')).toBeInTheDocument();
  });

  it('shows the 403 of the API (the permission key of /me only hides UI)', async () => {
    const forbidden = new C1M2ProblemException({ status: 403, type: 'urn:c1-m2:problem:forbidden' });
    renderOnboarding('/onboarding', { session: ROLF_SESSION, c1m2: { applications, failure: forbidden } });
    expect(await screen.findByText('Only OSP staff see the applications of this OSP.')).toBeInTheDocument();
  });
});
