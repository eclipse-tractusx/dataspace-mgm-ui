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

import type { MouseEvent } from 'react';
import type { CredentialDetailAnemic } from '@dataspace-mgm/c4-m1-core';
import { Box, Button, Card, Link, Stack, Typography, tractusx } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCompanyLine } from '../hooks/useCompanyLine';
import { useListLinkState } from '../hooks/useListReturn';
import { useTimeTexts } from '../hooks/useTimeTexts';
import { WALLETS_NS } from '../i18n';
import { WALLETS_PATHS } from '../paths';
import { CompanyName } from './CompanyName';
import { CountBadge } from './CountBadge';
import { CredentialStatusChip } from './CredentialStatusChip';
import { StatusNote } from './StatusNote';

/** A click on the card opens the credential; a click on its link or button does what they say. */
const fromCard = (event: MouseEvent) => !(event.target as HTMLElement).closest('a, button');

function AttentionCard({ credential }: { credential: CredentialDetailAnemic }) {
  const { t } = useTranslation(WALLETS_NS);
  const time = useTimeTexts();
  const navigate = useNavigate();
  const company = useCompanyLine(credential);
  const state = useListLinkState();
  const to = WALLETS_PATHS.credential(credential.id);
  return (
    <Card
      component="article"
      aria-label={t('allCredentials.attentionItem', { credential: t(`credentialType.${credential.credentialType}`), company })}
      onClick={(event: MouseEvent) => fromCard(event) && navigate(to, { state })}
      sx={{ p: 2.5, display: 'grid', gap: 1.25, alignContent: 'start', cursor: 'pointer', '&:hover': { borderColor: tractusx.orange } }}
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
        <CredentialStatusChip status={credential.status} />
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
          {time.ago(credential.changedAt)}
        </Typography>
      </Stack>
      <Box>
        <Link component={RouterLink} to={to} state={state} sx={{ fontWeight: 600, fontSize: '1.0625rem' }}>
          {t(`credentialType.${credential.credentialType}`)}
        </Link>
        <Typography component="div" variant="body2" color="text.secondary">
          <CompanyName credential={credential} inline />
        </Typography>
      </Box>
      <StatusNote credential={credential} />
      {credential.status === 'REVOCATION_PENDING' && (
        <Button sx={{ justifySelf: 'start', fontSize: '0.9375rem' }} onClick={() => navigate(`${to}?confirm=1`, { state })}>
          {t('confirm.button')}
        </Button>
      )}
    </Card>
  );
}

interface AttentionQueueProps {
  items: ReadonlyArray<CredentialDetailAnemic>;
  /** All open items of `listOpenItems`; more than `items.length` when a category had more than one page. */
  total: number;
}

/** "Needs attention": failed credentials, revocations to confirm by hand and orders open for too long, as cards. */
export function AttentionQueue({ items, total }: AttentionQueueProps) {
  const { t } = useTranslation(WALLETS_NS);
  return (
    <Box component="section" aria-labelledby="needs-attention" sx={{ mb: 4 }}>
      <Typography id="needs-attention" variant="h2" sx={{ fontSize: '1.375rem', fontWeight: 700, display: 'flex', alignItems: 'baseline', gap: 1.25, mb: 2 }}>
        {t('allCredentials.needsAttention')}
        <CountBadge count={total} />
      </Typography>
      {total > items.length && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: -1, mb: 2 }}>
          {t('allCredentials.attentionShown', { shown: items.length, total })}
        </Typography>
      )}
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {items.map((credential) => (
          <AttentionCard key={credential.id} credential={credential} />
        ))}
      </Box>
    </Box>
  );
}
