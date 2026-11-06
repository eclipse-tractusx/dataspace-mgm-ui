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

/**
 * The payload of a verification attestation in version 0.2 (C1-M2 README 6.4, C5-M1 section 9), with the claim names
 * of the JWT (snake_case). Only the mock attestation uses it; the UI passes the attestation on as an opaque string.
 */
export interface MockAttestedCompanyClaims {
  legal_name: string;
  ebwoid: string;
  euid?: string;
  country: string;
  address?: { street_address?: string; postal_code?: string; locality?: string; country?: string };
}

export interface MockAttestationClaims {
  iss: string;
  sub: string;
  aud: string | ReadonlyArray<string>;
  iat: number;
  exp: number;
  jti: string;
  attestation_version: string;
  purpose: string;
  verified_at: number;
  client_id: string;
  person: { given_name: string; family_name: string };
  company: MockAttestedCompanyClaims;
  representation: {
    confirmed: boolean;
    result?: 'CONFIRMED' | 'NOT_CONFIRMED';
    type?: string | null;
    role?: string | null;
    valid_until?: string | null;
    issuer?: string | null;
    trust?: string | null;
    reasons?: ReadonlyArray<string>;
  };
  evidence: ReadonlyArray<{ type: string; vct: string; issuer: string; wallet: string; status_checked: boolean }>;
}

/** Overrides of mockAttestation(): a key set to `undefined` removes the claim (e.g. to test reason `claims`). */
export type MockAttestationOverrides = {
  [K in keyof MockAttestationClaims]?: K extends 'company' ? Partial<MockAttestedCompanyClaims> : MockAttestationClaims[K];
};
