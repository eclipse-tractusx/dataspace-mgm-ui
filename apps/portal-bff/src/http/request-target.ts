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

/**
 * The path and query of a request, normalised by the URL parser ("." and ".." segments resolved, also when written
 * as %2e). Only the origin form (`/path?query`) is accepted; an absolute URL or `*` gives null.
 */
export function parseRequestTarget(rawUrl: string | undefined): URL | null {
  if (!rawUrl || !rawUrl.startsWith('/')) {
    return null;
  }
  try {
    return new URL(`http://bff.invalid${rawUrl}`);
  } catch {
    return null;
  }
}

/**
 * True for a path under `/api/` that stays there for every reader: after the normalisation no segment may turn into
 * "." or ".." when a backend decodes an encoded slash, backslash or dot once more.
 */
export function isApiPath(pathname: string): boolean {
  if (!pathname.startsWith('/api/')) {
    return false;
  }
  const decoded = pathname.replace(/%2f|%5c|\\/gi, '/').replace(/%2e/gi, '.');
  return !decoded.split('/').some((segment) => segment === '..' || segment === '.');
}
