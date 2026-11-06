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
import { OSP_A_COMPANY } from '@dataspace-mgm/c3-m1-core/testing';
import { PIA_SESSION } from '@dataspace-mgm/identity-core/testing';
import { ColorModeProvider } from '@dataspace-mgm/ui-mui';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, describe, expect, it } from 'vitest';
import { TestCoreModules, testCoreModules } from '../../core/testing';
import { features, getAllRoutes } from '../main';
import { participantsTranslations } from './i18n';
import CompanyProfile from './pages/CompanyProfile';

beforeAll(() => participantsTranslations.load());

const show = (options: Parameters<typeof testCoreModules>[0]) => {
  const test = testCoreModules(options);
  render(
    <ColorModeProvider>
      <MemoryRouter initialEntries={['/participants']}>
        <TestCoreModules modules={test.modules}>
          <CompanyProfile />
        </TestCoreModules>
      </MemoryRouter>
    </ColorModeProvider>,
  );
  return test;
};

describe('Participant management: your company (C3-M1)', () => {
  it('shows the company of the signed-in person', async () => {
    const { companyRepository } = show({ session: PIA_SESSION, companies: [OSP_A_COMPANY] });
    expect(await screen.findByRole('heading', { level: 2, name: 'OSP A Beispiel GmbH' })).toBeInTheDocument();
    expect(within(screen.getByRole('group', { name: 'Business partner number' })).getByText('BPNL00000000OSPA')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Address' })).toHaveTextContent('Am Prüfstand 1');
    expect(screen.getByText('Onboarding service provider')).toBeInTheDocument();
    expect(companyRepository.calls).toEqual([PIA_SESSION.companyId]);
  });

  it('asks a signed-out person to sign in, through the BFF', async () => {
    const { redirect } = show({ session: null });
    fireEvent.click(await screen.findByRole('button', { name: 'Sign in' }));
    expect(redirect.logins).toEqual(['/participants']);
  });

  it('tells a person without a company and does not call the module', async () => {
    const { companyRepository } = show({ session: { ...PIA_SESSION, companyId: null }, companies: [OSP_A_COMPANY] });
    expect(await screen.findByText(/not bound to a company/)).toBeInTheDocument();
    expect(companyRepository.calls).toEqual([]);
  });

  it('shows an error of the module with its Problem Details type', async () => {
    show({ session: PIA_SESSION, companyFailure: new CoreHttpException(501, 'urn:c3-m1:problem:not-implemented', 'not implemented') });
    expect(await screen.findByText(/HTTP 501/)).toHaveTextContent('not implemented');
    expect(screen.getByText('urn:c3-m1:problem:not-implemented')).toBeInTheDocument();
  });

  it('is registered as an enabled feature at /participants', () => {
    expect(features.find((item) => item.path === '/participants')?.disabled).toBe(false);
    expect(getAllRoutes().some((route) => route.path === 'participants')).toBe(true);
  });
});
