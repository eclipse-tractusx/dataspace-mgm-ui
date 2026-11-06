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

import type { ConfirmRevocationUseCase } from '../application/useCases/confirm-revocation.use-case';
import type { CountCredentialsByStatusUseCase } from '../application/useCases/count-credentials-by-status.use-case';
import type { GetCredentialUseCase } from '../application/useCases/get-credential.use-case';
import type { ListCompanyCredentialsUseCase } from '../application/useCases/list-company-credentials.use-case';
import type { ListCredentialsUseCase } from '../application/useCases/list-credentials.use-case';
import type { ListOpenItemsUseCase } from '../application/useCases/list-open-items.use-case';

/** Every operation a UI may trigger on C4-M1 Credentials, as a use case. */
export interface C4M1Module {
  listCompanyCredentials: ListCompanyCredentialsUseCase;
  listCredentials: ListCredentialsUseCase;
  countCredentialsByStatus: CountCredentialsByStatusUseCase;
  getCredential: GetCredentialUseCase;
  confirmRevocation: ConfirmRevocationUseCase;
  listOpenItems: ListOpenItemsUseCase;
}
