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

import { Alert, Button, CircularProgress, LoginIcon, Stack, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useCoreModules } from '../../../core/CoreModulesContext';
import { ONBOARDING_NS } from '../i18n';
import { OutcomeAlert } from './OutcomeAlert';

type CommonState = { status: string };

/** The states every page shares (loading, signed out, not connected, failed); null for the page's own results. */
export function StateView({ state, returnTo }: { state: CommonState; returnTo: string }) {
  const { t } = useTranslation(ONBOARDING_NS);
  const { identity } = useCoreModules();
  switch (state.status) {
    case 'loading':
      return (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }} role="status">
          <CircularProgress size={24} />
          <Typography>{t('loading')}</Typography>
        </Stack>
      );
    case 'signed-out':
      return (
        <Alert
          severity="info"
          action={
            <Button variant="text" color="inherit" startIcon={<LoginIcon />} onClick={() => identity.login.execute(returnTo)}>
              {t('signIn')}
            </Button>
          }
        >
          {t('signInPrompt')}
        </Alert>
      );
    case 'not-connected':
      return <Alert severity="info">{t('notConnected')}</Alert>;
    case 'failed':
    case 'not-found':
    case 'forbidden':
      return <OutcomeAlert outcome={state as Parameters<typeof OutcomeAlert>[0]['outcome']} />;
    default:
      return null;
  }
}

/** Whether the state is one of the shared ones that StateView renders. */
export const isCommonState = (state: CommonState) => ['loading', 'signed-out', 'not-connected', 'failed', 'not-found', 'forbidden'].includes(state.status);
