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

import { describe, expect, it, vi } from 'vitest';
import i18n from './index';
import { lazyFeatureTranslations } from './lazyFeatureTranslations';

const bundleFor = (language: string) => () => Promise.resolve({ hello: `hello-${language}` });

describe('lazyFeatureTranslations', () => {
  it('fetches only English and the active language, once', async () => {
    await i18n.changeLanguage('de');
    const loaders = { en: vi.fn(bundleFor('en')), de: vi.fn(bundleFor('de')) };
    const translations = lazyFeatureTranslations('lazy-test-a', loaders);
    expect(translations.isLoaded()).toBe(false);

    await translations.load();
    await translations.load();

    expect(loaders.en).toHaveBeenCalledTimes(1);
    expect(loaders.de).toHaveBeenCalledTimes(1);
    expect(translations.isLoaded()).toBe(true);
    expect(i18n.getResource('de', 'lazy-test-a', 'hello')).toBe('hello-de');
  });

  it('fetches a language when the app switches to it', async () => {
    const loaders = { en: vi.fn(bundleFor('en')), de: vi.fn(bundleFor('de')) };
    await lazyFeatureTranslations('lazy-test-b', loaders).load();
    expect(loaders.de).not.toHaveBeenCalled();

    await i18n.changeLanguage('de');
    await vi.waitFor(() => expect(i18n.getResource('de', 'lazy-test-b', 'hello')).toBe('hello-de'));
  });

  it('never rejects, and retries a bundle that failed to load', async () => {
    await i18n.changeLanguage('de');
    const de = vi.fn().mockRejectedValueOnce(new Error('chunk gone')).mockImplementation(bundleFor('de'));
    const translations = lazyFeatureTranslations('lazy-test-c', { en: bundleFor('en'), de });

    await expect(translations.load()).resolves.toBeUndefined();
    expect(i18n.getResource('en', 'lazy-test-c', 'hello')).toBe('hello-en');

    await translations.load();
    expect(de).toHaveBeenCalledTimes(2);
    expect(i18n.getResource('de', 'lazy-test-c', 'hello')).toBe('hello-de');
  });
});
