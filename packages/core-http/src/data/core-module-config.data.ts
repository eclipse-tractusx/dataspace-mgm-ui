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

/** How an app creates a core package: one config, shared by every module. */
export interface CoreModuleConfig {
  /** Base URL of the module's API, e.g. `/api/c3-m1` (the `servers.url` of its openapi.yaml under the app's api_base_url). */
  baseUrl: string;
  /** The CSRF token of the session (from GET /me), sent on write requests. */
  getCsrfToken?: () => string | null;
  /** Called on every 401, e.g. to start the sign-in at the BFF. */
  onUnauthorized?: () => void;
  /** Replaces the global fetch, for tests. */
  fetch?: typeof fetch;
}

/** The plain result of openapi-fetch, as ensureData reads it. */
export interface CoreResponse<T> {
  data?: T;
  error?: unknown;
  response: Response;
}

/** An HTTP error as plain data, so that any UI state library can keep it. */
export interface CoreHttpErrorData {
  /** HTTP status, null when no response arrived. */
  status: number | null;
  /** `type` of the Problem Details (RFC 9457) the module returned, e.g. `urn:c3-m1:problem:not-found`. */
  problemType: string | null;
  message: string;
}
