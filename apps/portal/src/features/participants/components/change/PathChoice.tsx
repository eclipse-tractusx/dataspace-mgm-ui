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

import type { ReactElement } from 'react';
import { Box, CardActionArea, Chip, Grid, Paper, Typography, VerifiedUserOutlinedIcon, FactCheckOutlinedIcon, alpha, tractusx } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../../i18n';

export type ChangePath = 'wallet' | 'request';

/** The two ways of C3-M1 6.6 as two cards (configurator choice path=choice); the chosen one opens below. */
export function PathChoice({ value, onChange }: { value: ChangePath | null; onChange: (path: ChangePath) => void }) {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const card = (path: ChangePath, icon: ReactElement) => (
    <Grid size={{ xs: 12, md: 6 }}>
      <Paper variant="outlined" sx={{ height: '100%', borderRadius: '10px', borderColor: value === path ? tractusx.orange : undefined, bgcolor: value === path ? alpha(tractusx.orange, 0.06) : undefined }}>
        <CardActionArea onClick={() => onChange(path)} aria-pressed={value === path} sx={{ p: 3, height: '100%', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
            {icon}
            <Chip size="small" label={t(`change.${path}.tag`)} />
          </Box>
          <Typography variant="h3" component="h2" sx={{ fontSize: 20, mb: 1 }}>{t(`change.${path}.title`)}</Typography>
          <Typography color="text.secondary">{t(`change.${path}.text`)}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>{t(`change.${path}.changes`)}</Typography>
        </CardActionArea>
      </Paper>
    </Grid>
  );
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {card('wallet', <VerifiedUserOutlinedIcon color="success" aria-hidden />)}
      {card('request', <FactCheckOutlinedIcon aria-hidden />)}
    </Grid>
  );
}
