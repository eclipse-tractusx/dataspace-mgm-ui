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

import type { ChangeRequestStatus, CompanyStatus, CoreDataSource } from './c3-m1-values.data';

/** Paging of the lists (query parameters `page` from 0, `size` 1–100). */
export interface PageRequestData {
  page: number;
  size: number;
}

/** Filters of `listCompanies` (GET /osp/companies), named like the query parameters of the spec. */
export interface CompanyListQueryData extends PageRequestData {
  status?: ReadonlyArray<CompanyStatus>;
  name?: string;
  bpn?: string;
  hasBpn?: boolean;
  companyRole?: string;
  coreDataSource?: CoreDataSource;
}

/** Filters of `listChangeRequests` (GET /osp/change-requests). */
export interface ChangeRequestListQueryData extends PageRequestData {
  status?: ReadonlyArray<ChangeRequestStatus>;
  companyId?: string;
}
