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

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ReviewActor, ReviewFilters } from '@dataspace-mgm/c1-m3-core';
import { reviewInitialState } from './review-ui.initial-state';
export const reviewUi = createSlice({
  name: 'reviewUi',
  initialState: reviewInitialState,
  reducers: {
    filtersChanged(state, action: PayloadAction<ReviewFilters>) {
      state.filters = {
        ...state.filters,
        ...action.payload,
        page: action.payload.page ?? 0,
      };
    },
    actorChanged(state, action: PayloadAction<ReviewActor>) {
      state.actor = action.payload;
      state.dialog = null;
      state.comment = '';
    },
    dialogChanged(state, action: PayloadAction<'approve' | 'decline' | null>) {
      state.dialog = action.payload;
      state.comment = '';
    },
    commentChanged(state, action: PayloadAction<string>) {
      state.comment = action.payload;
    },
    unavailableChanged(state, action: PayloadAction<boolean>) {
      state.unavailable = action.payload;
    },
    fixturesReset(state) {
      state.filters = { page: 0, size: 5 };
      state.dialog = null;
      state.comment = '';
      state.unavailable = false;
    },
  },
});
