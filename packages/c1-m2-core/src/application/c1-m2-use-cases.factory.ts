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

import type { C1M2Module } from '../data/c1-m2-module.data';
import type { AgreementRepository } from '../domain/repositories/agreement.repository';
import type { ApplicationRepository } from '../domain/repositories/application.repository';
import type { ReferenceDataRepository } from '../domain/repositories/reference-data.repository';
import type { WalletAttestationRepository } from '../domain/repositories/wallet-attestation.repository';
import { CreateAgreementVersionUseCase } from './useCases/create-agreement-version.use-case';
import { CreateApplicationUseCase } from './useCases/create-application.use-case';
import { DeleteDocumentUseCase } from './useCases/delete-document.use-case';
import { GetAnyApplicationUseCase } from './useCases/get-any-application.use-case';
import { GetAnyDocumentUseCase } from './useCases/get-any-document.use-case';
import { GetDocumentUseCase } from './useCases/get-document.use-case';
import { GetOwnApplicationUseCase } from './useCases/get-own-application.use-case';
import { ListAgreementVersionsUseCase } from './useCases/list-agreement-versions.use-case';
import { ListAgreementsUseCase } from './useCases/list-agreements.use-case';
import { ListAllApplicationsUseCase } from './useCases/list-all-applications.use-case';
import { ListCompanyRolesUseCase } from './useCases/list-company-roles.use-case';
import { ListCountriesUseCase } from './useCases/list-countries.use-case';
import { ListIdentifierTypesUseCase } from './useCases/list-identifier-types.use-case';
import { ListOwnApplicationsUseCase } from './useCases/list-own-applications.use-case';
import { ReplaceAttestationUseCase } from './useCases/replace-attestation.use-case';
import { RequestAttestationUseCase } from './useCases/request-attestation.use-case';
import { SubmitApplicationUseCase } from './useCases/submit-application.use-case';
import { UpdateApplicationUseCase } from './useCases/update-application.use-case';
import { UploadDocumentUseCase } from './useCases/upload-document.use-case';
import { WithdrawApplicationUseCase } from './useCases/withdraw-application.use-case';

/** The adapters of the three ports of C1-M2: in-memory in mock mode and tests, HTTP in phase 3. */
export interface C1M2Ports {
  referenceData: ReferenceDataRepository;
  applications: ApplicationRepository;
  agreements: AgreementRepository;
  /** The wallet step (stand-in for the BFF until it offers the attestation, open point P0). */
  wallet: WalletAttestationRepository;
}

/** Wires every use case of C1M2Module to its port, so that each composition root does it the same way. */
export function createC1M2UseCases(ports: C1M2Ports): C1M2Module {
  return {
    listCountries: new ListCountriesUseCase(ports.referenceData),
    listIdentifierTypes: new ListIdentifierTypesUseCase(ports.referenceData),
    listCompanyRoles: new ListCompanyRolesUseCase(ports.referenceData),
    listAgreements: new ListAgreementsUseCase(ports.referenceData),
    createApplication: new CreateApplicationUseCase(ports.applications),
    listOwnApplications: new ListOwnApplicationsUseCase(ports.applications),
    getOwnApplication: new GetOwnApplicationUseCase(ports.applications),
    updateApplication: new UpdateApplicationUseCase(ports.applications),
    replaceAttestation: new ReplaceAttestationUseCase(ports.applications),
    uploadDocument: new UploadDocumentUseCase(ports.applications),
    getDocument: new GetDocumentUseCase(ports.applications),
    deleteDocument: new DeleteDocumentUseCase(ports.applications),
    submitApplication: new SubmitApplicationUseCase(ports.applications),
    withdrawApplication: new WithdrawApplicationUseCase(ports.applications),
    requestAttestation: new RequestAttestationUseCase(ports.wallet),
    listAllApplications: new ListAllApplicationsUseCase(ports.applications),
    getAnyApplication: new GetAnyApplicationUseCase(ports.applications),
    getAnyDocument: new GetAnyDocumentUseCase(ports.applications),
    listAgreementVersions: new ListAgreementVersionsUseCase(ports.agreements),
    createAgreementVersion: new CreateAgreementVersionUseCase(ports.agreements),
  };
}
