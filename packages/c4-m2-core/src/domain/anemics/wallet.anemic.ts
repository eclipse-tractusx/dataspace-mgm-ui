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

import type { WalletProvider } from '../valueObjects/wallet-provider.value-object';

/** The dataspace wallet of the own company as its people see it (C4-M2 `Wallet`); without secrets. */
export type WalletAnemic = Readonly<{
  companyId: string;
  provider: WalletProvider;
  /** REQUESTED = ordered at the provider; VALIDATING = DID known, DID document being checked; ACTIVE; FAILED. */
  status: 'REQUESTED' | 'VALIDATING' | 'ACTIVE' | 'FAILED';
  /** did:web of the wallet; null until the provider has reported it. */
  did: string | null;
  didDocumentLocation: string | null;
  /** Address of the service CredentialService from the DID document. */
  credentialServiceUrl: string | null;
  /** Address of the directory BPN → DID, for the configuration of connectors. */
  bdrsUrl: string | null;
  /** IdentityHub only; for SAP DIV and CSP the token address is per wallet account. */
  stsTokenUrl: string | null;
  supportsWalletAccounts: boolean;
  failureReason: 'PROVIDER_TIMEOUT' | 'DID_MISMATCH' | 'INVALID_DID_DOCUMENT' | 'DID_NOT_RESOLVABLE' | null;
  createdAt: string;
  activatedAt: string | null;
}>;
