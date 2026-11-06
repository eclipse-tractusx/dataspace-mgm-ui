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

import type { ComparisonField, ComparisonResult, MismatchField } from '../data/c1-m2-enums.data';
import type { Address, ComparisonEntry, CompanyData, Identifier, IdentifierWithSource, ValidationError } from '../data/c1-m2-shapes.data';
import type { MockAttestationClaims } from './mock-attestation-claims';
import { problem, throwIfInvalid } from './problems.fake';
import { comparableText, normalisedIdentifierValue } from './text-normalisation.fake';

/**
 * What the person gave for the company (create or change). The fake keeps it per application so that a change or a
 * new attestation can compare again (README 6.5: omitted fields come from the attestation).
 */
export interface PersonCompanyInput {
  legalName?: string;
  shortName?: string | null;
  address?: Address;
  /** The identifiers given by the person, normalised. */
  identifiers: ReadonlyArray<Identifier>;
}

export interface BuiltCompanyData {
  companyData: CompanyData;
  comparison: ReadonlyArray<ComparisonEntry>;
}

/** Splits `street_address` into name and number (backend stand-in: `^(.*?)\s+(\d+\w*)$`). */
const STREET_NUMBER = /^(.*?)\s+(\d+\w*)$/;

interface ComparedValue {
  value: string | null;
  result: ComparisonResult | null;
}

/** One compared field (README 6.5): omitted → FROM_ATTESTATION, claim missing → NOT_IN_ATTESTATION, both → no entry. */
function compareField(person: string | null | undefined, claim: string | null | undefined): ComparedValue {
  const given = person !== undefined && person !== null && person.trim() !== '';
  const attested = claim !== undefined && claim !== null && claim.trim() !== '';
  if (given && attested) {
    return { value: person, result: comparableText(person) === comparableText(claim) ? 'MATCH' : 'MISMATCH' };
  }
  if (given) {
    return { value: person, result: 'NOT_IN_ATTESTATION' };
  }
  if (attested) {
    return { value: claim, result: 'FROM_ATTESTATION' };
  }
  return { value: null, result: null };
}

function identifierOf(identifiers: ReadonlyArray<Identifier>, type: Identifier['type']): string | undefined {
  return identifiers.find((identifier) => identifier.type === type)?.value;
}

/** Normalises the identifiers given by the person (README 6.6). */
export function normalisedIdentifiers(identifiers: ReadonlyArray<Identifier> | undefined): ReadonlyArray<Identifier> {
  return (identifiers ?? []).map((identifier) => ({ type: identifier.type, value: normalisedIdentifierValue(identifier.type, identifier.value) }));
}

/** The fixed fields that differ from the attestation (README 6.5): 400 `attestation-mismatch`. */
export function throwIfFixedFieldsDiffer(claims: MockAttestationClaims, input: PersonCompanyInput): void {
  const fields: MismatchField[] = [];
  const ebwoid = identifierOf(input.identifiers, 'EBWOID');
  if (ebwoid !== undefined && ebwoid !== claims.company.ebwoid) {
    fields.push('EBWOID');
  }
  const euid = identifierOf(input.identifiers, 'EUID');
  if (euid !== undefined && claims.company.euid && euid !== normalisedIdentifierValue('EUID', claims.company.euid)) {
    fields.push('EUID');
  }
  if (input.address && input.address.countryCode !== claims.company.country) {
    fields.push('COUNTRY');
  }
  if (fields.length > 0) {
    throw problem('attestation-mismatch', 400, 'Company data differ from the verification attestation', { fields });
  }
}

function addressFromAttestation(claims: MockAttestationClaims, comparison: Map<ComparisonField, ComparisonResult>): Address {
  const address = claims.company.address;
  const street = address?.street_address?.trim();
  const city = address?.locality?.trim();
  if (!street || !city) {
    throwIfInvalid([{ field: 'companyData.address', message: 'The verification attestation has no address: give streetName and city.' }]);
  }
  const match = STREET_NUMBER.exec(street as string);
  comparison.set('STREET', 'FROM_ATTESTATION');
  comparison.set('CITY', 'FROM_ATTESTATION');
  if (address?.postal_code) {
    comparison.set('POSTAL_CODE', 'FROM_ATTESTATION');
  }
  return {
    streetName: match ? match[1] : (street as string),
    streetNumber: match ? match[2] : null,
    postalCode: address?.postal_code ?? null,
    city: city as string,
    region: null,
    countryCode: claims.company.country,
  };
}

