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

/**
 * Limits of the inputs, from specs/c3-m1/openapi.yaml (maxLength) and the defaults of C3-M1 README 4
 * (`CHANGE_REQUEST_MAX_DOCUMENTS`, `CHANGE_REQUEST_MAX_DOCUMENT_BYTES`). An installation may set other document limits;
 * the UI cannot read them yet (open point), the API checks them again (400 `document-invalid`).
 */
export const C3M1_LIMITS = {
  SHORT_NAME_MAX: 100,
  COMPANY_NAME_MAX: 160,
  COMMENT_MAX: 1000,
  REASON_MAX: 500,
  DECLINE_REASON_MAX: 1000,
  APPROVAL_COMMENT_MAX: 1000,
  IDENTIFIER_VALUE_MAX: 255,
  ADDRESS_LINE_MAX: 255,
  MAX_DOCUMENTS: 3,
  MAX_DOCUMENT_BYTES: 10 * 1024 * 1024,
} as const;
