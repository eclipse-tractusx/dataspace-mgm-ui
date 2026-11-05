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

/**
 * Runtime configuration (docs/architecture: "Runtime configuration and deployment").
 * The image is built once; /config.json is mounted per environment from the Helm chart.
 * Without it (local development) the defaults apply. For local overrides copy
 * apps/portal/config.example.json to apps/portal/public/config.json (ignored by git).
 */
export interface RuntimeConfig {
  api_base_url: string;
  environment: string;
}

export const DEFAULT_CONFIG: RuntimeConfig = {
  api_base_url: '/api',
  environment: 'local',
};

function pick(raw: unknown): Partial<RuntimeConfig> {
  if (typeof raw !== 'object' || raw === null) return {};
  const source = raw as Record<string, unknown>;
  const result: Partial<RuntimeConfig> = {};
  if (typeof source.api_base_url === 'string') result.api_base_url = source.api_base_url;
  if (typeof source.environment === 'string') result.environment = source.environment;
  return result;
}

export async function loadConfig(fetchImpl: typeof fetch = fetch): Promise<RuntimeConfig> {
  try {
    const response = await fetchImpl('/config.json', { cache: 'no-store' });
    const isJson = response.headers.get('content-type')?.includes('json') ?? false;
    if (!response.ok || !isJson) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...pick(await response.json()) };
  } catch {
    return DEFAULT_CONFIG;
  }
}
