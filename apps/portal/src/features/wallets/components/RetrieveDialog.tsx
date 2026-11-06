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

import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@dataspace-mgm/ui-mui';
import { Trans, useTranslation } from 'react-i18next';
import { WALLETS_NS } from '../i18n';

interface RetrieveDialogProps {
  /** The technical user whose access data are retrieved; null: closed. */
  name: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Asks before the retrieval, because the access data are shown only once. */
export function RetrieveDialog({ name, onCancel, onConfirm }: RetrieveDialogProps) {
  const { t } = useTranslation(WALLETS_NS);
  return (
    <Dialog open={name !== null} onClose={onCancel} aria-labelledby="retrieve-title" fullWidth maxWidth="sm">
      <DialogTitle id="retrieve-title">{t('walletAccounts.confirm.title')}</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 2 }}>
        <DialogContentText>{t('walletAccounts.confirm.text', { name: name ?? '' })}</DialogContentText>
        <Alert severity="warning">
          <Trans t={t} i18nKey="walletAccounts.confirm.once" components={{ strong: <strong /> }} />
        </Alert>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="outlined" onClick={onCancel}>
          {t('walletAccounts.confirm.cancel')}
        </Button>
        <Button onClick={onConfirm}>
          {t('walletAccounts.confirm.retrieveNow')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
