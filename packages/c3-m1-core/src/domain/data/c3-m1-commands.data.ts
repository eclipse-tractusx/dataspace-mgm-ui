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

import type { AddressFieldsAnemic } from '../anemics/address-fields.anemic';
import type { AddressAnemic } from '../anemics/address.anemic';
import type { DeclaredIdentifierAnemic } from '../anemics/declared-identifier.anemic';
import type { DocumentFileAnemic } from '../anemics/document-file.anemic';

/** Input of `createChangeRequest`: only the parts that change, plus the comment and the supporting documents. */
export interface ChangeRequestDraftData {
  name?: string;
  address?: AddressFieldsAnemic;
  /** The complete new list of the declared identifiers. */
  identifiers?: ReadonlyArray<DeclaredIdentifierAnemic>;
  comment: string;
  documents: ReadonlyArray<DocumentFileAnemic>;
}

/** Input of `correctCompany` (C3-M1 `CompanyCorrection`). */
export interface CompanyCorrectionData {
  name?: string;
  shortName?: string | null;
  address?: AddressAnemic;
  identifiers?: ReadonlyArray<DeclaredIdentifierAnemic>;
  reason: string;
}

/** The terms the person accepts when adding a role (C3-M1 `AgreementRef`). */
export interface AgreementRefData {
  agreementKey: string;
  version: string;
}
