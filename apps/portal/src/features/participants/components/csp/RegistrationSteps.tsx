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
import type { CspRegistrationAnemic } from '@dataspace-mgm/c3-m2-core';
import { Box, CheckCircleOutlinedIcon, CloseIcon, HourglassEmptyIcon, RadioButtonUncheckedIcon, Stack, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../../i18n';
import { formatDateTime } from '../../utils/format';
import { StatusChip } from '../StatusChip';

type StepState = 'done' | 'waiting' | 'failed' | 'none';

const ICONS: Record<StepState, ReactNode> = {
  done: <CheckCircleOutlinedIcon color="success" />,
  waiting: <HourglassEmptyIcon color="warning" />,
  failed: <CloseIcon color="error" />,
  none: <RadioButtonUncheckedIcon color="disabled" />,
};

/**
 * The three parts of the registration as a list (configurator choice display=steps). Each part is read from a field
 * of `CspRegistration`; the UI does not say what runs next.
 */
export function RegistrationSteps({ registration, dataspace }: { registration: CspRegistrationAnemic; dataspace: string }) {
  const { t, i18n } = useTranslation(PARTICIPANTS_NS);
  const { status } = registration;
  const registered = status === 'REGISTERED' || status === 'TRANSFERRED_AWAY';
  const registerMeta =
    status === 'FAILED'
      ? t(`failureReason.${registration.failureReason ?? 'UNKNOWN'}`, { defaultValue: registration.failureReason ?? '' })
      : status === 'PENDING'
        ? t('csp.steps.waitingSince', { date: formatDateTime(registration.updatedAt, i18n.language) })
        : t('csp.steps.registeredAt', { date: formatDateTime(registration.registeredAt, i18n.language) });
  const steps: Array<{ key: string; state: StepState; value: ReactNode; meta: string }> = [
    {
      key: 'register',
      state: registered ? 'done' : status === 'PENDING' ? 'waiting' : 'failed',
      value: registration.bpn ? <Box component="span" sx={{ fontFamily: 'monospace' }}>{registration.bpn}</Box> : t('detail.noBpn'),
      meta: registerMeta,
    },
    {
      key: 'did',
      state: registration.did ? 'done' : registered ? 'waiting' : 'none',
      value: registration.did ? <Box component="span" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{registration.did}</Box> : t('csp.notRegistered'),
      meta: registration.did ? t('csp.steps.didEntered') : registered ? t('csp.steps.didAfterWallet') : t('csp.steps.needsRegistration'),
    },
    {
      key: 'membership',
      state: registration.membership === 'REGISTERED' ? 'done' : registered ? 'waiting' : 'none',
      value: <StatusChip kind="membership" value={registration.membership} />,
      meta: status === 'TRANSFERRED_AWAY' ? t('csp.steps.newHome') : t(`csp.steps.membership.${registration.membership}`),
    },
  ];
  return (
    <Stack component="ol" spacing={3} sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {steps.map((step) => (
        <Stack component="li" key={step.key} direction="row" spacing={2}>
          <Box aria-hidden sx={{ pt: 0.25 }}>{ICONS[step.state]}</Box>
          <Box>
            <Typography variant="h3" component="h3" sx={{ fontSize: 16, fontWeight: 600 }}>{t(`csp.steps.${step.key}.title`, { dataspace })}</Typography>
            <Typography component="div">{step.value}</Typography>
            <Typography variant="body2" color="text.secondary">{step.meta}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{t(`csp.steps.${step.key}.help`)}</Typography>
            <Typography component="span" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{t(`csp.stepState.${step.state}`)}</Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
