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

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import i18n, { currentLanguage } from './index';
import { appLocale, useAppLocale } from './locale';

describe('app locale', () => {
  it("formats in the app's language, not the browser's", async () => {
    await i18n.changeLanguage('de');
    expect(appLocale()).toBe('de');
    const date = new Date('2026-11-06T10:00:00Z');
    expect(date.toLocaleDateString(appLocale(), { timeZone: 'UTC' })).toBe(date.toLocaleDateString('de', { timeZone: 'UTC' }));
  });

  it('re-renders when the language changes', async () => {
    const { result } = renderHook(() => useAppLocale());
    expect(result.current).toBe('en');
    await act(async () => {
      await i18n.changeLanguage('de');
    });
    expect(result.current).toBe('de');
  });

  it('maps a regional or unknown language to a supported one', async () => {
    await i18n.changeLanguage('de-AT');
    expect(currentLanguage()).toBe('de');
    await i18n.changeLanguage('fr');
    expect(currentLanguage()).toBe('en');
  });
});
