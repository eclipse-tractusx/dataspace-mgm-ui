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
import type { C1M2ProblemData } from './data/c1-m2-problem.data';

/**
 * A 4xx Problem Details answer of C1-M2 with all its extension fields. `CoreHttpException` keeps only `status`, `type`
 * and `title`; C1-M2 needs `reason`, `fields`, `missing`, `existingApplicationId`, ... to render each result. Every
 * adapter of the ports (in-memory now, HTTP in phase 3) throws this for the module's 4xx answers.
 */
export class C1M2ProblemException extends CoreHttpException {
  public readonly problem: C1M2ProblemData;

  constructor(problem: C1M2ProblemData) {
    super(problem.status, problem.type, problem.title ?? problem.type);
    this.name = 'C1M2ProblemException';
    this.problem = problem;
  }
}
