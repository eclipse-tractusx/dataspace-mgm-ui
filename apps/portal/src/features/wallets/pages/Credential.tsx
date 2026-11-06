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

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { BlockedState } from '../components/BlockedState';
import { CredentialView } from '../components/CredentialView';
import { FailedAlert } from '../components/FailedAlert';
import { ProblemAlert } from '../components/ProblemAlert';
import { WalletsPage } from '../components/WalletsPage';
import { useCredential } from '../hooks/useCredential';
import { WALLETS_NS } from '../i18n';
import { WALLETS_PATHS } from '../paths';
import { FORBIDDEN_PROBLEM, NOT_FOUND_PROBLEM } from '../problems';

/** "Credential" for OSP staff (C4-M1 `getCredential`, `confirmRevocation`): /wallets/all-credentials/:credentialId. */
export default function Credential() {
  const { t } = useTranslation(WALLETS_NS);
  const { credentialId = '' } = useParams();
  const state = useCredential(credentialId);

  if (state.status === 'found') {
    return <CredentialView credential={state.credential} confirm={state.confirm} />;
  }

  let body;
  switch (state.status) {
    case 'forbidden':
      body = (
        <ProblemAlert severity="error" problemType={FORBIDDEN_PROBLEM}>
          {t('allCredentials.forbidden')}
        </ProblemAlert>
      );
      break;
    case 'not-found':
      body = (
        <ProblemAlert severity="warning" problemType={NOT_FOUND_PROBLEM}>
          {t('credential.notFound')}
        </ProblemAlert>
      );
      break;
    case 'failed':
      body = <FailedAlert error={state.error} />;
      break;
    default:
      body = (
        <BlockedState
          state={state}
          loadingLabel={t('credential.loading')}
          noAccess={t('allCredentials.noAccess')}
          returnTo={WALLETS_PATHS.credential(credentialId)}
        />
      );
  }

  return (
    <WalletsPage overline={t('overline')} title={t('credential.title')} back={{ to: WALLETS_PATHS.allCredentials, label: t('credential.back') }} tabs={false}>
      {body}
    </WalletsPage>
  );
}
