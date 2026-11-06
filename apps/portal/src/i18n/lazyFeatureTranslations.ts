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

import i18n from 'i18next';
import { FALLBACK_LANGUAGE } from './index';

/** One language's bundle of a feature namespace (the default export of its JSON file). */
export type FeatureBundle = Readonly<Record<string, unknown>>;

/** A feature's translations: its namespace, and loading its bundles. The registry renders routes once they are there. */
export interface FeatureTranslations {
  readonly namespace: string;
  /** Loads English and the language in use. Idempotent and never rejects: a failed bundle leaves English in place. */
  load(): Promise<void>;
  /** Whether English and the language in use are there, so a page can render translated right away. */
  isLoaded(): boolean;
}

/**
 * The translations of one feature, each language in its own chunk. Only English (the fallback) and the language in use
 * are fetched; switching the language later fetches that one, and the shell re-renders when it lands (i18next's
 * `added` event is bound in ./index.ts). Selecting a language again retries a bundle that failed to load.
 */
export function lazyFeatureTranslations<L extends string>(
  namespace: string,
  loaders: Readonly<Record<L, () => Promise<FeatureBundle>>>,
): FeatureTranslations {
  const loads = new Map<L, Promise<void>>();
  let listening = false;

  const resolve = (tag: string | undefined): L | null => {
    if (!tag) {
      return null;
    }
    const base = tag.split('-')[0].toLowerCase();
    return base in loaders ? (base as L) : null;
  };

  const wanted = (): L[] => {
    const languages = [resolve(FALLBACK_LANGUAGE), resolve(i18n.resolvedLanguage ?? i18n.language)];
    return languages.filter((language, at, all): language is L => language !== null && all.indexOf(language) === at);
  };

  const loadOne = (language: L): Promise<void> => {
    if (i18n.hasResourceBundle(language, namespace)) {
      return Promise.resolve();
    }
    const pending = loads.get(language);
    if (pending) {
      return pending;
    }
    const next = loaders[language]()
      .then((bundle) => {
        // (language, namespace, resources, deep = true, overwrite = false)
        i18n.addResourceBundle(language, namespace, bundle, true, false);
      })
      .finally(() => {
        loads.delete(language);
      });
    loads.set(language, next);
    return next;
  };

  return {
    namespace,
    isLoaded: () => wanted().every((language) => i18n.hasResourceBundle(language, namespace)),
    load: async () => {
      if (!listening) {
        listening = true;
        i18n.on('languageChanged', (tag: string) => {
          const language = resolve(tag);
          if (language) {
            loadOne(language).catch(() => undefined);
          }
        });
      }
      await Promise.allSettled(wanted().map(loadOne));
    },
  };
}
