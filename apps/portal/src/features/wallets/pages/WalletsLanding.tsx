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
import { Navigate } from 'react-router-dom';
import { BlockedState } from '../components/BlockedState';
import { WalletsPage } from '../components/WalletsPage';
import { useWalletsLanding } from '../hooks/useWalletsLanding';
import { WALLETS_NS } from '../i18n';
import { WALLETS_PATHS } from '../paths';

/** /wallets: opens the first view the person may see (Your credentials, or Credentials of all companies for OSP staff). */
export default function WalletsLanding() {
  const { t } = useTranslation(WALLETS_NS);
  const state = useWalletsLanding();
  if (state.status === 'redirect') {
    return <Navigate to={state.to} replace />;
  }
  return (
    <WalletsPage overline={t('overline')} title={t('landing.title')} tabs={false}>
      <BlockedState
        state={state}
        loadingLabel={t('landing.loading')}
        noAccess={t('landing.noAccess')}
        returnTo={WALLETS_PATHS.landing}
      />
    </WalletsPage>
  );
}
