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

import type { IdentifierAnemic } from '@dataspace-mgm/c3-m1-core';
import { Box, Chip, Stack, VerifiedUserOutlinedIcon } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../i18n';

/** The identifiers of a company with their source (Business Wallet or declared). */
export function IdentifierList({ identifiers }: { identifiers: ReadonlyArray<IdentifierAnemic> }) {
  const { t } = useTranslation(PARTICIPANTS_NS);
  if (identifiers.length === 0) {
    return <Box sx={{ color: 'text.secondary' }}>{t('identifiersNone')}</Box>;
  }
  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {identifiers.map((identifier) => (
        <Stack component="li" key={`${identifier.type}-${identifier.value}`} direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <span>{t('identifier', { type: t(`identifierTypes.${identifier.type}`), value: identifier.value })}</span>
          {identifier.verified && <VerifiedUserOutlinedIcon fontSize="small" color="success" titleAccess={t('verified')} />}
          <Chip size="small" variant="outlined" label={t(`identifierSource.${identifier.source}`)} />
        </Stack>
      ))}
    </Stack>
  );
}
