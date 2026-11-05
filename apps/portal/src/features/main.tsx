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

import type { FeatureConfig, NavigationItem } from '../types/routing';
import { homeFeature } from './home/routes';

/**
 * Registry of the feature modules. Add a feature: create src/features/<feature>/ with
 * pages/, routes.tsx (one FeatureConfig) and index.ts, then add it to this list.
 * Set `disabled: true` to show a feature in the navigation before it is ready.
 */
export const allFeatures: FeatureConfig[] = [homeFeature];

/** The navigation items of the sidebar. */
export const features: NavigationItem[] = allFeatures.map((feature) => ({
  name: feature.name,
  icon: feature.icon,
  path: feature.navigationPath,
  disabled: feature.disabled,
}));

/** The routes of all enabled features. */
export function getAllRoutes() {
  return allFeatures.filter((feature) => !feature.disabled).flatMap((feature) => feature.routes);
}
