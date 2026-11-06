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

import type { C1M2Module } from '@dataspace-mgm/c1-m2-core';
import { createC3M1Module, C3M1_BASE_PATH, type C3M1Module } from '@dataspace-mgm/c3-m1-core';
import { createC2M3Module, C2_M3_BASE_PATH, type C2M3Module } from '@dataspace-mgm/c2-m3-core';
import { createC2M2Module, C2_M2_BASE_PATH, type C2M2Module } from '@dataspace-mgm/c2-m2-core';
import { createC11M1Module, C11M1_BASE_PATH, type C11M1Module } from '@dataspace-mgm/c11-m1-core';
import { createC3M1Module, C3M1_BASE_PATH, type C3M1Module } from '@dataspace-mgm/c3-m1-core';
import type { C4M1Module } from '@dataspace-mgm/c4-m1-core';
import { CsrfTokenStore, type CoreModuleConfig } from '@dataspace-mgm/core-http';
import { createIdentityModule, type IdentityModule } from '@dataspace-mgm/identity-core';
import type { RuntimeConfig } from '../config';
import { ConfigurableRedirect, createSpecSessionRepository, isSpecLoginResponseEnabled } from './mock-container';

/** Every core package the portal uses, created once (composition root). Pages reach them through useCoreModules(). */
export interface CoreModules {
  identity: IdentityModule;
  c3m1: C3M1Module;
  /**
   * Proof of concept (feature `wallets`, stage 'poc'): C4-M1 Credentials, wired only in mock-container.ts on its
   * in-memory adapters. Pages treat a missing module as "not connected". Required here once its HTTP adapter exists.
   */
  c4m1?: C4M1Module;
  /**
   * C1-M2 Registration, proof of concept: no HTTP adapter yet, wired only in mock-container.ts. Pages check that it is
   * there (undefined outside mock mode); it becomes required here with createC1M2Module (skill build-feature).
   */
  c1m2?: C1M2Module;
  c2m3: C2M3Module;
  c2m2: C2M2Module;
  c11m1: C11M1Module;
}

/**
 * Creates the core packages from the runtime configuration. Add a backend module here: `<module>: create<Module>Module(
 * moduleConfig(<MODULE>_BASE_PATH))`, then add it to CoreModules and to mock-container.ts (mock mode).
 */
export function createCoreModules(config: RuntimeConfig): CoreModules {
  const identity = createIdentityModule({
    bffBaseUrl: '',
    ...(isSpecLoginResponseEnabled() ? { sessions: createSpecSessionRepository() } : {}),
    redirect: new ConfigurableRedirect('', 'normal'),
  });
  const moduleConfig = (basePath: string): CoreModuleConfig => ({
    baseUrl: `${config.api_base_url.replace(/\/$/, '')}${basePath}`,
    getCsrfToken: () => CsrfTokenStore.get(),
    onUnauthorized: () => identity.login.execute(window.location.pathname),
  });
  return {
    identity,
    c3m1: createC3M1Module(moduleConfig(C3M1_BASE_PATH)),
    c2m2: createC2M2Module(moduleConfig(C2_M2_BASE_PATH)),
    c2m3: createC2M3Module(moduleConfig(C2_M3_BASE_PATH)),
    c11m1: createC11M1Module(moduleConfig(C11M1_BASE_PATH)),
  };
}
