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

import type { CredentialStatusAnemic } from '../anemics/credential-status.anemic';
import type { C4M1Failed, C4M1Forbidden, C4M1NotFound } from './c4-m1-outcome.data';

export interface ListCompanyCredentialsFound {
  status: 'found';
  credentials: ReadonlyArray<CredentialStatusAnemic>;
}

/** The person is not bound to a company (no `company_id` in the session), e.g. OSP staff or an applicant. */
export interface ListCompanyCredentialsNoCompany {
  status: 'no-company';
}

export type ListCompanyCredentialsResult =
  | ListCompanyCredentialsFound
  | ListCompanyCredentialsNoCompany
  | C4M1Forbidden
  | C4M1NotFound
  | C4M1Failed;
