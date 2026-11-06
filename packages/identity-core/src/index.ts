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

import { GetCurrentSessionUseCase } from './application/useCases/get-current-session.use-case';
import { LoginUseCase } from './application/useCases/login.use-case';
import { LogoutUseCase } from './application/useCases/logout.use-case';
import type { IdentityModule } from './data/identity-module.data';
import type { RedirectPort, SessionRepository } from './domain/repositories/session.repository';
import { BrowserRedirectAdapter, SessionHttpRepository } from './infrastructure/repositories/session-http.repository';

export interface IdentityModuleConfig {
  /** Origin of the BFF; '' = the origin of the UI. */
  bffBaseUrl: string;
  /** Replace the adapters, for tests. */
  sessions?: SessionRepository;
  redirect?: RedirectPort;
}

export function createIdentityModule(config: IdentityModuleConfig): IdentityModule {
  const sessions = config.sessions ?? new SessionHttpRepository(config.bffBaseUrl);
  const redirect = config.redirect ?? new BrowserRedirectAdapter(config.bffBaseUrl);
  return {
    getCurrentSession: new GetCurrentSessionUseCase(sessions),
    login: new LoginUseCase(redirect),
    logout: new LogoutUseCase(sessions),
  };
}

export type { IdentityModule } from './data/identity-module.data';
export type { SessionAnemic } from './domain/anemics/session.anemic';
export type { RedirectPort, SessionRepository } from './domain/repositories/session.repository';
