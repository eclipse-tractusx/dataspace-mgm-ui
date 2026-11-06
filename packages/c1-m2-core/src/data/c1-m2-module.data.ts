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

import type { CreateAgreementVersionUseCase } from '../application/useCases/create-agreement-version.use-case';
import type { CreateApplicationUseCase } from '../application/useCases/create-application.use-case';
import type { DeleteDocumentUseCase } from '../application/useCases/delete-document.use-case';
import type { GetAnyApplicationUseCase } from '../application/useCases/get-any-application.use-case';
import type { GetAnyDocumentUseCase } from '../application/useCases/get-any-document.use-case';
import type { GetDocumentUseCase } from '../application/useCases/get-document.use-case';
import type { GetOwnApplicationUseCase } from '../application/useCases/get-own-application.use-case';
import type { ListAgreementVersionsUseCase } from '../application/useCases/list-agreement-versions.use-case';
import type { ListAgreementsUseCase } from '../application/useCases/list-agreements.use-case';
import type { ListAllApplicationsUseCase } from '../application/useCases/list-all-applications.use-case';
import type { ListCompanyRolesUseCase } from '../application/useCases/list-company-roles.use-case';
import type { ListCountriesUseCase } from '../application/useCases/list-countries.use-case';
import type { ListIdentifierTypesUseCase } from '../application/useCases/list-identifier-types.use-case';
import type { ListOwnApplicationsUseCase } from '../application/useCases/list-own-applications.use-case';
import type { ReplaceAttestationUseCase } from '../application/useCases/replace-attestation.use-case';
import type { RequestAttestationUseCase } from '../application/useCases/request-attestation.use-case';
import type { SubmitApplicationUseCase } from '../application/useCases/submit-application.use-case';
import type { UpdateApplicationUseCase } from '../application/useCases/update-application.use-case';
import type { UploadDocumentUseCase } from '../application/useCases/upload-document.use-case';
import type { WithdrawApplicationUseCase } from '../application/useCases/withdraw-application.use-case';

/**
 * Every operation a UI may trigger on C1-M2 Registration, as a use case (reads included). Steps and internal queries
 * are for Process Orchestration and other modules and are not here (README 8, 9).
 */
export interface C1M2Module {
  listCountries: ListCountriesUseCase;
  listIdentifierTypes: ListIdentifierTypesUseCase;
  listCompanyRoles: ListCompanyRolesUseCase;
  listAgreements: ListAgreementsUseCase;
  createApplication: CreateApplicationUseCase;
  listOwnApplications: ListOwnApplicationsUseCase;
  getOwnApplication: GetOwnApplicationUseCase;
  updateApplication: UpdateApplicationUseCase;
  replaceAttestation: ReplaceAttestationUseCase;
  uploadDocument: UploadDocumentUseCase;
  getDocument: GetDocumentUseCase;
  deleteDocument: DeleteDocumentUseCase;
  submitApplication: SubmitApplicationUseCase;
  withdrawApplication: WithdrawApplicationUseCase;
  /** Stand-in for the wallet step of the BFF (not a C1-M2 operation, open point P0). */
  requestAttestation: RequestAttestationUseCase;
  listAllApplications: ListAllApplicationsUseCase;
  getAnyApplication: GetAnyApplicationUseCase;
  getAnyDocument: GetAnyDocumentUseCase;
  listAgreementVersions: ListAgreementVersionsUseCase;
  createAgreementVersion: CreateAgreementVersionUseCase;
}
