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

import { useState } from 'react';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@dataspace-mgm/ui-mui';
import { Trans, useTranslation } from 'react-i18next';
import { ONBOARDING_NS } from '../i18n';

/** Withdraw as a section at the bottom (decided: withdraw=bottom), with a confirmation. */
export function WithdrawSection({ company, onWithdraw }: { company: string; onWithdraw: () => void }) {
  const { t } = useTranslation(ONBOARDING_NS);
  const [confirm, setConfirm] = useState(false);
  return (
    <Card component="section" aria-labelledby="withdraw-title" sx={{ borderColor: 'error.main' }}>
      <CardContent sx={{ p: { xs: 3, md: 3.5 }, display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'flex-start' }}>
        <Typography id="withdraw-title" variant="h3" component="h2" sx={{ fontSize: 20, fontWeight: 700 }}>
          {t('application.withdrawTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('application.withdrawText')}
        </Typography>
        <Button variant="outlined" onClick={() => setConfirm(true)}>
          {t('application.withdraw')}
        </Button>
      </CardContent>
      <Dialog open={confirm} onClose={() => setConfirm(false)} aria-labelledby="withdraw-confirm-title">
        <DialogTitle id="withdraw-confirm-title">{t('application.withdrawConfirmTitle')}</DialogTitle>
        <DialogContent>
          <Box component="p" sx={{ m: 0 }}>
            <Trans t={t} i18nKey="application.withdrawConfirmText" values={{ company }} components={{ strong: <strong /> }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => setConfirm(false)}>
            {t('application.keep')}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setConfirm(false);
              onWithdraw();
            }}
          >
            {t('application.withdraw')}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
