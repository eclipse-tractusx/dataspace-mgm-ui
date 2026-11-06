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

import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@dataspace-mgm/ui-mui';
import ReviewWorkspace from './review-workspace';
const ReviewsPage = lazy(() =>
  import('@dataspace-mgm/c1-m3-feature').then((m) => ({
    default: m.ReviewsPage,
  })),
);
const ReviewDetailPage = lazy(() =>
  import('@dataspace-mgm/c1-m3-feature').then((m) => ({
    default: m.ReviewDetailPage,
  })),
);
export default function ReviewRoutes() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <Routes>
        <Route element={<ReviewWorkspace />}>
          <Route index element={<ReviewsPage />} />
          <Route path=":reviewCaseId" element={<ReviewDetailPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
