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

import type { ReactElement } from 'react';

/**
 * Feature modules, as in the Industry Core Hub frontend: every feature folder under
 * src/features/<feature>/ exports one FeatureConfig from its routes.tsx, and
 * src/features/main.tsx registers it. The layout builds the navigation and the router
 * builds the routes from that registry, so adding a feature never touches the shell.
 */
export interface FeatureRoute {
  path?: string;
  index?: boolean;
  element: ReactElement;
  meta?: {
    title?: string;
    description?: string;
  };
}

/** What a feature is for; groups the services in the All services view. */
export type FeatureCategory = 'start' | 'onboarding' | 'participants' | 'as-a-service' | 'network';

export interface FeatureConfig {
  name: string;
  /** One sentence for the "All services" view. */
  description: string;
  /** The version of the service: the portal's own for its pages, the module's API version for the others. */
  version: string;
  category: FeatureCategory;
  icon: ReactElement;
  navigationPath: string;
  disabled: boolean;
  /**
   * 'poc': a proof of concept on mock data (skill build-poc). It is routed only in mock mode (VITE_USE_MOCKS=true)
   * and shows as "coming soon" otherwise. Remove it once the feature talks to its backend module (skill build-feature).
   */
  stage?: 'poc';
  routes: FeatureRoute[];
}

export interface NavigationItem {
  name: string;
  description: string;
  version: string;
  category: FeatureCategory;
  icon: ReactElement;
  path: string;
  disabled: boolean;
}
