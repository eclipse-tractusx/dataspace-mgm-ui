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
 * Development BFF: a stand-in for the server part of the UI, inside the Vite dev server (`npm start` only, never in the
 * image). It lets the portal talk to a running Dataspace Management Service without a token in the browser, as the
 * frontend architecture requires (05 Auth & session):
 *
 *   GET  /me                       the signed-in test person, from the claims of their token (+ a CSRF token)
 *   GET  /auth/login?person=&return_to=   "signs in" a test person of the backend (cookie), back to return_to
 *   POST /auth/logout              signs out
 *   /api/**                        proxied to the backend, with `Authorization: Bearer <token of the person>`
 *
 * The token comes from the test Portal IAM of the backend: the in-memory IAM of the scaffold
 * (`GET {api}/auth/realms/{realm}/test/tokens/{person}`), otherwise `iam/test/get-token.py` of the backend checkout
 * (Keycloak from docker compose). The real BFF (OIDC code flow at the EBW-Connector, HttpOnly session) is not built yet.
 */
import { execFile } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { join } from 'node:path';
import { promisify } from 'node:util';
import type { Plugin } from 'vite';

const run = promisify(execFile);

export interface DevBffOptions {
  /** Address of the installation, e.g. http://localhost:8000 (OSP A of `demo.py --serve`). */
  apiUrl: string;
  /** Test person signed in by default (key of testdata/persons-osp-a.json), e.g. pia. */
  person: string;
  realm: string;
  /** A fixed token instead (expires; only for quick tries). */
  token?: string;
  /** Command that prints a token; `{person}` and `{realm}` are replaced. Runs in serviceDir. */
  tokenCommand?: string;
  /** Checkout of dataspace-mgm-service, for iam/test/get-token.py. */
  serviceDir: string;
}

export const PERSON_COOKIE = 'dsm_dev_person';
const SIGNED_OUT = '-';
const PERSON_KEY = /^[a-z][a-z0-9-]{0,63}$/;

export function devBffOptions(env: Record<string, string | undefined>, workspaceRoot: string): DevBffOptions {
  return {
    apiUrl: (env.DEV_BFF_API_URL || 'http://localhost:8000').replace(/\/$/, ''),
    person: env.DEV_BFF_PERSON || 'pia',
    realm: env.DEV_BFF_REALM || 'CX-Central',
    token: env.DEV_BFF_TOKEN || undefined,
    tokenCommand: env.DEV_BFF_TOKEN_COMMAND || undefined,
    serviceDir: env.DEV_BFF_SERVICE_DIR || join(workspaceRoot, '..', 'dataspace-mgm-service'),
  };
}

// ------------------------------------------------------------------------------------------------ pure helpers (tested)

export function claimsOf(token: string): Record<string, unknown> {
  const payload = token.split('.')[1] ?? '';
  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Record<string, unknown>;
}

/** GET /me from the claims of the person's token (C2-M5 7.5: sub, names, company_id, bpn, resource_access.portal-core.roles). */
export function meOf(person: string, claims: Record<string, unknown>, csrfToken: string) {
  const access = claims.resource_access as Record<string, { roles?: string[] }> | undefined;
  const name = [claims.given_name, claims.family_name].filter((part) => typeof part === 'string' && part).join(' ');
  return {
    id: String(claims.sub ?? ''),
    name: name || person,
    username: person,
    company_id: typeof claims.company_id === 'string' ? claims.company_id : null,
    bpn: typeof claims.bpn === 'string' ? claims.bpn : null,
    permissions: access?.['portal-core']?.roles ?? [],
    csrf_token: csrfToken,
  };
}

/** Only a path of the app: never another origin. */
export function safeReturnTo(value: string | null): string {
  return value && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\') ? value : '/';
}

/** The signed-in person from the cookie; the default person without a cookie, null after logout. */
export function personFrom(cookieHeader: string | undefined, fallback: string): string | null {
  const value = (cookieHeader ?? '')
    .split(';')
    .map((part) => part.trim().split('='))
    .find(([key]) => key === PERSON_COOKIE)?.[1];
  if (value === undefined) {
    return fallback;
  }
  return value === SIGNED_OUT || !PERSON_KEY.test(value) ? null : value;
}

// ------------------------------------------------------------------------------------------------ tokens

class TokenSource {
  private readonly cache = new Map<string, { token: string; exp: number }>();

  constructor(private readonly options: DevBffOptions) {}

  public async get(person: string): Promise<string> {
    if (this.options.token) {
      return this.options.token;
    }
    const cached = this.cache.get(person);
    if (cached && cached.exp - 30 > Date.now() / 1000) {
      return cached.token;
    }
    const token = await this.fetchToken(person);
    const exp = Number(claimsOf(token).exp ?? 0);
    this.cache.set(person, { token, exp });
    return token;
  }

