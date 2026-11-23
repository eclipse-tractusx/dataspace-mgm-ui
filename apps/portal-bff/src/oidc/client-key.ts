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

import { createHash, createPrivateKey, createPublicKey, sign, type KeyObject } from 'node:crypto';
import { readFileSync } from 'node:fs';
import type { ClientJwk, ClientKey } from '../data/ebw.data.ts';
import { randomToken } from './pkce.ts';

const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');

/** RFC 7638: the thumbprint of an EC key, used as its key id. */
export function jwkThumbprint(jwk: { crv: string; kty: string; x: string; y: string }): string {
  const canonical = JSON.stringify({ crv: jwk.crv, kty: jwk.kty, x: jwk.x, y: jwk.y });
  return createHash('sha256').update(canonical).digest('base64url');
}

/** The key pair of a private key object; throws when it is not an EC key on P-256 (the EBW-Connector accepts ES256 only). */
export function clientKeyOf(privateKey: KeyObject): ClientKey {
  if (privateKey.type !== 'private' || privateKey.asymmetricKeyType !== 'ec' || privateKey.asymmetricKeyDetails?.namedCurve !== 'prime256v1') {
    throw new Error('The BFF cannot start: the key in BFF_EBW_KEY_FILE must be an EC private key on the curve P-256 (ES256).');
  }
  const { x, y } = createPublicKey(privateKey).export({ format: 'jwk' });
  if (typeof x !== 'string' || typeof y !== 'string') {
    throw new Error('The BFF cannot start: the key in BFF_EBW_KEY_FILE has no public part.');
  }
  const publicJwk: ClientJwk = { kty: 'EC', crv: 'P-256', x, y, kid: jwkThumbprint({ kty: 'EC', crv: 'P-256', x, y }), use: 'sig', alg: 'ES256' };
  return { privateKey, publicJwk };
}

/** Reads the private key of the client from a PEM file. The message of a failure names the setting, never the content. */
export function loadClientKey(file: string): ClientKey {
  let privateKey: KeyObject;
  try {
    privateKey = createPrivateKey(readFileSync(file));
  } catch {
    throw new Error('The BFF cannot start: BFF_EBW_KEY_FILE cannot be read as a private key (PEM).');
  }
  return clientKeyOf(privateKey);
}

/**
 * RFC 7523: the signed statement the client authenticates with at the token endpoint (`private_key_jwt`), valid for
 * two minutes and for one request (`jti`).
 */
export function clientAssertion(key: ClientKey, clientId: string, audience: string, nowSeconds: number): string {
  const header = { alg: 'ES256', typ: 'JWT', kid: key.publicJwk.kid };
  const claims = { iss: clientId, sub: clientId, aud: audience, iat: nowSeconds, exp: nowSeconds + 120, jti: randomToken() };
  const signingInput = `${encode(header)}.${encode(claims)}`;
  const signature = sign('sha256', Buffer.from(signingInput), { key: key.privateKey, dsaEncoding: 'ieee-p1363' });
  return `${signingInput}.${signature.toString('base64url')}`;
}
