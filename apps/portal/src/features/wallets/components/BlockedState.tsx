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

import { Alert, Button, LockOutlinedIcon, LoginIcon } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useCoreModules } from '../../../core/CoreModulesContext';
import type { WalletsBlocked } from '../hooks/useWalletsAccess';
import { WALLETS_NS } from '../i18n';
import { LoadingState } from './LoadingState';

interface BlockedStateProps {
  state: WalletsBlocked;
  loadingLabel: string;
  /** The page's text for a person without its permission. */
  noAccess: string;
  /** Where sign-in returns to. */
  returnTo: string;
  loadingBlocks?: number;
}

/** What a page shows before it has data: loading, sign in, no session, module not connected, no access. */
export function BlockedState({ state, loadingLabel, noAccess, returnTo, loadingBlocks }: BlockedStateProps) {
  const { t } = useTranslation(WALLETS_NS);
  const { identity } = useCoreModules();
  switch (state.status) {
    case 'loading':
      return <LoadingState label={loadingLabel} blocks={loadingBlocks} />;
    case 'signed-out':
      return (
        <Alert
          severity="info"
          action={
            <Button color="inherit" startIcon={<LoginIcon />} onClick={() => identity.login.execute(returnTo)}>
              {t('common.signIn')}
            </Button>
          }
        >
          {t('common.signInPrompt')}
        </Alert>
      );
    case 'session-failed':
      return <Alert severity="error">{t('common.sessionFailed', { message: state.message })}</Alert>;
    case 'not-connected':
      return <Alert severity="info">{t('common.notConnected')}</Alert>;
    default:
      return (
        <Alert severity="info" icon={<LockOutlinedIcon />}>
          {noAccess}
        </Alert>
      );
  }
}
