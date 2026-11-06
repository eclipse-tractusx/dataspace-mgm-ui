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
 * Assisted-By: Claude Code (claude-opus-5-5)
 ********************************************************************************/

// Every language has every key English has, and nothing English does not. With `fallbackLng: 'en'` a missing key
// breaks nothing visibly in development, it quietly shows in English: that is how English sentences end up on German
// screens. Every `locales/` folder under src/ is checked, so a new feature is covered without touching this file.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FALLBACK_LANGUAGE, SUPPORTED_LANGUAGES } from './index';

const SRC = join(import.meta.dirname, '..');

type Tree = { [key: string]: string | Tree };

function localeFolders(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (!statSync(path).isDirectory()) {
      return [];
    }
    return name === 'locales' ? [path] : localeFolders(path);
  });
}

function flatten(tree: Tree, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string' ? [path] : flatten(value, path);
  });
}

// Languages differ in plural forms (German and English: _one, _other; others add _few or _many, or have only
// _other). A plural is covered when the other language has any form of that key.
const PLURAL = /_(zero|one|two|few|many|other)$/;
const stem = (key: string): string => key.replace(PLURAL, '');

function gaps(english: string[], other: string[]): { missing: string[]; extra: string[] } {
  const have = new Set(other);
  const stems = new Set(other.map(stem));
  const englishSet = new Set(english);
  const englishStems = new Set(english.map(stem));
  return {
    missing: english.filter((key) => !have.has(key) && !(PLURAL.test(key) && stems.has(stem(key)))),
    extra: other.filter((key) => !englishSet.has(key) && !(PLURAL.test(key) && englishStems.has(stem(key)))),
  };
}

const read = (path: string): Tree => JSON.parse(readFileSync(path, 'utf8')) as Tree;
const folders = localeFolders(SRC);

describe('locale key parity', () => {
  it('finds the shell and the features', () => {
    const names = folders.map((folder) => relative(SRC, folder));
    expect(names).toContain(join('i18n', 'locales'));
    expect(names.length).toBeGreaterThan(1);
  });

  for (const folder of folders) {
    const name = relative(SRC, folder);

    it(`${name} has a folder for every supported language and no other`, () => {
      expect(readdirSync(folder).filter((entry) => statSync(join(folder, entry)).isDirectory()).sort()).toEqual(
        [...SUPPORTED_LANGUAGES].sort(),
      );
    });

    for (const file of readdirSync(join(folder, FALLBACK_LANGUAGE)).filter((entry) => entry.endsWith('.json'))) {
      it(`${name}/*/${file} has every English key in every language`, () => {
        const english = flatten(read(join(folder, FALLBACK_LANGUAGE, file)));
        const problems = SUPPORTED_LANGUAGES.filter((language) => language !== FALLBACK_LANGUAGE).flatMap((language) => {
          const { missing, extra } = gaps(english, flatten(read(join(folder, language, file))));
          return [...missing.map((key) => `${language}: missing ${key}`), ...extra.map((key) => `${language}: not in English ${key}`)];
        });
        expect(problems).toEqual([]);
      });

      it(`${name}/*/${file} has no empty texts`, () => {
        const empty = SUPPORTED_LANGUAGES.flatMap((language) => {
          const tree = read(join(folder, language, file));
          return flatten(tree).filter((key) => {
            const value = key.split('.').reduce<string | Tree>((node, part) => (node as Tree)[part], tree);
            return typeof value === 'string' && value.trim() === '';
          }).map((key) => `${language}: ${key}`);
        });
        expect(empty).toEqual([]);
      });
    }
  }
});
