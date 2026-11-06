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

import type { C1M2Module, Language } from '@dataspace-mgm/c1-m2-core';
import { useTranslation } from 'react-i18next';
import { useCoreModules, useSession } from '../../../core/CoreModulesContext';
import { useAppLocale } from '../../../i18n/locale';

/** The C1-M2 module (undefined outside mock mode while the feature is a proof of concept). */
export function useC1M2(): C1M2Module | undefined {
  return useCoreModules().c1m2;
}

/** The language of the texts the API returns (names, titles): the language of the portal. */
export function useApiLanguage(): Language {
  const { i18n } = useTranslation();
  return i18n.resolvedLanguage === 'de' ? 'de' : 'en';
}

/** The signed-in person's name and permission keys (GET /me); permissions only hide UI, the API decides. */
export function useSignedInPerson(): { name: string; permissions: ReadonlyArray<string> } | null {
  const session = useSession();
  return session.status === 'signed-in' ? { name: session.session.user.name, permissions: session.session.permissions } : null;
}

/** Dates as the portal shows them, in the language of the portal (e.g. 28 Oct 2026). */
export function useDate(): (iso: string | null | undefined) => string {
  const locale = useAppLocale();
  return (iso) => (iso ? new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' }) : '–');
}
