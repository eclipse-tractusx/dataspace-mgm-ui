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

import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createBff } from '../create-bff.ts';
import type { BffConfig } from '../data/bff-config.data.ts';
import type { Bff } from '../data/bff-context.data.ts';
import { loadConfig } from '../load-config.ts';
import type { Answer } from './call.ts';
import { startFakeBackend, type FakeBackend } from './fake-backend.ts';
import { startFakeOidcProvider, type FakeOidcProvider } from './fake-oidc-provider.ts';
import { TestBrowser } from './test-browser.ts';

export const CLIENT_ID = 'portal-ui';
export const INDEX_HTML = '<!doctype html><title>portal</title><div id="root"></div>';
export const SECRET = 'TOP-SECRET-outside-the-static-directory';

export interface TestBff {
  port: number;
  origin: string;
  bff: Bff;
  browser(): TestBrowser;
}

export interface TestWorld {
  clock: { now: number };
  provider: FakeOidcProvider;
  backend: FakeBackend;
  /** Every line the BFFs of this world logged, as JSON. */
  logs: string[];
  /** Starts a BFF on a free port; `change` replaces settings after they were read from the environment. */
  start(change?: (config: BffConfig) => Partial<BffConfig>, env?: Record<string, string>): Promise<TestBff>;
  close(): Promise<void>;
}

/** The fake identity provider, the fake backend, a built "portal" on disk and a clock the tests move. */
export async function createTestWorld(): Promise<TestWorld> {
  const clock = { now: Date.now() };
  const provider = await startFakeOidcProvider(CLIENT_ID, () => clock.now);
  const backend = await startFakeBackend();
  const logs: string[] = [];
  const closers: Array<() => Promise<void>> = [];

  const directory = mkdtempSync(join(tmpdir(), 'portal-bff-test-'));
  const staticDir = join(directory, 'public');
  mkdirSync(join(staticDir, 'assets'), { recursive: true });
  writeFileSync(join(staticDir, 'index.html'), INDEX_HTML);
  writeFileSync(join(staticDir, 'assets', 'app.js'), 'console.log("portal")');
  writeFileSync(join(directory, 'secret.txt'), SECRET);
  writeFileSync(join(directory, 'config.json'), '{"api_base_url":"/api","environment":"test"}');
  symlinkSync(join(directory, 'secret.txt'), join(staticDir, 'link.txt'));

  return {
    clock,
    provider,
    backend,
    logs,
    async start(change = () => ({}), env = {}) {
      const server = createServer();
      await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
      const port = (server.address() as AddressInfo).port;
      const origin = `http://127.0.0.1:${port}`;
      const config = loadConfig({
        BFF_PUBLIC_URL: origin,
        BFF_ISSUER_URL: provider.issuer,
        BFF_CLIENT_ID: CLIENT_ID,
        BFF_BACKEND_URL: backend.url,
        BFF_STATIC_DIR: staticDir,
        BFF_CONFIG_FILE: join(directory, 'config.json'),
        BFF_SESSION_IDLE_SECONDS: '1800',
        BFF_SESSION_MAX_SECONDS: '7200',
        ...env,
      });
      const bff = createBff(
        { ...config, ...change(config) },
        { now: () => clock.now, upstreamTimeoutMs: 300, log: (level, event, fields) => logs.push(JSON.stringify({ level, event, ...fields })) },
      );
      server.on('request', bff.handler);
      closers.push(
        () =>
          new Promise((resolve) => {
            bff.close();
            server.closeAllConnections();
            server.close(() => resolve());
          }),
      );
      return { port, origin: bff.context.config.publicOrigin, bff, browser: () => new TestBrowser(port) };
    },
    async close() {
      await Promise.all(closers.map((close) => close()));
      await provider.close();
      await backend.close();
      rmSync(directory, { recursive: true, force: true });
    },
  };
}

export interface SignIn {
  start: Answer;
  callbackUrl: URL;
  callbackPath: string;
  done: Answer;
}

/** The whole sign-in as a browser does it: /auth/login → provider → /auth/callback. */
export async function signIn(browser: TestBrowser, returnTo?: string): Promise<SignIn> {
  const start = await browser.call(`/auth/login${returnTo === undefined ? '' : `?return_to=${encodeURIComponent(returnTo)}`}`);
  const atProvider = await fetch(start.headers.location as string, { redirect: 'manual' });
  const callbackUrl = new URL(atProvider.headers.get('location') as string);
  const callbackPath = `${callbackUrl.pathname}${callbackUrl.search}`;
  const done = await browser.call(callbackPath);
  return { start, callbackUrl, callbackPath, done };
}
