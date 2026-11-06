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

import type { AddressFieldsAnemic } from '@dataspace-mgm/c3-m1-core';

/** Display formats in the language in use; values from the API stay unchanged elsewhere. */
export function formatDate(value: string | null | undefined, language: string): string {
  return value ? new Intl.DateTimeFormat(language, { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(value)) : '–';
}

export function formatDateTime(value: string | null | undefined, language: string): string {
  return value
    ? new Intl.DateTimeFormat(language, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }).format(new Date(value))
    : '–';
}

export function formatBytes(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function countryName(code: string, language: string): string {
  try {
    return new Intl.DisplayNames([language], { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
}

/** The lines of an address as on a letter, without the country. */
export function addressLines(address: AddressFieldsAnemic): string[] {
  return [
    [address.street, address.houseNumber].filter(Boolean).join(' '),
    address.addressAddition ?? '',
    [address.postalCode, address.city].filter(Boolean).join(' '),
  ].filter((line) => line.trim() !== '');
}

export const shortId = (id: string) => `${id.slice(0, 8)}…`;

/** Only http(s) links from the API become links; anything else (e.g. `javascript:`) is shown as text. */
export function safeExternalUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
}

/** Hours (and days) since a time, for the waiting time of a change request. */
export function waitingHours(since: string, now: Date = new Date()): number {
  return Math.max(0, Math.floor((now.getTime() - new Date(since).getTime()) / 3_600_000));
}
