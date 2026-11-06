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

import type { ReactNode } from 'react';
import { Box, Container, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { ONBOARDING_NS } from '../i18n';
import { FlowSteps } from './FlowSteps';

interface PageFrameProps {
  /** i18n key of the page title. */
  titleKey: string;
  /** The application flow: the step labels (keys of `steps`) and the current one, shown at the side (decided). */
  steps?: { keys: ReadonlyArray<string>; current: number };
  children: ReactNode;
}

/** The frame of every onboarding page: overline, title, and in the application flow the steps at the side. */
export function PageFrame({ titleKey, steps, children }: PageFrameProps) {
  const { t } = useTranslation(ONBOARDING_NS);
  return (
    <Container component="article" maxWidth="lg" aria-labelledby="onboarding-title" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="overline" color="text.secondary">
        {t('overline')}
      </Typography>
      <Typography id="onboarding-title" variant="h1" component="h1" sx={{ fontSize: 'clamp(2rem, 2vw + 1rem, 2.75rem)', mb: 4 }}>
        {t(titleKey)}
      </Typography>
      {steps ? (
        <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '240px minmax(0, 1fr)' }, alignItems: 'start' }}>
          <FlowSteps keys={steps.keys} current={steps.current} />
          <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>{children}</Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>{children}</Box>
      )}
    </Container>
  );
}