function addressFromPerson(claims: MockAttestationClaims, given: Address, comparison: Map<ComparisonField, ComparisonResult>): Address {
  const claimed = claims.company.address;
  const street = compareField([given.streetName, given.streetNumber].filter(Boolean).join(' '), claimed?.street_address);
  const postalCode = compareField(given.postalCode, claimed?.postal_code);
  const city = compareField(given.city, claimed?.locality);
  comparison.set('COUNTRY', 'MATCH');
  for (const [field, compared] of [['STREET', street], ['POSTAL_CODE', postalCode], ['CITY', city]] as const) {
    if (compared.result) {
      comparison.set(field, compared.result);
    }
  }
  return { ...given, postalCode: postalCode.value, countryCode: claims.company.country };
}

const COMPARISON_ORDER: ReadonlyArray<ComparisonField> = ['EBWOID', 'EUID', 'COUNTRY', 'LEGAL_NAME', 'STREET', 'POSTAL_CODE', 'CITY'];

/**
 * Company data and comparison in the verification path EBW (README 6.5): the attestation is the basis, the person may
 * omit fields; fixed fields must be equal, compared fields are recorded.
 */
export function buildEbwCompanyData(claims: MockAttestationClaims, input: PersonCompanyInput): BuiltCompanyData {
  throwIfFixedFieldsDiffer(claims, input);
  const comparison = new Map<ComparisonField, ComparisonResult>();
  const company = claims.company;
  const attestedEuid = company.euid ? normalisedIdentifierValue('EUID', company.euid) : undefined;
  const givenEuid = identifierOf(input.identifiers, 'EUID');

  comparison.set('EBWOID', identifierOf(input.identifiers, 'EBWOID') ? 'MATCH' : 'FROM_ATTESTATION');
  if (attestedEuid) {
    comparison.set('EUID', givenEuid ? 'MATCH' : 'FROM_ATTESTATION');
  } else if (givenEuid) {
    comparison.set('EUID', 'NOT_IN_ATTESTATION');
  }
  comparison.set('COUNTRY', 'FROM_ATTESTATION');
  const legalName = compareField(input.legalName, company.legal_name);
  comparison.set('LEGAL_NAME', legalName.result as ComparisonResult);
  const address = input.address ? addressFromPerson(claims, input.address, comparison) : addressFromAttestation(claims, comparison);

  const identifiers: IdentifierWithSource[] = [{ type: 'EBWOID', value: company.ebwoid, source: 'ATTESTATION' }];
  if (attestedEuid) {
    identifiers.push({ type: 'EUID', value: attestedEuid, source: 'ATTESTATION' });
  }
  for (const identifier of input.identifiers) {
    const fromAttestation = identifier.type === 'EBWOID' || (identifier.type === 'EUID' && attestedEuid);
    if (!fromAttestation) {
      identifiers.push({ ...identifier, source: 'APPLICANT' });
    }
  }
  return {
    companyData: { legalName: legalName.value as string, shortName: input.shortName ?? null, address, identifiers },
    comparison: COMPARISON_ORDER.filter((field) => comparison.has(field)).map((field) => ({ field, result: comparison.get(field) as ComparisonResult })),
  };
}

/** Company data in the verification path DOCUMENTS (README 6.9): all from the person, no comparison, no EBWOID. */
export function buildDocumentsCompanyData(input: PersonCompanyInput): BuiltCompanyData {
  const errors: ValidationError[] = [];
  if (!input.legalName?.trim()) {
    errors.push({ field: 'companyData.legalName', message: 'Required in the verification path DOCUMENTS.' });
  }
  if (!input.address) {
    errors.push({ field: 'companyData.address', message: 'Required in the verification path DOCUMENTS.' });
  }
  if (input.identifiers.some((identifier) => identifier.type === 'EBWOID')) {
    errors.push({ field: 'companyData.identifiers', message: 'EBWOID is not allowed without a Business Wallet.' });
  } else if (input.identifiers.length === 0) {
    errors.push({ field: 'companyData.identifiers', message: 'At least one identifier is required.' });
  }
  throwIfInvalid(errors);
  return {
    companyData: {
      legalName: (input.legalName as string).trim(),
      shortName: input.shortName ?? null,
      address: input.address as Address,
      identifiers: input.identifiers.map((identifier) => ({ ...identifier, source: 'APPLICANT' })),
    },
    comparison: [],
  };
}
