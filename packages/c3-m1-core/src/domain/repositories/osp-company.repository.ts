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

import type { CompanyDetailAnemic } from '../anemics/company-detail.anemic';
import type { CompanySummaryAnemic } from '../anemics/company-summary.anemic';
import type { PageAnemic } from '../anemics/page.anemic';
import type { CompanyCorrectionData } from '../data/c3-m1-commands.data';
import type { CompanyListQueryData } from '../data/c3-m1-queries.data';

/** Port: the companies of the installation for the staff of the onboarding service provider (scope `osp`). */
export interface OspCompanyRepository {
  list(query: CompanyListQueryData): Promise<PageAnemic<CompanySummaryAnemic>>;
  getDetail(companyId: string): Promise<CompanyDetailAnemic>;
  correct(companyId: string, correction: CompanyCorrectionData): Promise<CompanyDetailAnemic>;
  deactivate(companyId: string, reason: string): Promise<CompanyDetailAnemic>;
}
