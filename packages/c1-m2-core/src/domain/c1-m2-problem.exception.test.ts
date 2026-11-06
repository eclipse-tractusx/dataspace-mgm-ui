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

import { CoreHttpException } from '@dataspace-mgm/core-http';
import { describe, expect, it } from 'vitest';
import { C1M2ProblemException } from './c1-m2-problem.exception';

describe('C1M2ProblemException', () => {
  it('is a CoreHttpException that keeps every extension field', () => {
    const problem = { status: 409, type: 'urn:c1-m2:problem:open-application-exists', title: 'Open application', existingApplicationId: 'a1' };
    const exception = new C1M2ProblemException(problem);
    expect(exception).toBeInstanceOf(CoreHttpException);
    expect(exception).toMatchObject({ name: 'C1M2ProblemException', status: 409, problemType: problem.type, message: 'Open application', problem });
  });

  it('uses the type as message without a title', () => {
    expect(new C1M2ProblemException({ status: 400, type: 'urn:c1-m2:problem:validation' }).message).toBe('urn:c1-m2:problem:validation');
  });
});
