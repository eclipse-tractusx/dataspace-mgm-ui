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

import { BEISPIEL_LOGISTIK, BEISPIEL_MASCHINENBAU } from '@dataspace-mgm/c3-m1-core/testing';
import { describe, expect, it } from 'vitest';
import { changeRows } from './change-rows';
import { addressLines, formatBytes, safeExternalUrl, waitingHours } from './format';

describe('feature utils', () => {
  it('compares identifiers: unchanged, new and removed rows', () => {
    const rows = changeRows({ identifiers: [{ type: 'LEI_CODE', value: '5299' }] }, { name: BEISPIEL_MASCHINENBAU.name, address: BEISPIEL_MASCHINENBAU.postalAddress, identifiers: BEISPIEL_MASCHINENBAU.identifiers });
    expect(rows).toEqual([
      { field: 'VAT_ID', kind: 'identifier', current: 'DE123456789', requested: null, changed: true },
      { field: 'LEI_CODE', kind: 'identifier', current: null, requested: '5299', changed: true },
    ]);
  });

  it('compares name and address', () => {
    const rows = changeRows({ name: 'X SE', address: { ...BEISPIEL_LOGISTIK.postalAddress, city: 'Mannheim' } }, { name: 'X GmbH', address: BEISPIEL_LOGISTIK.postalAddress, identifiers: [] });
    expect(rows.map((row) => `${row.field}:${row.changed}`)).toEqual(['name:true', 'address:false']);
    expect(addressLines(BEISPIEL_LOGISTIK.postalAddress)).toEqual(['Hafenstraße 5', '68159 Mannheim']);
  });

  it('turns only http(s) URLs into links', () => {
    expect(safeExternalUrl('https://dataspace.example.org/t.pdf')).toBe('https://dataspace.example.org/t.pdf');
    expect(safeExternalUrl('javascript:alert(1)')).toBeNull();
    expect(safeExternalUrl('data:text/html,x')).toBeNull();
    expect(safeExternalUrl('not a url')).toBeNull();
  });

  it('formats sizes and waiting time', () => {
    expect(formatBytes(184320)).toBe('180 KB');
    expect(formatBytes(10 * 1024 * 1024)).toBe('10.0 MB');
    expect(waitingHours('2026-11-05T14:02:00Z', new Date('2026-11-06T16:30:00Z'))).toBe(26);
    expect(waitingHours('2026-11-07T00:00:00Z', new Date('2026-11-06T00:00:00Z'))).toBe(0);
  });
});
