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
import { Alert, Box } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { BlockedState } from '../components/BlockedState';
import { CredentialPass } from '../components/CredentialPass';
import { FailedAlert } from '../components/FailedAlert';
import { ProblemAlert } from '../components/ProblemAlert';
import { WalletsPage } from '../components/WalletsPage';
import { useCompanyCredentials } from '../hooks/useCompanyCredentials';
import { WALLETS_NS } from '../i18n';
import { WALLETS_PATHS } from '../paths';
import { FORBIDDEN_PROBLEM } from '../problems';

/**
 * "Your credentials" (C4-M1 `listCompanyCredentials`): one pass per credential of the company, the BPN credential in
 * carbon and the membership credential in orange, each with the logo slot of its dataspace.
 */
export default function YourCredentials() {
  const { t } = useTranslation(WALLETS_NS);
  const state = useCompanyCredentials();

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
          loadingLabel={t('yourCredentials.loading')}
          noAccess={t('yourCredentials.noAccess')}
          returnTo={WALLETS_PATHS.credentials}
          loadingBlocks={2}
        />
      );
      break;
    case 'forbidden':
      body = (
        <ProblemAlert severity="error" problemType={FORBIDDEN_PROBLEM}>
          {t('yourCredentials.forbidden')}
        </ProblemAlert>
      );
      break;
    case 'no-company':
      body = <Alert severity="info">{t('yourCredentials.noCompany')}</Alert>;
      break;
    case 'not-found':
      body = <Alert severity="warning">{t('yourCredentials.notFound')}</Alert>;
      break;
    case 'failed':
      body = <FailedAlert error={state.error} />;
      break;
    default:
      body = (
        <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(320px, 460px))' } }}>
          {state.credentials.map((credential) => (
            <CredentialPass
              key={`${credential.dataspace.id}:${credential.credentialType}`}
              credential={credential}
              bpn={state.bpn}
              skin={credential.credentialType === 'BPN' ? 'carbon' : 'orange'}
            />
          ))}
        </Box>
      );
  }

  return (
    <WalletsPage overline={t('overline')} title={t('yourCredentials.title')}>
      {body}
    </WalletsPage>
  );
}
