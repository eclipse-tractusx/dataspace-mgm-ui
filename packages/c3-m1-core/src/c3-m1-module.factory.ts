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

import { AddCompanyRoleUseCase } from './application/useCases/add-company-role.use-case';
import { ApproveChangeRequestUseCase } from './application/useCases/approve-change-request.use-case';
import { CorrectCompanyUseCase } from './application/useCases/correct-company.use-case';
import { CreateChangeRequestUseCase } from './application/useCases/create-change-request.use-case';
import { DeactivateCompanyUseCase } from './application/useCases/deactivate-company.use-case';
import { DeclineChangeRequestUseCase } from './application/useCases/decline-change-request.use-case';
import { DownloadChangeRequestDocumentUseCase } from './application/useCases/download-change-request-document.use-case';
import { GetChangeRequestUseCase } from './application/useCases/get-change-request.use-case';
import { GetCompanyDetailUseCase } from './application/useCases/get-company-detail.use-case';
import { GetOwnCompanyUseCase } from './application/useCases/get-own-company.use-case';
import { ListChangeRequestsUseCase } from './application/useCases/list-change-requests.use-case';
import { ListCompaniesUseCase } from './application/useCases/list-companies.use-case';
import { ListCompanyRolesUseCase } from './application/useCases/list-company-roles.use-case';
import { ListOwnChangeRequestsUseCase } from './application/useCases/list-own-change-requests.use-case';
import { RemoveCompanyRoleUseCase } from './application/useCases/remove-company-role.use-case';
import { UpdateShortNameUseCase } from './application/useCases/update-short-name.use-case';
import { WithdrawChangeRequestUseCase } from './application/useCases/withdraw-change-request.use-case';
import type { C3M1Module } from './data/c3-m1-module.data';
import type { ChangeRequestReviewRepository } from './domain/repositories/change-request-review.repository';
import type { CompanyRepository } from './domain/repositories/company.repository';
import type { CompanyRoleRepository } from './domain/repositories/company-role.repository';
import type { OspCompanyRepository } from './domain/repositories/osp-company.repository';
import type { OwnChangeRequestRepository } from './domain/repositories/own-change-request.repository';

/** The adapters of every port of C3-M1: HTTP in the app, in memory in mock mode and tests. */
export interface C3M1Repositories {
  companies: CompanyRepository;
  ownChangeRequests: OwnChangeRequestRepository;
  companyRoles: CompanyRoleRepository;
  ospCompanies: OspCompanyRepository;
  reviews: ChangeRequestReviewRepository;
}

/** Wires the use cases to the given adapters; the same wiring for HTTP and in memory, so both behave alike. */
export function c3m1ModuleFrom(repositories: C3M1Repositories): C3M1Module {
  const { companies, ownChangeRequests, companyRoles, ospCompanies, reviews } = repositories;
  return {
    getOwnCompany: new GetOwnCompanyUseCase(companies),
    updateShortName: new UpdateShortNameUseCase(companies),
    listOwnChangeRequests: new ListOwnChangeRequestsUseCase(ownChangeRequests),
    createChangeRequest: new CreateChangeRequestUseCase(ownChangeRequests),
    withdrawChangeRequest: new WithdrawChangeRequestUseCase(ownChangeRequests),
    listCompanyRoles: new ListCompanyRolesUseCase(companyRoles),
    addCompanyRole: new AddCompanyRoleUseCase(companyRoles),
    removeCompanyRole: new RemoveCompanyRoleUseCase(companyRoles),
    listCompanies: new ListCompaniesUseCase(ospCompanies),
    getCompanyDetail: new GetCompanyDetailUseCase(ospCompanies),
    correctCompany: new CorrectCompanyUseCase(ospCompanies),
    deactivateCompany: new DeactivateCompanyUseCase(ospCompanies),
    listChangeRequests: new ListChangeRequestsUseCase(reviews),
    getChangeRequest: new GetChangeRequestUseCase(reviews),
    downloadChangeRequestDocument: new DownloadChangeRequestDocumentUseCase(reviews),
    approveChangeRequest: new ApproveChangeRequestUseCase(reviews),
    declineChangeRequest: new DeclineChangeRequestUseCase(reviews),
  };
}
