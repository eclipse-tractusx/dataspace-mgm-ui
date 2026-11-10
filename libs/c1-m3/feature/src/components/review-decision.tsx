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

import { Link as RouterLink, useLocation } from 'react-router-dom';
import type { ReviewCase } from '@dataspace-mgm/c1-m3-core';
import {
  reviewUi,
  useApproveMutation,
  useDeclineMutation,
  useReviewDispatch,
  useReviewSelector,
} from '@dataspace-mgm/c1-m3-state';
import {
  Alert,
  ArrowForwardIcon,
  Box,
  Button,
  CheckCircleOutlinedIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@dataspace-mgm/ui-mui';
import { ReviewError } from './review-error';
import { useReviewTranslation } from '../use-review-translation';

/** A same-origin path the page was opened from (navigation state `returnTo`), e.g. the applicant's application. */
function useReturnTo(): string | null {
  const returnTo = (useLocation().state as { returnTo?: unknown } | null)?.returnTo;
  return typeof returnTo === 'string' && returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : null;
}

export function ReviewDecision({ review }: { review: ReviewCase }) {
  const { t } = useReviewTranslation();
  const returnTo = useReturnTo();
  const decided = review.status === 'APPROVED' || review.status === 'DECLINED';
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
  const open = (next: 'approve' | 'decline') => {
    approval.reset();
    rejection.reset();
    dispatch(reviewUi.actions.dialogChanged(next));
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
    <Stack spacing={1.5}>
      {!permitted && (
        <Alert severity="info" sx={{ py: 0, fontSize: '0.8125rem' }}>
          {t('readOnly')}
        </Alert>
      )}
      {approval.isSuccess || rejection.isSuccess ? (
        <Alert severity="success" sx={{ py: 0, fontSize: '0.8125rem' }}>
          {t('success')}
        </Alert>
      ) : null}
      {returnTo && decided && (
        <Button component={RouterLink} to={returnTo} variant="contained" fullWidth endIcon={<ArrowForwardIcon />}>
          {t('backToApplicant')}
        </Button>
      )}
      <Stack spacing={1.25}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<CheckCircleOutlinedIcon />}
          disabled={!permitted || busy}
          onClick={() => open('approve')}
        >
          {t('approve')}
        </Button>
        <Button variant="outlined" color="error" fullWidth disabled={!permitted || busy} onClick={() => open('decline')}>
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
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
        >
          <DialogTitle id="review-decision-title">{t(dialog === 'approve' ? 'approve' : 'decline')}</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 0.5 }}>
              {dialog === 'approve' && <Alert severity="info">{t('approveNotice')}</Alert>}
              <TextField
                label={t(dialog === 'decline' ? 'reason' : 'comment')}
                multiline
                minRows={5}
                required={required}
                value={comment}
                disabled={busy}
                onChange={(e) => dispatch(reviewUi.actions.commentChanged(e.target.value))}
                helperText={`${t(dialog === 'decline' ? 'reasonHelp' : 'commentHelp')} (${comment.length}/1000)`}
                slotProps={{ htmlInput: { maxLength: 1000 } }}
                fullWidth
              />
              {(approval.error || rejection.error) && <ReviewError error={approval.error ?? rejection.error} />}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button variant="outlined" disabled={busy} onClick={close}>
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color={dialog === 'decline' ? 'error' : 'primary'}
              disabled={busy || (required && !comment.trim()) || comment.length > 1000 || !permitted}
            >
              {t('confirm')}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Stack>
  );
}
