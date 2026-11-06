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

import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { ReviewActor } from '@dataspace-mgm/c1-m3-core';
import type { ReviewExtra } from './data/review-use-cases.data';
import { reviewApi } from './review.api';
import { reviewUi } from './slices/review-ui.slice';
import { reviewInitialState } from './slices/review-ui.initial-state';

export function createReviewStore(extra: ReviewExtra, actor?: ReviewActor) {
  const listener = createListenerMiddleware();
  const store = configureStore({
    reducer: {
      reviewUi: reviewUi.reducer,
      [reviewApi.reducerPath]: reviewApi.reducer,
    },
    preloadedState: {
      reviewUi: {
        ...reviewInitialState,
        mock: Boolean(extra.mock),
        actor: actor ?? reviewInitialState.actor,
      },
    },
    middleware: (getDefault) =>
      getDefault({ thunk: { extraArgument: extra } })
        .prepend(listener.middleware)
        .concat(reviewApi.middleware),
  });
  listener.startListening({
    actionCreator: reviewUi.actions.actorChanged,
    effect: (action) => {
      extra.mock?.setActor(action.payload);
      store.dispatch(reviewApi.util.resetApiState());
    },
  });
  listener.startListening({
    actionCreator: reviewUi.actions.fixturesReset,
    effect: () => {
      extra.mock?.reset();
      store.dispatch(reviewApi.util.resetApiState());
    },
  });
  listener.startListening({
    actionCreator: reviewUi.actions.unavailableChanged,
    effect: (action) => {
      if (extra.mock) {
        extra.mock.unavailable = action.payload;
      }
      store.dispatch(reviewApi.util.resetApiState());
    },
  });
  return store;
}
export type ReviewStore = ReturnType<typeof createReviewStore>;
export type ReviewState = ReturnType<ReviewStore['getState']>;
export const useReviewDispatch = useDispatch.withTypes<ReviewStore['dispatch']>();
export const useReviewSelector = useSelector.withTypes<ReviewState>();
