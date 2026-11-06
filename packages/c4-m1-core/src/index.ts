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

// Public API of @dataspace-mgm/c4-m1-core. Proof of concept: no HTTP adapter and no createC4M1Module yet (skill
// build-feature); the app wires the module on the in-memory adapters of `@dataspace-mgm/c4-m1-core/testing`.

/** The base path of the module under the app's api_base_url (`servers.url` /api/c4-m1 of the spec without /api). */
export const C4M1_BASE_PATH = '/c4-m1';

export type { C4M1Module } from './data/c4-m1-module.data';
export type { CredentialDetailAnemic } from './domain/anemics/credential-detail.anemic';
export type { CredentialPageAnemic } from './domain/anemics/credential-page.anemic';
export type { CredentialStatusAnemic } from './domain/anemics/credential-status.anemic';
export type { DataspaceRefAnemic } from './domain/anemics/dataspace-ref.anemic';
export type { C4M1Conflict, C4M1Failed, C4M1Forbidden, C4M1NotFound } from './domain/data/c4-m1-outcome.data';
export type { ConfirmRevocationResult } from './domain/data/confirm-revocation-result.data';
export type {
  CountCredentialsByStatusResult,
  CredentialStatusCount,
} from './domain/data/count-credentials-by-status-result.data';
export type { CredentialQuery } from './domain/data/credential-query.data';
export type { GetCredentialResult } from './domain/data/get-credential-result.data';
export type { ListCompanyCredentialsResult } from './domain/data/list-company-credentials-result.data';
export type { ListCredentialsResult } from './domain/data/list-credentials-result.data';
export type { ListOpenItemsOptions } from './domain/data/list-open-items-options.data';
export type { ListOpenItemsResult } from './domain/data/list-open-items-result.data';
export type { RevocationNoteErrorKey, RevocationNoteValidation } from './domain/data/revocation-note-validation.data';
export type { CompanyCredentialRepository } from './domain/repositories/company-credential.repository';
export type { CredentialRepository } from './domain/repositories/credential.repository';
export type { CredentialStatus } from './domain/valueObjects/credential-status.value-object';
export type { CredentialType } from './domain/valueObjects/credential-type.value-object';
export type { CredentialViewStatus } from './domain/valueObjects/credential-view-status.value-object';
export type { RevocationNote } from './domain/valueObjects/revocation-note.value-object';
export type { RevocationReason } from './domain/valueObjects/revocation-reason.value-object';
export type { Route } from './domain/valueObjects/route.value-object';
export type { WalletProvider } from './domain/valueObjects/wallet-provider.value-object';

export { CREDENTIAL_PAGE_DEFAULT_SIZE, CREDENTIAL_PAGE_MAX_SIZE } from './domain/data/credential-page-limits.data';
export { DEFAULT_OPEN_ORDER_HOURS } from './domain/data/open-order-hours.data';
export { REVOCATION_NOTE_MAX_LENGTH, REVOCATION_NOTE_MIN_LENGTH } from './domain/data/revocation-note-limits.data';
export { RevocationNoteFactory } from './domain/factories/revocation-note.factory';
export { CREDENTIAL_STATUSES } from './domain/valueObjects/credential-status.value-object';
export { CREDENTIAL_TYPES } from './domain/valueObjects/credential-type.value-object';
export { CREDENTIAL_VIEW_STATUSES } from './domain/valueObjects/credential-view-status.value-object';
export { REVOCATION_REASONS } from './domain/valueObjects/revocation-reason.value-object';
export { ROUTES } from './domain/valueObjects/route.value-object';
export { WALLET_PROVIDERS } from './domain/valueObjects/wallet-provider.value-object';

export { ConfirmRevocationUseCase } from './application/useCases/confirm-revocation.use-case';
export { CountCredentialsByStatusUseCase } from './application/useCases/count-credentials-by-status.use-case';
export { GetCredentialUseCase } from './application/useCases/get-credential.use-case';
export { ListCompanyCredentialsUseCase } from './application/useCases/list-company-credentials.use-case';
export { ListCredentialsUseCase } from './application/useCases/list-credentials.use-case';
export { ListOpenItemsUseCase } from './application/useCases/list-open-items.use-case';
