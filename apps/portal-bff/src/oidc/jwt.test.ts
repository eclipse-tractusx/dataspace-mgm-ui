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

import { createHmac, generateKeyPairSync } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { signJwt } from '../testing/sign-jwt.ts';
import { decodeJwt, isSupportedAlgorithm, verifyJwtSignature } from './jwt.ts';

const rsa = generateKeyPairSync('rsa', { modulusLength: 2048 });
const otherRsa = generateKeyPairSync('rsa', { modulusLength: 2048 });
const weakRsa = generateKeyPairSync('rsa', { modulusLength: 1024 });
const ec = generateKeyPairSync('ec', { namedCurve: 'P-256' });
const jwk = (key: { publicKey: import('node:crypto').KeyObject }) => key.publicKey.export({ format: 'jwk' });
const claims = { sub: 'person-1', admin: false };

describe('JWT', () => {
  it('decodes header and claims', () => {
    const jwt = decodeJwt(signJwt(claims, rsa.privateKey, { kid: 'k1' }));
    expect(jwt.header).toMatchObject({ alg: 'RS256', kid: 'k1' });
    expect(jwt.claims).toEqual(claims);
  });

  it.each(['', 'a.b', 'a.b.c.d', 'a.b.', '!!.e30.c2ln', 'bm90anNvbg.e30.c2ln', 'W10.e30.c2ln'])('refuses the malformed token %j', (token) => {
    expect(() => decodeJwt(token)).toThrow(/jwt_malformed/);
  });

  it('accepts a signature of the right key (RS256 and ES256)', () => {
    expect(verifyJwtSignature(decodeJwt(signJwt(claims, rsa.privateKey)), jwk(rsa))).toBe(true);
    expect(verifyJwtSignature(decodeJwt(signJwt(claims, ec.privateKey)), jwk(ec))).toBe(true);
  });

  it('refuses another key, changed claims and a key of the wrong kind', () => {
    const token = signJwt(claims, rsa.privateKey);
    expect(verifyJwtSignature(decodeJwt(token), jwk(otherRsa))).toBe(false);
    expect(verifyJwtSignature(decodeJwt(token), jwk(ec))).toBe(false);

    const [header, , signature] = token.split('.');
    const forged = `${header}.${Buffer.from(JSON.stringify({ ...claims, admin: true })).toString('base64url')}.${signature}`;
    expect(verifyJwtSignature(decodeJwt(forged), jwk(rsa))).toBe(false);
  });

  it('refuses a key that is not meant for signatures or for this algorithm', () => {
    const jwt = decodeJwt(signJwt(claims, rsa.privateKey));
    expect(verifyJwtSignature(jwt, { ...jwk(rsa), use: 'enc' })).toBe(false);
    expect(verifyJwtSignature(jwt, { ...jwk(rsa), alg: 'PS256' })).toBe(false);
    expect(verifyJwtSignature(jwt, { ...jwk(rsa), use: 'sig', alg: 'RS256' })).toBe(true);
  });

  it('refuses "none", HMAC with the public key as secret, and a weak RSA key', () => {
    const body = Buffer.from(JSON.stringify(claims)).toString('base64url');
    const none = `${Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url')}.${body}.AA`;
    expect(isSupportedAlgorithm('none')).toBe(false);
    expect(verifyJwtSignature(decodeJwt(none), jwk(rsa))).toBe(false);

    const hsInput = `${Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64url')}.${body}`;
    const secret = rsa.publicKey.export({ format: 'pem', type: 'spki' });
    const hs = `${hsInput}.${createHmac('sha256', secret).update(hsInput).digest('base64url')}`;
    expect(isSupportedAlgorithm('HS256')).toBe(false);
    expect(verifyJwtSignature(decodeJwt(hs), jwk(rsa))).toBe(false);

    expect(verifyJwtSignature(decodeJwt(signJwt(claims, weakRsa.privateKey)), jwk(weakRsa))).toBe(false);
  });
});
