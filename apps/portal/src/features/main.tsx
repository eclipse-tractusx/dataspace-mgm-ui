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

import {
  AppRegistrationOutlinedIcon,
  BusinessOutlinedIcon,
  CableOutlinedIcon,
  ManageAccountsOutlinedIcon,
  StorefrontOutlinedIcon,
} from '@dataspace-mgm/ui-mui';
import type { FeatureCategory, FeatureConfig, NavigationItem } from '../types/routing';
import { homeFeature } from './home/routes';

/**
 * Features that are announced but not built yet: shown greyed out as "coming soon", without routes
 * (like the Status placeholder of the Industry Core Hub). Replace one by its feature folder when it arrives.
 */
const upcoming = (
  name: string,
  description: string,
  category: FeatureCategory,
  icon: FeatureConfig['icon'],
  path: string,
): FeatureConfig => ({
  name,
  description,
  category,
  icon,
  navigationPath: path,
  disabled: true,
  routes: [],
});

/**
 * Registry of the feature modules. Add a feature: create src/features/<feature>/ with
 * pages/, routes.tsx (one FeatureConfig) and index.ts, then add it to this list.
 * The order is the order in the sidebar, the phone's bottom bar (first entries) and the "All apps" views.
 * Notifications are not a feature here: the shell has its own bell (sidebar on desktop, header on phones).
 */
export const allFeatures: FeatureConfig[] = [
  homeFeature,
  upcoming('Onboarding', 'Register your company and follow its application.', 'connect', <AppRegistrationOutlinedIcon />, '/onboarding'),
  upcoming('Company', 'Company data, business partner number and credentials.', 'connect', <BusinessOutlinedIcon />, '/company'),
  upcoming('Users & roles', 'Invite people, assign roles and manage technical users.', 'govern', <ManageAccountsOutlinedIcon />, '/users'),
  upcoming('Connectors', 'Register and monitor the connectors of your company.', 'exchange', <CableOutlinedIcon />, '/connectors'),
  upcoming('Apps', 'Find and subscribe to apps and services of the dataspace.', 'discover', <StorefrontOutlinedIcon />, '/apps'),
];

/** The navigation items of the sidebar, the bottom bar and the "All apps" view. */
export const features: NavigationItem[] = allFeatures.map((feature) => ({
  name: feature.name,
  description: feature.description,
  category: feature.category,
  icon: feature.icon,
  path: feature.navigationPath,
  disabled: feature.disabled,
}));

/** The routes of all enabled features. */
export function getAllRoutes() {
  return allFeatures.filter((feature) => !feature.disabled).flatMap((feature) => feature.routes);
}
