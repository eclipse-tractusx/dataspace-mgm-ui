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

import type { ValidationErrorData } from '../data/validation-error.data';

/** Checks of free text against the limits of the spec, as i18n keys. */
export class TextDomain {
  public static required(field: string, value: string | null | undefined, max: number): ValidationErrorData[] {
    const text = value?.trim() ?? '';
    if (!text) {
      return [{ field, key: 'required' }];
    }
    return TextDomain.optional(field, text, max);
  }

  public static optional(field: string, value: string | null | undefined, max: number): ValidationErrorData[] {
    return (value?.trim().length ?? 0) > max ? [{ field, key: 'tooLong', params: { max } }] : [];
  }

  /** The value trimmed, null when empty (the API removes an optional text with null). */
  public static orNull(value: string | null | undefined): string | null {
    const text = value?.trim() ?? '';
    return text ? text : null;
  }
}
