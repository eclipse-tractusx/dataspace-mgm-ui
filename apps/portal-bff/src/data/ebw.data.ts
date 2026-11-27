/********************************************************************************
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
 * Assisted-By: Claude Code (claude-fable-5-2)
 ********************************************************************************/

import type { JsonWebKey, KeyObject } from 'node:crypto';
import type { EbwConnectorClient } from '../oidc/ebw-connector.client.ts';
import type { LoginTransactionStore } from '../session/login-transaction.store.ts';

/** Settings of the wallet step: the BFF as an OpenID Connect client of the EBW-Connector (C5-M1 6.8). */
export interface EbwConfig {
  /** Issuer of the EBW-Connector, e.g. `https://ebw-connector.example.org`. */
  issuer: string;
  /** Client of the portal at the EBW-Connector, e.g. `osp-a-ui` (the `client_id` of the verification attestation). */
  clientId: string;
  /** File with the private key of the client (PEM, EC P-256): it signs the client assertions (`private_key_jwt`). */
  keyFile: string;
}

/** The public key of the client as GET /ebw/jwks publishes it. */
export interface ClientJwk extends JsonWebKey {
  kty: 'EC';
  crv: 'P-256';
  x: string;
  y: string;
  kid: string;
  use: 'sig';
  alg: 'ES256';
}

export interface ClientKey {
  privateKey: KeyObject;
  publicJwk: ClientJwk;
}

/**
 * How a wallet step ended. Kept in the session until the portal collects it, once (POST /ebw/attestation).
 * `reason` is a fixed word of the BFF or a failure reason of the EBW-Connector (C5-M1 6.2), never a free text.
 */
export type WalletStepResult = { status: 'received'; attestation: string } | { status: 'cancelled' } | { status: 'failed'; reason: string };

export interface EbwConnectorClientOptions {
  issuer: string;
  clientId: string;
  redirectUri: string;
  key: ClientKey;
  now: () => number;
  fetch: typeof fetch;
}

/** What the routes of the wallet step need. */
export interface EbwContext {
  client: EbwConnectorClient;
  /** The wallet steps that wait for their callback, each bound to the session that started it. */
  transactions: LoginTransactionStore;
  jwks: { keys: ClientJwk[] };
}
