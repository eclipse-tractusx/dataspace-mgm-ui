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

import type { CoreHttpErrorData } from '@dataspace-mgm/core-http';
import type { OperationResult, OperationSuccess } from '../data/operation-result.data';
import type { ValidationErrorData } from '../data/validation-error.data';

const PROBLEM = /^urn:[a-z0-9-]+:problem:([a-z0-9-]+)$/;
const EXPECTED_PROBLEM_STATUSES: ReadonlyArray<number> = [400, 409];

/** Turns the answer of a call into the result union of the use cases. */
export class OperationResultFactory {
  public static success<T>(data: T): OperationSuccess<T> {
    return { status: 'success', data };
  }

  public static invalid<T>(errors: ReadonlyArray<ValidationErrorData>): OperationResult<T> {
    return { status: 'invalid', errors };
  }

  /** 404 and 403 by status; a 400 or 409 with a Problem Details type of a module as `rejected`; the rest `failed`. */
  public static fromError<T>(error: CoreHttpErrorData): OperationResult<T> {
    if (error.status === 404) {
      return { status: 'not-found' };
    }
    if (error.status === 403) {
      return { status: 'forbidden' };
    }
    const problem = error.problemType?.match(PROBLEM)?.[1];
    if (problem && error.status !== null && EXPECTED_PROBLEM_STATUSES.includes(error.status)) {
      return { status: 'rejected', problem, error };
    }
    return { status: 'failed', error };
  }
}
