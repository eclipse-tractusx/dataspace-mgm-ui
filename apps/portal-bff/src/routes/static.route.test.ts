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

import { sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolveStaticPath } from './static.route.ts';

const ROOT = `${sep}srv${sep}portal`;
const at = (...parts: string[]) => [ROOT, ...parts].join(sep);

describe('static path', () => {
  it('maps a URL path to a file below the static directory', () => {
    expect(resolveStaticPath(ROOT, '/')).toBe(ROOT);
    expect(resolveStaticPath(ROOT, '/index.html')).toBe(at('index.html'));
    expect(resolveStaticPath(ROOT, '/assets/index-GOMadsHj.js')).toBe(at('assets', 'index-GOMadsHj.js'));
    expect(resolveStaticPath(ROOT, '/assets/a%20b.svg')).toBe(at('assets', 'a b.svg'));
  });

  it.each([
    '/../secret.txt',
    '/assets/../../secret.txt',
    '/%2e%2e/secret.txt',
    '/%2e%2e%2fsecret.txt',
    '/..%2f..%2fetc%2fpasswd',
    '/assets/..%2F..%2Fsecret.txt',
    '/%252e%252e/secret.txt/../../..',
    '/..\\secret.txt',
    '/assets%5C..%5C..%5Csecret.txt',
    '/assets/%00.js',
    '/%E0%A4%A',
    '/.env',
    '/.git/config',
    '/assets/.hidden',
    '/./index.html',
  ])('refuses %j', (pathname) => {
    expect(resolveStaticPath(ROOT, pathname)).toBeNull();
  });

  it('never leaves the static directory, whatever the path', () => {
    for (const pathname of ['/a/b/c', '/%2e', '/....//secret', '/assets/%2e%2e', '//etc/passwd', '/a//b']) {
      const file = resolveStaticPath(ROOT, pathname);
      expect(file === null || file === ROOT || file.startsWith(ROOT + sep)).toBe(true);
    }
  });
});
