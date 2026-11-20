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
 * Assisted-By: Claude Code (claude-fable-5-2)
 ********************************************************************************/

import { CoreHttpException, HTTP, ensureData, type CoreResponse } from '@dataspace-mgm/core-http';
import { C1M2ProblemException } from '../../domain/c1-m2-problem.exception';
import { ProblemMapper } from '../mappers/problem.mapper';

/**
 * Reads the answer of a call of the generated client, as the ports of C1-M2 define it. `ensureData` of core-http keeps
 * only `status`, `type` and `title` of a Problem Details body; the result unions of C1-M2 need its extension fields
 * (`reason`, `fields`, `missing`, `existingApplicationId`, ...), so a 4xx Problem Details of the module is thrown as
 * `C1M2ProblemException` first. Everything else goes through `ensureData` (`CoreHttpException`).
 */
export class C1M2Response {
  /** The data of a successful answer. */
  public static async data<T>(call: Promise<CoreResponse<T>>): Promise<T> {
    const result = await call;
    const problem = ProblemMapper.toProblem(result.response.status, result.error);
    if (problem) {
      throw new C1M2ProblemException(problem);
    }
    return ensureData(Promise.resolve(result));
  }

  /** null for a 404, where the port defines it so; every other error is thrown on. */
  public static async orNull<T>(call: Promise<T>): Promise<T | null> {
    try {
      return await call;
    } catch (error) {
      if (error instanceof CoreHttpException && error.status === HTTP.NOT_FOUND) {
        return null;
      }
      throw error;
    }
  }
}
