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

/** Port: the credentials of the own company (C4-M1 tag Company). Only the methods the use cases call. */
export interface CompanyCredentialRepository {
  /**
   * `GET /companies/{companyId}/credentials` (`listCompanyCredentials`). null = 404 (not the person's own company).
   * Throws on every other error (403 included).
   */
  listCompanyCredentials(companyId: string): Promise<ReadonlyArray<CredentialStatusAnemic> | null>;
}
