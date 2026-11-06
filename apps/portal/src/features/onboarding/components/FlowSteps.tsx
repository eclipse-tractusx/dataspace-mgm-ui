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

import { Box, CheckIcon, Typography, alpha, tractusx } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { ONBOARDING_NS } from '../i18n';

/** The steps of the application at the side of the page (mockup: progress=side); on phones a row of numbers. */
export function FlowSteps({ keys, current }: { keys: ReadonlyArray<string>; current: number }) {
  const { t } = useTranslation(ONBOARDING_NS);
  return (
    <Box
      component="ol"
      aria-label={t('steps.label')}
      sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: 0.5, position: { md: 'sticky' }, top: { md: 0 }, overflowX: 'auto' }}
    >
      {keys.map((key, index) => {
        const done = index < current;
        const isCurrent = index === current;
        return (
          <Box
            component="li"
            key={key}
            aria-current={isCurrent ? 'step' : undefined}
            sx={{
              display: 'flex', gap: 1.5, alignItems: 'center', px: 1.5, py: 1.25, borderRadius: '10px', flexShrink: 0,
              color: isCurrent ? 'text.primary' : 'text.secondary', fontWeight: isCurrent ? 700 : 400,
              bgcolor: isCurrent ? alpha(tractusx.orange, 0.15) : 'transparent',
            }}
          >
            <Box
              aria-hidden
              sx={{
                width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 14, flexShrink: 0,
                border: '1px solid', borderColor: isCurrent ? tractusx.orange : done ? 'transparent' : 'ui.cardBorder',
                bgcolor: isCurrent ? tractusx.orange : done ? alpha(tractusx.orange, 0.15) : 'transparent',
                color: isCurrent ? tractusx.black : done ? tractusx.orange : 'inherit',
              }}
            >
              {done ? <CheckIcon sx={{ fontSize: 16 }} /> : index + 1}
            </Box>
            <Typography component="span" sx={{ fontWeight: 'inherit', display: { xs: isCurrent ? 'inline' : 'none', md: 'inline' } }}>
              {t(`steps.${key}`)}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
