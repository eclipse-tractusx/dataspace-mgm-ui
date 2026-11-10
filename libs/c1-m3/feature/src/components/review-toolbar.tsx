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

import { REVIEW_ACTORS } from '@dataspace-mgm/c1-m3-core';
import { reviewUi, useReviewDispatch, useReviewSelector } from '@dataspace-mgm/c1-m3-state';
import { Box, Button, Checkbox, FormControlLabel, Stack, TextField, Tooltip, Typography, tractusx } from '@dataspace-mgm/ui-mui';
import { useReviewTranslation } from '../use-review-translation';

/**
 * Mock mode only: a slim, unobtrusive bar with the demo controls (acting reviewer, simulated outage, reset). Live, the
 * pages show nothing here.
 */
export function ReviewToolbar() {
  const dispatch = useReviewDispatch();
  const ui = useReviewSelector((s) => s.reviewUi);
  const { t } = useReviewTranslation();
  if (!ui.mock) {
    return null;
  }
  return (
    <Box
      component="section"
      aria-label={t('demoControls')}
      sx={{
        mb: 3,
        px: 1.5,
        py: 0.75,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        flexWrap: 'wrap',
      }}
    >
      <Tooltip title={t('mockBanner')}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, lineHeight: 1.5, mr: 'auto' }}
        >
          <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: tractusx.green }} />
          {t('demoControls')}
        </Typography>
      </Tooltip>
      <Stack direction="row" useFlexGap spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          select
          size="small"
          id="review-acting-reviewer"
          label={t('reviewer')}
          value={ui.actor.id}
          onChange={(e) => {
            const actor = REVIEW_ACTORS.find((v) => v.id === e.target.value);
            if (actor) {
              dispatch(reviewUi.actions.actorChanged(actor));
            }
          }}
          slotProps={{ select: { native: true } }}
          sx={{
            minWidth: 180,
            '& select': { colorScheme: (theme) => theme.palette.mode, py: 0.75, fontSize: '0.875rem' },
          }}
        >
          {REVIEW_ACTORS.map((v) => (
            <option value={v.id} key={v.id}>
              {v.name}
            </option>
          ))}
        </TextField>
        <FormControlLabel
          sx={{ m: 0, '& .MuiFormControlLabel-label': { fontSize: '0.8125rem', color: 'text.secondary' } }}
          control={
            <Checkbox
              size="small"
              checked={ui.unavailable}
              onChange={(e) => dispatch(reviewUi.actions.unavailableChanged(e.target.checked))}
            />
          }
          label={t('outage')}
        />
        <Button variant="text" size="small" color="inherit" onClick={() => dispatch(reviewUi.actions.fixturesReset())} sx={{ color: 'text.secondary' }}>
          {t('reset')}
        </Button>
      </Stack>
    </Box>
  );
}
