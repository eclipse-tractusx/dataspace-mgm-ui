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

import { describe, expect, it } from 'vitest';
import { loadConfig } from './load-config.ts';

const env = {
  BFF_PUBLIC_URL: 'https://portal.example.org/',
  BFF_ISSUER_URL: 'https://iam.example.org/auth/realms/CX-Central/',
  BFF_CLIENT_ID: 'portal-ui',
  BFF_BACKEND_URL: 'http://dataspace-mgm-service:8000/',
  BFF_STATIC_DIR: '/app/public',
};

describe('settings', () => {
  it('reads the settings with their defaults', () => {
    expect(loadConfig(env)).toEqual({
      publicOrigin: 'https://portal.example.org',
      secureCookies: true,
      issuer: 'https://iam.example.org/auth/realms/CX-Central',
      clientId: 'portal-ui',
      clientSecret: null,
      idpHint: null,
      backendUrl: 'http://dataspace-mgm-service:8000',
      staticDir: '/app/public',
      configFile: null,
      port: 8080,
      sessionIdleSeconds: 1800,
      sessionMaxSeconds: 36000,
      ebw: null,
    });
  });

  it('reads the settings of the wallet step', () => {
    const config = loadConfig({
      ...env,
      BFF_EBW_ISSUER_URL: 'https://ebw-connector.example.org/',
      BFF_EBW_CLIENT_ID: 'osp-a-ui',
      BFF_EBW_KEY_FILE: '/app/keys/ebw-client.pem',
    });
    expect(config.ebw).toEqual({ issuer: 'https://ebw-connector.example.org', clientId: 'osp-a-ui', keyFile: '/app/keys/ebw-client.pem' });
  });

  it('accepts an EBW-Connector on https for a portal on localhost', () => {
    const config = loadConfig({
      ...env,
      BFF_PUBLIC_URL: 'http://localhost:8081',
      BFF_ISSUER_URL: 'http://localhost:8080/auth/realms/CX-Central',
      BFF_EBW_ISSUER_URL: 'https://ebw-connector.example.org',
      BFF_EBW_CLIENT_ID: 'osp-a-ui',
      BFF_EBW_KEY_FILE: '/app/keys/ebw-client.pem',
    });
    expect(config.ebw?.issuer).toBe('https://ebw-connector.example.org');
  });

  it('reads the optional settings', () => {
    const config = loadConfig({
      ...env,
      BFF_PUBLIC_URL: 'http://localhost:8081',
      BFF_ISSUER_URL: 'http://localhost:8080/auth/realms/CX-Central',
      BFF_CLIENT_SECRET: 'a-secret',
      BFF_IDP_HINT: 'ebw-connector',
      BFF_CONFIG_FILE: '/app/config/config.json',
      BFF_PORT: '8081',
      BFF_SESSION_IDLE_SECONDS: '60',
      BFF_SESSION_MAX_SECONDS: '600',
    });
    expect(config).toMatchObject({
      publicOrigin: 'http://localhost:8081',
      secureCookies: false,
      clientSecret: 'a-secret',
      idpHint: 'ebw-connector',
      configFile: '/app/config/config.json',
      port: 8081,
      sessionIdleSeconds: 60,
      sessionMaxSeconds: 600,
    });
  });

  it.each([
    [{ BFF_PUBLIC_URL: undefined }, 'BFF_PUBLIC_URL is missing'],
    [{ BFF_PUBLIC_URL: 'portal.example.org' }, 'BFF_PUBLIC_URL is not a URL'],
    [{ BFF_PUBLIC_URL: 'ftp://portal.example.org' }, 'BFF_PUBLIC_URL must start with'],
    [{ BFF_PUBLIC_URL: 'https://portal.example.org/portal' }, 'must not contain a path'],
    [{ BFF_PUBLIC_URL: 'http://portal.example.org' }, 'BFF_PUBLIC_URL must be https'],
    [{ BFF_PUBLIC_URL: 'http://localhost.evil.example' }, 'BFF_PUBLIC_URL must be https'],
    [{ BFF_ISSUER_URL: 'http://iam.example.org/realms/r' }, 'BFF_ISSUER_URL must be https'],
    [{ BFF_ISSUER_URL: 'https://user:pw@iam.example.org/realms/r' }, 'BFF_ISSUER_URL must not contain credentials'],
    [{ BFF_CLIENT_ID: ' ' }, 'BFF_CLIENT_ID is missing'],
    [{ BFF_BACKEND_URL: undefined }, 'BFF_BACKEND_URL is missing'],
    [{ BFF_BACKEND_URL: 'http://backend:8000/?x=1' }, 'BFF_BACKEND_URL must not contain'],
    [{ BFF_STATIC_DIR: undefined }, 'BFF_STATIC_DIR is missing'],
    [{ BFF_STATIC_DIR: 'dist' }, 'BFF_STATIC_DIR must be an absolute path'],
    [{ BFF_CONFIG_FILE: 'config.json' }, 'BFF_CONFIG_FILE must be an absolute path'],
    [{ BFF_PORT: '0' }, 'BFF_PORT must be a port number'],
    [{ BFF_PORT: '70000' }, 'BFF_PORT must be a port number'],
    [{ BFF_PORT: '80a' }, 'BFF_PORT must be a port number'],
    [{ BFF_IDP_HINT: 'a b&c' }, 'BFF_IDP_HINT must be the alias'],
    [{ BFF_SESSION_IDLE_SECONDS: '0' }, 'BFF_SESSION_IDLE_SECONDS must be a whole number'],
    [{ BFF_SESSION_MAX_SECONDS: '-5' }, 'BFF_SESSION_MAX_SECONDS must be a whole number'],
    [{ BFF_SESSION_IDLE_SECONDS: '600', BFF_SESSION_MAX_SECONDS: '60' }, 'must not be greater than'],
    [{ BFF_EBW_ISSUER_URL: 'https://ebw.example.org' }, 'belong together: set all three or none (missing: BFF_EBW_CLIENT_ID, BFF_EBW_KEY_FILE)'],
    [{ BFF_EBW_CLIENT_ID: 'osp-a-ui', BFF_EBW_KEY_FILE: '/k.pem' }, 'missing: BFF_EBW_ISSUER_URL'],
    [{ BFF_EBW_ISSUER_URL: 'http://ebw.example.org', BFF_EBW_CLIENT_ID: 'osp-a-ui', BFF_EBW_KEY_FILE: '/k.pem' }, 'BFF_EBW_ISSUER_URL must be https'],
    [{ BFF_EBW_ISSUER_URL: 'ebw.example.org', BFF_EBW_CLIENT_ID: 'osp-a-ui', BFF_EBW_KEY_FILE: '/k.pem' }, 'BFF_EBW_ISSUER_URL is not a URL'],
    [{ BFF_EBW_ISSUER_URL: 'https://ebw.example.org', BFF_EBW_CLIENT_ID: 'a b', BFF_EBW_KEY_FILE: '/k.pem' }, 'BFF_EBW_CLIENT_ID must be the client id'],
    [{ BFF_EBW_ISSUER_URL: 'https://ebw.example.org', BFF_EBW_CLIENT_ID: 'osp-a-ui', BFF_EBW_KEY_FILE: 'k.pem' }, 'BFF_EBW_KEY_FILE must be an absolute path'],
  ])('refuses %j', (change, message) => {
    expect(() => loadConfig({ ...env, ...change })).toThrow(message);
  });

  it('names every wrong setting at once and never prints a value', () => {
    const attempt = () => loadConfig({ BFF_PUBLIC_URL: 'https://user:hunter2@portal.example.org', BFF_CLIENT_SECRET: 'hunter2', BFF_PORT: 'x' });
    expect(attempt).toThrow(/BFF_PUBLIC_URL[\s\S]*BFF_ISSUER_URL[\s\S]*BFF_BACKEND_URL[\s\S]*BFF_CLIENT_ID[\s\S]*BFF_STATIC_DIR[\s\S]*BFF_PORT/);
    expect(attempt).not.toThrow(/hunter2/);
  });
});
