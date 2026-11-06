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

import type { AddCompanyRoleUseCase } from '../application/useCases/add-company-role.use-case';
import type { ApproveChangeRequestUseCase } from '../application/useCases/approve-change-request.use-case';
import type { CorrectCompanyUseCase } from '../application/useCases/correct-company.use-case';
import type { CreateChangeRequestUseCase } from '../application/useCases/create-change-request.use-case';
import type { DeactivateCompanyUseCase } from '../application/useCases/deactivate-company.use-case';
import type { DeclineChangeRequestUseCase } from '../application/useCases/decline-change-request.use-case';
import type { DownloadChangeRequestDocumentUseCase } from '../application/useCases/download-change-request-document.use-case';
import type { GetChangeRequestUseCase } from '../application/useCases/get-change-request.use-case';
import type { GetCompanyDetailUseCase } from '../application/useCases/get-company-detail.use-case';
import type { GetOwnCompanyUseCase } from '../application/useCases/get-own-company.use-case';
import type { ListChangeRequestsUseCase } from '../application/useCases/list-change-requests.use-case';
import type { ListCompaniesUseCase } from '../application/useCases/list-companies.use-case';
import type { ListCompanyRolesUseCase } from '../application/useCases/list-company-roles.use-case';
import type { ListOwnChangeRequestsUseCase } from '../application/useCases/list-own-change-requests.use-case';
import type { RemoveCompanyRoleUseCase } from '../application/useCases/remove-company-role.use-case';
import type { UpdateShortNameUseCase } from '../application/useCases/update-short-name.use-case';
import type { WithdrawChangeRequestUseCase } from '../application/useCases/withdraw-change-request.use-case';

/** Every operation a UI may trigger on C3-M1 Company Profile, as a use case. */
export interface C3M1Module {
  // The own company (scope `company`)
  getOwnCompany: GetOwnCompanyUseCase;
  updateShortName: UpdateShortNameUseCase;
  listOwnChangeRequests: ListOwnChangeRequestsUseCase;
  createChangeRequest: CreateChangeRequestUseCase;
  withdrawChangeRequest: WithdrawChangeRequestUseCase;
  listCompanyRoles: ListCompanyRolesUseCase;
  addCompanyRole: AddCompanyRoleUseCase;
  removeCompanyRole: RemoveCompanyRoleUseCase;
  // The onboarding service provider (scope `osp`)
  listCompanies: ListCompaniesUseCase;
  getCompanyDetail: GetCompanyDetailUseCase;
  correctCompany: CorrectCompanyUseCase;
  deactivateCompany: DeactivateCompanyUseCase;
  listChangeRequests: ListChangeRequestsUseCase;
  getChangeRequest: GetChangeRequestUseCase;
  downloadChangeRequestDocument: DownloadChangeRequestDocumentUseCase;
  approveChangeRequest: ApproveChangeRequestUseCase;
  declineChangeRequest: DeclineChangeRequestUseCase;
}
