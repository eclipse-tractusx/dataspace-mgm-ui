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

import type { IdentifierType, Language } from '../../data/c1-m2-enums.data';

/** The shared reference data (`masterDataFile`, structure of C1-M2 README 14.2). */
export interface ReferenceDataFixture {
  countries: ReadonlyArray<{ code: string; name: Readonly<Record<Language, string>>; identifierTypes: ReadonlyArray<IdentifierType> }>;
  identifierTypes: ReadonlyArray<{
    type: IdentifierType;
    name: Readonly<Record<Language, string>>;
    /** Regular expression per country code, fallback `Worldwide`. Shown by the UI, evaluated only by the backend. */
    patterns: Readonly<Record<string, string>>;
  }>;
}

/** C1-M2 README 14.2 verbatim (the backend's config/master-data.json is the same extract): DE and US. */
export const REFERENCE_DATA: ReferenceDataFixture = {
  countries: [
    {
      code: 'DE',
      name: { de: 'Deutschland', en: 'Germany' },
      identifierTypes: ['EUID', 'EBWOID', 'COMMERCIAL_REG_NUMBER', 'VAT_ID', 'LEI_CODE', 'EORI'],
    },
    { code: 'US', name: { de: 'Vereinigte Staaten', en: 'United States' }, identifierTypes: ['EORI'] },
  ],
  identifierTypes: [
    { type: 'EUID', name: { de: 'EUID', en: 'EUID' }, patterns: { Worldwide: '^[A-Z]{2}[A-Za-z0-9.\\-]{2,60}$' } },
    { type: 'EBWOID', name: { de: 'EBWOID', en: 'EBWOID' }, patterns: { Worldwide: '^\\S{1,200}$' } },
    {
      type: 'COMMERCIAL_REG_NUMBER',
      name: { de: 'Handelsregisternummer', en: 'Commercial register number' },
      patterns: {
        Worldwide: '^(?!.*\\s$)([A-Za-zÀ-ÿ0-9.()](\\.|\\s|-|_)?){4,50}$',
        DE: '^(?!.*\\s$)([A-Za-zÀ-ÿ])([A-Za-zÀ-ÿ0-9.()](\\s|-|_)?){4,50}$',
        FR: '^\\d{9}$',
      },
    },
    {
      type: 'VAT_ID',
      name: { de: 'USt-ID', en: 'VAT ID' },
      patterns: {
        Worldwide: '^(?!.*\\s$)([A-Za-z0-9](\\.|\\s|-|\\/)?){5,18}$',
        DE: '^DE\\d{9}$',
        IN: '^[a-zA-Z\\d-]{5,15}$',
        MX: '^[a-zA-Z\\d-&]{12,13}$',
      },
    },
    { type: 'LEI_CODE', name: { de: 'LEI', en: 'LEI' }, patterns: { Worldwide: '^[A-Za-z0-9]{20}$' } },
    { type: 'EORI', name: { de: 'EORI-Nummer', en: 'EORI number' }, patterns: { Worldwide: '^[A-Z]{2}[A-Za-z0-9]{1,15}$' } },
  ],
};
