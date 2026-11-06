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

// Formatting of the times the API returns (ISO date-times). Nothing here decides anything about a credential.

/** The locale of the dates per language of the portal (day month year, as the mockup). */
const LOCALES: Readonly<Record<string, string>> = { en: 'en-GB', de: 'de-DE' };

const locale = (language: string) => LOCALES[language.split('-')[0]] ?? LOCALES.en;

/**
 * Times are shown in UTC, as on the wire and in the mockup, so every person sees the same time (whether the portal
 * shows the person's time zone is an open question of the proof of concept).
 */
const TIME_ZONE = 'UTC';

/** `03 Nov 2026`, or null when the API has no time. */
export function formatDate(iso: string | null, language: string): string | null {
  return iso
    ? new Intl.DateTimeFormat(locale(language), { day: '2-digit', month: 'short', year: 'numeric', timeZone: TIME_ZONE }).format(new Date(iso))
    : null;
}

/** `03 Nov 2026, 10:00`, or null when the API has no time. */
export function formatDateTime(iso: string | null, language: string): string | null {
  return iso
    ? new Intl.DateTimeFormat(locale(language), {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: TIME_ZONE,
      }).format(new Date(iso))
    : null;
}

/** A time span for the texts "2 h ago" and "for 20 h": minutes below one hour, hours below two days, else days. */
export interface Elapsed {
  unit: 'minutes' | 'hours' | 'days';
  count: number;
}

export function elapsed(iso: string, now: number): Elapsed {
  const minutes = Math.max(0, Math.round((now - Date.parse(iso)) / 60_000));
  if (minutes < 60) {
    return { unit: 'minutes', count: minutes };
  }
  const hours = Math.round(minutes / 60);
  if (hours < 48) {
    return { unit: 'hours', count: hours };
  }
  return { unit: 'days', count: Math.round(hours / 24) };
}
