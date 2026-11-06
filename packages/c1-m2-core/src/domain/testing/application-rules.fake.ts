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

import type { Verification } from '../data/c1-m2-enums.data';
import type { CompanyData, Identifier, ValidationError } from '../data/c1-m2-shapes.data';
import type { CompanyRoleFixture } from './fixtures/catalog.fixture';
import type { ReferenceDataFixture } from './fixtures/reference-data.fixture';

const MAX_IDENTIFIERS = 10;

/** Identifiers given by a person (README 6.6): at most 10, at most one per type. */
export function identifierListErrors(identifiers: ReadonlyArray<Identifier>, field: string): ValidationError[] {
  const errors: ValidationError[] = [];
  if (identifiers.length > MAX_IDENTIFIERS) {
    errors.push({ field, message: `At most ${MAX_IDENTIFIERS} identifiers.` });
  }
  const types = identifiers.map((identifier) => identifier.type);
  if (new Set(types).size !== types.length) {
    errors.push({ field, message: 'At most one identifier per type.' });
  }
  if (identifiers.some((identifier) => identifier.value.length === 0 || identifier.value.length > 200)) {
    errors.push({ field, message: 'An identifier value has 1 to 200 characters.' });
  }
  return errors;
}

/**
 * Company data against the reference data (README 7.2 step 9, 6.6): country known, identifier types of the country,
 * EBWOID required for EBW and forbidden for DOCUMENTS. The per-country regular expressions are checked only by the
 * backend.
 */
export function companyDataErrors(companyData: CompanyData, verification: Verification, referenceData: ReferenceDataFixture): ValidationError[] {
  const errors = identifierListErrors(companyData.identifiers, 'companyData.identifiers');
  const country = referenceData.countries.find((candidate) => candidate.code === companyData.address.countryCode);
  if (!country) {
    errors.push({ field: 'companyData.address.countryCode', message: `Unknown country ${companyData.address.countryCode}.` });
  }
  for (const identifier of companyData.identifiers) {
    if (country && !country.identifierTypes.includes(identifier.type)) {
      errors.push({ field: 'companyData.identifiers', message: `Identifier type ${identifier.type} is not allowed for ${country.code}.` });
    }
  }
  const hasEbwoid = companyData.identifiers.some((identifier) => identifier.type === 'EBWOID');
  if (verification === 'EBW' && !hasEbwoid) {
    errors.push({ field: 'companyData.identifiers', message: 'EBWOID is required in the verification path EBW.' });
  }
  if (verification === 'DOCUMENTS' && hasEbwoid) {
    errors.push({ field: 'companyData.identifiers', message: 'EBWOID is not allowed without a Business Wallet.' });
  }
  if (!companyData.legalName.trim() || companyData.legalName.length > 160) {
    errors.push({ field: 'companyData.legalName', message: 'The legal name has 1 to 160 characters.' });
  }
  return errors;
}

/** Company roles (README 6.7): at least one, no duplicates, only selectable roles. */
export function companyRoleErrors(roles: ReadonlyArray<string>, catalog: ReadonlyArray<CompanyRoleFixture>, field = 'companyRoles'): ValidationError[] {
  const errors: ValidationError[] = [];
  if (roles.length === 0) {
    errors.push({ field, message: 'At least one company role is required.' });
  }
  if (new Set(roles).size !== roles.length) {
    errors.push({ field, message: 'Company roles must not repeat.' });
  }
  for (const role of roles) {
    if (!catalog.some((candidate) => candidate.role === role && candidate.selectable)) {
      errors.push({ field, message: `Company role ${role} is unknown or not selectable.` });
    }
  }
  return errors;
}