  private async fetchToken(person: string): Promise<string> {
    const { apiUrl, realm, serviceDir, tokenCommand } = this.options;
    if (!tokenCommand) {
      // The in-memory IAM of the scaffold (installation started without IAM_URL) answers at the installation itself.
      const response = await fetch(`${apiUrl}/auth/realms/${realm}/test/tokens/${person}`).catch(() => null);
      if (response?.ok) {
        return ((await response.json()) as { access_token: string }).access_token;
      }
      if (response === null) {
        throw new Error(`The backend does not answer at ${apiUrl}. Start it (see docs/developers/integrate-a-backend-module.md).`);
      }
    }
    const script = join(serviceDir, 'iam', 'test', 'get-token.py');
    if (!tokenCommand && !existsSync(script)) {
      throw new Error(`No token for "${person}": set DEV_BFF_SERVICE_DIR to your dataspace-mgm-service checkout or DEV_BFF_TOKEN_COMMAND.`);
    }
    const command = tokenCommand
      ? ['sh', ['-c', tokenCommand.replaceAll('{person}', person).replaceAll('{realm}', realm)]]
      : ['uv', ['run', 'python', 'iam/test/get-token.py', person, '--realm', realm]];
    const { stdout } = await run(command[0] as string, command[1] as string[], { cwd: serviceDir, timeout: 30_000 });
    const token = stdout.trim().split('\n').pop() ?? '';
    if (token.split('.').length !== 3) {
      throw new Error(`The token command printed no token for "${person}".`);
    }
    return token;
  }
}

// ------------------------------------------------------------------------------------------------ HTTP

function problem(res: ServerResponse, status: number, type: string, detail: string) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/problem+json');
  res.end(JSON.stringify({ type: `urn:dev-bff:problem:${type}`, title: type, status, detail }));
}

const SAFE = new Set(['GET', 'HEAD', 'OPTIONS']);

export function devBff(options: DevBffOptions): Plugin {
  const tokens = new TokenSource(options);
  const csrfToken = randomBytes(24).toString('base64url');

  const handle = async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = new URL(req.url ?? '/', 'http://dev-bff');
    const method = req.method ?? 'GET';
    const person = personFrom(req.headers.cookie, options.person);

    if (url.pathname === '/me' && method === 'GET') {
      if (!person) {
        return problem(res, 401, 'unauthorized', 'Not signed in. Open /auth/login?person=pia');
      }
      const claims = claimsOf(await tokens.get(person));
      res.setHeader('content-type', 'application/json');
      res.setHeader('cache-control', 'no-store');
      return res.end(JSON.stringify(meOf(person, claims, csrfToken)));
    }

    if (url.pathname === '/auth/login' && method === 'GET') {
      const chosen = url.searchParams.get('person') ?? options.person;
      if (!PERSON_KEY.test(chosen)) {
        return problem(res, 400, 'validation', 'person: key of a test person, e.g. pia');
      }
      await tokens.get(chosen); // fails early for an unknown person
      res.setHeader('set-cookie', `${PERSON_COOKIE}=${chosen}; Path=/; HttpOnly; SameSite=Lax`);
      res.statusCode = 302;
      res.setHeader('location', safeReturnTo(url.searchParams.get('return_to')));
      return res.end();
    }

    if (url.pathname === '/auth/logout' && method === 'POST') {
      res.setHeader('set-cookie', `${PERSON_COOKIE}=${SIGNED_OUT}; Path=/; HttpOnly; SameSite=Lax`);
      res.statusCode = 204;
      return res.end();
    }

    if (url.pathname.startsWith('/api/')) {
      if (!SAFE.has(method) && req.headers['x-csrf-token'] !== csrfToken) {
        return problem(res, 403, 'csrf', 'Write requests need the header X-CSRF-Token from GET /me.');
      }
      delete req.headers.cookie; // the session cookie stays at the BFF
      delete req.headers.authorization;
      if (person) {
        req.headers.authorization = `Bearer ${await tokens.get(person)}`;
      }
    }
    return next();
  };

  return {
    name: 'dataspace-mgm-dev-bff',
    apply: 'serve',
    config: () => ({ server: { proxy: { '/api': { target: options.apiUrl, changeOrigin: true } } } }),
    configureServer(server) {
      server.config.logger.info(`  ➜  Dev BFF:  /api → ${options.apiUrl}, signed in as "${options.person}" (switch: /auth/login?person=<key>)`);
      server.middlewares.use((req, res, next) => {
        handle(req, res, next).catch((error: unknown) =>
          problem(res, 502, 'dev-bff', error instanceof Error ? error.message : String(error)),
        );
      });
    },
  };
}
