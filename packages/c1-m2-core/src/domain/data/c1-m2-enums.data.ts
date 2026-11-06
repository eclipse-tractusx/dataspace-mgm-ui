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

/**
 * The enumerations of C1-M2 Registration as string-literal unions, with the values of specs/c1-m2/openapi.yaml.
 * One `data/` file groups them because they are only names; each union is the schema of the same name.
 */

/** ONBOARDING = new company; REACTIVATION = deactivated company of this installation; TRANSFER = from another OSP. */
export type ApplicationKind = 'ONBOARDING' | 'REACTIVATION' | 'TRANSFER';

/** EBW = with Business Wallet and verification attestation; DOCUMENTS = with supporting documents (README 6.9). */
export type Verification = 'EBW' | 'DOCUMENTS';

/** CREATED is changeable; SUBMITTED is fixed; WITHDRAWN, DECLINED and COMPLETED are final (README 6.1). */
export type ApplicationStatus = 'CREATED' | 'SUBMITTED' | 'WITHDRAWN' | 'DECLINED' | 'COMPLETED';

/** Status of the review case in C1-M3 (README 7.4). NONE = no review case; UNKNOWN = C1-M3 not reachable. */
export type ReviewStatus = 'NONE' | 'OPEN' | 'AWAITING_SECOND_APPROVAL' | 'APPROVED' | 'DECLINED' | 'CLOSED' | 'UNKNOWN';

export type IdentifierType = 'EUID' | 'EBWOID' | 'COMMERCIAL_REG_NUMBER' | 'VAT_ID' | 'LEI_CODE' | 'EORI';

/** ATTESTATION = from the verification attestation; APPLICANT = given by the person. */
export type IdentifierSource = 'ATTESTATION' | 'APPLICANT';

export type DocumentType = 'COMMERCIAL_REGISTER_EXTRACT' | 'POWER_OF_ATTORNEY' | 'OTHER';

export type DocumentContentType = 'application/pdf' | 'image/png' | 'image/jpeg';

export type AgreementParty = 'OSP' | 'DATASPACE';

export type AgreementScope = 'ALL' | 'COMPANY_ROLE';

export type AgreementStatus = 'ACTIVE' | 'INACTIVE';

export type Language = 'de' | 'en';

export type ComparisonField = 'EBWOID' | 'EUID' | 'COUNTRY' | 'LEGAL_NAME' | 'STREET' | 'POSTAL_CODE' | 'CITY';

export type ComparisonResult = 'FROM_ATTESTATION' | 'MATCH' | 'MISMATCH' | 'NOT_IN_ATTESTATION';

/** `reason` of a 400 `attestation-invalid` (README 6.4, the first failing check). */
export type AttestationInvalidReason =
  | 'format'
  | 'algorithm'
  | 'issuer'
  | 'signature'
  | 'audience'
  | 'expired'
  | 'not-yet-valid'
  | 'version'
  | 'purpose'
  | 'claims'
  | 'client'
  | 'person';

/** `fields` of a 400 `attestation-mismatch`: the fixed fields (README 6.5). */
export type MismatchField = 'EBWOID' | 'EUID' | 'COUNTRY';

export type RepresentationResult = 'CONFIRMED' | 'NOT_CONFIRMED';
