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

import { useState, type ReactNode } from 'react';
import { Box, ContentCopyOutlinedIcon, IconButton, Tooltip } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { WALLETS_NS } from '../i18n';
import { MONO } from '../utils/mono';

// The parts of a pass that read the colours of its skin (var(--pass-fg) …), shared by the wallet pass and the peeks.

export const PASS_LABEL_SX = {
  fontSize: '0.6875rem',
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--pass-muted)',
} as const;

/** A field of a pass: the label in small capitals, the value below. */
export function PassField({ label, mono = false, children }: { label: string; mono?: boolean; children: ReactNode }) {
  return (
    <Box role="group" aria-label={label} sx={{ display: 'grid', gap: '3px', alignContent: 'start', minWidth: 0 }}>
      <Box component="span" sx={PASS_LABEL_SX}>
        {label}
      </Box>
      <Box component="span" sx={{ fontWeight: 600, fontSize: '0.9375rem', ...(mono ? { fontFamily: MONO, whiteSpace: 'nowrap' } : { overflowWrap: 'anywhere' }) }}>
        {children}
      </Box>
    </Box>
  );
}

/** A long identifier on a pass (DID), in full, with a copy button in the colours of the pass. */
export function PassCopyValue({ value }: { value: string }) {
  const { t } = useTranslation(WALLETS_NS);
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(value).then(
      () => setCopied(true),
      () => setCopied(false),
    );
  };
  return (
    <Box component="span" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, minWidth: 0 }}>
      <Box component="span" sx={{ flex: 1, minWidth: 0, fontFamily: MONO, fontSize: '0.8125rem', lineHeight: 1.6, wordBreak: 'break-all' }}>
        {value}
      </Box>
      <Tooltip title={copied ? t('common.copied') : t('common.copy')} onClose={() => setCopied(false)}>
        <IconButton
          size="small"
          aria-label={t('common.copyValue', { value })}
          onClick={copy}
          sx={{ p: '4px', color: 'var(--pass-muted)', '&:hover': { color: 'var(--pass-fg)', bgcolor: 'color-mix(in srgb, var(--pass-fg) 10%, transparent)' } }}
        >
          <ContentCopyOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

/** The 44 px logo slot of a pass with an icon in the accent colour (the wallet pass; credentials show their dataspace). */
export function PassIconSlot({ children }: { children: ReactNode }) {
  return (
    <Box
      aria-hidden
      sx={{
        width: 44,
        height: 44,
        borderRadius: '12px',
        flex: '0 0 auto',
        display: 'grid',
        placeItems: 'center',
        color: 'primary.main',
        bgcolor: 'color-mix(in srgb, var(--pass-fg) 10%, transparent)',
        border: '1px solid var(--pass-line)',
      }}
    >
      {children}
    </Box>
  );
}
