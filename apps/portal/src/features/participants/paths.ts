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

/** The routes of participant management (relative to the app root, as FeatureRoute.path) and links to them. */
export const PARTICIPANTS_ROUTES = {
  company: 'participants',
  changeCompany: 'participants/company/change',
  ownChangeRequests: 'participants/company/change-requests',
  companyRoles: 'participants/company/roles',
  companies: 'participants/companies',
  companyDetail: 'participants/companies/:companyId',
  cspRegistration: 'participants/companies/:companyId/csp',
  reviewQueue: 'participants/change-requests',
  review: 'participants/change-requests/:changeRequestId',
} as const;

const id = (value: string) => encodeURIComponent(value);

export const participantsPath = {
  company: () => '/participants',
  changeCompany: () => '/participants/company/change',
  ownChangeRequests: () => '/participants/company/change-requests',
  companyRoles: () => '/participants/company/roles',
  companies: () => '/participants/companies',
  companyDetail: (companyId: string) => `/participants/companies/${id(companyId)}`,
  cspRegistration: (companyId: string) => `/participants/companies/${id(companyId)}/csp`,
  reviewQueue: () => '/participants/change-requests',
  review: (changeRequestId: string) => `/participants/change-requests/${id(changeRequestId)}`,
};
