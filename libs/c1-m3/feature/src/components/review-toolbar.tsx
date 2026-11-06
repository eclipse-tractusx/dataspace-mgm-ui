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
 ********************************************************************************/

import { REVIEW_ACTORS } from '@dataspace-mgm/c1-m3-core';
import { reviewUi, useReviewDispatch, useReviewSelector } from '@dataspace-mgm/c1-m3-state';
import { Alert, Box, Button, Stack } from '@dataspace-mgm/ui-mui';
import { useReviewTranslation } from '../use-review-translation';
export function ReviewToolbar() {
  const dispatch = useReviewDispatch();
  const ui = useReviewSelector((s) => s.reviewUi);
  const { t } = useReviewTranslation();
  return (
    <Stack spacing={2} sx={{ mb: 4 }}>
      <Alert severity={ui.mock ? 'info' : 'success'}>{t(ui.mock ? 'mockBanner' : 'liveBanner')}</Alert>
      <Stack direction="row" useFlexGap spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        {ui.mock && (
          <>
            <Box component="label" sx={{ display: 'grid', gap: 0.5 }}>
              {t('reviewer')}
              <select
                aria-label={t('reviewer')}
                value={ui.actor.id}
                onChange={(e) => {
                  const actor = REVIEW_ACTORS.find((v) => v.id === e.target.value);
                  if (actor) {
                    dispatch(reviewUi.actions.actorChanged(actor));
                  }
                }}
              >
                {REVIEW_ACTORS.map((v) => (
                  <option value={v.id} key={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </Box>
            <Button variant="outlined" onClick={() => dispatch(reviewUi.actions.fixturesReset())}>
              {t('reset')}
            </Button>
            <label>
              <input
                type="checkbox"
                checked={ui.unavailable}
                onChange={(e) => dispatch(reviewUi.actions.unavailableChanged(e.target.checked))}
              />{' '}
              {t('outage')}
            </label>
          </>
        )}
      </Stack>
    </Stack>
  );
}
