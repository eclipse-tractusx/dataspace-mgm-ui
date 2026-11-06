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

import type {
  ComparisonField,
  ComparisonResult,
  IdentifierSource,
  IdentifierType,
  Language,
  RepresentationResult,
} from './c1-m2-enums.data';

/**
 * The nested shapes of C1-M2 Registration (schemas of specs/c1-m2/openapi.yaml with the same name), grouped in one
 * `data/` file because they only exist as parts of the anemics.
 */

/** Schema `Address`. */
export type Address = Readonly<{
  streetName: string;
  streetNumber: string | null;
  postalCode: string | null;
  city: string;
  /** ISO 3166-2 code of the region without the country part, e.g. `BW`. */
  region: string | null;
  countryCode: string;
}>;

/** Schema `Identifier`. */
export type Identifier = Readonly<{ type: IdentifierType; value: string }>;

/** Schema `IdentifierWithSource`. */
export type IdentifierWithSource = Readonly<{ type: IdentifierType; value: string; source: IdentifierSource }>;

/** Schema `CompanyData`: the company data of an application. */
export type CompanyData = Readonly<{
  legalName: string;
  shortName: string | null;
  address: Address;
  identifiers: ReadonlyArray<IdentifierWithSource>;
}>;

/** Schema `Applicant`: the person who owns the application (`sub` of the token at creation). */
export type Applicant = Readonly<{ sub: string; givenName: string; familyName: string }>;

/** Schema `PersonExtract`: the representative named in the verification attestation. */
export type PersonExtract = Readonly<{ givenName: string; familyName: string }>;

/** Schema `Representation`: result of the representation check of the EBW-Connector (stored, not assessed). */
export type Representation = Readonly<{
  confirmed: boolean;
  result?: RepresentationResult;
  type?: string | null;
  role?: string | null;
  validUntil?: string | null;
  issuer?: string | null;
  trust?: string | null;
  reasons?: ReadonlyArray<string>;
}>;

/** Schema `ComparisonEntry`: the result of the comparison for one field (README 6.5). */
export type ComparisonEntry = Readonly<{ field: ComparisonField; result: ComparisonResult }>;

/** Schema `Consent`: a consent given at submission. */
export type Consent = Readonly<{ agreementKey: string; version: string; language: Language; givenAt: string }>;

/** Schema `AgreementRef`: key and version of terms. */
export type AgreementRef = Readonly<{ agreementKey: string; version: string }>;

/** Schema `DocumentUrls`: one document per language, at least one. */
export type DocumentUrls = Readonly<{ de?: string; en?: string }>;

/** Schema `LocalizedText`. */
export type LocalizedText = Readonly<{ de: string; en: string }>;

/** One entry of `errors` of a 400 `validation`. */
export type ValidationError = Readonly<{ field: string; message: string }>;
