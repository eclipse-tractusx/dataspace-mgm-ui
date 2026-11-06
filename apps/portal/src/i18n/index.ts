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

/**
 * Translations of the portal (i18next + react-i18next). Every text a person can see or hear is a key:
 *
 * - The shell's texts are the namespace `common` in ./locales/<language>/common.json, bundled with the app: header,
 *   navigation, footer, and the name and description of every feature (the shell shows them before a feature opens).
 * - Every feature has its own namespace in src/features/<feature>/i18n/, loaded lazily for English and the language
 *   in use (./lazyFeatureTranslations.ts), so a feature's texts travel with its chunk.
 * - English is the source and the fallback. Every other language has every English key (./localeParity.test.ts).
 *
 * i18next starts in <I18nProvider> (frontend architecture 09), not when this module is imported.
 */
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import deCommon from './locales/de/common.json';
import enCommon from './locales/en/common.json';

/** The language the texts are written in, and the one shown while a feature's bundle loads or when a key is missing. */
export const FALLBACK_LANGUAGE = 'en';

/**
 * The languages of the portal. To add one: a folder with every JSON file in each `locales/` directory, its code here,
 * its own name in LANGUAGE_NAMES and its loader in every feature's i18n/resources.ts.
 */
export const SUPPORTED_LANGUAGES = ['en', 'de'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

/** Each language in its own name, for the language menu. These are never translated. */
export const LANGUAGE_NAMES: Record<Language, string> = { en: 'English', de: 'Deutsch' };

/** The language the person chose, kept in this browser. */
export const LANGUAGE_STORAGE_KEY = 'dataspace-mgm.language';

export const defaultNS = 'common';
export const resources = {
  en: { common: enCommon },
  de: { common: deCommon },
} as const;

export interface I18nOptions {
  /** A fixed language instead of the stored or the browser's one (tests). */
  language?: string;
  /** Called for every key that exists in no language (tests fail on it). */
  onMissingKey?: (namespace: string, key: string) => void;
}

let started = false;

/**
 * Starts i18next, once: synchronously, because the shell's texts are bundled, so the first render is translated.
 * The language is the one stored in this browser, else the browser's, else English.
 */
export function initI18n(options: I18nOptions = {}): typeof i18n {
  if (started) {
    return i18n;
  }
  started = true;

  // `<html lang>` decides the voice of screen readers, the browser's offer to translate and the font fallback, so it
  // follows the language. Registered before `init`, so the language detected at start-up is applied too.
  i18n.on('languageChanged', (language) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = i18n.resolvedLanguage ?? language;
    }
  });

  if (!options.language) {
    i18n.use(LanguageDetector);
  }
  const { onMissingKey } = options;
  void i18n.use(initReactI18next).init({
    resources,
    lng: options.language,
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    load: 'languageOnly',
    defaultNS,
    ns: [defaultNS],
    initAsync: false,
    interpolation: {
      escapeValue: false, // React escapes already
    },
    saveMissing: Boolean(onMissingKey),
    missingKeyHandler: onMissingKey ? (_languages, namespace, key) => onMissingKey(namespace, key) : undefined,
    react: {
      // Features add their bundles after start-up (lazyFeatureTranslations). Without this, components re-render on
      // `languageChanged` but not when the bundle of that language arrives, and stay in English until the next render.
      bindI18nStore: 'added',
      useSuspense: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    },
  });
  return i18n;
}

/** The language in use, as one of SUPPORTED_LANGUAGES. */
export function currentLanguage(): Language {
  const language = (i18n.resolvedLanguage ?? i18n.language ?? FALLBACK_LANGUAGE).split('-')[0];
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(language) ? (language as Language) : FALLBACK_LANGUAGE;
}

export default i18n;
