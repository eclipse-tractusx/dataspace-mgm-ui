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

import { useState } from 'react';
import { Box, ContentCopyOutlinedIcon, IconButton, Tooltip } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { WALLETS_NS } from '../i18n';
import { MONO } from '../utils/mono';

/** An identifier in monospace with a copy button; an absent value reads `empty`. */
export function CopyValue({ value, empty }: { value: string | null; empty?: string }) {
  const { t } = useTranslation(WALLETS_NS);
  const [copied, setCopied] = useState(false);
  if (!value) {
    return (
      <Box component="span" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
        {empty ?? t('common.notKnown')}
      </Box>
    );
  }
  const copy = () => {
    navigator.clipboard?.writeText(value).then(
      () => setCopied(true),
      () => setCopied(false),
    );
  };
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'flex-start', gap: 1, maxWidth: '100%' }}>
      <Box component="span" sx={{ fontFamily: MONO, fontSize: '0.9375rem', letterSpacing: '0.02em', wordBreak: 'break-all' }}>
        {value}
      </Box>
      <Tooltip title={copied ? t('common.copied') : t('common.copy')} onClose={() => setCopied(false)}>
        <IconButton size="small" aria-label={t('common.copyValue', { value })} onClick={copy} sx={{ p: '2px', color: 'text.secondary' }}>
          <ContentCopyOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
