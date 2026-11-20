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

import { constants, createPublicKey, verify, type JsonWebKey, type KeyObject } from 'node:crypto';
import type { DecodedJwt } from '../data/oidc.data.ts';
import { OidcError } from './oidc.error.ts';

const SEGMENT = /^[A-Za-z0-9_-]+$/;

interface Algorithm {
  kty: 'RSA' | 'EC';
  hash: string;
  pss?: boolean;
  crv?: string;
}

/** Accepted signature algorithms: asymmetric only. `none` and the HMAC algorithms are not in this list on purpose. */
const ALGORITHMS = new Map<string, Algorithm>([
  ['RS256', { kty: 'RSA', hash: 'sha256' }],
  ['RS384', { kty: 'RSA', hash: 'sha384' }],
  ['RS512', { kty: 'RSA', hash: 'sha512' }],
  ['PS256', { kty: 'RSA', hash: 'sha256', pss: true }],
  ['PS384', { kty: 'RSA', hash: 'sha384', pss: true }],
  ['PS512', { kty: 'RSA', hash: 'sha512', pss: true }],
  ['ES256', { kty: 'EC', hash: 'sha256', crv: 'P-256' }],
  ['ES384', { kty: 'EC', hash: 'sha384', crv: 'P-384' }],
  ['ES512', { kty: 'EC', hash: 'sha512', crv: 'P-521' }],
]);

const MIN_RSA_BITS = 2048;

function jsonObject(segment: string): Record<string, unknown> {
  const value: unknown = JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'));
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('not an object');
  }
  return value as Record<string, unknown>;
}

/** Splits a signed JWT (JWS compact form) into its parts. Does not check the signature. */
export function decodeJwt(token: string): DecodedJwt {
  const parts = token.split('.');
  if (parts.length !== 3 || !parts.every((part) => SEGMENT.test(part))) {
    throw new OidcError('invalid', 'jwt_malformed');
  }
  try {
    return {
      header: jsonObject(parts[0]),
      claims: jsonObject(parts[1]),
      signingInput: `${parts[0]}.${parts[1]}`,
      signature: Buffer.from(parts[2], 'base64url'),
    };
  } catch {
    throw new OidcError('invalid', 'jwt_malformed');
  }
}

export function isSupportedAlgorithm(alg: unknown): alg is string {
  return typeof alg === 'string' && ALGORITHMS.has(alg);
}

/** True when `jwk` is a signing key of the kind the algorithm of the token needs. */
export function isKeyFor(alg: string, jwk: JsonWebKey): boolean {
  const algorithm = ALGORITHMS.get(alg);
  if (!algorithm || jwk.kty !== algorithm.kty) {
    return false;
  }
  if ((jwk.use !== undefined && jwk.use !== 'sig') || (jwk.alg !== undefined && jwk.alg !== alg)) {
    return false;
  }
  return algorithm.crv === undefined || jwk.crv === algorithm.crv;
}

/** Checks the signature of a JWT with a key of the provider's JWKS. The algorithm must fit the key. */
export function verifyJwtSignature(jwt: DecodedJwt, jwk: JsonWebKey): boolean {
  const alg = jwt.header.alg;
  if (!isSupportedAlgorithm(alg) || !isKeyFor(alg, jwk)) {
    return false;
  }
  const algorithm = ALGORITHMS.get(alg) as Algorithm;
  let key: KeyObject;
  try {
    key = createPublicKey({ key: jwk, format: 'jwk' });
  } catch {
    return false;
  }
  const data = Buffer.from(jwt.signingInput, 'ascii');
  try {
    if (algorithm.kty === 'EC') {
      return verify(algorithm.hash, data, { key, dsaEncoding: 'ieee-p1363' }, jwt.signature);
    }
    if ((key.asymmetricKeyDetails?.modulusLength ?? 0) < MIN_RSA_BITS) {
      return false;
    }
    const padding = algorithm.pss
      ? { padding: constants.RSA_PKCS1_PSS_PADDING, saltLength: constants.RSA_PSS_SALTLEN_DIGEST }
      : { padding: constants.RSA_PKCS1_PADDING };
    return verify(algorithm.hash, data, { key, ...padding }, jwt.signature);
  } catch {
    return false;
  }
}
