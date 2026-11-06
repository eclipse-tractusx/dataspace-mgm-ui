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

import { CoreHttpException, HTTP } from '@dataspace-mgm/core-http';
import type { SessionAnemic } from '../../domain/anemics/session.anemic';
import type { RedirectPort, SessionRepository } from '../../domain/repositories/session.repository';
import { AUTH_PATH } from '../constants/auth-path.constant';
import type { MeDto } from '../data/identity-infrastructure.data';
import { SessionMapper } from '../mappers/session.mapper';

export class SessionHttpRepository implements SessionRepository {
  constructor(
    private readonly bffBaseUrl: string,
    private readonly fetchImpl: typeof fetch = (...args) => fetch(...args),
  ) {}

  public async getCurrent(): Promise<SessionAnemic | null> {
    const response = await this.fetchImpl(`${this.bffBaseUrl}${AUTH_PATH.ME}`, {
      credentials: 'include',
      headers: { accept: 'application/json' },
    });
    if (response.status === HTTP.UNAUTHORIZED) {
      return null;
    }
    if (!response.ok) {
      const problem = (await response.json().catch(() => ({}))) as { type?: string; title?: string; detail?: string };
      throw new CoreHttpException(response.status, problem.type ?? null, problem.detail ?? problem.title ?? `${response.status} /me`);
    }
    return SessionMapper.toAnemic((await response.json()) as MeDto);
  }

  public async logout(csrfToken: string | null): Promise<void> {
    await this.fetchImpl(`${this.bffBaseUrl}${AUTH_PATH.LOGOUT}`, {
      method: 'POST',
      credentials: 'include',
      headers: csrfToken ? { [HTTP.CSRF_HEADER]: csrfToken } : {},
    });
  }
}

/** Leaves the app for the sign-in of the BFF (the only place that touches window). */
export class BrowserRedirectAdapter implements RedirectPort {
  constructor(private readonly bffBaseUrl: string) {}

  public toLogin(returnTo: string): void {
    window.location.assign(`${this.bffBaseUrl}${AUTH_PATH.LOGIN}?return_to=${encodeURIComponent(returnTo)}`);
  }
}
