/* Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra */
import { describe, expect, it } from 'vitest';
import { TECHNICAL_NS, technicalLanguageLoaders, technicalTranslations } from './i18n';

describe('technical workflow translations', () => {
  it('exports a lazy namespace and matching nonempty English and German keys', async () => {
    const [en, de] = await Promise.all([technicalLanguageLoaders.en(), technicalLanguageLoaders.de()]);
    expect(technicalTranslations.namespace).toBe(TECHNICAL_NS);
    expect(Object.keys(de).sort()).toEqual(Object.keys(en).sort());
    expect(Object.values(en).every(Boolean)).toBe(true);
    expect(Object.values(de).every(Boolean)).toBe(true);
    expect(en.page).toContain('{{page}}');
    expect(de.page).toContain('{{page}}');
  });
});
