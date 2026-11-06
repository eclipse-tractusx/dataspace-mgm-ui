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
import { Box, ContentCopyOutlinedIcon, IconButton, Tooltip, VisibilityOffOutlinedIcon, VisibilityOutlinedIcon } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { WALLETS_NS } from '../i18n';
import { MONO } from '../utils/mono';

interface ValueBlockProps {
  label: string;
  value: string;
  /** A secret: masked until the person shows it; the copy button copies it either way. */
  secret?: boolean;
}

const MASK = '••••••••••••••••••••';

/** A value of the access data in a framed block: label, the value in monospace, show/hide (secret) and copy. */
export function ValueBlock({ label, value, secret = false }: ValueBlockProps) {
  const { t } = useTranslation(WALLETS_NS);
  const [visible, setVisible] = useState(!secret);
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(value).then(
      () => setCopied(true),
      () => setCopied(false),
    );
  };
  let toggle: ReactNode = null;
  if (secret) {
    const toggleLabel = visible ? t('walletAccounts.access.hide') : t('walletAccounts.access.show');
    toggle = (
      <Tooltip title={toggleLabel}>
        <IconButton size="small" aria-label={toggleLabel} aria-pressed={visible} onClick={() => setVisible(!visible)} sx={{ color: 'text.secondary' }}>
          {visible ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
    );
  }
  return (
    <Box role="group" aria-label={label} sx={{ display: 'grid', gap: 0.75 }}>
      <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'text.secondary' }}>
        {label}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: '10px 12px', border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper', minWidth: 0 }}>
        <Box component="span" sx={{ flex: 1, minWidth: 0, fontFamily: MONO, fontSize: '0.9375rem', wordBreak: 'break-all', ...(!visible && { letterSpacing: '0.2em' }) }}>
          {visible ? value : MASK}
        </Box>
        {toggle}
        <Tooltip title={copied ? t('common.copied') : t('common.copy')} onClose={() => setCopied(false)}>
          <IconButton size="small" aria-label={t('walletAccounts.access.copy', { label })} onClick={copy} sx={{ color: 'text.secondary' }}>
            <ContentCopyOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
