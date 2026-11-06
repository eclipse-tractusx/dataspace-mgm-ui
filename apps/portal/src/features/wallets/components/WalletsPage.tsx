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
import { ArrowBackOutlinedIcon, Box, Container, Link, Typography } from '@dataspace-mgm/ui-mui';
import { Link as RouterLink } from 'react-router-dom';
import { WalletsTabs } from './WalletsTabs';

interface WalletsPageProps {
  overline: ReactNode;
  title: string;
  lead?: string;
  /** The primary action of the page, at the right of the title. */
  actions?: ReactNode;
  back?: { to: string; label: string };
  /** The feature tabs under the title (not on a detail page). */
  tabs?: boolean;
  children: ReactNode;
}

/** The frame of every page of the feature: back link, overline, title, lead, actions, feature tabs, then the body. */
export function WalletsPage({ overline, title, lead, actions, back, tabs = true, children }: WalletsPageProps) {
  return (
    <Container component="article" maxWidth="lg" aria-labelledby="wallets-title" sx={{ py: { xs: 4, md: 6 } }}>
      {back && (
        <Link
          component={RouterLink}
          to={back.to}
          underline="none"
          sx={{ display: 'flex', width: 'fit-content', alignItems: 'center', gap: 0.75, mb: 1.5, color: 'text.secondary', fontSize: '0.875rem', fontWeight: 500, '&:hover': { color: 'text.primary' } }}
        >
          <ArrowBackOutlinedIcon fontSize="small" />
          {back.label}
        </Link>
      )}
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: tabs ? 3 : 4 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" color="text.secondary" component="div">
            {overline}
          </Typography>
          <Typography id="wallets-title" variant="h1" component="h1" sx={{ fontSize: 'clamp(2rem, 2vw + 1rem, 2.75rem)' }}>
            {title}
          </Typography>
          {lead && (
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {lead}
            </Typography>
          )}
        </Box>
        {actions && <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>{actions}</Box>}
      </Box>
      {tabs && <WalletsTabs />}
      {children}
    </Container>
  );
}
