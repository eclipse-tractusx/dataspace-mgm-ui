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

import type { PageData } from '../data/page.data';
import { throwIfInvalid } from './problems.fake';

/** One page of a list (FRAMEWORK 4.1): `page` from 0 (default 0), `size` 1 to 100 (default 20); otherwise 400. */
export function pageOf<T>(items: ReadonlyArray<T>, page = 0, size = 20): PageData<T> {
  throwIfInvalid([
    ...(Number.isInteger(page) && page >= 0 ? [] : [{ field: 'page', message: 'page is an integer from 0.' }]),
    ...(Number.isInteger(size) && size >= 1 && size <= 100 ? [] : [{ field: 'size', message: 'size is an integer from 1 to 100.' }]),
  ]);
  return { items: items.slice(page * size, page * size + size), page, size, total: items.length };
}
