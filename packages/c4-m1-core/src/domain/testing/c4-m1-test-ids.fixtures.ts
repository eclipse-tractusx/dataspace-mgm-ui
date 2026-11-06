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

// Test IDs of FRAMEWORK 7a, of the participant management mockup (C3-M1 14) and of C4-M2 14.1, as in
// mockups/wallets/shared/data.js. Never invent IDs.

/** Company IDs of the fixtures. */
export const C4M1_TEST_COMPANY_IDS = {
  /** OSP A Beispiel GmbH, the OSP of the installation. */
  osp: '11111111-1111-4111-8111-111111111111',
  /** Beispiel Maschinenbau GmbH (U1), the company of Erika Mustermann and Max Mustermann. */
  beispielMaschinenbau: 'c0000001-0000-4000-8000-000000000001',
  beispielLogistik: 'c0000002-0000-4000-8000-000000000002',
  ohneZustimmung: 'c0000003-0000-4000-8000-000000000003',
  andereBeispiel: 'c0000004-0000-4000-8000-000000000004',
  /** C4-M2 14.1 test companies without a name. */
  div: '1a2b3c4d-0001-4000-8000-000000000001',
  identityHub: '1a2b3c4d-0002-4000-8000-000000000002',
  inactive: '1a2b3c4d-0006-4000-8000-000000000006',
} as const;

/** "Now" of the fixtures (the hackathon week, as in the mockup). Inject it as the clock to get the mockup's views. */
export const C4M1_FIXTURES_NOW = '2026-11-06T12:00:00Z';
