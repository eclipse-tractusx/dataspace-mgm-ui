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

import type { DocumentContentType } from '../data/c1-m2-enums.data';

const SIGNATURES: ReadonlyArray<{ contentType: DocumentContentType; bytes: ReadonlyArray<number> }> = [
  { contentType: 'application/pdf', bytes: [0x25, 0x50, 0x44, 0x46, 0x2d] },
  { contentType: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { contentType: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
];

/** The format by the first bytes (README 6.9: `%PDF-`, PNG signature, `FF D8 FF`), not by the declared type. */
export function contentTypeOf(content: Uint8Array): DocumentContentType | null {
  const match = SIGNATURES.find(({ bytes }) => bytes.every((byte, index) => content[index] === byte));
  return match?.contentType ?? null;
}

/** README 5 `file_name`: 1 to 200 characters, without path parts and control characters. */
export function isValidFileName(fileName: string): boolean {
  // eslint-disable-next-line no-control-regex
  return fileName.length >= 1 && fileName.length <= 200 && !/[/\\\u0000-\u001f\u007f]/.test(fileName) && fileName !== '.' && fileName !== '..';
}

/** Checksum of the content, hexadecimal (WebCrypto, in browsers and Node). */
export async function sha256Hex(content: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', content as Uint8Array<ArrayBuffer>);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
