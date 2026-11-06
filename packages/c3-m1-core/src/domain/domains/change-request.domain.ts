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

import type { ChangeRequestAnemic } from '../anemics/change-request.anemic';
import { C3M1_LIMITS } from '../constants/c3-m1-limits.constant';
import type { ChangeRequestDraftData } from '../data/c3-m1-commands.data';
import { DOCUMENT_MEDIA_TYPES, type DocumentMediaType } from '../data/c3-m1-values.data';
import type { ValidationErrorData } from '../data/validation-error.data';
import { IdentifierDomain } from './identifier.domain';
import { TextDomain } from './text.domain';

/** UX pre-checks of change requests (C3-M1 README 7.4 to 7.6, 7.17, 7.18); the API checks them again. */
export class ChangeRequestDomain {
  /** Withdraw, approve and decline are accepted only for OPEN (409 `invalid-state` otherwise). */
  public static isOpen(changeRequest: Pick<ChangeRequestAnemic, 'status'>): boolean {
    return changeRequest.status === 'OPEN';
  }

  /** The names of the changed parts, in a fixed order: `name`, `address`, `identifiers`. */
  public static changedFields(changeRequest: Pick<ChangeRequestAnemic, 'changes'>): Array<'name' | 'address' | 'identifiers'> {
    const { changes } = changeRequest;
    return (['name', 'address', 'identifiers'] as const).filter((field) => changes[field] !== undefined);
  }

  public static validateDraft(draft: ChangeRequestDraftData): ValidationErrorData[] {
    const errors: ValidationErrorData[] = [...TextDomain.required('comment', draft.comment, C3M1_LIMITS.COMMENT_MAX)];
    if (draft.name === undefined && draft.address === undefined && draft.identifiers === undefined) {
      errors.push({ field: 'changes', key: 'nothingChanged' });
    }
    if (draft.name !== undefined) {
      errors.push(...TextDomain.required('name', draft.name, C3M1_LIMITS.COMPANY_NAME_MAX));
    }
    if (draft.identifiers) {
      errors.push(...IdentifierDomain.validate(draft.identifiers));
    }
    if (draft.documents.length === 0) {
      errors.push({ field: 'documents', key: 'tooFew', params: { min: 1 } });
    }
    if (draft.documents.length > C3M1_LIMITS.MAX_DOCUMENTS) {
      errors.push({ field: 'documents', key: 'tooMany', params: { max: C3M1_LIMITS.MAX_DOCUMENTS } });
    }
    draft.documents.forEach((document, index) => {
      if (!(DOCUMENT_MEDIA_TYPES as ReadonlyArray<string>).includes(document.mediaType)) {
        errors.push({ field: `documents.${index}`, key: 'fileType', params: { fileName: document.fileName } });
      } else if (document.sizeBytes > C3M1_LIMITS.MAX_DOCUMENT_BYTES) {
        errors.push({ field: `documents.${index}`, key: 'fileTooLarge', params: { fileName: document.fileName, maxMb: 10 } });
      }
    });
    return errors;
  }

  public static isDocumentMediaType(mediaType: string): mediaType is DocumentMediaType {
    return (DOCUMENT_MEDIA_TYPES as ReadonlyArray<string>).includes(mediaType);
  }

  public static validateDeclineReason(reason: string): ValidationErrorData[] {
    return TextDomain.required('reason', reason, C3M1_LIMITS.DECLINE_REASON_MAX);
  }

  public static validateApprovalComment(comment: string | undefined): ValidationErrorData[] {
    return TextDomain.optional('comment', comment, C3M1_LIMITS.APPROVAL_COMMENT_MAX);
  }
}
