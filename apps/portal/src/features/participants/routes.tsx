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

import { GroupsOutlinedIcon } from '@dataspace-mgm/ui-mui';
import type { FeatureConfig } from '../../types/routing';
import { participantsTranslations } from './i18n';
import ChangeCompanyData from './pages/ChangeCompanyData';
import ChangeRequestQueue from './pages/ChangeRequestQueue';
import ChangeRequestReview from './pages/ChangeRequestReview';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import CompanyProfile from './pages/CompanyProfile';
import CompanyRoles from './pages/CompanyRoles';
import CspRegistration from './pages/CspRegistration';
import OwnChangeRequests from './pages/OwnChangeRequests';
import { PARTICIPANTS_ROUTES } from './paths';

/**
 * Participant management. Its backend modules are C3-M1 Company Profile and C3-M2 CSP Connection; the version is the
 * API version of C3-M1. Every page checks its permission (`x-permission` of its main operation) and the API enforces
 * it again. The pages of the company need `view_company`, the pages of the onboarding service provider
 * `view_companies`, `review_company_changes` or `view_csp_registration`.
 */
export const participantsFeature: FeatureConfig = {
  id: 'participants',
  version: '0.2.0',
  category: 'participants',
  icon: <GroupsOutlinedIcon />,
  navigationPath: '/participants',
  disabled: false,
  translations: participantsTranslations,
  routes: [
    { path: PARTICIPANTS_ROUTES.company, element: <CompanyProfile />, meta: { title: 'title' } },
    { path: PARTICIPANTS_ROUTES.changeCompany, element: <ChangeCompanyData />, meta: { title: 'change.title' } },
    { path: PARTICIPANTS_ROUTES.ownChangeRequests, element: <OwnChangeRequests />, meta: { title: 'requests.title' } },
    { path: PARTICIPANTS_ROUTES.companyRoles, element: <CompanyRoles />, meta: { title: 'roleCards.title' } },
    { path: PARTICIPANTS_ROUTES.companies, element: <Companies />, meta: { title: 'companies.title' } },
    { path: PARTICIPANTS_ROUTES.companyDetail, element: <CompanyDetail />, meta: { title: 'detail.title' } },
    { path: PARTICIPANTS_ROUTES.cspRegistration, element: <CspRegistration />, meta: { title: 'csp.title' } },
    { path: PARTICIPANTS_ROUTES.reviewQueue, element: <ChangeRequestQueue />, meta: { title: 'queue.title' } },
    { path: PARTICIPANTS_ROUTES.review, element: <ChangeRequestReview />, meta: { title: 'review.title' } },
  ],
};
