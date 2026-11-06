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

import type { CredentialStatus, CredentialType } from '@dataspace-mgm/c4-m1-core';

/** The filters of "All credentials", as the person sets them. UI state only; the API filters. */
export interface CredentialFilters {
  status: ReadonlyArray<CredentialStatus>;
  credentialType: CredentialType | null;
  /** Only orders open for longer than the open-order age (status REQUESTED, `requestedBefore`). */
  openOnly: boolean;
  /** Zero-based. */
  page: number;
}

export const NO_FILTERS: CredentialFilters = { status: [], credentialType: null, openOnly: false, page: 0 };

/** The status chips, in the order of the mockup (API values). */
export const FILTER_STATUSES: ReadonlyArray<CredentialStatus> = ['REQUESTED', 'FAILED', 'REVOCATION_PENDING', 'ISSUED', 'CANCELLED', 'REVOKED'];

/** Rows per page of the table (the API allows 1 to 100). */
export const CREDENTIALS_PAGE_SIZE = 10;
