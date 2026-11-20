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
 * Assisted-By: Claude Code (claude-fable-5-2)
 ********************************************************************************/

import type { ApplicationSummaryAnemic } from '../../domain/anemics/application-summary.anemic';
import type { ApplicationWithReviewAnemic } from '../../domain/anemics/application-with-review.anemic';
import type { ApplicationAnemic } from '../../domain/anemics/application.anemic';
import type { ApplicationCreateInput, CompanyDataInput } from '../../domain/data/application-create-input.data';
import type { ApplicationUpdateInput } from '../../domain/data/application-update-input.data';
import type { Address, CompanyData } from '../../domain/data/c1-m2-shapes.data';
import type { PageData } from '../../domain/data/page.data';
import type { SubmitInput } from '../../domain/data/submit-input.data';
import type {
  AddressDto,
  ApplicationCreateDto,
  ApplicationDto,
  ApplicationPageDto,
  ApplicationSummaryDto,
  ApplicationUpdateDto,
  ApplicationWithReviewDto,
  CompanyDataDto,
  CompanyDataInputDto,
  SubmitRequestDto,
} from '../data/c1-m2-infrastructure.data';
import { DocumentMapper } from './document.mapper';

/**
 * C1-M2 `Application` and its relatives (DTOs of the API) ↔ the anemics and inputs of the UI. The anemics keep the
 * wire shape (camelCase of specs/c1-m2/openapi.yaml); the mapper makes the optional members of the spec explicit
 * (`null`), since the module leaves out what an application never had.
 */
export class ApplicationMapper {
  public static addressToAnemic(dto: AddressDto): Address {
    return {
      streetName: dto.streetName,
      streetNumber: dto.streetNumber ?? null,
      postalCode: dto.postalCode ?? null,
      city: dto.city,
      region: dto.region ?? null,
      countryCode: dto.countryCode,
    };
  }

  public static companyDataToAnemic(dto: CompanyDataDto): CompanyData {
    return {
      legalName: dto.legalName,
      shortName: dto.shortName ?? null,
      address: ApplicationMapper.addressToAnemic(dto.address),
      identifiers: dto.identifiers,
    };
  }

  public static toAnemic(dto: ApplicationDto): ApplicationAnemic {
    return {
      id: dto.id,
      companyId: dto.companyId,
      kind: dto.kind,
      existingCompany: dto.existingCompany,
      verification: dto.verification,
      applicant: dto.applicant,
      status: dto.status,
      companyData: ApplicationMapper.companyDataToAnemic(dto.companyData),
      companyRoles: dto.companyRoles,
      attestation: dto.attestation ?? null,
      comparison: dto.comparison,
      documents: dto.documents.map(DocumentMapper.toAnemic),
      representationDeclared: dto.representationDeclared ?? null,
      consents: dto.consents,
      declineReason: dto.declineReason ?? null,
      createdAt: dto.createdAt,
      // `changedAt` is not required by the spec: an application that was never changed was last changed when created.
      changedAt: dto.changedAt ?? dto.createdAt,
      submittedAt: dto.submittedAt ?? null,
      withdrawnAt: dto.withdrawnAt ?? null,
      closedAt: dto.closedAt ?? null,
      completedAt: dto.completedAt ?? null,
    };
  }

  public static withReviewToAnemic(dto: ApplicationWithReviewDto): ApplicationWithReviewAnemic {
    return { ...ApplicationMapper.toAnemic(dto), reviewStatus: dto.reviewStatus };
  }

  public static summaryToAnemic(dto: ApplicationSummaryDto): ApplicationSummaryAnemic {
    return {
      id: dto.id,
      companyId: dto.companyId,
      kind: dto.kind,
      existingCompany: dto.existingCompany,
      verification: dto.verification,
      status: dto.status,
      legalName: dto.legalName,
      countryCode: dto.countryCode,
      companyRoles: dto.companyRoles,
      createdAt: dto.createdAt,
      submittedAt: dto.submittedAt ?? null,
    };
  }

  public static pageToAnemic(dto: ApplicationPageDto): PageData<ApplicationSummaryAnemic> {
    return { items: dto.items.map(ApplicationMapper.summaryToAnemic), page: dto.page, size: dto.size, total: dto.total };
  }

  public static companyDataInputToDto(input: CompanyDataInput): CompanyDataInputDto {
    return {
      legalName: input.legalName,
      shortName: input.shortName,
      address: input.address,
      identifiers: input.identifiers ? [...input.identifiers] : undefined,
    };
  }

  /** Body of `createApplication` (schema `ApplicationCreate`); members that are not given stay out of the JSON. */
  public static createToDto(input: ApplicationCreateInput): ApplicationCreateDto {
    return {
      kind: input.kind,
      verification: input.verification,
      attestation: input.attestation,
      companyId: input.companyId,
      bpn: input.bpn,
      companyData: input.companyData ? ApplicationMapper.companyDataInputToDto(input.companyData) : undefined,
      companyRoles: input.companyRoles ? [...input.companyRoles] : undefined,
    };
  }

  /** Body of `updateApplication` (schema `ApplicationUpdate`): given members replace, `shortName: null` clears it. */
  public static updateToDto(input: ApplicationUpdateInput): ApplicationUpdateDto {
    return {
      legalName: input.legalName,
      shortName: input.shortName,
      address: input.address,
      identifiers: input.identifiers ? [...input.identifiers] : undefined,
      companyRoles: input.companyRoles ? [...input.companyRoles] : undefined,
    };
  }

  /** Body of `submitApplication` (schema `SubmitRequest`). */
  public static submitToDto(input: SubmitInput): SubmitRequestDto {
    return {
      consents: input.consents.map((consent) => ({ agreementKey: consent.agreementKey, version: consent.version, language: consent.language })),
      representationDeclared: input.representationDeclared,
    };
  }
}
