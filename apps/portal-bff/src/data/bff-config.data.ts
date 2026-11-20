/********************************************************************************
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

/** Settings of the BFF, read and checked once at start (load-config.ts). */
export interface BffConfig {
  /** Origin the browser uses, e.g. `https://portal.example.org` (no path, no trailing slash). */
  publicOrigin: string;
  /** True when the public URL is https: cookies are `Secure` and carry the `__Host-` prefix. */
  secureCookies: boolean;
  /** Issuer of the identity provider, e.g. `https://iam.example.org/auth/realms/CX-Central`. */
  issuer: string;
  clientId: string;
  /** Only for a confidential client; null for a public client (PKCE only). */
  clientSecret: string | null;
  /** Optional `kc_idp_hint`, e.g. `ebw-connector`. */
  idpHint: string | null;
  /** Address of the backend without a trailing slash; `/api/...` is appended. */
  backendUrl: string;
  /** Directory of the built portal (contains index.html). */
  staticDir: string;
  /** File served as `/config.json`; null answers 404. */
  configFile: string | null;
  port: number;
  sessionIdleSeconds: number;
  sessionMaxSeconds: number;
}
