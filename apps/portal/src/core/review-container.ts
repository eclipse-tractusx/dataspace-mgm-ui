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
 * to the project's license. Human review is required before committing.
 *
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: Codex (GPT-6)
 ********************************************************************************/

import { createHttpReviewModule, createMockReviewModule } from '@dataspace-mgm/c1-m3-core';
import { createReviewStore } from '@dataspace-mgm/c1-m3-state';
import { CsrfTokenStore } from '@dataspace-mgm/core-http';
import type { RuntimeConfig } from '../config';
import { mockRegistrationLink } from './mock-registration-link';
export function createReviewWorkspace(config: RuntimeConfig) {
  if (import.meta.env.VITE_REVIEW_API === 'live') {
    const baseUrl = config.api_base_url.replace(/\/$/, '');
    const common = {
      getCsrfToken: () => CsrfTokenStore.get(),
      onUnauthorized: () =>
        window.location.assign(`/auth/login?return_to=${encodeURIComponent(window.location.pathname)}`),
    };
    return createReviewStore(
      {
        useCases: {
          review: createHttpReviewModule(
            { ...common, baseUrl: `${baseUrl}/c1-m3` },
            { ...common, baseUrl: `${baseUrl}/c1-m2` },
          ),
        },
      },
      { id: '', name: '', permissions: [] },
    );
  }
  // Mock: the applications submitted in onboarding join the fixtures, and the decision reaches the applicant.
  const mock = createMockReviewModule(mockRegistrationLink);
  return createReviewStore({
    useCases: { review: mock.module },
    mock: mock.server,
  });
}
