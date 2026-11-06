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
import { ArrowBackIcon, Box, Link, Stack, Typography } from '@dataspace-mgm/ui-mui';
import { Link as RouterLink } from 'react-router-dom';

interface PageHeaderProps {
  overline: string;
  title: ReactNode;
  subtitle?: ReactNode;
  back?: { to: string; label: string };
  actions?: ReactNode;
}

/** The head of every page of the feature: back link, overline, title (h1), subtitle and the page's actions. */
export function PageHeader({ overline, title, subtitle, back, actions }: PageHeaderProps) {
  return (
    <Box component="header" sx={{ mb: 4 }}>
      {back && (
        <Link component={RouterLink} to={back.to} underline="hover" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
          <ArrowBackIcon fontSize="small" aria-hidden />
          {back.label}
        </Link>
      )}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { md: 'flex-end' }, justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="overline" color="text.secondary" component="div">
            {overline}
          </Typography>
          <Typography id="participants-title" variant="h1" component="h1" sx={{ fontSize: 'clamp(2rem, 2vw + 1rem, 2.75rem)' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 760 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && (
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            {actions}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
