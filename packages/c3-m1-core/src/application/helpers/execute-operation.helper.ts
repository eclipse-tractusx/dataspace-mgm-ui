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

import { CoreHttpErrorFactory } from '@dataspace-mgm/core-http';
import type { OperationResult } from '../../domain/data/operation-result.data';
import { OperationResultFactory } from '../../domain/factories/operation-result.factory';

/** Runs one call of a port and returns its outcome as data, never as an exception. */
export async function executeOperation<T>(call: () => Promise<T>): Promise<OperationResult<T>> {
  try {
    return OperationResultFactory.success(await call());
  } catch (error) {
    return OperationResultFactory.fromError(CoreHttpErrorFactory.from(error));
  }
}
