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

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { loadConfig, type RuntimeConfig } from './config';
import { createCoreModules, type CoreModules } from './core/container';

const container = document.getElementById('root');
if (!container) throw new Error('The element #root is missing in index.html');

/**
 * The core packages of the app: the real ones, or in mock mode (VITE_USE_MOCKS=true) the in-memory ones; the
 * environment chip then says "mock data". The condition stays literal here (not MOCK_MODE): vite.config.ts replaces it
 * at build time, so without mock mode the bundler drops the branch and emits no mock chunk.
 */
async function coreModules(config: RuntimeConfig): Promise<{ config: RuntimeConfig; modules: CoreModules }> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { createMockCoreModules } = await import('./core/mock-container');
    return {
      config: { ...config, environment: 'mock data' },
      modules: createMockCoreModules(import.meta.env.VITE_MOCK_PERSON),
    };
  }
  return { config, modules: createCoreModules(config) };
}

loadConfig()
  .then(coreModules)
  .then(async ({ config, modules }) => {
    if (window.location.pathname === '/mock-eudi-sign-in') {
      const { MockEudiSignIn } = await import('./core/mock-eudi-sign-in');
      createRoot(container).render(<MockEudiSignIn />);
      return;
    }
    createRoot(container).render(
      <StrictMode>
        <App config={config} modules={modules} />
      </StrictMode>,
    );
  });
