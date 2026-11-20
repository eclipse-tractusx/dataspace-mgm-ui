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

import { BFF } from '../constants/bff.constant.ts';
import type { Session } from '../data/session.data.ts';

const text = (value: unknown): string | null => (typeof value === 'string' && value ? value : null);

/**
 * GET /me: the same shape as the development BFF (apps/portal/dev-bff/dev-bff.ts, `meOf`), from the claims of the
 * access token (C2-M5 7.5: sub, names, company_id, bpn, resource_access.portal-core.roles) plus the CSRF token of the
 * session. Never contains a token.
 */
export function meOf(session: Pick<Session, 'subject' | 'username' | 'claims' | 'csrfToken'>) {
  const { claims } = session;
  const access = claims.resource_access as Record<string, { roles?: unknown } | undefined> | null | undefined;
  const roles = typeof access === 'object' && access !== null ? access[BFF.PERMISSIONS_CLIENT]?.roles : undefined;
  const username = text(claims.preferred_username) ?? session.username ?? session.subject;
  const name = [claims.given_name, claims.family_name].filter((part) => typeof part === 'string' && part).join(' ');
  return {
    id: session.subject,
    name: name || text(claims.name) || username,
    username,
    company_id: text(claims.company_id),
    bpn: text(claims.bpn),
    permissions: Array.isArray(roles) ? roles.filter((role): role is string => typeof role === 'string') : [],
    csrf_token: session.csrfToken,
  };
}
