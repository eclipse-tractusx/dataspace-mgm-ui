/********************************************************************************
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * AI Disclosure: This file was entirely AI-generated.
 * The AI-generated portions are made available under CC0-1.0 and not subject
 * to the project's license. The human contributor has reviewed and verified
 * that the code is correct.
 *
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra
 ********************************************************************************/

import { describe, expect, it } from 'vitest';
import { testCoreModules } from '../../../core/testing';
import { accessControlApi, getCoreModules, toQueryResult } from './access-control.api';
import { createAppStore } from './store';

const testApi = accessControlApi.injectEndpoints({
  endpoints: (builder) => ({
    testSession: builder.query<boolean, void>({
      queryFn: (_arg, api) =>
        toQueryResult(async () => (await getCoreModules(api).identity.getCurrentSession.execute()) !== null),
    }),
  }),
});

describe('access-control store', () => {
  it('injects the supplied core modules into queryFn and caches its result', async () => {
    const store = createAppStore(testCoreModules().modules);
    const request = store.dispatch(testApi.endpoints.testSession.initiate());
    await expect(request.unwrap()).resolves.toBe(false);
    expect(testApi.endpoints.testSession.select()(store.getState()).data).toBe(false);
    request.unsubscribe();
    store.dispatch(accessControlApi.util.resetApiState());
  });

  it('converts thrown errors and preserves result unions as data', async () => {
    await expect(
      toQueryResult(async () => {
        throw new Error('failed');
      }),
    ).resolves.toEqual({ error: { message: 'failed' } });
    await expect(toQueryResult(async () => ({ status: 'not-found' as const }))).resolves.toEqual({
      data: { status: 'not-found' },
    });
  });
});
