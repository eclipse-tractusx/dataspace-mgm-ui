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
import type { CredentialStatusAnemic } from '@dataspace-mgm/c4-m1-core';
import { Box, IconButton, InfoOutlinedIcon, Tooltip, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useTimeTexts } from '../hooks/useTimeTexts';
import { WALLETS_NS } from '../i18n';
import { MONO } from '../utils/mono';
import { CREDENTIAL_STATUS_TONE } from '../utils/statusTone';
import { DataspaceLogo } from './DataspaceLogo';
import { PassSurface, type PassSkin } from './PassSurface';
import { StatusPill } from './StatusPill';

/** How the pass says what the credential is for: an info button with a tooltip, or the sentence in the footer. */
export type CredentialExplain = 'info' | 'text';

interface CredentialPassProps {
  credential: CredentialStatusAnemic;
  /** The BPN of the company, the primary field of a BPN credential (from the session). */
  bpn: string | null;
  skin: PassSkin;
  explain?: CredentialExplain;
}

const LABEL_SX = { fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--pass-muted)' } as const;

function PassField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box role="group" aria-label={label} sx={{ display: 'grid', gap: '3px', alignContent: 'start', minWidth: 0 }}>
      <Box component="span" sx={LABEL_SX}>
        {label}
      </Box>
      <Box component="span" sx={{ fontWeight: 600, fontSize: '0.9375rem', overflowWrap: 'anywhere' }}>
        {children}
      </Box>
    </Box>
  );
}

/** The sentence in the footer, in the words of the company. The company view has no failure message. */
function useStatusLine(credential: CredentialStatusAnemic): string {
  const { t } = useTranslation(WALLETS_NS);
  const time = useTimeTexts();
  switch (credential.status) {
    case 'REQUESTED':
      return t('pass.statusLine.REQUESTED', { ago: credential.requestedAt ? time.ago(credential.requestedAt) : t('common.none') });
    case 'ISSUED':
      return t('pass.statusLine.ISSUED', { dateTime: time.dateTime(credential.issuedAt) });
    case 'REVOKED':
      return t('pass.statusLine.REVOKED', { dateTime: time.dateTime(credential.revokedAt) });
    default:
      return t(`pass.statusLine.${credential.status}`);
  }
}

/**
 * A credential of the company as a pass, like a card in a phone wallet: the logo slot of its dataspace, the name with
 * what it is for, its status, the primary field (BPN, or the dataspace it is a member of), the dates and a sentence.
 */
export function CredentialPass({ credential, bpn, skin, explain = 'info' }: CredentialPassProps) {
  const { t } = useTranslation(WALLETS_NS);
  const time = useTimeTexts();
  const statusLine = useStatusLine(credential);
  const name = t(`credentialType.${credential.credentialType}`);
  const description = t(`credentialDescription.${credential.credentialType}`);
  const muted = credential.status === 'FAILED' || credential.status === 'REVOKED' || credential.status === 'NONE';

  return (
    <PassSurface skin={skin} muted={muted} label={t('pass.label', { name, dataspace: credential.dataspace.name })}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <DataspaceLogo dataspace={credential.dataspace} />
        <Box sx={{ flex: 1, minWidth: 0, fontWeight: 700, fontSize: '0.9375rem', lineHeight: 1.2 }}>
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Typography component="h3" sx={{ font: 'inherit' }}>
              {name}
            </Typography>
            {explain === 'info' && (
              <Tooltip title={description} enterTouchDelay={0}>
                <IconButton size="small" aria-label={t('pass.whatIs', { name })} sx={{ p: '2px', color: 'var(--pass-muted)', '&:hover': { color: 'var(--pass-fg)' } }}>
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Box component="small" sx={{ display: 'block', fontWeight: 500, fontSize: '0.75rem', color: 'var(--pass-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {credential.dataspace.name}
          </Box>
        </Box>
        <StatusPill tone={CREDENTIAL_STATUS_TONE[credential.status]} label={t(`credentialStatus.${credential.status}`)} />
      </Box>

      <Box sx={{ display: 'grid', gap: '4px' }}>
        <Box component="span" sx={LABEL_SX}>
          {credential.credentialType === 'BPN' ? t('pass.bpn') : t('pass.memberOf')}
        </Box>
        <Box
          component="strong"
          sx={{ fontWeight: 800, fontSize: '1.5rem', lineHeight: 1.15, letterSpacing: '-0.01em', overflowWrap: 'anywhere', ...(credential.credentialType === 'BPN' && { fontFamily: MONO }) }}
        >
          {credential.credentialType === 'BPN' ? (bpn ?? t('common.none')) : credential.dataspace.name}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '14px 36px' }}>
        <PassField label={t('pass.requested')}>{time.date(credential.requestedAt)}</PassField>
        {credential.revokedAt ? (
          <PassField label={t('pass.revoked')}>{time.date(credential.revokedAt)}</PassField>
        ) : (
          <PassField label={t('pass.issued')}>{time.date(credential.issuedAt)}</PassField>
        )}
      </Box>

      <Box sx={{ pt: 2, borderTop: '1px dashed var(--pass-line)', color: 'var(--pass-muted)', fontSize: '0.875rem' }}>
        {explain === 'text' ? description : statusLine}
      </Box>
    </PassSurface>
  );
}
