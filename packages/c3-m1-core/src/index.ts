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

import { createCoreClient, type CoreModuleConfig } from '@dataspace-mgm/core-http';
import { c3m1ModuleFrom } from './c3-m1-module.factory';
import type { C3M1Module } from './data/c3-m1-module.data';
import type { paths } from './generated/c3-m1-api';
import { ChangeRequestReviewHttpRepository } from './infrastructure/repositories/change-request-review-http.repository';
import { CompanyHttpRepository } from './infrastructure/repositories/company-http.repository';
import { CompanyRoleHttpRepository } from './infrastructure/repositories/company-role-http.repository';
import { OspCompanyHttpRepository } from './infrastructure/repositories/osp-company-http.repository';
import { OwnChangeRequestHttpRepository } from './infrastructure/repositories/own-change-request-http.repository';

/** The base path of the module under the app's api_base_url (`servers.url` of specs/c3-m1/openapi.yaml). */
export const C3M1_BASE_PATH = '/c3-m1';

/** Creates the module once per app (composition root); `config.baseUrl` is the module's base URL. */
export function createC3M1Module(config: CoreModuleConfig): C3M1Module {
  const client = createCoreClient<paths>(config);
  return c3m1ModuleFrom({
    companies: new CompanyHttpRepository(client),
    ownChangeRequests: new OwnChangeRequestHttpRepository(client),
    companyRoles: new CompanyRoleHttpRepository(client),
    ospCompanies: new OspCompanyHttpRepository(client),
    reviews: new ChangeRequestReviewHttpRepository(client),
  });
}

export { c3m1ModuleFrom, type C3M1Repositories } from './c3-m1-module.factory';
export type { C3M1Module } from './data/c3-m1-module.data';

// Shapes the UI works with
export type { AddressAnemic } from './domain/anemics/address.anemic';
export type { AddressFieldsAnemic } from './domain/anemics/address-fields.anemic';
export type { AgreementConsentAnemic } from './domain/anemics/agreement-consent.anemic';
export type { ChangeRequestAnemic } from './domain/anemics/change-request.anemic';
export type { ChangeRequestDetailAnemic } from './domain/anemics/change-request-detail.anemic';
export type { CompanyAnemic } from './domain/anemics/company.anemic';
export type { CompanyDetailAnemic } from './domain/anemics/company-detail.anemic';
export type { CompanyRoleStateAnemic } from './domain/anemics/company-role-state.anemic';
export type { CompanySummaryAnemic } from './domain/anemics/company-summary.anemic';
export type { DeclaredIdentifierAnemic } from './domain/anemics/declared-identifier.anemic';
export type { DocumentFileAnemic } from './domain/anemics/document-file.anemic';
export type { DocumentInfoAnemic } from './domain/anemics/document-info.anemic';
export type { IdentifierAnemic } from './domain/anemics/identifier.anemic';
export type { PageAnemic } from './domain/anemics/page.anemic';
export type { AgreementRefData, ChangeRequestDraftData, CompanyCorrectionData } from './domain/data/c3-m1-commands.data';
export type { ChangeRequestListQueryData, CompanyListQueryData, PageRequestData } from './domain/data/c3-m1-queries.data';
export * from './domain/data/c3-m1-values.data';
export type { GetOwnCompanyResult } from './domain/data/get-own-company-result.data';
export type * from './domain/data/operation-result.data';
export type { ValidationErrorData } from './domain/data/validation-error.data';
export { C3M1_LIMITS } from './domain/constants/c3-m1-limits.constant';

// UX pre-checks (the API decides again)
export { ChangeRequestDomain } from './domain/domains/change-request.domain';
export { CompanyDomain } from './domain/domains/company.domain';
export { CompanyRoleDomain } from './domain/domains/company-role.domain';
export { IdentifierDomain } from './domain/domains/identifier.domain';

// Ports and use cases
export type { ChangeRequestReviewRepository } from './domain/repositories/change-request-review.repository';
export type { CompanyRepository } from './domain/repositories/company.repository';
export type { CompanyRoleRepository } from './domain/repositories/company-role.repository';
export type { OspCompanyRepository } from './domain/repositories/osp-company.repository';
export type { OwnChangeRequestRepository } from './domain/repositories/own-change-request.repository';
export { GetOwnCompanyUseCase } from './application/useCases/get-own-company.use-case';
