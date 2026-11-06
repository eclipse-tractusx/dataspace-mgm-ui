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

import type { AddressFieldsAnemic, ChangeRequestAnemic, DeclaredIdentifierAnemic, IdentifierAnemic } from '@dataspace-mgm/c3-m1-core';
import { addressLines } from './format';

/** One row of a comparison "Now → Requested"; `field` is `name`, `address` or an identifier type. */
export interface ChangeRow {
  field: string;
  kind: 'name' | 'address' | 'identifier';
  current: string | null;
  requested: string | null;
  changed: boolean;
}

export interface CurrentCompanyData {
  name: string;
  address: AddressFieldsAnemic;
  identifiers: ReadonlyArray<IdentifierAnemic>;
}

const addressText = (address: AddressFieldsAnemic) => addressLines(address).join(', ');

/**
 * Rows to compare the requested changes with the current data. Display only: which changes are allowed and what they
 * do is decided by the API. Identifiers: the requested list replaces the declared ones, so every type of either list is a row.
 */
export function changeRows(changes: ChangeRequestAnemic['changes'], current: CurrentCompanyData): ChangeRow[] {
  const rows: ChangeRow[] = [];
  if (changes.name !== undefined) {
    rows.push({ field: 'name', kind: 'name', current: current.name, requested: changes.name, changed: changes.name !== current.name });
  }
  if (changes.address !== undefined) {
    const now = addressText(current.address);
    const next = addressText(changes.address);
    rows.push({ field: 'address', kind: 'address', current: now, requested: next, changed: now !== next });
  }
  if (changes.identifiers !== undefined) {
    const declared = current.identifiers.filter((identifier) => identifier.source === 'DECLARED');
    const types = [...new Set([...declared.map((identifier) => identifier.type), ...changes.identifiers.map((identifier) => identifier.type)])];
    for (const type of types) {
      const now = declared.find((identifier) => identifier.type === type)?.value ?? null;
      const next = (changes.identifiers as ReadonlyArray<DeclaredIdentifierAnemic>).find((identifier) => identifier.type === type)?.value ?? null;
      rows.push({ field: type, kind: 'identifier', current: now, requested: next, changed: now !== next });
    }
  }
  return rows;
}
