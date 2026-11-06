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

import type { ApplicationWithReviewAnemic } from '@dataspace-mgm/c1-m2-core';
import { Box, CheckIcon, CloseIcon, ScheduleIcon, Typography, alpha, tractusx } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useDate } from '../hooks/useOnboarding';
import { ONBOARDING_NS } from '../i18n';

interface Step {
  label: string;
  when: string | null;
  done: boolean;
  current?: boolean;
  failed?: boolean;
}

/** The steps the person sees, from status and reviewStatus as the API returns them (a display mapping, no rule). */
function stepsOf(app: ApplicationWithReviewAnemic, t: (key: string) => string): Step[] {
  const approved = app.reviewStatus === 'APPROVED' || app.status === 'COMPLETED';
  const declined = app.status === 'DECLINED';
  const withdrawn = app.status === 'WITHDRAWN';
  const reviewLabel = declined ? t('application.steps.declined') : approved ? t('application.steps.approved') : app.reviewStatus === 'NONE' ? t('application.steps.review') : t(`enum.reviewStatus.${app.reviewStatus}`);
  return [
    { label: t('application.steps.created'), when: app.createdAt, done: true },
    { label: t(withdrawn ? 'application.steps.withdrawn' : 'application.steps.submitted'), when: app.withdrawnAt ?? app.submittedAt, done: Boolean(app.submittedAt || app.withdrawnAt), failed: withdrawn },
    { label: reviewLabel, when: app.closedAt, done: approved || declined, current: app.reviewStatus === 'OPEN' || app.reviewStatus === 'AWAITING_SECOND_APPROVAL', failed: declined },
    { label: t(app.status === 'COMPLETED' ? 'application.steps.active' : 'application.steps.setUp'), when: app.completedAt, done: app.status === 'COMPLETED', current: app.reviewStatus === 'APPROVED' && app.status === 'SUBMITTED' },
  ];
}

/** The horizontal stepper with the icons of the timeline (decided: status=stepper). */
export function ApplicationStepper({ application }: { application: ApplicationWithReviewAnemic }) {
  const { t } = useTranslation(ONBOARDING_NS);
  const date = useDate();
  const steps = stepsOf(application, t);
  return (
    <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 1, gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
      {steps.map((step, index) => {
        const done = step.done && !step.failed;
        return (
          <Box
            component="li"
            key={step.label}
            aria-current={step.current ? 'step' : undefined}
            sx={{
              position: 'relative', display: 'flex', flexDirection: 'column', gap: 1, fontSize: '0.875rem', color: done || step.current || step.failed ? 'text.primary' : 'text.secondary',
              '&::after': index < steps.length - 1 ? { content: '""', position: 'absolute', top: 16, left: 40, right: 0, height: '1px', bgcolor: done ? tractusx.orange : 'ui.cardBorder' } : undefined,
            }}
          >
            <Box
              aria-hidden
              sx={{
                width: 32, height: 32, borderRadius: '50%', display: 'grid', placeItems: 'center', border: '1px solid',
                borderColor: step.current ? tractusx.orange : done || step.failed ? 'transparent' : 'ui.cardBorder',
                bgcolor: step.current ? tractusx.orange : step.failed ? (theme) => alpha(theme.palette.error.main, 0.15) : done ? alpha(tractusx.orange, 0.15) : 'transparent',
                color: step.current ? tractusx.black : step.failed ? 'error.main' : done ? tractusx.orange : 'text.secondary',
              }}
            >
              {step.failed ? <CloseIcon sx={{ fontSize: 18 }} /> : done ? <CheckIcon sx={{ fontSize: 18 }} /> : <ScheduleIcon sx={{ fontSize: 18 }} />}
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 'inherit' }}>{step.label}</Typography>
              <Typography sx={{ fontSize: 'inherit' }}>{step.when ? date(step.when) : ''}</Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
