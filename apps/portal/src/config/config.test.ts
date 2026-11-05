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

import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG, loadConfig } from './index';

const respond = (body: string, contentType: string, status = 200) =>
  (() => Promise.resolve(new Response(body, { status, headers: { 'content-type': contentType } }))) as typeof fetch;

describe('loadConfig', () => {
  it('reads /config.json', async () => {
    const config = await loadConfig(respond('{"environment":"int","api_base_url":"https://api.example.org"}', 'application/json'));
    expect(config).toEqual({ environment: 'int', api_base_url: 'https://api.example.org' });
  });

  it('falls back to the defaults when the dev server answers with index.html', async () => {
    expect(await loadConfig(respond('<!doctype html>', 'text/html'))).toEqual(DEFAULT_CONFIG);
  });

  it('falls back to the defaults on a network error', async () => {
    expect(await loadConfig((() => Promise.reject(new Error('offline'))) as typeof fetch)).toEqual(DEFAULT_CONFIG);
  });

  it('ignores values of the wrong type', async () => {
    expect(await loadConfig(respond('{"environment":42}', 'application/json'))).toEqual(DEFAULT_CONFIG);
  });
});
