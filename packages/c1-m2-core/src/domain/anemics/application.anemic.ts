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

import type { ApplicationKind, ApplicationStatus, Verification } from '../data/c1-m2-enums.data';
import type { Applicant, ComparisonEntry, CompanyData, Consent } from '../data/c1-m2-shapes.data';
import type { AttestationSummaryAnemic } from './attestation-summary.anemic';
import type { DocumentInfoAnemic } from './document-info.anemic';

/**
 * An application of a company at the OSP (schema `Application`), as create, change, submit and withdraw return it.
 * Wire shape 1:1 (camelCase of specs/c1-m2/openapi.yaml); a page formats, the anemic does not.
 */
export type ApplicationAnemic = Readonly<{
  id: string;
  /** New for ONBOARDING and TRANSFER without reference; the existing company otherwise (README 6.2). */
  companyId: string;
  kind: ApplicationKind;
  existingCompany: boolean;
  verification: Verification;
  applicant: Applicant;
  status: ApplicationStatus;
  companyData: CompanyData;
  companyRoles: ReadonlyArray<string>;
  /** Extract of the current verification attestation; null in the verification path DOCUMENTS. */
  attestation: AttestationSummaryAnemic | null;
  /** Empty in the verification path DOCUMENTS. */
  comparison: ReadonlyArray<ComparisonEntry>;
  /** Metadata only. */
  documents: ReadonlyArray<DocumentInfoAnemic>;
  /** Only DOCUMENTS: the declaration of representation at submission. */
  representationDeclared: boolean | null;
  consents: ReadonlyArray<Consent>;
  declineReason: string | null;
  createdAt: string;
  changedAt: string;
  submittedAt: string | null;
  withdrawnAt: string | null;
  closedAt: string | null;
  completedAt: string | null;
}>;
