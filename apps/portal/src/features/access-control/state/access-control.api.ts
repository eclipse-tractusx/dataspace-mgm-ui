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

import { createApi, fakeBaseQuery, type BaseQueryApi } from '@reduxjs/toolkit/query/react';
import type { CoreModules } from '../../../core/container';

export type QueryError = { message: string; status?: number; problemType?: string | null };

/** Endpoints are injected by the feature when its core use cases are available. */
export const accessControlApi = createApi({
  reducerPath: 'accessControlApi',
  baseQuery: fakeBaseQuery<QueryError>(),
  tagTypes: ['AccessControl'],
  endpoints: () => ({}),
});

/** The app store supplies these modules as the thunk extra argument. */
export function getCoreModules(api: Pick<BaseQueryApi, 'extra'>): CoreModules {
  return api.extra as CoreModules;
}

/** Convert unexpected thrown errors to serializable RTK Query errors. Result unions remain data. */
export async function toQueryResult<T>(action: () => Promise<T>): Promise<{ data: T } | { error: QueryError }> {
  try {
    return { data: await action() };
  } catch (error: unknown) {
    const result: QueryError = { message: error instanceof Error ? error.message : String(error) };
    if (error && typeof error === 'object') {
      if ('status' in error && typeof error.status === 'number') {
        result.status = error.status;
      }
      if ('problemType' in error && (typeof error.problemType === 'string' || error.problemType === null)) {
        result.problemType = error.problemType;
      }
    }
    return { error: result };
  }
}
