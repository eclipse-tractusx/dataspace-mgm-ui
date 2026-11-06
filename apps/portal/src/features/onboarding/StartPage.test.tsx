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
import { ERIKA_SESSION, MAX_APPLICATION_REACTIVATION, MAX_SESSION } from '@dataspace-mgm/c1-m2-core/testing';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { features, getAllRoutes } from '../main';
import { onboardingTranslations } from './i18n';
import { renderOnboarding } from './test-utils';

beforeAll(() => onboardingTranslations.load());

describe('Onboarding: start application (C1-M2, proof of concept)', () => {
  it('is a proof of concept: closed outside mock mode', () => {
    expect(features.find((feature) => feature.id === 'onboarding')?.disabled).toBe(true);
    expect(getAllRoutes().some((route) => route.path?.startsWith('onboarding'))).toBe(false);
  });

  it('keeps the goal cards visible and shows the proof below them, steps at the side', async () => {
    renderOnboarding('/onboarding/start', { session: ERIKA_SESSION });
    expect(await screen.findByText('Erika Mustermann')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'How do you prove your company?' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Register a new company/ }));
    expect(screen.getByRole('heading', { name: 'How do you prove your company?' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register a new company/ })).toHaveAttribute('aria-pressed', 'true');
    const steps = screen.getByRole('list', { name: 'Progress' });
    expect(within(steps).getByText('Proof').closest('li')).toHaveAttribute('aria-current', 'step');
  });

  it('asks an existing company what happened, with the fields of the move', async () => {
    renderOnboarding('/onboarding/start', { session: ERIKA_SESSION });
    fireEvent.click(await screen.findByRole('button', { name: /My company is already in the dataspace/ }));
    expect(screen.queryByRole('heading', { name: 'How do you prove your company?' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Move it from another OSP/ }));
    expect(screen.getByLabelText('From which OSP?')).toBeInTheDocument();
    expect(screen.getByLabelText('Business partner number (BPN), if it was at this OSP before')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'How do you prove your company?' })).toBeInTheDocument();
  });

  it('verifies with the Business Wallet, creates the application and goes on to the company data', async () => {
    const { applicationRepository } = renderOnboarding('/onboarding/start', { session: ERIKA_SESSION });
    fireEvent.click(await screen.findByRole('button', { name: /Register a new company/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue with the Business Wallet' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Open wallet' }));
    expect(await screen.findByRole('heading', { name: 'Your company' })).toBeInTheDocument();
    const created = applicationRepository?.applications[0];
    expect(created).toMatchObject({ kind: 'ONBOARDING', verification: 'EBW', companyRoles: ['ACTIVE_PARTICIPANT'] });
    expect(screen.getByTestId('location')).toHaveTextContent(`/onboarding/application/${created?.id}/company-data`);
  });

  it('continues an open application instead of starting a second one', async () => {
    renderOnboarding('/onboarding/start', { session: MAX_SESSION, c1m2: { applications: [MAX_APPLICATION_REACTIVATION] } });
    fireEvent.click(await screen.findByRole('button', { name: /My company is already in the dataspace/ }));
    fireEvent.click(screen.getByRole('button', { name: /Reactivate it here/ }));
    fireEvent.change(screen.getByLabelText(/Business partner number \(BPN\)/), { target: { value: 'BPNL00000000003C' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue with the Business Wallet' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Open wallet' }));
    expect(await screen.findByText(/already have an application in progress/)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByText('urn:c1-m2:problem:open-application-exists')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Continue your application' }));
    expect(await screen.findByRole('heading', { name: 'Beispiel Werkzeugbau GmbH' })).toBeInTheDocument();
  });

  it('sends the documents path to the company form', async () => {
    renderOnboarding('/onboarding/start', { session: ERIKA_SESSION });
    fireEvent.click(await screen.findByRole('button', { name: /Register a new company/ }));
    fireEvent.click(screen.getByRole('button', { name: /With supporting documents/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue with supporting documents' }));
    expect(await screen.findByRole('button', { name: 'Create application and continue' })).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/onboarding/new');
  });

  it('shows a failure of the wallet step with its status', async () => {
    renderOnboarding('/onboarding/start', { session: ERIKA_SESSION, c1m2: { failure: new CoreHttpException(502, null, 'EBW-Connector not reachable') } });
    fireEvent.click(await screen.findByRole('button', { name: /Register a new company/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue with the Business Wallet' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Open wallet' }));
    expect(await screen.findByText(/HTTP 502/)).toHaveTextContent('EBW-Connector not reachable');
  });

  it('asks a signed-out person to sign in and says when the module is not connected', async () => {
    renderOnboarding('/onboarding/start', { session: null });
    expect(await screen.findByText('Sign in to register your company.')).toBeInTheDocument();
  });

  it('says when the module is not connected (outside mock mode)', async () => {
    renderOnboarding('/onboarding/start', { session: ERIKA_SESSION, c1m2: false });
    expect(await screen.findByText('Onboarding is not connected to its backend yet.')).toBeInTheDocument();
  });
});
