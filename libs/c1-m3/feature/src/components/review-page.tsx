/********************************************************************************
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
 * to the project's license. Human review is required before committing.
 *
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: Claude Code (claude-opus-5-5)
 ********************************************************************************/

import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowBackOutlinedIcon, Box, Container, Link, TextField, Typography } from '@dataspace-mgm/ui-mui';

/**
 * The frame of the review pages, like the wallet pages: a quiet back link, the overline, the title, then one quiet
 * line with the status and the meta (or the lead of the list).
 */
export function ReviewPage({
  overline,
  title,
  status,
  lead,
  back,
  children,
}: {
  overline: string;
  title: ReactNode;
  status?: ReactNode;
  lead?: ReactNode;
  back?: { to: string; label: string };
  children: ReactNode;
}) {
  return (
    <Container component="article" maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {back && (
        <Link
          component={RouterLink}
          to={back.to}
          underline="none"
          sx={{
            display: 'flex',
            width: 'fit-content',
            alignItems: 'center',
            gap: 0.75,
            mb: 2,
            color: 'text.secondary',
            fontSize: '0.875rem',
            fontWeight: 500,
            '&:hover': { color: 'text.primary' },
          }}
        >
          <ArrowBackOutlinedIcon sx={{ fontSize: 18 }} />
          {back.label}
        </Link>
      )}
      <Box sx={{ mb: 3 }}>
        <Typography variant="overline" color="text.secondary" component="div">
          {overline}
        </Typography>
        <Typography variant="h1" component="h1" sx={{ fontSize: 'clamp(2rem, 2vw + 1rem, 2.75rem)', overflowWrap: 'anywhere' }}>
          {title}
        </Typography>
        {(status || lead) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mt: 1 }}>
            {status}
            {lead && <Typography color="text.secondary">{lead}</Typography>}
          </Box>
        )}
      </Box>
      {children}
    </Container>
  );
}

/** A filter of the review pages: an outlined select of the portal on a native list (keyboard and tests as before). */
export function ReviewSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <TextField
      select
      size="small"
      id={id}
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
      sx={{ minWidth: { xs: '100%', sm: 180 }, '& select': { colorScheme: (theme) => theme.palette.mode } }}
    >
      {children}
    </TextField>
  );
}
