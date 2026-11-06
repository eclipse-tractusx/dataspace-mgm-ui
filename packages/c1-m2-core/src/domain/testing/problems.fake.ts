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

import { C1M2ProblemException } from '../c1-m2-problem.exception';
import type { C1M2ProblemData } from '../data/c1-m2-problem.data';
import type { ValidationError } from '../data/c1-m2-shapes.data';

type Extension = Omit<C1M2ProblemData, 'status' | 'type' | 'title'>;

/** A Problem Details answer of the fake, with the type and HTTP status of C1-M2 README 12. */
export function problem(name: string, status: number, title: string, extension: Extension = {}): C1M2ProblemException {
  return new C1M2ProblemException({ status, type: `urn:c1-m2:problem:${name}`, title, ...extension });
}

/** 400 `validation` with `errors` (messages in English, as the backend sends them; the UI maps the `type`). */
export function validationProblem(errors: ReadonlyArray<ValidationError>): C1M2ProblemException {
  return problem('validation', 400, 'Validation failed', { errors });
}

export function forbiddenProblem(): C1M2ProblemException {
  return problem('forbidden', 403, 'Permission missing');
}

export function invalidStateProblem(): C1M2ProblemException {
  return problem('invalid-state', 409, 'The status or verification path does not allow this operation');
}

/** Throws 400 `validation` when there is at least one error. */
export function throwIfInvalid(errors: ReadonlyArray<ValidationError>): void {
  if (errors.length > 0) {
    throw validationProblem(errors);
  }
}
