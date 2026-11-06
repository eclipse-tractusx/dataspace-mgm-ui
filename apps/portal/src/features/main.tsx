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
  CableOutlinedIcon,
  HowToRegOutlinedIcon,
  HubOutlinedIcon,
  StorefrontOutlinedIcon,
} from '@dataspace-mgm/ui-mui';
import { MOCK_MODE } from '../core/mock-mode';
import { FeatureTranslationsGate } from '../i18n/FeatureTranslationsGate';
import type { FeatureCategory, FeatureConfig, FeatureRoute, NavigationEntry } from '../types/routing';
import { homeFeature } from './home/routes';
import { onboardingFeature } from './onboarding/routes';
import { participantsFeature } from './participants/routes';
import { lazy, Suspense } from 'react';
const ReviewRoutes = lazy(() => import('./review/review-routes'));

/**
 * Whether a feature can be opened: not disabled, and a proof of concept (`stage: 'poc'`) only in mock mode, because it
 * runs on mock data only. A closed feature shows as "coming soon" and has no routes.
 */
export function isOpen(feature: FeatureConfig, mockMode: boolean = MOCK_MODE): boolean {
  return !feature.disabled && (feature.stage !== 'poc' || mockMode);
}

/**
 * Features that are announced but not built yet: shown greyed out as "coming soon", without routes. Their version
 * is the API version of the backend module behind them (portal-backend-spec)
 * (like the Status placeholder of the Industry Core Hub). Their name and description are `features.<id>` in the
 * shell's common.json. Replace one by its feature folder when it arrives.
 */
const upcoming = (
  id: string,
  category: FeatureCategory,
  icon: FeatureConfig['icon'],
  path: string,
  version: string,
): FeatureConfig => ({
  id,
  version,
  category,
  icon,
  navigationPath: path,
  disabled: true,
  routes: [],
});

/**
 * Registry of the feature modules. Add a feature: create src/features/<feature>/ with
 * pages/, i18n/ (its namespace), routes.tsx (one FeatureConfig) and index.ts, add `features.<id>` to the shell's
 * common.json in every language, then add it to this list.
 * The order is the order in the sidebar, the phone's bottom bar (first entries) and the "All services" views.
 * Notifications are not a feature here: the shell has its own bell (sidebar on desktop, header on phones).
 */
export const allFeatures: FeatureConfig[] = [
  homeFeature,
  onboardingFeature,
  {
    id: 'onboarding-review',
    version: '0.2.0',
    category: 'onboarding',
    icon: <HowToRegOutlinedIcon />,
    navigationPath: '/onboarding/reviews',
    disabled: false,
    routes: [
      {
        path: 'onboarding/reviews/*',
        element: (
          <Suspense fallback={null}>
            <ReviewRoutes />
          </Suspense>
        ),
        meta: {
          title: 'features.onboarding-review.name',
          description: 'features.onboarding-review.description',
        },
      },
    ],
  },
  participantsFeature,
  upcoming('connectors', 'as-a-service', <CableOutlinedIcon />, '/connectors', '0.2.0'),
  upcoming('wallets', 'as-a-service', <AccountBalanceWalletOutlinedIcon />, '/wallets', '0.2.0'),
  upcoming('marketplace', 'as-a-service', <StorefrontOutlinedIcon />, '/marketplace', '0.2.0'),
  upcoming('network', 'network', <HubOutlinedIcon />, '/network', '0.1.0'),
];

/** The features of the sidebar, the bottom bar and the "All services" view, before translation. */
export const features: NavigationEntry[] = allFeatures.map((feature) => ({
  id: feature.id,
  version: feature.version,
  category: feature.category,
  icon: feature.icon,
  path: feature.navigationPath,
  disabled: !isOpen(feature),
}));

/** A route that renders once its feature's translations are there. */
const translated = (feature: FeatureConfig, route: FeatureRoute): FeatureRoute =>
  feature.translations
    ? { ...route, element: <FeatureTranslationsGate translations={feature.translations}>{route.element}</FeatureTranslationsGate> }
    : route;

/** The routes of all enabled features. */
export function getAllRoutes(): FeatureRoute[] {
  return allFeatures
    .filter((feature) => isOpen(feature))
    .flatMap((feature) => feature.routes.map((route) => translated(feature, route)));
}
