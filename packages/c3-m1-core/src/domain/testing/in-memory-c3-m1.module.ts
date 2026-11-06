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

import { c3m1ModuleFrom } from '../../c3-m1-module.factory';
import type { C3M1Module } from '../../data/c3-m1-module.data';
import { InMemoryC3M1Store, type InMemoryC3M1StoreOptions } from './in-memory-c3-m1.store';
import { InMemoryChangeRequestReviewRepository } from './in-memory-change-request-review.repository';
import { InMemoryCompanyRoleRepository } from './in-memory-company-role.repository';
import { InMemoryOspCompanyRepository } from './in-memory-osp-company.repository';
import { InMemoryOwnChangeRequestRepository } from './in-memory-own-change-request.repository';
import { InMemoryOwnCompanyRepository } from './in-memory-own-company.repository';

/** C3-M1 completely in memory (mock mode, page tests): the same use cases as createC3M1Module, on one shared store. */
export function createInMemoryC3M1Module(options: InMemoryC3M1StoreOptions): { module: C3M1Module; store: InMemoryC3M1Store } {
  const store = new InMemoryC3M1Store(options);
  const module = c3m1ModuleFrom({
    companies: new InMemoryOwnCompanyRepository(store),
    ownChangeRequests: new InMemoryOwnChangeRequestRepository(store),
    companyRoles: new InMemoryCompanyRoleRepository(store),
    ospCompanies: new InMemoryOspCompanyRepository(store),
    reviews: new InMemoryChangeRequestReviewRepository(store),
  });
  return { module, store };
}
