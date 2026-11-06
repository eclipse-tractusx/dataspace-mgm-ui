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

import type { CredentialStatusAnemic } from '@dataspace-mgm/c4-m1-core';
import { Box, tractusx } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { WALLETS_NS } from '../i18n';
import { CREDENTIAL_STATUS_TONE } from '../utils/statusTone';
import { DataspaceLogo } from './DataspaceLogo';
import { PassSurface } from './PassSurface';
import { StatusPill } from './StatusPill';

/** Greyed out like its full pass (CredentialPass). */
const MUTED = new Set(['FAILED', 'REVOKED', 'NONE']);

/**
 * A credential behind the front pass of the stack: only the header of its pass (logo slot of the dataspace, name,
 * status) peeks out. A button: a click brings the credential to the front.
 */
interface CredentialPeekProps {
  credential: CredentialStatusAnemic;
  /** Every header but the first overlaps the one above by 20 px. */
  overlap: boolean;
  onSelect: () => void;
}

export function CredentialPeek({ credential, overlap, onSelect }: CredentialPeekProps) {
  const { t } = useTranslation(WALLETS_NS);
  const name = t(`credentialType.${credential.credentialType}`);
  return (
    <PassSurface
      skin="carbon"
      muted={MUTED.has(credential.status)}
      label={t('wallet.credentials.show', { name, dataspace: credential.dataspace.name })}
      onClick={onSelect}
      sx={{
        width: '100%',
        font: 'inherit',
        textAlign: 'left',
        cursor: 'pointer',
        p: '18px 22px 30px',
        mt: overlap ? '-20px' : 0,
        '&:hover': { transform: 'translateY(-6px)' },
        '&:focus-visible': { outline: `2px solid ${tractusx.orange}`, outlineOffset: '2px' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <DataspaceLogo dataspace={credential.dataspace} />
        <Box component="span" sx={{ flex: 1, minWidth: 0, fontWeight: 700, fontSize: '0.9375rem', lineHeight: 1.2 }}>
          {name}
          <Box component="small" sx={{ display: 'block', fontWeight: 500, fontSize: '0.75rem', color: 'var(--pass-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {credential.dataspace.name}
          </Box>
        </Box>
        <StatusPill tone={CREDENTIAL_STATUS_TONE[credential.status]} label={t(`credentialStatus.${credential.status}`)} />
      </Box>
    </PassSurface>
  );
}
