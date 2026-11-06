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

import type { ReviewCase } from '@dataspace-mgm/c1-m3-core';
import {
  reviewUi,
  useReviewDispatch,
  useReviewSelector,
  useApproveMutation,
  useDeclineMutation,
} from '@dataspace-mgm/c1-m3-state';
import { Alert, Box, Button, Dialog, DialogContent, Stack, Typography } from '@dataspace-mgm/ui-mui';
import { ReviewError } from './review-error';
import { useReviewTranslation } from '../use-review-translation';
export function ReviewDecision({ review }: { review: ReviewCase }) {
  const { t } = useReviewTranslation();
  const dispatch = useReviewDispatch();
  const { actor, dialog, comment } = useReviewSelector((s) => s.reviewUi);
  const permitted = actor.permissions.includes('review_application');
  const [approve, approval] = useApproveMutation();
  const [decline, rejection] = useDeclineMutation();
  const busy = approval.isLoading || rejection.isLoading;
  const required = dialog === 'decline';
  const close = () => {
    dispatch(reviewUi.actions.dialogChanged(null));
    approval.reset();
    rejection.reset();
  };
  const send = async () => {
    const result =
      dialog === 'approve'
        ? await approve({
            id: review.id,
            ...(comment.trim() ? { comment: comment.trim() } : {}),
          })
        : await decline({ id: review.id, reason: comment.trim() });
    if ('data' in result) {
      dispatch(reviewUi.actions.dialogChanged(null));
    }
  };
  return (
    <Stack spacing={2}>
      {!permitted && <Alert severity="info">{t('readOnly')}</Alert>}
      {approval.isSuccess || rejection.isSuccess ? <Alert severity="success">{t('success')}</Alert> : null}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button
          variant="contained"
          disabled={!permitted || busy}
          onClick={() => {
            approval.reset();
            rejection.reset();
            dispatch(reviewUi.actions.dialogChanged('approve'));
          }}
        >
          {t('approve')}
        </Button>
        <Button
          variant="outlined"
          color="error"
          disabled={!permitted || busy}
          onClick={() => {
            approval.reset();
            rejection.reset();
            dispatch(reviewUi.actions.dialogChanged('decline'));
          }}
        >
          {t('decline')}
        </Button>
      </Stack>
      <Dialog
        open={dialog !== null}
        onClose={busy ? undefined : close}
        fullWidth
        maxWidth="sm"
        aria-labelledby="review-decision-title"
      >
        <DialogContent>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <Stack spacing={3}>
              <Typography id="review-decision-title" variant="h2" sx={{ fontSize: 26 }}>
                {t(dialog === 'approve' ? 'approve' : 'decline')}
              </Typography>
              {dialog === 'approve' && <Alert severity="info">{t('approveNotice')}</Alert>}
              <label>
                {t(dialog === 'decline' ? 'reason' : 'comment')} {required ? '*' : ''}
                <Box
                  component="textarea"
                  rows={5}
                  required={required}
                  maxLength={1000}
                  value={comment}
                  disabled={busy}
                  onChange={(e) => dispatch(reviewUi.actions.commentChanged(e.target.value))}
                  aria-describedby="decision-help"
                  sx={{
                    display: 'block',
                    width: '100%',
                    boxSizing: 'border-box',
                    p: 2,
                    mt: 1,
                    background: 'transparent',
                    color: 'inherit',
                    border: '1px solid',
                    borderRadius: 1,
                    font: 'inherit',
                  }}
                />
              </label>
              <Typography id="decision-help" variant="body2" color="text.secondary">
                {t(dialog === 'decline' ? 'reasonHelp' : 'commentHelp')} ({comment.length}/1000)
              </Typography>
              {(approval.error || rejection.error) && <ReviewError error={approval.error ?? rejection.error} />}
              <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
                <Button disabled={busy} onClick={close}>
                  {t('cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    busy ||
                    (required && !comment.trim()) ||
                    comment.length > 1000 ||
                    !permitted
                  }
                >
                  {t('confirm')}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
