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

import { createPublicKey, generateKeyPairSync, verify } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { clientAssertion, clientKeyOf, jwkThumbprint, loadClientKey } from './client-key.ts';

const directory = mkdtempSync(join(tmpdir(), 'portal-bff-key-'));
afterAll(() => rmSync(directory, { recursive: true, force: true }));

const decode = (segment: string) => JSON.parse(Buffer.from(segment, 'base64url').toString('utf8')) as Record<string, unknown>;

describe('key of the client at the EBW-Connector', () => {
  it('computes the thumbprint of RFC 7638 from the required members in their fixed order', () => {
    const jwk = { kty: 'EC', crv: 'P-256', x: 'f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU', y: 'x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0' };
    // The same key with its members in another order and with extras: the thumbprint does not change.
    const reordered = { y: jwk.y, x: jwk.x, use: 'sig', crv: jwk.crv, kty: jwk.kty };
    expect(jwkThumbprint(jwk)).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(jwkThumbprint(reordered)).toBe(jwkThumbprint(jwk));
    expect(jwkThumbprint({ ...jwk, x: jwk.y })).not.toBe(jwkThumbprint(jwk));
  });

  it('reads an EC P-256 key from a PEM file and publishes only its public part', () => {
    const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
    const file = join(directory, 'client.pem');
    writeFileSync(file, privateKey.export({ type: 'pkcs8', format: 'pem' }));
    const key = loadClientKey(file);
    expect(key.publicJwk).toMatchObject({ kty: 'EC', crv: 'P-256', use: 'sig', alg: 'ES256' });
    expect(key.publicJwk.kid).toBe(jwkThumbprint(key.publicJwk));
    expect(Object.keys(key.publicJwk).sort()).toEqual(['alg', 'crv', 'kid', 'kty', 'use', 'x', 'y']);
  });

  it('refuses a missing file, a file that is no key, and keys of another kind, without printing the path or the content', () => {
    const missing = join(directory, 'secret-name.pem');
    expect(() => loadClientKey(missing)).toThrow('BFF_EBW_KEY_FILE cannot be read as a private key');
    expect(() => loadClientKey(missing)).not.toThrow(/secret-name/);
    const garbage = join(directory, 'garbage.pem');
    writeFileSync(garbage, 'not a key: hunter2');
    expect(() => loadClientKey(garbage)).toThrow('BFF_EBW_KEY_FILE cannot be read as a private key');
    expect(() => loadClientKey(garbage)).not.toThrow(/hunter2/);
    expect(() => clientKeyOf(generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey)).toThrow('EC private key on the curve P-256');
    expect(() => clientKeyOf(generateKeyPairSync('ec', { namedCurve: 'P-384' }).privateKey)).toThrow('EC private key on the curve P-256');
    expect(() => clientKeyOf(generateKeyPairSync('ec', { namedCurve: 'P-256' }).publicKey)).toThrow('EC private key on the curve P-256');
  });

  it('signs a client assertion of RFC 7523 with ES256: issuer and subject are the client, valid for two minutes, one jti each', () => {
    const key = clientKeyOf(generateKeyPairSync('ec', { namedCurve: 'P-256' }).privateKey);
    const assertion = clientAssertion(key, 'osp-a-ui', 'https://ebw.example.org/token', 1_800_000_000);
    const [header, claims, signature] = assertion.split('.');
    expect(decode(header)).toEqual({ alg: 'ES256', typ: 'JWT', kid: key.publicJwk.kid });
    expect(decode(claims)).toMatchObject({ iss: 'osp-a-ui', sub: 'osp-a-ui', aud: 'https://ebw.example.org/token', iat: 1_800_000_000, exp: 1_800_000_120 });
    expect(decode(claims).jti).toMatch(/^[A-Za-z0-9_-]{43}$/);
    const publicKey = createPublicKey({ key: key.publicJwk, format: 'jwk' });
    expect(verify('sha256', Buffer.from(`${header}.${claims}`), { key: publicKey, dsaEncoding: 'ieee-p1363' }, Buffer.from(signature, 'base64url'))).toBe(true);
    const second = clientAssertion(key, 'osp-a-ui', 'https://ebw.example.org/token', 1_800_000_000);
    expect(decode(second.split('.')[1]).jti).not.toBe(decode(claims).jti);
  });
});
