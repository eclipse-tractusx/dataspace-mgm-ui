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
import type { ValidationErrorData } from './validation-error.data';

/** The call succeeded; `data` is what the module returned, mapped to the anemics. */
export interface OperationSuccess<T> {
  status: 'success';
  data: T;
}

/** The input failed the local UX pre-check; nothing was sent. */
export interface OperationInvalid {
  status: 'invalid';
  errors: ReadonlyArray<ValidationErrorData>;
}

/** 404: unknown, or outside the scope of the person (scope `company`). */
export interface OperationNotFound {
  status: 'not-found';
}

/** 403: the person lacks the operation's permission (`x-permission`). */
export interface OperationForbidden {
  status: 'forbidden';
}

/**
 * 400 or 409 with a Problem Details type of the module: an expected answer the page explains, e.g. `same-person`,
 * `last-role`, `change-request-open`. `problem` is the name after `urn:<module>:problem:`.
 */
export interface OperationRejected {
  status: 'rejected';
  problem: string;
  error: CoreHttpErrorData;
}

/** Everything else: 401, 5xx (501 `not-implemented` of a stand-in, 502 of the BFF or upstream), network errors. */
export interface OperationFailed {
  status: 'failed';
  error: CoreHttpErrorData;
}

/** The result of every use case of the participant management that reads or writes through the API. */
export type OperationResult<T> =
  | OperationSuccess<T>
  | OperationInvalid
  | OperationNotFound
  | OperationForbidden
  | OperationRejected
  | OperationFailed;
