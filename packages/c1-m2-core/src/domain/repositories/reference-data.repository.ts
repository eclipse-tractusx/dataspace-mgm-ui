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

import type { AgreementAnemic } from '../anemics/agreement.anemic';
import type { CompanyRoleInfoAnemic } from '../anemics/company-role-info.anemic';
import type { CountryAnemic } from '../anemics/country.anemic';
import type { IdentifierTypeInfoAnemic } from '../anemics/identifier-type-info.anemic';
import type { Language } from '../data/c1-m2-enums.data';

/**
 * Port: reference data and required terms of C1-M2 (README 7.1). Throws `C1M2ProblemException` for the module's 4xx
 * answers and `CoreHttpException` for the rest.
 */
export interface ReferenceDataRepository {
  listCountries(lang: Language): Promise<ReadonlyArray<CountryAnemic>>;
  /** null = 404, unknown country. */
  listIdentifierTypes(countryCode: string, lang: Language): Promise<ReadonlyArray<IdentifierTypeInfoAnemic> | null>;
  listCompanyRoles(lang: Language): Promise<ReadonlyArray<CompanyRoleInfoAnemic>>;
  /** Active required terms of the roles plus those with scope ALL; 400 `validation` for an unknown role. */
  listAgreements(companyRoles: ReadonlyArray<string>, lang: Language): Promise<ReadonlyArray<AgreementAnemic>>;
}
