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

import type { IdTokenExpectation, IdTokenIdentity } from '../data/oidc.data.ts';
import { safeEqual } from '../http/csrf.ts';
import { OidcError } from './oidc.error.ts';

const invalid = (reason: string) => new OidcError('invalid', `id_token_${reason}`);

/**
 * The claim checks of OpenID Connect Core 3.1.3.7 for an ID token from the token endpoint: issuer, audience,
 * authorized party, expiry, issue time and the nonce of this sign-in. Throws OidcError('invalid') with the claim
 * that failed.
 */
export function validateIdTokenClaims(claims: Record<string, unknown>, expected: IdTokenExpectation): IdTokenIdentity {
  if (claims.iss !== expected.issuer) {
    throw invalid('iss');
  }

  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!audiences.includes(expected.clientId)) {
    throw invalid('aud');
  }
  if (audiences.length > 1 && claims.azp === undefined) {
    throw invalid('azp');
  }
  if (claims.azp !== undefined && claims.azp !== expected.clientId) {
    throw invalid('azp');
  }

  if (typeof claims.exp !== 'number' || claims.exp + expected.clockSkewSeconds <= expected.nowSeconds) {
    throw invalid('exp');
  }
  if (typeof claims.iat !== 'number' || claims.iat - expected.clockSkewSeconds > expected.nowSeconds) {
    throw invalid('iat');
  }
  if (claims.nbf !== undefined && (typeof claims.nbf !== 'number' || claims.nbf - expected.clockSkewSeconds > expected.nowSeconds)) {
    throw invalid('nbf');
  }

  if (typeof claims.nonce !== 'string' || !safeEqual(claims.nonce, expected.nonce)) {
    throw invalid('nonce');
  }
  if (typeof claims.sub !== 'string' || claims.sub.length === 0) {
    throw invalid('sub');
  }

  return {
    subject: claims.sub,
    username: typeof claims.preferred_username === 'string' && claims.preferred_username ? claims.preferred_username : null,
  };
}
