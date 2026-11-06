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

import { describe, expect, it } from 'vitest';
import { createMockC1M2Ports } from '../domain/testing/create-mock-c1-m2-module';
import { ERIKA_SESSION } from '../domain/testing/fixtures/sessions.fixture';
import { createC1M2UseCases } from './c1-m2-use-cases.factory';
import { CreateApplicationUseCase } from './useCases/create-application.use-case';
import { ListAgreementVersionsUseCase } from './useCases/list-agreement-versions.use-case';
import { ListCountriesUseCase } from './useCases/list-countries.use-case';

describe('createC1M2UseCases', () => {
  it('creates one use case per operation on the matching port', async () => {
    const ports = createMockC1M2Ports(ERIKA_SESSION, { applications: [] });
    const module = createC1M2UseCases(ports);
    expect(module.listCountries).toBeInstanceOf(ListCountriesUseCase);
    expect(module.createApplication).toBeInstanceOf(CreateApplicationUseCase);
    expect(module.listAgreementVersions).toBeInstanceOf(ListAgreementVersionsUseCase);
    await module.listCountries.execute();
    await module.listOwnApplications.execute();
    expect(ports.applications.calls).toEqual(['listOwn']);
  });
});
