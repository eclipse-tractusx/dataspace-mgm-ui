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

import { createCoreClient, type CoreModuleConfig } from '@dataspace-mgm/core-http';
import { GetCspRegistrationUseCase } from './application/useCases/get-csp-registration.use-case';
import type { C3M2Module } from './data/c3-m2-module.data';
import type { paths } from './generated/c3-m2-api';
import { CspRegistrationHttpRepository } from './infrastructure/repositories/csp-registration-http.repository';

/** The base path of the module under the app's api_base_url (`servers.url` of specs/c3-m2/openapi.yaml). */
export const C3M2_BASE_PATH = '/c3-m2';

/** Creates the module once per app (composition root); `config.baseUrl` is the module's base URL. */
export function createC3M2Module(config: CoreModuleConfig): C3M2Module {
  return { getCspRegistration: new GetCspRegistrationUseCase(new CspRegistrationHttpRepository(createCoreClient<paths>(config))) };
}

export type { C3M2Module } from './data/c3-m2-module.data';
export type { CspRegistrationAnemic } from './domain/anemics/csp-registration.anemic';
export type { GetCspRegistrationResult } from './domain/data/get-csp-registration-result.data';
export type { CspRegistrationRepository } from './domain/repositories/csp-registration.repository';
export { GetCspRegistrationUseCase } from './application/useCases/get-csp-registration.use-case';
