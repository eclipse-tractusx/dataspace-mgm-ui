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
 * Assisted-By: Claude Code (claude-fable-5-2)
 ********************************************************************************/

import type { DocumentInfoAnemic } from '../../domain/anemics/document-info.anemic';
import type { DocumentInfoDto } from '../data/c1-m2-infrastructure.data';

/** C1-M2 `DocumentInfo` (DTO of the API) → the anemic of the UI, and the file name of a download. */
export class DocumentMapper {
  public static toAnemic(dto: DocumentInfoDto): DocumentInfoAnemic {
    return {
      documentId: dto.documentId,
      documentType: dto.documentType,
      fileName: dto.fileName,
      contentType: dto.contentType,
      sizeBytes: dto.sizeBytes,
      sha256: dto.sha256,
      uploadedAt: dto.uploadedAt,
    };
  }

  /**
   * The file name of `Content-Disposition` (C1-M2 sends `attachment; filename*=UTF-8''<percent-encoded name>`); only
   * the base name, so a path in the header cannot reach a save dialog. `fallback` when the header has no file name.
   */
  public static fileNameOf(contentDisposition: string | null, fallback: string): string {
    const match = contentDisposition?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
    if (!match) {
      return fallback;
    }
    let name = match[1];
    try {
      name = decodeURIComponent(name);
    } catch {
      // not percent-encoded: keep it as it is
    }
    const base = name.split(/[\\/]/).pop()?.trim();
    return base ? base : fallback;
  }
}
