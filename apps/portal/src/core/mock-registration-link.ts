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

import type { LinkedApplication, MockRegistrationLink } from '@dataspace-mgm/c1-m3-core';
import type { InMemoryApplicationRepository } from '@dataspace-mgm/c1-m2-core/testing';

/** The registration mock (C1-M2) of the running mock mode; mock-container.ts sets it. */
let registration: InMemoryApplicationRepository | null = null;

export function linkMockRegistration(applications: InMemoryApplicationRepository | null): void {
  registration = applications;
}

/**
 * Mock mode: Application review (C1-M3 mock) sees the applications submitted in onboarding (C1-M2 mock) and its
 * decision completes or declines them, so the applicant's "My application" follows the reviewer, without a reload.
 */
export const mockRegistrationLink: MockRegistrationLink = {
  submitted: () =>
    (registration?.applications ?? [])
      .filter((application) => application.status === 'SUBMITTED' && application.reviewStatus === 'OPEN')
      .map(
        (application): LinkedApplication => ({
          id: application.id,
          companyId: application.companyId,
          kind: application.kind,
          existingCompany: application.existingCompany,
          verification: application.verification,
          applicant: { ...application.applicant },
          companyData: structuredClone(application.companyData) as LinkedApplication['companyData'],
          companyRoles: [...application.companyRoles] as LinkedApplication['companyRoles'],
          consents: application.consents.map((consent) => ({ ...consent })) as LinkedApplication['consents'],
          requiredAgreements: (registration?.requiredAgreementsOf(application.id) ?? []).map((ref) => ({ ...ref })),
          createdAt: application.createdAt,
          submittedAt: application.submittedAt,
        }),
      ),
  decided: (applicationId, approved, reason) => {
    if (approved) {
      registration?.complete(applicationId);
    } else {
      registration?.decline(applicationId, reason ?? '');
    }
  },
};
