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

// Outcomes several C4-M1 use cases share.

/** 403 `urn:c4-m1:problem:forbidden`: the person lacks the permission of the operation. */
export interface C4M1Forbidden {
  status: 'forbidden';
}

/** 404 `urn:c4-m1:problem:not-found`: unknown, or (scope `company`) not the person's own company. */
export interface C4M1NotFound {
  status: 'not-found';
}

/** 409, e.g. `urn:c4-m1:problem:invalid-state`: the status of the credential does not allow the operation. */
export interface C4M1Conflict {
  status: 'conflict';
  error: CoreHttpErrorData;
}

/** Every other error, with the HTTP status and the Problem Details type for the UI to map to a text. */
export interface C4M1Failed {
  status: 'failed';
  error: CoreHttpErrorData;
}
