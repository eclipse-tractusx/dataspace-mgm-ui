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
import { C4M1_TEST_COMPANY_IDS } from './c4-m1-test-ids.fixtures';
import { COMPANY_CREDENTIALS } from './company-credentials.fixtures';
import { CATENA_X_DATASPACE, SEMICONDUCTOR_DATASPACE } from './dataspace.fixtures';
import { InMemoryCompanyCredentialRepository } from './in-memory-company-credential.repository';

describe('InMemoryCompanyCredentialRepository', () => {
  it('answers null (404) for a company it does not hold, inherited object keys included', async () => {
    const repository = new InMemoryCompanyCredentialRepository({ [C4M1_TEST_COMPANY_IDS.beispielMaschinenbau]: COMPANY_CREDENTIALS.none });
    expect(await repository.listCompanyCredentials('toString')).toBeNull();
    expect(await repository.listCompanyCredentials(C4M1_TEST_COMPANY_IDS.beispielMaschinenbau)).toBe(COMPANY_CREDENTIALS.none);
  });

  it('carries a dataspace per credential: Catena-X, and a second dataspace in the outlook variant', () => {
    expect(COMPANY_CREDENTIALS.issued.every((credential) => credential.dataspace === CATENA_X_DATASPACE)).toBe(true);
    expect(COMPANY_CREDENTIALS.twoDataspaces.map((credential) => credential.dataspace.mark)).toEqual(['CX', 'CX', 'SC']);
    expect(SEMICONDUCTOR_DATASPACE.logoUrl).toBeNull();
  });
});
