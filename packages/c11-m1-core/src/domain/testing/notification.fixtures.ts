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

import type { NotificationAnemic } from '../anemics/notification.anemic';

/**
 * Test data of C11-M1 README 14: the company of OSP A (`1111…`) and the application of Erika. The offer and
 * subscription IDs are invented for the UI (README 14 names none). Contents carry IDs only, never names.
 */
const OSP_A_COMPANY_ID = '11111111-1111-4111-8111-111111111111';

/** R9, an open task for the Company Admin of the provider company. */
export const SUBSCRIPTION_REQUESTED_TASK: NotificationAnemic = {
  id: '7c1d0001-0000-4000-8000-000000000001',
  type: 'SUBSCRIPTION_REQUESTED',
  topic: 'ACTION',
  companyId: OSP_A_COMPANY_ID,
  subjectType: 'OFFER_SUBSCRIPTION',
  subjectId: '5b0d0001-0000-4000-8000-000000000001',
  content: {
    offerSubscriptionId: '5b0d0001-0000-4000-8000-000000000001',
    offerId: '0ffe0001-0000-4000-8000-000000000001',
    providerCompanyId: OSP_A_COMPANY_ID,
    customerCompanyId: 'c0000001-0000-4000-8000-000000000001',
  },
  forStaff: false,
  read: false,
  done: false,
  createdAt: '2026-11-06T09:31:00Z',
  doneAt: null,
};

/** R7, unread information for the Company Admin of the provider company. */
export const OFFER_APPROVED_INFO: NotificationAnemic = {
  id: '7c1d0002-0000-4000-8000-000000000002',
  type: 'OFFER_APPROVED',
  topic: 'INFO',
  companyId: OSP_A_COMPANY_ID,
  subjectType: 'OFFER',
  subjectId: '0ffe0001-0000-4000-8000-000000000001',
  content: { offerId: '0ffe0001-0000-4000-8000-000000000001', providerCompanyId: OSP_A_COMPANY_ID },
  forStaff: false,
  read: false,
  done: null,
  createdAt: '2026-11-05T15:02:00Z',
  doneAt: null,
};

/** R2, a task that is already closed (the application was approved). */
export const REVIEW_CASE_DONE_TASK: NotificationAnemic = {
  id: '7c1d0003-0000-4000-8000-000000000003',
  type: 'REVIEW_CASE_OPENED',
  topic: 'ACTION',
  companyId: null,
  subjectType: 'APPLICATION',
  subjectId: '0f8e2d4c-6b1a-4c3e-8f7d-2a9b1c0d3e4f',
  content: { applicationId: '0f8e2d4c-6b1a-4c3e-8f7d-2a9b1c0d3e4f' },
  forStaff: true,
  read: true,
  done: true,
  createdAt: '2026-11-04T10:00:00Z',
  doneAt: '2026-11-04T16:30:00Z',
};

/** The inbox of the mock person (Pia, Company Admin of the company of OSP A). */
export const MOCK_INBOX: ReadonlyArray<NotificationAnemic> = [SUBSCRIPTION_REQUESTED_TASK, OFFER_APPROVED_INFO, REVIEW_CASE_DONE_TASK];
