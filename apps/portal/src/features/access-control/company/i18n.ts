/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import { lazyFeatureTranslations } from '../../../i18n/lazyFeatureTranslations';
export const COMPANY_NS = 'accessControlCompany';
export const companyLanguageLoaders = {
  en: () => import('./locales/en/company.json').then((module) => module.default),
  de: () => import('./locales/de/company.json').then((module) => module.default),
};
export const companyTranslations = lazyFeatureTranslations(COMPANY_NS, companyLanguageLoaders);
