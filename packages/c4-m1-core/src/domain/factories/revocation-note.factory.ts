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

import { REVOCATION_NOTE_MAX_LENGTH, REVOCATION_NOTE_MIN_LENGTH } from '../data/revocation-note-limits.data';
import type { RevocationNoteValidation } from '../data/revocation-note-validation.data';
import type { RevocationNote } from '../valueObjects/revocation-note.value-object';

/**
 * Creates the note of `confirmRevocation` from the input (UX pre-check only; the API checks again). The input is
 * trimmed, so a note of blanks counts as empty. Errors are i18n keys of the feature namespace.
 */
export class RevocationNoteFactory {
  public static create(input: string): RevocationNoteValidation {
    const note = input.trim();
    if (note.length < REVOCATION_NOTE_MIN_LENGTH) {
      return { valid: false, key: 'validation.revocationNoteRequired' };
    }
    if (note.length > REVOCATION_NOTE_MAX_LENGTH) {
      return { valid: false, key: 'validation.revocationNoteTooLong' };
    }
    return { valid: true, note: note as RevocationNote };
  }
}
