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

import type { CredentialDetailAnemic, ConfirmRevocationResult } from '@dataspace-mgm/c4-m1-core';
import { Alert, Box, Button, Snackbar, TaskAltOutlinedIcon } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useCompanyLine } from '../hooks/useCompanyLine';
import { useConfirmRevocation } from '../hooks/useConfirmRevocation';
import { useBackToList } from '../hooks/useListReturn';
import { WALLETS_NS } from '../i18n';
import { ConfirmRevocationDialog } from './ConfirmRevocationDialog';
import { CredentialFacts } from './CredentialFacts';
import { CredentialStatusAlert } from './CredentialStatusAlert';
import { IssuerHolderCard } from './IssuerHolderCard';
import { LifeCycleTimeline } from './LifeCycleTimeline';
import { WalletsPage } from './WalletsPage';

interface CredentialViewProps {
  credential: CredentialDetailAnemic;
  confirm: (note: string) => Promise<ConfirmRevocationResult>;
}

/**
 * A credential found: cards by topic (facts, issuer and holder, life cycle). "Confirm revocation" sits in the page
 * header while the status is REVOCATION_PENDING (the field of the API; the API decides with 409), and opens the
 * dialog; `?confirm=1` (the button of the "Needs attention" card) opens it right away. The back link keeps the
 * filters of the list the credential was opened from.
 */
export function CredentialView({ credential, confirm }: CredentialViewProps) {
  const { t } = useTranslation(WALLETS_NS);
  const [search] = useSearchParams();
  const pending = credential.status === 'REVOCATION_PENDING';
  const form = useConfirmRevocation(confirm, pending && search.has('confirm'));
  const company = useCompanyLine(credential);
  const backTo = useBackToList();

  return (
    <WalletsPage
      overline={company}
      title={t(`credentialType.${credential.credentialType}`)}
      back={{ to: backTo, label: t('credential.back') }}
      tabs={false}
      actions={
        pending && (
          <Button startIcon={<TaskAltOutlinedIcon />} onClick={form.openDialog}>
            {t('confirm.button')}
          </Button>
        )
      }
    >
      <CredentialStatusAlert credential={credential} />
      <Box sx={{ display: 'grid', gap: 3 }}>
        <CredentialFacts credential={credential} />
        <IssuerHolderCard credential={credential} />
        <LifeCycleTimeline credential={credential} />
      </Box>
      {/* Stays open after a 409 although the credential read again is no longer pending, to show the answer. */}
      {(pending || form.open) && <ConfirmRevocationDialog credential={credential} form={form} />}
      <Snackbar open={form.done} autoHideDuration={4000} onClose={form.dismissDone} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={form.dismissDone}>
          {t('confirm.done')}
        </Alert>
      </Snackbar>
    </WalletsPage>
  );
}
