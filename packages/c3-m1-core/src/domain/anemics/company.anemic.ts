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

import type { CompanyStatus, CoreDataSource } from '../data/c3-m1-values.data';
import type { AddressAnemic } from './address.anemic';
import type { IdentifierAnemic } from './identifier.anemic';

/** The company as its own people see it (C3-M1 `Company`), in the shape the UI works with. */
export type CompanyAnemic = Readonly<{
  id: string;
  name: string;
  shortName: string | null;
  /** BPNL; null until the CSP has assigned it. */
  bpn: string | null;
  status: CompanyStatus;
  coreDataSource: CoreDataSource;
  /** When the core data was last verified (Business Wallet or onboarding service provider). */
  coreDataVerifiedAt: string | null;
  dataspaceName: string | null;
  address: Readonly<{
    /** One line, e.g. "Am Prüfstand 1". */
    street: string;
    /** One line, e.g. "70569 Stuttgart". */
    city: string;
    countryCode: string;
  }>;
  /** The address in its parts, as the API has it (forms start from it). */
  postalAddress: AddressAnemic;
  identifiers: ReadonlyArray<IdentifierAnemic>;
  /** The active company roles, e.g. ACTIVE_PARTICIPANT. */
  companyRoles: ReadonlyArray<string>;
  createdAt: string;
  activatedAt: string | null;
}>;
