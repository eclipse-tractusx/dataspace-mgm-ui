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

import type { WalletAttestationRepository } from '../repositories/wallet-attestation.repository';
import { MASCHINENBAU_CLAIMS, WERKZEUGBAU_CLAIMS } from './fixtures/companies.fixture';
import type { MockAttestedCompanyClaims } from './mock-attestation-claims';
import { mockAttestation } from './mock-attestation';
import type { CallerFixture } from './mock-caller';

/** The company whose Business Wallet a test person holds (FRAMEWORK 7a; Max reactivates Beispiel Werkzeugbau GmbH). */
const WALLET_COMPANY: Readonly<Record<string, MockAttestedCompanyClaims>> = {
  '5a1c0002-0000-4000-8000-000000000002': WERKZEUGBAU_CLAIMS,
};

export interface InMemoryWalletAttestationOptions {
  caller: CallerFixture;
  /** The person cancels in the wallet. */
  cancel?: boolean;
  now?: () => Date;
  failure?: Error | null;
  /** The time the person takes in the wallet before it answers (mock mode: the approval in the dialog); default 0. */
  delayMs?: number;
}

/**
 * In-memory adapter of the wallet step: a new mock attestation of the signed-in person for the company of their
 * Business Wallet (Beispiel Maschinenbau GmbH unless WALLET_COMPANY says otherwise). Stand-in for the BFF.
 */
export class InMemoryWalletAttestationRepository implements WalletAttestationRepository {
  public readonly calls: string[] = [];

  constructor(private readonly options: InMemoryWalletAttestationOptions) {}

  public async requestAttestation(): Promise<string | null> {
    this.calls.push('requestAttestation');
    if (this.options.delayMs) {
      await new Promise((resolve) => setTimeout(resolve, this.options.delayMs));
    }
    if (this.options.failure) {
      throw this.options.failure;
    }
    if (this.options.cancel) {
      return null;
    }
    const { caller } = this.options;
    return mockAttestation(
      { person: { given_name: caller.givenName, family_name: caller.familyName }, company: WALLET_COMPANY[caller.sub] ?? MASCHINENBAU_CLAIMS },
      (this.options.now ?? (() => new Date()))(),
    );
  }
}
