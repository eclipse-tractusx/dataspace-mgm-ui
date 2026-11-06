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

import i18next from 'i18next';
import { useSyncExternalStore } from 'react';

/**
 * The language the app is shown in, for `Intl` and `toLocale*String`. Format dates, numbers and lists with it, never
 * with `undefined` (the browser's language) or a fixed `'en-US'`: a person who chose Deutsch would otherwise read
 * "Nov 6, 2026" among German labels. `undefined` only before i18next has started, where the browser's guess is best.
 */
export function appLocale(): string | undefined {
  return i18next.resolvedLanguage ?? (i18next.language || undefined);
}

const subscribe = (onChange: () => void): (() => void) => {
  i18next.on('languageChanged', onChange);
  return () => i18next.off('languageChanged', onChange);
};

/**
 * `appLocale()` as React state: re-renders when the language changes. For values formatted once and kept (labels
 * built when data arrives), which would otherwise stay in the old language until the next fetch.
 */
export function useAppLocale(): string | undefined {
  return useSyncExternalStore(subscribe, appLocale, appLocale);
}
