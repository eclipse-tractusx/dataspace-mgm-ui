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

import { isAbsolute } from 'node:path';
import type { BffConfig } from './data/bff-config.data.ts';
import type { EbwConfig } from './data/ebw.data.ts';

const LOOPBACK = /^(localhost|127\.0\.0\.1|\[::1\]|[a-z0-9-]+\.localhost)$/;

type Env = Record<string, string | undefined>;

function httpUrl(env: Env, name: string, errors: string[]): URL | null {
  const value = env[name]?.trim();
  if (!value) {
    errors.push(`${name} is missing`);
    return null;
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    errors.push(`${name} is not a URL`);
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    errors.push(`${name} must start with https:// or http://`);
    return null;
  }
  if (url.username || url.password || url.search || url.hash) {
    errors.push(`${name} must not contain credentials, a query or a fragment`);
    return null;
  }
  return url;
}

function seconds(env: Env, name: string, fallback: number, errors: string[]): number {
  const value = env[name]?.trim();
  if (!value) {
    return fallback;
  }
  if (!/^[1-9][0-9]{0,8}$/.test(value)) {
    errors.push(`${name} must be a whole number of seconds greater than 0`);
    return fallback;
  }
  return Number(value);
}

function optional(env: Env, name: string): string | null {
  return env[name]?.trim() || null;
}

/**
 * The wallet step (BFF_EBW_*): all three settings or none. Without them the step is not connected, which is a valid
 * installation (the registration then runs with supporting documents only).
 */
function ebwSettings(env: Env, publicUrl: URL | null, errors: string[]): EbwConfig | null {
  const names = ['BFF_EBW_ISSUER_URL', 'BFF_EBW_CLIENT_ID', 'BFF_EBW_KEY_FILE'];
  const given = names.filter((name) => optional(env, name) !== null);
  if (given.length === 0) {
    return null;
  }
  if (given.length < names.length) {
    errors.push(`${names.join(', ')} belong together: set all three or none (missing: ${names.filter((name) => !given.includes(name)).join(', ')})`);
    return null;
  }
  const issuer = httpUrl(env, 'BFF_EBW_ISSUER_URL', errors);
  if (issuer && publicUrl && publicUrl.protocol === 'https:' && issuer.protocol !== 'https:') {
    errors.push('BFF_EBW_ISSUER_URL must be https when BFF_PUBLIC_URL is https');
  }
  const clientId = optional(env, 'BFF_EBW_CLIENT_ID') as string;
  if (!/^[A-Za-z0-9._-]{1,100}$/.test(clientId)) {
    errors.push('BFF_EBW_CLIENT_ID must be the client id at the EBW-Connector (letters, digits, ".", "_", "-")');
  }
  const keyFile = optional(env, 'BFF_EBW_KEY_FILE') as string;
  if (!isAbsolute(keyFile)) {
    errors.push('BFF_EBW_KEY_FILE must be an absolute path');
  }
  return issuer ? { issuer: issuer.href.replace(/\/$/, ''), clientId, keyFile } : null;
}

/**
 * Reads the settings from the environment and checks them. Throws one error that names every wrong setting; the
 * message never contains a value, so a mistyped secret does not end up in a log.
 */
export function loadConfig(env: Env): BffConfig {
  const errors: string[] = [];

  const publicUrl = httpUrl(env, 'BFF_PUBLIC_URL', errors);
  if (publicUrl && publicUrl.pathname !== '/') {
    errors.push('BFF_PUBLIC_URL must not contain a path: the portal is served at the root of its host');
  }
  if (publicUrl && publicUrl.protocol === 'http:' && !LOOPBACK.test(publicUrl.hostname)) {
    errors.push('BFF_PUBLIC_URL must be https (http is accepted for localhost only): the session cookie needs Secure');
  }

  const issuer = httpUrl(env, 'BFF_ISSUER_URL', errors);
  if (issuer && publicUrl && publicUrl.protocol === 'https:' && issuer.protocol !== 'https:') {
    errors.push('BFF_ISSUER_URL must be https when BFF_PUBLIC_URL is https');
  }

  const backend = httpUrl(env, 'BFF_BACKEND_URL', errors);

  const clientId = optional(env, 'BFF_CLIENT_ID');
  if (!clientId) {
    errors.push('BFF_CLIENT_ID is missing');
  }

  const idpHint = optional(env, 'BFF_IDP_HINT');
  if (idpHint && !/^[A-Za-z0-9._-]{1,64}$/.test(idpHint)) {
    errors.push('BFF_IDP_HINT must be the alias of an identity provider (letters, digits, ".", "_", "-")');
  }

  const staticDir = optional(env, 'BFF_STATIC_DIR');
  if (!staticDir) {
    errors.push('BFF_STATIC_DIR is missing');
  } else if (!isAbsolute(staticDir)) {
    errors.push('BFF_STATIC_DIR must be an absolute path');
  }

  const configFile = optional(env, 'BFF_CONFIG_FILE');
  if (configFile && !isAbsolute(configFile)) {
    errors.push('BFF_CONFIG_FILE must be an absolute path');
  }

  const portValue = optional(env, 'BFF_PORT') ?? '8080';
  const port = /^[0-9]{1,5}$/.test(portValue) ? Number(portValue) : -1;
  if (port < 1 || port > 65535) {
    errors.push('BFF_PORT must be a port number between 1 and 65535');
  }

  const ebw = ebwSettings(env, publicUrl, errors);

  const sessionIdleSeconds = seconds(env, 'BFF_SESSION_IDLE_SECONDS', 30 * 60, errors);
  const sessionMaxSeconds = seconds(env, 'BFF_SESSION_MAX_SECONDS', 10 * 60 * 60, errors);
  if (sessionIdleSeconds > sessionMaxSeconds) {
    errors.push('BFF_SESSION_IDLE_SECONDS must not be greater than BFF_SESSION_MAX_SECONDS');
  }

  if (errors.length > 0 || !publicUrl || !issuer || !backend || !clientId || !staticDir) {
    throw new Error(`The BFF cannot start, its settings are wrong:\n- ${errors.join('\n- ')}`);
  }

  return {
    publicOrigin: publicUrl.origin,
    secureCookies: publicUrl.protocol === 'https:',
    issuer: issuer.href.replace(/\/$/, ''),
    clientId,
    clientSecret: optional(env, 'BFF_CLIENT_SECRET'),
    idpHint,
    backendUrl: backend.href.replace(/\/$/, ''),
    staticDir,
    configFile,
    port,
    sessionIdleSeconds,
    sessionMaxSeconds,
    ebw,
  };
}
