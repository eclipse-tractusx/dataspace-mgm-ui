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

import { useState } from 'react';
import type { ReviewCheck } from '@dataspace-mgm/c1-m3-core';
import {
  Box,
  Button,
  CheckCircleOutlinedIcon,
  Collapse,
  ErrorOutlineOutlinedIcon,
  ExpandLessIcon,
  ExpandMoreIcon,
  Stack,
  Typography,
  WarningAmberOutlinedIcon,
  useTheme,
} from '@dataspace-mgm/ui-mui';
import { useReviewTranslation } from '../use-review-translation';
import { statusColor } from './review-status';

type Result = ReviewCheck['result'];

/** The colour of a check result (statusColor): green passed, red failed, pale orange unavailable, gray n/a. */
function useResultColor() {
  const theme = useTheme();
  return (result: Result) => statusColor(theme, result);
}

/** The icon of a check result; a dash for "not applicable". The label is the result, for screen readers. */
export function CheckResultIcon({ result }: { result: Result }) {
  const { t } = useReviewTranslation();
  const color = useResultColor()(result);
  const sx = { fontSize: 20, color };
  return (
    <Box component="span" role="img" aria-label={t(result)} sx={{ display: 'inline-flex', width: 20, flexShrink: 0 }}>
      {result === 'PASSED' && <CheckCircleOutlinedIcon sx={sx} />}
      {result === 'FAILED' && <ErrorOutlineOutlinedIcon sx={sx} />}
      {result === 'ERROR' && <WarningAmberOutlinedIcon sx={sx} />}
      {result === 'NOT_APPLICABLE' && (
        <Box component="span" sx={{ width: 20, height: 20, display: 'grid', placeItems: 'center', color, fontWeight: 700 }}>
          –
        </Box>
      )}
    </Box>
  );
}

/** One segment per check in the colour of its result: the state of all checks at a glance. */
export function CheckBar({ results }: { results: ReadonlyArray<Result> }) {
  const color = useResultColor();
  return (
    <Box aria-hidden sx={{ display: 'flex', gap: '3px', height: 6 }}>
      {results.map((result, index) => (
        <Box key={index} sx={{ flex: 1, borderRadius: '3px', bgcolor: color(result), opacity: result === 'NOT_APPLICABLE' ? 0.4 : 1 }} />
      ))}
    </Box>
  );
}

/** "6 of 6 passed" (not applicable checks do not count). */
export function checksSummary(t: (key: string) => string, results: ReadonlyArray<Result>): string {
  const relevant = results.filter((v) => v !== 'NOT_APPLICABLE');
  return t('checksSummary')
    .replace('{passed}', String(relevant.filter((v) => v === 'PASSED').length))
    .replace('{total}', String(relevant.length));
}

/** The details of a check (findings of the backend), as a short list. */
function CheckDetails({ check }: { check: ReviewCheck }) {
  const { t } = useReviewTranslation();
  const d = check.details;
  if (!d) {
    return null;
  }
  const lines = [
    ...(d.cspOutcome ? [`${t('CSP_MATCH_EXPECTED')}: ${t(d.cspOutcome)}`] : []),
    ...(d.cspMatches ?? []).map(
      (m) => `${m.bpn} · ${m.homeOspName ?? m.homeOspId} · ${m.matchedBy.join(', ')} · ${t(m.expected ? 'EXPECTED_MATCH' : 'MISMATCH')}`,
    ),
    ...(d.mismatchedFields ?? []).map((v) => `${t(v)}: ${t('MISMATCH')}`),
    ...(d.unverifiedFields ?? []).map((v) => `${t(v)}: ${t('NOT_IN_ATTESTATION')}`),
    ...(d.duplicates ?? []).map((v) => `${v.companyId} · ${v.companyStatus} · ${v.matchedOn.join(', ')}`),
    ...(d.missing ?? []).map((v) => `${v.agreementKey} · ${v.version}`),
    ...(d.representationReasons ?? []).map((v) => t(v)),
    ...(d.signatureCheck ? [t(d.signatureCheck)] : []),
    ...(d.expiredAtSubmission ? [`${t('ATTESTATION_VALID')}: ${t('FAILED')}`] : []),
    ...(d.error ? [d.error] : []),
  ];
  return (
    <Box component="ul" sx={{ m: 0, mt: 1, pl: 2.5, display: 'grid', gap: 0.5, color: 'text.secondary', fontSize: '0.875rem', overflowWrap: 'anywhere' }}>
      {lines.map((line, index) => (
        <li key={index}>{line}</li>
      ))}
    </Box>
  );
}

/** A row of the checks list; failed and unavailable checks can unfold their findings. */
function CheckRow({ check, first }: { check: ReviewCheck; first: boolean }) {
  const { t, date } = useReviewTranslation();
  const expandable = (check.result === 'FAILED' || check.result === 'ERROR') && Boolean(check.details);
  const [open, setOpen] = useState(false);
  return (
    <Box component="li" sx={{ py: 1.5, borderTop: first ? 0 : '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <CheckResultIcon result={check.result} />
        <Typography sx={{ fontWeight: 600, flex: 1, minWidth: 0 }}>{t(check.checkKey)}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', display: { xs: 'none', sm: 'block' } }}>
          {t('checkedAt')} {date(check.checkedAt)}
          {check.attempts > 1 ? ` · ${t('attempts')}: ${check.attempts}` : ''}
        </Typography>
        {expandable && (
          <Button
            variant="text"
            size="small"
            color="inherit"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={`${t('findings')}: ${t(check.checkKey)}`}
            endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{ color: 'text.secondary', minWidth: 0 }}
          >
            {t('findings')}
          </Button>
        )}
      </Stack>
      {expandable && (
        <Collapse in={open}>
          <Box sx={{ pl: 4.5 }}>
            <CheckDetails check={check} />
          </Box>
        </Collapse>
      )}
    </Box>
  );
}

/** All checks of a review case in one compact list. */
export function ChecksList({ checks }: { checks: ReadonlyArray<ReviewCheck> }) {
  return (
    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {checks.map((check, index) => (
        <CheckRow key={check.checkKey} check={check} first={index === 0} />
      ))}
    </Box>
  );
}
