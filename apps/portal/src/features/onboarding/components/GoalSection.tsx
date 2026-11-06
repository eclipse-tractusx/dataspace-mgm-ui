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

import type { ApplicationKind } from '@dataspace-mgm/c1-m2-core';
import { AddBusinessOutlinedIcon, AutorenewOutlinedIcon, Box, BusinessOutlinedIcon, Card, CardContent, SwapHorizOutlinedIcon, TextField, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { ONBOARDING_NS } from '../i18n';
import { ChoiceCard } from './ChoiceCard';

export type Goal = 'new' | 'existing' | null;

interface GoalSectionProps {
  goal: Goal;
  kind: ApplicationKind | null;
  bpn: string;
  fromOsp: string;
  onGoal: (goal: Exclude<Goal, null>) => void;
  onKind: (kind: ApplicationKind) => void;
  onBpn: (bpn: string) => void;
  onFromOsp: (osp: string) => void;
}

const grid = { display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } } as const;

/** "What do you want to do?": cards that stay visible; an existing company first says what happened to it. */
export function GoalSection({ goal, kind, bpn, fromOsp, onGoal, onKind, onBpn, onFromOsp }: GoalSectionProps) {
  const { t } = useTranslation(ONBOARDING_NS);
  return (
    <>
      <Card component="section" aria-labelledby="goal-title">
        <CardContent sx={{ p: { xs: 3, md: 3.5 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography id="goal-title" variant="h3" component="h2" sx={{ fontSize: 20, fontWeight: 700 }}>
            {t('start.goalQuestion')}
          </Typography>
          <Box sx={grid}>
            <ChoiceCard icon={<AddBusinessOutlinedIcon />} title={t('start.goalNew')} text={t('start.goalNewText')} selected={goal === 'new'} onSelect={() => onGoal('new')} />
            <ChoiceCard icon={<BusinessOutlinedIcon />} title={t('start.goalExisting')} text={t('start.goalExistingText')} selected={goal === 'existing'} onSelect={() => onGoal('existing')} />
          </Box>
        </CardContent>
      </Card>
      {goal === 'existing' && (
        <Card component="section" aria-labelledby="kind-title">
          <CardContent sx={{ p: { xs: 3, md: 3.5 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography id="kind-title" variant="h3" component="h2" sx={{ fontSize: 20, fontWeight: 700 }}>
              {t('start.kindQuestion')}
            </Typography>
            <Box sx={grid}>
              <ChoiceCard icon={<AutorenewOutlinedIcon />} title={t('start.kindReactivation')} text={t('start.kindReactivationText')} selected={kind === 'REACTIVATION'} onSelect={() => onKind('REACTIVATION')} />
              <ChoiceCard icon={<SwapHorizOutlinedIcon />} title={t('start.kindTransfer')} text={t('start.kindTransferText')} selected={kind === 'TRANSFER'} onSelect={() => onKind('TRANSFER')} />
            </Box>
            {kind === 'REACTIVATION' && (
              <Box sx={grid}>
                <TextField label={t('start.bpnRequired')} value={bpn} onChange={(event) => onBpn(event.target.value)} helperText={t('start.bpnRequiredHelp')} required slotProps={{ htmlInput: { style: { fontFamily: 'monospace' } } }} />
              </Box>
            )}
            {kind === 'TRANSFER' && (
              <Box sx={grid}>
                {/* Not sent: ApplicationCreate has no field for the current OSP (open point for the backend). */}
                <TextField label={t('start.fromOsp')} value={fromOsp} onChange={(event) => onFromOsp(event.target.value)} helperText={t('start.fromOspHelp')} />
                <TextField label={t('start.bpnReturn')} value={bpn} onChange={(event) => onBpn(event.target.value)} helperText={t('start.bpnReturnHelp')} slotProps={{ htmlInput: { style: { fontFamily: 'monospace' } } }} />
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
