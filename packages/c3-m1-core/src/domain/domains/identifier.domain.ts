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

import type { DeclaredIdentifierAnemic } from '../anemics/declared-identifier.anemic';
import type { IdentifierAnemic } from '../anemics/identifier.anemic';
import { C3M1_LIMITS } from '../constants/c3-m1-limits.constant';
import type { ValidationErrorData } from '../data/validation-error.data';
import { TextDomain } from './text.domain';

/** Identifiers: which ones a company declares itself, and the checks of a new list of them. */
export class IdentifierDomain {
  public static declared(identifiers: ReadonlyArray<IdentifierAnemic>): DeclaredIdentifierAnemic[] {
    return identifiers.filter((identifier) => identifier.source === 'DECLARED').map(({ type, value }) => ({ type, value }));
  }

  /** Every value given and within its limit, every type at most once. Patterns per type are checked by the API. */
  public static validate(identifiers: ReadonlyArray<DeclaredIdentifierAnemic>): ValidationErrorData[] {
    const errors: ValidationErrorData[] = [];
    const seen = new Set<string>();
    identifiers.forEach((identifier, index) => {
      errors.push(...TextDomain.required(`identifiers.${index}`, identifier.value, C3M1_LIMITS.IDENTIFIER_VALUE_MAX));
      if (seen.has(identifier.type)) {
        errors.push({ field: `identifiers.${index}`, key: 'duplicate' });
      }
      seen.add(identifier.type);
    });
    return errors;
  }

  public static sameList(a: ReadonlyArray<DeclaredIdentifierAnemic>, b: ReadonlyArray<DeclaredIdentifierAnemic>): boolean {
    const key = (list: ReadonlyArray<DeclaredIdentifierAnemic>) =>
      list
        .map((identifier) => `${identifier.type}=${identifier.value.trim()}`)
        .sort()
        .join('|');
    return key(a) === key(b);
  }
}
