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
import { OperationResultFactory } from './operation-result.factory';

const error = (status: number | null, problemType: string | null = null) => ({ status, problemType, message: 'm' });

describe('OperationResultFactory.fromError', () => {
  it('maps 404 to not-found and 403 to forbidden', () => {
    expect(OperationResultFactory.fromError(error(404, 'urn:c3-m1:problem:not-found'))).toEqual({ status: 'not-found' });
    expect(OperationResultFactory.fromError(error(403, 'urn:c3-m1:problem:forbidden'))).toEqual({ status: 'forbidden' });
  });

  it('maps 400 and 409 with a module problem type to rejected with its name', () => {
    expect(OperationResultFactory.fromError(error(409, 'urn:c3-m1:problem:same-person'))).toMatchObject({ status: 'rejected', problem: 'same-person' });
    expect(OperationResultFactory.fromError(error(400, 'urn:c3-m1:problem:consent-missing'))).toMatchObject({ status: 'rejected', problem: 'consent-missing' });
  });

  it.each([
    [401, 'urn:portal:problem:unauthorized'],
    [501, 'urn:c3-m1:problem:not-implemented'],
    [502, 'urn:c3-m1:problem:upstream-error'],
    [409, null],
    [409, 'about:blank'],
    [null, null],
  ])('keeps %s (%s) as failed', (status, type) => {
    expect(OperationResultFactory.fromError(error(status, type))).toEqual({ status: 'failed', error: error(status, type) });
  });
});
