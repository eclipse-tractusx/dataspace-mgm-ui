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

import { BFF } from '../constants/bff.constant.ts';

// Backslashes and control characters: browsers turn "\" into "/" and drop tabs and line breaks, so "/\host" and
// "/<tab>/host" would leave the app.
// eslint-disable-next-line no-control-regex
const FORBIDDEN = /[\\\u0000-\u001f\u007f]/;

/**
 * Where to go after the sign-in: only a path of this app, never another origin. Anything else becomes `/`.
 * The result is the path as the URL parser normalised it, so what is checked is what is sent.
 */
export function safeReturnTo(value: string | null | undefined, publicOrigin: string): string {
  if (!value || value.length > BFF.MAX_RETURN_TO_LENGTH || !value.startsWith('/') || value.startsWith('//') || FORBIDDEN.test(value)) {
    return '/';
  }
  let url: URL;
  try {
    url = new URL(value, publicOrigin);
  } catch {
    return '/';
  }
  // "/.//host" is normalised to "//host": check the result, not only the input.
  if (url.origin !== publicOrigin || url.pathname.startsWith('//')) {
    return '/';
  }
  // Returning into the sign-in itself would loop.
  if (url.pathname === '/auth' || url.pathname.startsWith('/auth/')) {
    return '/';
  }
  return `${url.pathname}${url.search}${url.hash}`;
}
