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

import type { CompanyAnemic } from '../anemics/company.anemic';
import type { CompanyDetailAnemic } from '../anemics/company-detail.anemic';
import type { ValidationErrorData } from '../data/validation-error.data';
import type { CompanyCorrectionData } from '../data/c3-m1-commands.data';
import { C3M1_LIMITS } from '../constants/c3-m1-limits.constant';
import { IdentifierDomain } from './identifier.domain';
import { TextDomain } from './text.domain';

/**
 * UX pre-checks of C3-M1 README 6.6 and 7.x. They only hide buttons that the API would refuse anyway (409
 * `invalid-state`); the API decides. Open point for C3-M1: return the allowed actions with the company instead.
 */
export class CompanyDomain {
  /** PATCH /companies/{id} is accepted only for an ACTIVE company (README 7.2). */
  public static canEdit(company: Pick<CompanyAnemic, 'status'>): boolean {
    return company.status === 'ACTIVE';
  }

  /** A change request may change name and address only for a company without a Business Wallet (409 `attestation-required`). */
  public static canRequestCoreDataChange(company: Pick<CompanyAnemic, 'coreDataSource'>): boolean {
    return company.coreDataSource === 'MANUAL';
  }

  /** README 7.12: a correction for ACTIVE and REQUESTED companies. */
  public static canCorrect(company: Pick<CompanyDetailAnemic, 'status'>): boolean {
    return company.status === 'ACTIVE' || company.status === 'REQUESTED';
  }

  /** README 7.13: only ACTIVE becomes INACTIVE. */
  public static canDeactivate(company: Pick<CompanyDetailAnemic, 'status'>): boolean {
    return company.status === 'ACTIVE';
  }

  public static validateShortName(shortName: string | null): ValidationErrorData[] {
    return TextDomain.optional('shortName', shortName, C3M1_LIMITS.SHORT_NAME_MAX);
  }

  public static validateReason(reason: string): ValidationErrorData[] {
    return TextDomain.required('reason', reason, C3M1_LIMITS.REASON_MAX);
  }

  public static validateCorrection(correction: CompanyCorrectionData): ValidationErrorData[] {
    const errors = [...CompanyDomain.validateReason(correction.reason)];
    if (correction.name !== undefined) {
      errors.push(...TextDomain.required('name', correction.name, C3M1_LIMITS.COMPANY_NAME_MAX));
    }
    if (correction.shortName !== undefined) {
      errors.push(...CompanyDomain.validateShortName(correction.shortName));
    }
    if (correction.address) {
      errors.push(...TextDomain.required('address.street', correction.address.street, C3M1_LIMITS.ADDRESS_LINE_MAX));
      errors.push(...TextDomain.required('address.city', correction.address.city, C3M1_LIMITS.ADDRESS_LINE_MAX));
    }
    if (correction.identifiers) {
      errors.push(...IdentifierDomain.validate(correction.identifiers));
    }
    return errors;
  }
}
