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
import type { WalletCredentialsPart } from '../hooks/useDataspaceWallet';
import { Alert, Box, Link, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { WALLETS_NS } from '../i18n';
import { WALLETS_PATHS } from '../paths';
import { CredentialStack } from './CredentialStack';
import { FailedAlert } from './FailedAlert';
import { LoadingState } from './LoadingState';

/** The right column of the wallet: "Credentials" with the summary and the link to the details, then the stack. */
export function WalletCredentials({ credentials, bpn }: { credentials: Exclude<WalletCredentialsPart, { status: 'hidden' }>; bpn: string | null }) {
  const { t } = useTranslation(WALLETS_NS);
  let summary: string | null = null;
  let body: ReactNode;
  switch (credentials.status) {
    case 'loading':
      body = <LoadingState label={t('wallet.credentials.loading')} />;
      break;
    case 'found': {
      const issued = credentials.credentials.filter((credential) => credential.status === 'ISSUED').length;
      const total = credentials.credentials.length;
      summary = issued === total ? t('wallet.credentials.allIssued') : t('wallet.credentials.someIssued', { issued, total });
      body = <CredentialStack credentials={credentials.credentials} bpn={bpn} />;
      break;
    }
    case 'failed':
      body = <FailedAlert error={credentials.error} />;
      break;
    case 'forbidden':
      body = <Alert severity="info">{t('yourCredentials.forbidden')}</Alert>;
      break;
    case 'no-company':
      body = <Alert severity="info">{t('yourCredentials.noCompany')}</Alert>;
      break;
    default:
      body = <Alert severity="warning">{t('yourCredentials.notFound')}</Alert>;
  }

  return (
    <Box component="section" aria-labelledby="wallet-credentials" sx={{ position: 'sticky', top: 24, '@media (max-width: 1099.98px)': { position: 'static' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, flexWrap: 'wrap', mb: 2.5, maxWidth: 440 }}>
        <Box>
          <Typography id="wallet-credentials" variant="h2" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
            {t('wallet.credentials.title')}
          </Typography>
          {summary && (
            <Typography color="text.secondary" sx={{ fontSize: '0.9375rem', mt: 0.5 }}>
              {summary}
            </Typography>
          )}
        </Box>
        <Link component={RouterLink} to={WALLETS_PATHS.credentials} sx={{ fontSize: '0.9375rem' }}>
          {t('wallet.credentials.details')}
        </Link>
      </Box>
      {body}
    </Box>
  );
}
