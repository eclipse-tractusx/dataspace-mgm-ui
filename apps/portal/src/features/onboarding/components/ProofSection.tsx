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

import type { Verification } from '@dataspace-mgm/c1-m2-core';
import { AccountBalanceWalletOutlinedIcon, Alert, ArrowForwardIcon, Box, Button, Card, CardContent, DescriptionOutlinedIcon, Typography } from '@dataspace-mgm/ui-mui';
import { Trans, useTranslation } from 'react-i18next';
import { ONBOARDING_NS } from '../i18n';
import { ChoiceCard } from './ChoiceCard';

/** "How do you prove your company?" as two tiles (decided), what the person needs, and Continue. */
export function ProofSection({ path, onPath, onContinue, busy }: { path: Verification; onPath: (path: Verification) => void; onContinue: () => void; busy: boolean }) {
  const { t } = useTranslation(ONBOARDING_NS);
  return (
    <Box component="section" aria-labelledby="proof-title" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card>
        <CardContent sx={{ p: { xs: 3, md: 3.5 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography id="proof-title" variant="h3" component="h2" sx={{ fontSize: 20, fontWeight: 700 }}>
            {t('start.proofQuestion')}
          </Typography>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <ChoiceCard icon={<AccountBalanceWalletOutlinedIcon />} title={t('start.proofEbw')} text={t('start.proofEbwText')} selected={path === 'EBW'} onSelect={() => onPath('EBW')} />
            <ChoiceCard icon={<DescriptionOutlinedIcon />} title={t('start.proofDocuments')} text={t('start.proofDocumentsText')} selected={path === 'DOCUMENTS'} onSelect={() => onPath('DOCUMENTS')} />
          </Box>
        </CardContent>
      </Card>
      <Alert severity="info">
        <Trans t={t} i18nKey={path === 'EBW' ? 'start.needsEbw' : 'start.needsDocuments'} components={{ strong: <strong /> }} />
      </Alert>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={onContinue} disabled={busy}>
          {t(path === 'EBW' ? 'start.continueEbw' : 'start.continueDocuments')}
        </Button>
      </Box>
    </Box>
  );
}
