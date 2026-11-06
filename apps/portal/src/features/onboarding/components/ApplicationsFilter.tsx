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

import type { AllApplicationsFilter } from '@dataspace-mgm/c1-m2-core';
import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { ONBOARDING_NS } from '../i18n';

export type StaffFilter = Required<Pick<AllApplicationsFilter, 'status' | 'kind' | 'verification'>>;

const OPTIONS = {
  status: ['CREATED', 'SUBMITTED', 'WITHDRAWN', 'DECLINED', 'COMPLETED'],
  kind: ['ONBOARDING', 'REACTIVATION', 'TRANSFER'],
  verification: ['EBW', 'DOCUMENTS'],
} as const;
const LABEL = { status: 'staff.filterStatus', kind: 'staff.filterKind', verification: 'staff.filterVerification' } as const;

/** The filters of GET /osp/applications as a side panel (decided: filters=side). */
export function ApplicationsFilter({ filter, onChange }: { filter: StaffFilter; onChange: (filter: StaffFilter) => void }) {
  const { t } = useTranslation(ONBOARDING_NS);
  const toggle = (key: keyof StaffFilter, value: string) => {
    const current = filter[key] as ReadonlyArray<string>;
    onChange({ ...filter, [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] });
  };
  return (
    <Box component="aside" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pr: { md: 3 }, pb: { xs: 2, md: 0 }, borderRight: { md: '1px solid' }, borderBottom: { xs: '1px solid', md: 0 }, borderColor: { xs: 'ui.subtleBorder', md: 'ui.subtleBorder' } }}>
      {(Object.keys(OPTIONS) as Array<keyof StaffFilter>).map((key) => (
        <Box key={key} role="group" aria-label={t(LABEL[key])}>
          <Typography variant="overline" color="text.secondary" component="div">
            {t(LABEL[key])}
          </Typography>
          <FormGroup>
            {OPTIONS[key].map((value) => (
              <FormControlLabel
                key={value}
                control={<Checkbox size="small" checked={(filter[key] as ReadonlyArray<string>).includes(value)} onChange={() => toggle(key, value)} />}
                label={t(`enum.${key}.${value}`)}
              />
            ))}
          </FormGroup>
        </Box>
      ))}
    </Box>
  );
}
