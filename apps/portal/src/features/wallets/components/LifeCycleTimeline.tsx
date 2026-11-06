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

import type { CredentialDetailAnemic } from '@dataspace-mgm/c4-m1-core';
import { Box, Typography, useTheme } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useTimeTexts } from '../hooks/useTimeTexts';
import { WALLETS_NS } from '../i18n';
import { SectionCard } from './SectionCard';

type EventKind = 'done' | 'failed' | 'current';

interface LifeCycleEvent {
  key: string;
  at: string;
  title: string;
  kind: EventKind;
}

/** The times of the last attempt, in order. (The full history per attempt is an open point of the backend.) */
function useEvents(credential: CredentialDetailAnemic): LifeCycleEvent[] {
  const { t } = useTranslation(WALLETS_NS);
  const events: Array<LifeCycleEvent | null> = [
    credential.requestedAt ? { key: 'requested', at: credential.requestedAt, title: t('credential.lifeCycle.requested', { attempt: credential.attempt }), kind: 'done' } : null,
    credential.failedAt ? { key: 'failed', at: credential.failedAt, title: t('credential.lifeCycle.failed'), kind: 'failed' } : null,
    credential.issuedAt ? { key: 'issued', at: credential.issuedAt, title: t('credential.lifeCycle.issued'), kind: 'done' } : null,
    credential.status === 'REVOCATION_PENDING' ? { key: 'pending', at: credential.changedAt, title: t('credential.lifeCycle.pending'), kind: 'current' } : null,
    credential.revokedAt ? { key: 'revoked', at: credential.revokedAt, title: t('credential.lifeCycle.revoked'), kind: 'done' } : null,
  ];
  return events.filter((event): event is LifeCycleEvent => event !== null);
}

/** The life cycle of the credential as a vertical timeline. */
export function LifeCycleTimeline({ credential }: { credential: CredentialDetailAnemic }) {
  const { t } = useTranslation(WALLETS_NS);
  const theme = useTheme();
  const time = useTimeTexts();
  const events = useEvents(credential);
  const dot: Record<EventKind, { border: string; fill: string }> = {
    done: { border: theme.palette.success.main, fill: theme.palette.success.main },
    failed: { border: theme.palette.error.main, fill: theme.palette.error.main },
    current: { border: theme.palette.info.main, fill: theme.palette.background.default },
  };

  return (
    <SectionCard id="credential-life-cycle" title={t('credential.lifeCycle.title')}>
      <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0 }}>
        {events.map((event, index, all) => (
          <Box
            component="li"
            key={event.key}
            sx={{
              display: 'grid',
              gridTemplateColumns: '20px 1fr',
              gap: 2,
              position: 'relative',
              pb: index < all.length - 1 ? 3 : 0,
              '&::before':
                index < all.length - 1
                  ? { content: '""', position: 'absolute', left: 9, top: 22, bottom: 0, width: 2, bgcolor: 'divider' }
                  : undefined,
            }}
          >
            <Box aria-hidden sx={{ width: 20, height: 20, mt: '2px', borderRadius: '50%', border: 2, borderColor: dot[event.kind].border, bgcolor: dot[event.kind].fill }} />
            <div>
              <Typography sx={{ fontWeight: 600 }}>{event.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {time.dateTime(event.at)}
              </Typography>
            </div>
          </Box>
        ))}
      </Box>
    </SectionCard>
  );
}
