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

import i18n from 'i18next';
import { beforeAll, describe, expect, it } from 'vitest';
import { PARTICIPANTS_NS, participantsTranslations } from '../i18n';
import { failureText, problemKey, rejectionText } from './problems';

beforeAll(() => participantsTranslations.load());

describe('problem texts', () => {
  const t = (...args: Parameters<typeof i18n.t>) => i18n.t(args[0] as string, { ns: PARTICIPANTS_NS, ...(args[1] as object) });

  it('maps known Problem Details types explicitly and nothing else', () => {
    expect(problemKey('same-person')).toBe('problems.same-person');
    expect(problemKey('title-from-the-server')).toBeNull();
  });

  it.each([
    [null, /could not be reached/],
    [401, /session has ended/],
    [501, /not available yet/],
    [502, /did not answer \(HTTP 502\)/],
    [503, /not available right now \(HTTP 503\)/],
    [500, /failed \(HTTP 500\)/],
  ])('explains status %s', (status, text) => {
    expect(failureText(t as never, { status, problemType: null, message: 'm' })).toMatch(text);
  });

  it('never shows the title of an unknown problem', () => {
    expect(rejectionText(t as never, 'unknown', { status: 409, problemType: 'urn:x:problem:unknown', message: 'Server title' })).toBe('The request was refused (HTTP 409).');
  });
});
