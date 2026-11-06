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

import type { CompanyRoleInfoAnemic } from '@dataspace-mgm/c1-m2-core';
import { Box, Card, CardContent, Checkbox, FormControlLabel, FormGroup, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { ONBOARDING_NS } from '../i18n';

/** Company roles as checkboxes (decided: roles=checkboxes), from GET /company-roles; a change is saved with PATCH. */
export function RolesCard({ roles, selected, disabled, onToggle }: { roles: ReadonlyArray<CompanyRoleInfoAnemic>; selected: ReadonlyArray<string>; disabled: boolean; onToggle: (role: string) => void }) {
  const { t } = useTranslation(ONBOARDING_NS);
  return (
    <Card component="section" aria-labelledby="roles-title">
      <CardContent sx={{ p: { xs: 3, md: 3.5 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography id="roles-title" variant="h3" component="h2" sx={{ fontSize: 20, fontWeight: 700 }}>
          {t('terms.rolesTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('terms.rolesIntro')}
        </Typography>
        <FormGroup sx={{ border: '1px solid', borderColor: 'ui.cardBorder', borderRadius: '10px' }}>
          {roles.map((role, index) => (
            <FormControlLabel
              key={role.role}
              sx={{ m: 0, px: 2, py: 1.5, alignItems: 'flex-start', borderTop: index ? '1px solid' : 0, borderColor: 'ui.subtleBorder' }}
              control={<Checkbox checked={selected.includes(role.role)} onChange={() => onToggle(role.role)} disabled={disabled} sx={{ mt: -0.75 }} />}
              label={
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{role.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {role.description}
                  </Typography>
                </Box>
              }
            />
          ))}
        </FormGroup>
      </CardContent>
    </Card>
  );
}
