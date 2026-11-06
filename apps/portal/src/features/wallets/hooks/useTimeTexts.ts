/********************************************************************************
 * Copyright (c) 2026 Catena-X Automotive Network e.V.
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

import { useTranslation } from 'react-i18next';
import { WALLETS_NS } from '../i18n';
import { elapsed, formatDate, formatDateTime } from '../utils/format';
import { useNow } from './useNow';

/** Times as texts of the language in use: absent times read "–". */
export interface TimeTexts {
  date: (iso: string | null) => string;
  dateTime: (iso: string | null) => string;
  /** "2 h ago" */
  ago: (iso: string) => string;
  /** "20 h" (for "open for 20 h") */
  duration: (iso: string) => string;
}

export function useTimeTexts(): TimeTexts {
  const { t, i18n } = useTranslation(WALLETS_NS);
  const now = useNow();
  const language = i18n.resolvedLanguage ?? i18n.language;
  return {
    date: (iso) => formatDate(iso, language) ?? t('common.none'),
    dateTime: (iso) => formatDateTime(iso, language) ?? t('common.none'),
    ago: (iso) => {
      const { unit, count } = elapsed(iso, now);
      return t(`ago.${unit}`, { count });
    },
    duration: (iso) => {
      const { unit, count } = elapsed(iso, now);
      return t(`duration.${unit}`, { count });
    },
  };
}
