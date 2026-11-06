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

import createClient, { type Client } from 'openapi-fetch';
import { HTTP } from './constants/http.constant';
import type { CoreModuleConfig } from './data/core-module-config.data';

/**
 * The typed HTTP client of one backend module. `Paths` is the `paths` type that openapi-typescript generated from the
 * module's openapi.yaml, so every path, parameter and body is checked by the compiler.
 *
 * Every request carries the session cookie (`credentials: 'include'`), never a token: the BFF adds the token of the
 * person on its way to the module. Write requests carry the CSRF token of the session.
 */
export function createCoreClient<Paths extends object>(config: CoreModuleConfig): Client<Paths> {
  const client = createClient<Paths>({
    baseUrl: config.baseUrl,
    credentials: 'include',
    ...(config.fetch ? { fetch: config.fetch } : {}),
  });
  client.use({
    onRequest({ request }) {
      const safe = (HTTP.SAFE_METHODS as ReadonlyArray<string>).includes(request.method);
      const csrf = config.getCsrfToken?.() ?? null;
      if (!safe && csrf !== null) {
        request.headers.set(HTTP.CSRF_HEADER, csrf);
      }
      return request;
    },
    onResponse({ response }) {
      if (response.status === HTTP.UNAUTHORIZED) {
        config.onUnauthorized?.();
      }
      return response;
    },
  });
  return client;
}
