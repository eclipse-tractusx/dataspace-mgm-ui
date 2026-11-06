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
 * Assisted-By: Claude Code (claude-opus-5-5)
 ********************************************************************************/

import { describe, expect, it } from 'vitest';
import type { FeatureConfig } from '../types/routing';
import { getAllRoutes, isOpen } from './main';

const feature = (overrides: Partial<FeatureConfig>): FeatureConfig => ({
  id: 'onboarding',
  version: '0.2.0',
  category: 'onboarding',
  icon: <span />,
  navigationPath: '/onboarding',
  disabled: false,
  routes: [{ path: 'onboarding', element: <span /> }],
  ...overrides,
});

describe('feature registry', () => {
  it('opens a built feature and closes a disabled one', () => {
    expect(isOpen(feature({}), false)).toBe(true);
    expect(isOpen(feature({ disabled: true }), true)).toBe(false);
  });

  it('opens a proof of concept only in mock mode', () => {
    expect(isOpen(feature({ stage: 'poc' }), false)).toBe(false);
    expect(isOpen(feature({ stage: 'poc' }), true)).toBe(true);
  });

  it('routes the built features outside mock mode', () => {
    expect(getAllRoutes().map((route) => route.path ?? 'index')).toEqual([
      'index', 'onboarding/reviews/*',
      'participants',
      'access-control',
      'notifications',
      'onboarding/reviews/*',
      'access-control/technical-users',
      'access-control/iam',
    ]);
  });

  it('gives every feature its own translations gate, so a click in the sidebar loads the next namespace', () => {
    // Only features with their own translations have a gate (the review of onboarding has none).
    const gated = getAllRoutes()
      .map((route) => route.element.key)
      .filter((key) => key !== null);
    expect(gated).toEqual(['home', 'notifications', 'participants']);
  });
});
