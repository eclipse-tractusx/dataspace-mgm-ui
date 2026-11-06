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
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import { workspaceAliases } from '../../workspace.aliases';
import { devBff, devBffOptions } from './dev-bff/dev-bff';

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url));
const { version } = JSON.parse(readFileSync(here('../../package.json'), 'utf8')) as { version: string };

// `npm start` runs the dev BFF (dev-bff/dev-bff.ts): /me, /auth/* and /api → the backend, with the token of a test
// person. Its settings come from DEV_BFF_* in the environment or in apps/portal/.env.local (git-ignored).
// VITE_USE_MOCKS=true runs the portal on mock data (src/core/mock-mode.ts). It is defined as a constant, so a build
// without it drops the mock container entirely instead of shipping it as an unused chunk.
export default defineConfig(({ mode }) => ({
  root: here('.'),
  cacheDir: here('../../node_modules/.vite/apps/portal'),
  plugins: [react(), devBff(devBffOptions(loadEnv(mode, here('.'), 'DEV_BFF_'), here('../..')))],
  define: {
    __APP_VERSION__: JSON.stringify(version),
    'import.meta.env.VITE_USE_MOCKS': JSON.stringify(
      loadEnv(mode, here('.'), 'VITE_').VITE_USE_MOCKS === 'true' ? 'true' : '',
    ),
  },
  resolve: { alias: workspaceAliases },
  server: { host: 'localhost', port: 4200 },
  preview: { host: 'localhost', port: 4300 },
  build: {
    outDir: here('../../dist/apps/portal'),
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'dev-bff/**/*.test.ts'],
  },
}));
