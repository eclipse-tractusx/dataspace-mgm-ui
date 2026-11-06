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

import type { AttestationInvalidReason } from '../data/c1-m2-enums.data';
import type { CallerFixture } from './mock-caller';
import type { MockAttestationClaims } from './mock-attestation-claims';
import { decodeMockAttestation } from './mock-attestation';
import { problem, validationProblem } from './problems.fake';
import { comparableName } from './text-normalisation.fake';

/** Maximum length of an attestation (README 6.4: at most 16 KB; schema `Attestation`). */
const MAX_ATTESTATION_LENGTH = 16384;
/** ATTESTATION_CLOCK_SKEW_SECONDS of the test installation. */
export const CLOCK_SKEW_SECONDS = 60;

export interface AttestationCheckContext {
  caller: CallerFixture;
  now: Date;
  /** Country codes of the reference data. */
  countries: ReadonlyArray<string>;
  /** ATTESTATION_CLIENT_IDS; empty = no check. */
  allowedClientIds: ReadonlyArray<string>;
}

function invalid(reason: AttestationInvalidReason) {
  return problem('attestation-invalid', 400, 'Verification attestation not acceptable', { reason });
}

const isText = (value: unknown): value is string => typeof value === 'string' && value.length > 0;
const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

function hasRequiredClaims(claims: Partial<MockAttestationClaims>, countries: ReadonlyArray<string>): boolean {
  const { person, company, representation } = claims;
  const audience = claims.aud;
  return (
    isText(claims.iss) &&
    isText(claims.sub) &&
    (isText(audience) || (Array.isArray(audience) && audience.every(isText))) &&
    isNumber(claims.iat) &&
    isNumber(claims.exp) &&
    isText(claims.jti) &&
    claims.jti.length <= 200 &&
    isNumber(claims.verified_at) &&
    isText(claims.client_id) &&
    isText(person?.given_name) &&
    isText(person?.family_name) &&
    isText(company?.legal_name) &&
    isText(company?.ebwoid) &&
    isText(company?.country) &&
    countries.includes(company.country) &&
    claims.sub === company.ebwoid &&
    typeof representation?.confirmed === 'boolean' &&
    Array.isArray(claims.evidence)
  );
}

/**
 * The checks of README 6.4 that need no cryptography, in the order of the README; the first failure is the `reason`.
 * Not checked here, only by the backend: `algorithm`, `issuer`, `signature`, `audience`, `not-yet-valid`.
 */
export function checkMockAttestation(jws: string, context: AttestationCheckContext): MockAttestationClaims {
  if (jws.length > MAX_ATTESTATION_LENGTH) {
    throw validationProblem([{ field: 'attestation', message: 'The verification attestation is longer than 16 KB.' }]);
  }
  const decoded = decodeMockAttestation(jws);
  if (!decoded) {
    throw invalid('format');
  }
  const claims = decoded.payload;
  if (isNumber(claims.exp) && claims.exp * 1000 < context.now.getTime() - CLOCK_SKEW_SECONDS * 1000) {
    throw invalid('expired');
  }
  if (claims.attestation_version !== '0.2') {
    throw invalid('version');
  }
  if (claims.purpose !== 'onboarding') {
    throw invalid('purpose');
  }
  if (!hasRequiredClaims(claims, context.countries)) {
    throw invalid('claims');
  }
  const checked = claims as MockAttestationClaims;
  if (context.allowedClientIds.length > 0 && !context.allowedClientIds.includes(checked.client_id)) {
    throw invalid('client');
  }
  const { givenName, familyName } = context.caller;
  if (
    !givenName ||
    !familyName ||
    comparableName(checked.person.given_name) !== comparableName(givenName) ||
    comparableName(checked.person.family_name) !== comparableName(familyName)
  ) {
    throw invalid('person');
  }
  return checked;
}
