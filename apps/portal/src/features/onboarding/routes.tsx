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

import { AppRegistrationOutlinedIcon } from '@dataspace-mgm/ui-mui';
import type { FeatureConfig } from '../../types/routing';
import { onboardingTranslations } from './i18n';
import CompanyDataPage from './pages/CompanyDataPage';
import DocumentsPage from './pages/DocumentsPage';
import MyApplicationPage from './pages/MyApplicationPage';
import NewApplicationPage from './pages/NewApplicationPage';
import OnboardingPage from './pages/OnboardingPage';
import StartPage from './pages/StartPage';
import TermsPage from './pages/TermsPage';

/**
 * Onboarding, a proof of concept on mock data (skill build-poc): routed only in mock mode, "coming soon" otherwise.
 * Its backend module is C1-M2 Registration; the version is the API version of the module (specs/c1-m2/openapi.yaml).
 * Every page is open to every signed-in person: an applicant has register_company (every account, C2-M5 6.3), OSP
 * staff view_applications; the API decides and the pages show its 403.
 */
export const onboardingFeature: FeatureConfig = {
  id: 'onboarding',
  version: '0.2.0',
  category: 'onboarding',
  icon: <AppRegistrationOutlinedIcon />,
  navigationPath: '/onboarding',
  disabled: false,
  stage: 'poc',
  translations: onboardingTranslations,
  routes: [
    { path: 'onboarding', element: <OnboardingPage />, meta: { title: 'application.title' } },
    { path: 'onboarding/start', element: <StartPage />, meta: { title: 'start.title' } },
    { path: 'onboarding/new', element: <NewApplicationPage />, meta: { title: 'company.title' } },
    { path: 'onboarding/application/:applicationId', element: <MyApplicationPage />, meta: { title: 'application.title' } },
    { path: 'onboarding/application/:applicationId/company-data', element: <CompanyDataPage />, meta: { title: 'company.title' } },
    { path: 'onboarding/application/:applicationId/documents', element: <DocumentsPage />, meta: { title: 'documents.title' } },
    { path: 'onboarding/application/:applicationId/terms', element: <TermsPage />, meta: { title: 'terms.title' } },
  ],
};
