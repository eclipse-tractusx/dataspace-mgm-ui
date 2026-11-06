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

import { useEffect, useRef, useState } from 'react';
import type { CredentialStatusAnemic } from '@dataspace-mgm/c4-m1-core';
import { Box, Typography, tractusx } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { WALLETS_NS } from '../i18n';
import { CredentialPass } from './CredentialPass';
import { CredentialPeek } from './CredentialPeek';

const keyOf = (credential: CredentialStatusAnemic) => `${credential.dataspace.id}:${credential.credentialType}`;

/**
 * The credentials as a stack of passes, like a phone wallet: the front one in full, the others as peeking headers
 * below it. A click on a header brings that credential to the front (with a short rise, none with reduced motion), and
 * the focus moves to it: the header that was clicked is gone.
 */
export function CredentialStack({ credentials, bpn }: { credentials: ReadonlyArray<CredentialStatusAnemic>; bpn: string | null }) {
  const { t } = useTranslation(WALLETS_NS);
  const [frontKey, setFrontKey] = useState<string | null>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Not on the first render: only after a header brought another credential to the front.
    if (frontKey !== null) {
      frontRef.current?.focus();
    }
  }, [frontKey]);
  const front = credentials.find((credential) => keyOf(credential) === frontKey) ?? credentials[0];
  if (!front) {
    return null;
  }
  const others = credentials.filter((credential) => credential !== front);

  return (
    <>
      {/* One shrinkable column: a long word (German) wraps instead of widening the stack past a phone screen. */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', minWidth: 0, maxWidth: 440, width: '100%' }}>
        <Box
          key={keyOf(front)}
          ref={frontRef}
          tabIndex={-1}
          data-testid="front-pass"
          sx={{
            position: 'relative',
            borderRadius: '18px',
            outline: 'none',
            '&:focus-visible': { outline: `2px solid ${tractusx.orange}`, outlineOffset: '2px' },
            zIndex: 4,
            '@keyframes walletsPassRise': { from: { transform: 'translateY(14px)', opacity: 0.6 }, to: { transform: 'none', opacity: 1 } },
            animation: 'walletsPassRise 0.35s ease',
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }}
        >
          <CredentialPass credential={front} bpn={bpn} skin="carbon" explain="text" headingLevel="h3" />
        </Box>
        {others.length > 0 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', minWidth: 0, mt: '14px' }}>
            {others.map((credential, index) => (
              <CredentialPeek key={keyOf(credential)} credential={credential} overlap={index > 0} onSelect={() => setFrontKey(keyOf(credential))} />
            ))}
          </Box>
        )}
      </Box>
      {others.length > 0 && (
        <Typography color="text.secondary" sx={{ fontSize: '0.8125rem', mt: 1.5, textAlign: 'center', maxWidth: 440 }}>
          {t('wallet.credentials.hint')}
        </Typography>
      )}
    </>
  );
}
