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
 * Assisted-By: Codex (GPT-6)
 * Assisted-By: Claude Code (claude-opus-5-5)
 ********************************************************************************/

import { Box, tractusx, useTheme, type Theme } from '@dataspace-mgm/ui-mui';
import { useReviewTranslation } from '../use-review-translation';

/**
 * The colour of a review status or check result. Orange: to act on; pale orange: waiting for the second approval;
 * Eclipse Tractus-X green: approved or passed; red: declined or failed; gray: closed or not applicable.
 */
export function statusColor(theme: Theme, value: string): string {
  switch (value) {
    case 'OPEN':
      return tractusx.orange;
    case 'AWAITING_SECOND_APPROVAL':
    case 'ERROR':
      return tractusx.orangeLightest;
    case 'APPROVED':
    case 'PASSED':
    case 'VALID':
    case 'CONFIRMED':
      return tractusx.green;
    case 'DECLINED':
    case 'FAILED':
    case 'INVALID':
      return theme.palette.error.main;
    default:
      return theme.palette.text.disabled;
  }
}

/** A status as a pill with a dot in its colour on a tint of it, like the status of a wallet pass. */
export function ReviewStatus({ value, label }: { value: string; label?: string }) {
  const { t } = useReviewTranslation();
  const theme = useTheme();
  const color = statusColor(theme, value);
  const neutral = color === theme.palette.text.disabled;
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        flexShrink: 0,
        width: 'fit-content',
        px: 1.25,
        py: 0.375,
        borderRadius: '999px',
        fontSize: '0.8125rem',
        fontWeight: 600,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        color: neutral ? 'text.secondary' : 'text.primary',
        bgcolor: `color-mix(in srgb, ${color} 16%, transparent)`,
        '&::before': { content: '""', width: 8, height: 8, borderRadius: '50%', bgcolor: color, flexShrink: 0 },
      }}
    >
      {label ?? t(value)}
    </Box>
  );
}

/** Visually hidden text, for screen readers (and the counts the list announces per row). */
export function VisuallyHidden({ children }: { children: string }) {
  return (
    <Box
      component="span"
      sx={{ position: 'absolute', width: 1, height: 1, p: 0, m: '-1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 }}
    >
      {children}
    </Box>
  );
}
