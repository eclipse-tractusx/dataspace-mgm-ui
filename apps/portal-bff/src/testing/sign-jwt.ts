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

import { sign, type KeyObject } from 'node:crypto';

const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');

/** A signed JWT for tests (RS256 with an RSA key, ES256 with a P-256 key). */
export function signJwt(claims: object, key: KeyObject, header: Record<string, unknown> = {}): string {
  const alg = key.asymmetricKeyType === 'ec' ? 'ES256' : 'RS256';
  const signingInput = `${encode({ alg, typ: 'JWT', ...header })}.${encode(claims)}`;
  const signature = sign('sha256', Buffer.from(signingInput), alg === 'ES256' ? { key, dsaEncoding: 'ieee-p1363' } : key);
  return `${signingInput}.${signature.toString('base64url')}`;
}
