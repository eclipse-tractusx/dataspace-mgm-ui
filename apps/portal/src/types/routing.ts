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

/** Which part of taking part in the dataspace a feature serves; groups the apps in the All apps view. */
export type FeatureCategory = 'start' | 'discover' | 'connect' | 'exchange' | 'govern';

export interface FeatureConfig {
  name: string;
  /** One sentence for the "All apps" view. */
  description: string;
  category: FeatureCategory;
  icon: ReactElement;
  navigationPath: string;
  disabled: boolean;
  routes: FeatureRoute[];
}

export interface NavigationItem {
  name: string;
  description: string;
  category: FeatureCategory;
  icon: ReactElement;
  path: string;
  disabled: boolean;
}
