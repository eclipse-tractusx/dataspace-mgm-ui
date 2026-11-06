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

import type { CoreHttpErrorData } from '@dataspace-mgm/core-http';
import type { AttestationInvalidReason, DocumentType, MismatchField, ReviewStatus } from './c1-m2-enums.data';
import type { AgreementRef, ValidationError } from './c1-m2-shapes.data';

/**
 * The expected outcomes that C1-M2 reports as Problem Details (README 12), one interface each, so that every result
 * union of a use case is built from the same parts. `status` is the problem name without `urn:c1-m2:problem:`.
 */

export interface FailedOutcome {
  status: 'failed';
  error: CoreHttpErrorData;
}

export interface ValidationOutcome {
  status: 'validation';
  errors: ReadonlyArray<ValidationError>;
}

export interface AttestationInvalidOutcome {
  status: 'attestation-invalid';
  reason: AttestationInvalidReason | null;
}

export interface AttestationMismatchOutcome {
  status: 'attestation-mismatch';
  fields: ReadonlyArray<MismatchField>;
}

export interface ConsentsIncompleteOutcome {
  status: 'consents-incomplete';
  /** Key and expected version of every required terms document without a matching consent. */
  missing: ReadonlyArray<AgreementRef>;
}

export interface DocumentsIncompleteOutcome {
  status: 'documents-incomplete';
  missingDocumentTypes: ReadonlyArray<DocumentType>;
  representationDeclarationMissing: boolean;
}

export interface DocumentsDisabledOutcome {
  status: 'documents-disabled';
}

/** 403 for an `osp` operation without its permission. For `own` operations a 403 is `failed`. */
export interface ForbiddenOutcome {
  status: 'forbidden';
}

export interface AccountBoundOutcome {
  status: 'account-bound';
}

export interface NotFoundOutcome {
  status: 'not-found';
}

export interface InvalidStateOutcome {
  status: 'invalid-state';
}

export interface ConflictOutcome {
  status: 'conflict';
}

export interface OpenApplicationExistsOutcome {
  status: 'open-application-exists';
  /** The UI continues with this application (README 6.11). */
  existingApplicationId: string | null;
}

export interface CompanyHasOpenApplicationOutcome {
  status: 'company-has-open-application';
}

export interface CompanyNotEligibleOutcome {
  status: 'company-not-eligible';
  /** Status of the company in C3-M1; null for an unknown company. */
  companyStatus: string | null;
}

export interface AttestationUsedOutcome {
  status: 'attestation-used';
}

export interface AttestationExpiredOutcome {
  status: 'attestation-expired';
}

export interface AlreadyDecidedOutcome {
  status: 'already-decided';
  reviewStatus: ReviewStatus | null;
}

/** Every outcome a Problem Details answer of C1-M2 can turn into. */
export type ProblemOutcome =
  | ValidationOutcome
  | AttestationInvalidOutcome
  | AttestationMismatchOutcome
  | ConsentsIncompleteOutcome
  | DocumentsIncompleteOutcome
  | DocumentsDisabledOutcome
  | ForbiddenOutcome
  | AccountBoundOutcome
  | NotFoundOutcome
  | InvalidStateOutcome
  | ConflictOutcome
  | OpenApplicationExistsOutcome
  | CompanyHasOpenApplicationOutcome
  | CompanyNotEligibleOutcome
  | AttestationUsedOutcome
  | AttestationExpiredOutcome
  | AlreadyDecidedOutcome;

export type ProblemOutcomeStatus = ProblemOutcome['status'];
