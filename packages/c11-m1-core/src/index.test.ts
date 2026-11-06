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

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { C11M1_BASE_PATH } from './index';

describe('C11M1_BASE_PATH', () => {
  it('matches servers.url of the vendored spec', () => {
    const spec = readFileSync(new URL('../../../specs/c11-m1/openapi.yaml', import.meta.url), 'utf8');
    expect(spec).toMatch(/servers:\s*\n\s*-\s*url:\s*\/api\/c11-m1\s*\n/);
    expect(`/api${C11M1_BASE_PATH}`).toBe('/api/c11-m1');
  });
});
