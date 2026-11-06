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
  AccountBalanceWalletOutlinedIcon,
  AppRegistrationOutlinedIcon,
  CableOutlinedIcon,
  HubOutlinedIcon,
  StorefrontOutlinedIcon,
} from '@dataspace-mgm/ui-mui';
import type { FeatureCategory, FeatureConfig, NavigationItem } from '../types/routing';
import { homeFeature } from './home/routes';
import { participantsFeature } from './participants/routes';

/**
 * Features that are announced but not built yet: shown greyed out as "coming soon", without routes. Their version
 * is the API version of the backend module behind them (portal-backend-spec)
 * (like the Status placeholder of the Industry Core Hub). Replace one by its feature folder when it arrives.
 */
const upcoming = (
  name: string,
  description: string,
  category: FeatureCategory,
  icon: FeatureConfig['icon'],
  path: string,
  version: string,
): FeatureConfig => ({
  name,
  description,
  version,
  category,
  icon,
  navigationPath: path,
  disabled: true,
  routes: [],
});

/**
 * Registry of the feature modules. Add a feature: create src/features/<feature>/ with
 * pages/, routes.tsx (one FeatureConfig) and index.ts, then add it to this list.
 * The order is the order in the sidebar, the phone's bottom bar (first entries) and the "All services" views.
 * Notifications are not a feature here: the shell has its own bell (sidebar on desktop, header on phones).
 */
export const allFeatures: FeatureConfig[] = [
  homeFeature,
  upcoming(
    'Onboarding',
    'Register companies, review their applications and bring them into the dataspace.',
    'onboarding',
    <AppRegistrationOutlinedIcon />,
    '/onboarding',
    '0.2.0',
  ),
  participantsFeature,
  upcoming(
    'Connectors as a service',
    'Run and monitor dataspace connectors for your participants, so they do not have to host their own.',
    'as-a-service',
    <CableOutlinedIcon />,
    '/connectors',
    '0.2.0',
  ),
  upcoming(
    'Wallets as a service',
    'Provide dataspace wallets for your participants and manage their credentials.',
    'as-a-service',
    <AccountBalanceWalletOutlinedIcon />,
    '/wallets',
    '0.2.0',
  ),
  upcoming(
    'Marketplace',
    'Offer apps and services to the participants and manage their subscriptions.',
    'as-a-service',
    <StorefrontOutlinedIcon />,
    '/marketplace',
    '0.2.0',
  ),
  upcoming(
    'Provider network',
    'Work with other onboarding service providers: find the home provider of a participant and exchange trust.',
    'network',
    <HubOutlinedIcon />,
    '/network',
    '0.1.0',
  ),
];

/** The navigation items of the sidebar, the bottom bar and the "All services" view. */
export const features: NavigationItem[] = allFeatures.map((feature) => ({
  name: feature.name,
  description: feature.description,
  version: feature.version,
  category: feature.category,
  icon: feature.icon,
  path: feature.navigationPath,
  disabled: feature.disabled,
}));

/** The routes of all enabled features. */
export function getAllRoutes() {
  return allFeatures.filter((feature) => !feature.disabled).flatMap((feature) => feature.routes);
}
