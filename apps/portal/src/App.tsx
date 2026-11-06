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

import { ColorModeProvider } from '@dataspace-mgm/ui-mui';
import { useMemo } from 'react';
import { Provider } from 'react-redux';
import { ConfigContext } from './config/ConfigContext';
import type { CoreModules } from './core/container';
import { CoreModulesProvider } from './core/CoreModulesContext';
import { FavouritesProvider } from './contexts/FavouritesContext';
import { I18nProvider } from './i18n/I18nProvider';
import { features } from './features/main';
import { createAppStore } from './features/access-control/state/store';
import type { RuntimeConfig } from './config';
import AppRoutes from './routes';

/**
 * The app around the router. main.tsx creates the core packages once (real ones, or the mock ones in mock mode);
 * I18nProvider starts the translations (src/i18n).
 */
export default function App({ config, modules }: { config: RuntimeConfig; modules: CoreModules }) {
  const store = useMemo(() => createAppStore(modules), [modules]);
  return (
    <Provider store={store}>
      <I18nProvider>
        <ConfigContext.Provider value={config}>
          <CoreModulesProvider modules={modules}>
            <ColorModeProvider>
              <FavouritesProvider items={features}>
                <AppRoutes />
              </FavouritesProvider>
            </ColorModeProvider>
          </CoreModulesProvider>
        </ConfigContext.Provider>
      </I18nProvider>
    </Provider>
  );
}
