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
 * to the project's license. Human review is required before committing.
 *
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: Codex (GPT-6)
 ********************************************************************************/

import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  DecisionInput,
  DocumentInput,
  Outcome,
  ReviewCase,
  ReviewFilters,
  ReviewPage,
  ReviewProblem,
} from '@dataspace-mgm/c1-m3-core';
import type { ReviewExtra } from './data/review-use-cases.data';

function getUseCases(api: { extra: unknown }) {
  return (api.extra as ReviewExtra).useCases;
}
async function toQueryResult<T>(run: () => Promise<Outcome<T>>) {
  try {
    return await run();
  } catch {
    return { error: { status: 502, type: 'urn:c1-m3:problem:upstream-error' } };
  }
}
export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fakeBaseQuery<ReviewProblem>(),
  tagTypes: ['Review'],
  endpoints: (build) => ({
    reviews: build.query<ReviewPage, ReviewFilters>({
      queryFn: (filters, api) => toQueryResult(() => getUseCases(api).review.list.execute(filters)),
      providesTags: ['Review'],
    }),
    review: build.query<ReviewCase, string>({
      queryFn: (id, api) => toQueryResult(() => getUseCases(api).review.get.execute(id)),
      providesTags: ['Review'],
    }),
    approve: build.mutation<ReviewCase, DecisionInput>({
      queryFn: (input, api) => toQueryResult(() => getUseCases(api).review.approve.execute(input)),
      invalidatesTags: ['Review'],
    }),
    decline: build.mutation<ReviewCase, DecisionInput>({
      queryFn: (input, api) => toQueryResult(() => getUseCases(api).review.decline.execute(input)),
      invalidatesTags: ['Review'],
    }),
    download: build.mutation<null, DocumentInput>({
      async queryFn(input, api) {
        const reply = await toQueryResult(() => getUseCases(api).review.document.execute(input));
        if ('error' in reply) {
          return reply;
        }
        const url = URL.createObjectURL(reply.data.content);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = reply.data.fileName;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        return { data: null };
      },
    }),
  }),
});
export const { useReviewsQuery, useReviewQuery, useApproveMutation, useDeclineMutation, useDownloadMutation } =
  reviewApi;
