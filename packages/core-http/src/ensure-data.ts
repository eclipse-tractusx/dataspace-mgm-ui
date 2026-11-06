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

import { CoreHttpException } from './core-http.exception';
import type { CoreResponse } from './data/core-module-config.data';

function problemOf(error: unknown): { type: string | null; title: string | null } {
  if (typeof error !== 'object' || error === null) {
    return { type: null, title: null };
  }
  const problem = error as Record<string, unknown>;
  return {
    type: typeof problem.type === 'string' ? problem.type : null,
    title: typeof problem.title === 'string' ? problem.title : null,
  };
}

/** The body of a successful call; otherwise a CoreHttpException with the status and the Problem Details type. */
export async function ensureData<T>(call: Promise<CoreResponse<T>>): Promise<T> {
  const { data, error, response } = await call;
  if (error !== undefined || !response.ok) {
    const problem = problemOf(error);
    throw new CoreHttpException(response.status, problem.type, problem.title ?? `${response.status} ${response.url}`);
  }
  return data as T;
}

export async function ensureOk(call: Promise<CoreResponse<unknown>>): Promise<void> {
  await ensureData(call);
}
