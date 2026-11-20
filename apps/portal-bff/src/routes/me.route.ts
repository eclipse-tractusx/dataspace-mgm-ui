/********************************************************************************
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

import type { IncomingMessage, ServerResponse } from 'node:http';
import type { BffContext } from '../data/bff-context.data.ts';
import { sendJson } from '../http/respond.ts';
import { meOf } from '../session/me-of.ts';
import { ensureFreshToken, sendProviderUnavailable, sendUnauthorized, sessionOf } from './session-access.ts';

/** GET /me: who is signed in, with the permission keys and the CSRF token; 401 when nobody is. */
export async function me(context: BffContext, req: IncomingMessage, res: ServerResponse): Promise<void> {
  const session = sessionOf(context, req);
  if (!session) {
    return sendUnauthorized(context, res);
  }
  const state = await ensureFreshToken(context, session);
  if (state === 'ended') {
    return sendUnauthorized(context, res);
  }
  if (state === 'unavailable') {
    return sendProviderUnavailable(res);
  }
  sendJson(res, 200, meOf(session));
}
