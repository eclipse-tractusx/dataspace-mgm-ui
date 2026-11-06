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

import { useEffect, useState, type ReactNode } from 'react';
import { Box, CircularProgress } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import type { FeatureTranslations } from './lazyFeatureTranslations';

/**
 * Renders a feature's page once its translations are there, so the first paint is translated. The registry
 * (features/main.tsx) puts every route of a feature with `translations` inside one; features never use it themselves.
 */
export function FeatureTranslationsGate({ translations, children }: { translations: FeatureTranslations; children: ReactNode }) {
  const { t } = useTranslation();
  const [ready, setReady] = useState(translations.isLoaded);

  useEffect(() => {
    if (ready) {
      return;
    }
    let active = true;
    translations.load().then(() => {
      if (active) {
        setReady(true);
      }
    });
    return () => {
      active = false;
    };
  }, [translations, ready]);

  if (ready) {
    return children;
  }
  return (
    <Box role="status" aria-label={t('app.loading')} sx={{ display: 'grid', placeItems: 'center', py: 10 }}>
      <CircularProgress size={28} />
    </Box>
  );
}
