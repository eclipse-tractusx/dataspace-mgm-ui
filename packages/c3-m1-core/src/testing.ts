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

/** Entry point @dataspace-mgm/c3-m1-core/testing: in-memory adapters and test data for tests of pages and use cases. */
export { InMemoryCompanyRepository, OSP_A_COMPANY } from './domain/testing/in-memory-company.repository';
export { InMemoryC3M1Store, c3m1Problem, type InMemoryC3M1StoreOptions } from './domain/testing/in-memory-c3-m1.store';
export { InMemoryOwnCompanyRepository } from './domain/testing/in-memory-own-company.repository';
export { InMemoryOwnChangeRequestRepository } from './domain/testing/in-memory-own-change-request.repository';
export { InMemoryCompanyRoleRepository } from './domain/testing/in-memory-company-role.repository';
export { InMemoryOspCompanyRepository } from './domain/testing/in-memory-osp-company.repository';
export { InMemoryChangeRequestReviewRepository } from './domain/testing/in-memory-change-request-review.repository';
export { createInMemoryC3M1Module } from './domain/testing/in-memory-c3-m1.module';
export * from './domain/testing/participants.fixtures';
