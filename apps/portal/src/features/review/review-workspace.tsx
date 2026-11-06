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

import { useEffect, useMemo } from 'react';
import { Provider } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { reviewUi } from '@dataspace-mgm/c1-m3-state';
import { useConfig } from '../../config/ConfigContext';
import { useSession } from '../../core/CoreModulesContext';
import { createReviewWorkspace } from '../../core/review-container';
export default function ReviewWorkspace() {
  const config = useConfig();
  const session = useSession();
  const store = useMemo(() => createReviewWorkspace(config), [config]);
  useEffect(() => {
    if (!store.getState().reviewUi.mock) {
      store.dispatch(
        reviewUi.actions.actorChanged(
          session.status === 'signed-in'
            ? {
                id: session.session.user.id,
                name: session.session.user.name,
                permissions: [...session.session.permissions],
              }
            : { id: '', name: '', permissions: [] },
        ),
      );
    }
  }, [session, store]);
  return (
    <Provider store={store}>
      <Outlet />
    </Provider>
  );
}
