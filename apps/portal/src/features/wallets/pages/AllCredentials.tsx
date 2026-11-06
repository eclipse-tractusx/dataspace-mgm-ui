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
import { Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { AttentionQueue } from '../components/AttentionQueue';
import { BlockedState } from '../components/BlockedState';
import { CredentialFilters } from '../components/CredentialFilters';
import { CredentialTable } from '../components/CredentialTable';
import { FailedAlert } from '../components/FailedAlert';
import { LoadingState } from '../components/LoadingState';
import { NoResults } from '../components/NoResults';
import { ProblemAlert } from '../components/ProblemAlert';
import { WalletsPage } from '../components/WalletsPage';
import { useAllCredentials, type AllCredentialsLoaded } from '../hooks/useAllCredentials';
import { WALLETS_NS } from '../i18n';
import { WALLETS_PATHS } from '../paths';
import { FORBIDDEN_PROBLEM } from '../problems';

/** The list part: loading, a rejected query, no match, or the table. */
function CredentialList({ state }: { state: AllCredentialsLoaded }) {
  const { t } = useTranslation(WALLETS_NS);
  const { list } = state;
  if (!list) {
    return <LoadingState label={t('allCredentials.loading')} />;
  }
  switch (list.status) {
    case 'invalid':
      return (
        <ProblemAlert severity="error" problemType={list.error.problemType}>
          {t('allCredentials.invalid')}
        </ProblemAlert>
      );
    case 'failed':
      return <FailedAlert error={list.error} />;
    case 'found':
      return list.page.total === 0 ? <NoResults onReset={state.reset} /> : <CredentialTable page={list.page} onPage={state.setPage} />;
    default:
      return null;
  }
}

/**
 * "Credentials of all companies" for OSP staff (C4-M1 `listCredentials`): "Needs attention" first, then all credentials
 * with status chips, open orders and the credential type as filters; a row opens the credential page.
 */
export default function AllCredentials() {
  const { t } = useTranslation(WALLETS_NS);
  const state = useAllCredentials();

  let body: ReactNode;
  switch (state.status) {
    case 'loading':
    case 'signed-out':
    case 'session-failed':
    case 'not-connected':
    case 'no-access':
      body = (
        <BlockedState
          state={state}
          loadingLabel={t('allCredentials.loading')}
          noAccess={t('allCredentials.noAccess')}
          returnTo={WALLETS_PATHS.allCredentials}
        />
      );
      break;
    case 'forbidden':
      body = (
        <ProblemAlert severity="error" problemType={FORBIDDEN_PROBLEM}>
          {t('allCredentials.forbidden')}
        </ProblemAlert>
      );
      break;
    case 'failed':
      body = <FailedAlert error={state.error} />;
      break;
    default: {
      const queue = state.attention.items;
      body = (
        <>
          {queue.length > 0 && <AttentionQueue items={queue} total={state.attention.total} />}
          {queue.length > 0 && (
            <Typography variant="h2" sx={{ fontSize: '1.375rem', fontWeight: 700, mb: 2 }}>
              {t('allCredentials.all')}
            </Typography>
          )}
          <CredentialFilters state={state} counts={state.counts} openOrderHours={state.attention.openOrderHours} />
          <CredentialList state={state} />
        </>
      );
    }
  }

  return (
    <WalletsPage overline={t('overline')} title={t('allCredentials.title')} lead={t('allCredentials.lead')}>
      {body}
    </WalletsPage>
  );
}
