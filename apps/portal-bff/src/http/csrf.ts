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

import { createHash, timingSafeEqual } from 'node:crypto';
import { BFF } from '../constants/bff.constant.ts';

/** Compares two secrets without telling by the time taken where they differ. */
export function safeEqual(a: string, b: string): boolean {
  const digest = (value: string) => createHash('sha256').update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}

export function isSafeMethod(method: string): boolean {
  return (BFF.SAFE_METHODS as ReadonlyArray<string>).includes(method);
}

/** Write requests need the header X-CSRF-Token with the token of the session (from GET /me). */
export function isCsrfValid(method: string, header: string | string[] | undefined, sessionToken: string): boolean {
  if (isSafeMethod(method)) {
    return true;
  }
  return typeof header === 'string' && header.length > 0 && safeEqual(header, sessionToken);
}

/**
 * Second line against cross-site requests: a browser names the page that sends a write request in `Origin`. A request
 * from another origin is refused; a request without the header (not a browser) is left to the CSRF token.
 */
export function isOwnOrigin(header: string | string[] | undefined, publicOrigin: string): boolean {
  return header === undefined || header === publicOrigin;
}
