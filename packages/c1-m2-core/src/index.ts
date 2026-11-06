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

/** The base path of the module under the app's api_base_url (`servers.url` of specs/c1-m2/openapi.yaml without `/api`). */
export const C1M2_BASE_PATH = '/c1-m2';

// No createC1M2Module yet: the HTTP adapter comes in phase 3 (skill build-feature). Mock mode and tests wire the use
// cases with createMockC1M2Module from @dataspace-mgm/c1-m2-core/testing.

export { createC1M2UseCases, type C1M2Ports } from './application/c1-m2-use-cases.factory';
export type { C1M2Module } from './data/c1-m2-module.data';
export { C1M2ProblemException } from './domain/c1-m2-problem.exception';

export { CreateAgreementVersionUseCase } from './application/useCases/create-agreement-version.use-case';
export { CreateApplicationUseCase } from './application/useCases/create-application.use-case';
export { DeleteDocumentUseCase } from './application/useCases/delete-document.use-case';
export { GetAnyApplicationUseCase } from './application/useCases/get-any-application.use-case';
export { GetAnyDocumentUseCase } from './application/useCases/get-any-document.use-case';
export { GetDocumentUseCase } from './application/useCases/get-document.use-case';
export { GetOwnApplicationUseCase } from './application/useCases/get-own-application.use-case';
export { ListAgreementVersionsUseCase } from './application/useCases/list-agreement-versions.use-case';
export { ListAgreementsUseCase } from './application/useCases/list-agreements.use-case';
export { ListAllApplicationsUseCase } from './application/useCases/list-all-applications.use-case';
export { ListCompanyRolesUseCase } from './application/useCases/list-company-roles.use-case';
export { ListCountriesUseCase } from './application/useCases/list-countries.use-case';
export { ListIdentifierTypesUseCase } from './application/useCases/list-identifier-types.use-case';
export { ListOwnApplicationsUseCase } from './application/useCases/list-own-applications.use-case';
export { ReplaceAttestationUseCase } from './application/useCases/replace-attestation.use-case';
export { RequestAttestationUseCase } from './application/useCases/request-attestation.use-case';
export { SubmitApplicationUseCase } from './application/useCases/submit-application.use-case';
export { UpdateApplicationUseCase } from './application/useCases/update-application.use-case';
export { UploadDocumentUseCase } from './application/useCases/upload-document.use-case';
export { WithdrawApplicationUseCase } from './application/useCases/withdraw-application.use-case';
export type { AgreementAnemic } from './domain/anemics/agreement.anemic';
export type { AgreementVersionAnemic } from './domain/anemics/agreement-version.anemic';
export type { ApplicationAnemic } from './domain/anemics/application.anemic';
export type { ApplicationSummaryAnemic } from './domain/anemics/application-summary.anemic';
export type { ApplicationWithReviewAnemic } from './domain/anemics/application-with-review.anemic';
export type { AttestationSummaryAnemic } from './domain/anemics/attestation-summary.anemic';
export type { CompanyRoleInfoAnemic } from './domain/anemics/company-role-info.anemic';
export type { CountryAnemic } from './domain/anemics/country.anemic';
export type { DocumentInfoAnemic } from './domain/anemics/document-info.anemic';
export type { IdentifierTypeInfoAnemic } from './domain/anemics/identifier-type-info.anemic';
export type { AgreementVersionCreateInput } from './domain/data/agreement-version-create-input.data';
export type { ApplicationCreateInput, CompanyDataInput } from './domain/data/application-create-input.data';
export type { ApplicationUpdateInput } from './domain/data/application-update-input.data';
export type {
  AgreementParty,
  AgreementScope,
  AgreementStatus,
  ApplicationKind,
  ApplicationStatus,
  AttestationInvalidReason,
  ComparisonField,
  ComparisonResult,
  DocumentContentType,
  DocumentType,
  IdentifierSource,
  IdentifierType,
  Language,
  MismatchField,
  RepresentationResult,
  ReviewStatus,
  Verification,
} from './domain/data/c1-m2-enums.data';
export type * from './domain/data/c1-m2-outcomes.data';
export type { C1M2ProblemData } from './domain/data/c1-m2-problem.data';
export type * from './domain/data/c1-m2-shapes.data';
export type { CreatedApplicationData } from './domain/data/created-application.data';
export type { DocumentContent } from './domain/data/document-content.data';
export type { DocumentUploadInput } from './domain/data/document-upload-input.data';
export type { AgreementVersionsFilter, AllApplicationsFilter, OwnApplicationsFilter } from './domain/data/list-filters.data';
export type { PageData } from './domain/data/page.data';
export type { ConsentInput, SubmitInput } from './domain/data/submit-input.data';
export type * from './domain/data/create-agreement-version-result.data';
export type * from './domain/data/create-application-result.data';
export type * from './domain/data/delete-document-result.data';
export type * from './domain/data/get-any-application-result.data';
export type * from './domain/data/get-any-document-result.data';
export type * from './domain/data/get-document-result.data';
export type * from './domain/data/get-own-application-result.data';
export type * from './domain/data/list-agreement-versions-result.data';
export type * from './domain/data/list-agreements-result.data';
export type * from './domain/data/list-all-applications-result.data';
export type * from './domain/data/list-company-roles-result.data';
export type * from './domain/data/list-countries-result.data';
export type * from './domain/data/list-identifier-types-result.data';
export type * from './domain/data/list-own-applications-result.data';
export type * from './domain/data/replace-attestation-result.data';
export type * from './domain/data/request-attestation-result.data';
export type * from './domain/data/submit-application-result.data';
export type * from './domain/data/update-application-result.data';
export type * from './domain/data/upload-document-result.data';
export type * from './domain/data/withdraw-application-result.data';
export type { AgreementRepository } from './domain/repositories/agreement.repository';
export type { ApplicationRepository } from './domain/repositories/application.repository';
export type { ReferenceDataRepository } from './domain/repositories/reference-data.repository';
export type { WalletAttestationRepository } from './domain/repositories/wallet-attestation.repository';
export { ProblemOutcomeDomain } from './domain/domains/problem-outcome.domain';
