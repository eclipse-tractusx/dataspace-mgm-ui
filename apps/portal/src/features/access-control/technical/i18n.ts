/* Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra */
import { lazyFeatureTranslations } from '../../../i18n/lazyFeatureTranslations';

export const TECHNICAL_NS = 'accessControlTechnical';
export const technicalLanguageLoaders = {
  en: () => import('./locales/en/technical.json').then((module) => module.default),
  de: () => import('./locales/de/technical.json').then((module) => module.default),
};
export const technicalTranslations = lazyFeatureTranslations(TECHNICAL_NS, technicalLanguageLoaders);
