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

import type { CredentialDetailAnemic } from '../anemics/credential-detail.anemic';
import type { CredentialPageAnemic } from '../anemics/credential-page.anemic';
import type { CredentialQuery } from '../data/credential-query.data';
import type { RevocationNote } from '../valueObjects/revocation-note.value-object';

/** Port: the credentials of all companies for OSP staff (C4-M1 tag OSP). Only the methods the use cases call. */
export interface CredentialRepository {
  /** `GET /credentials` (`listCredentials`), sorted by `changedAt` descending. Throws on every error (400, 403). */
  listCredentials(query: CredentialQuery): Promise<CredentialPageAnemic>;

  /**
   * One credential by its id; null = 404. NOT in the spec (0.2 has no `GET /credentials/{credentialId}`): only the
   * in-memory adapter has it until the backend adds it (open point).
   */
  getCredential(credentialId: string): Promise<CredentialDetailAnemic | null>;

  /**
   * `POST /credentials/{credentialId}/confirm-revocation` (`confirmRevocation`) with `{ note }`; returns the
   * credential. null = 404. Throws on every other error (400, 403, 409).
   */
  confirmRevocation(credentialId: string, note: RevocationNote): Promise<CredentialDetailAnemic | null>;
}
