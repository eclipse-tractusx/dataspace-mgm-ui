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

import type { CredentialDetailAnemic } from '@dataspace-mgm/c4-m1-core';
import { REVOCATION_NOTE_MAX_LENGTH } from '@dataspace-mgm/c4-m1-core';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import type { ConfirmRevocationForm } from '../hooks/useConfirmRevocation';
import { useCompanyLine } from '../hooks/useCompanyLine';
import { WALLETS_NS } from '../i18n';
import { FORBIDDEN_PROBLEM, NOT_FOUND_PROBLEM } from '../problems';
import { FailedAlert } from './FailedAlert';
import { ProblemAlert } from './ProblemAlert';

/** The answer of the API in the dialog; a note that failed the pre-check shows at the field instead. */
function ConfirmProblem({ problem }: { problem: NonNullable<ConfirmRevocationForm['problem']> }) {
  const { t } = useTranslation(WALLETS_NS);
  switch (problem.status) {
    case 'invalid':
      return problem.error ? (
        <ProblemAlert severity="error" problemType={problem.error.problemType}>
          {t(problem.key)}
        </ProblemAlert>
      ) : null;
    case 'conflict':
      return (
        <ProblemAlert severity="error" problemType={problem.error.problemType}>
          {t('confirm.conflict')}
        </ProblemAlert>
      );
    case 'forbidden':
      return (
        <ProblemAlert severity="error" problemType={FORBIDDEN_PROBLEM}>
          {t('confirm.forbidden')}
        </ProblemAlert>
      );
    case 'not-found':
      return (
        <ProblemAlert severity="error" problemType={NOT_FOUND_PROBLEM}>
          {t('credential.notFound')}
        </ProblemAlert>
      );
    default:
      return <FailedAlert error={problem.error} />;
  }
}

/** "Confirm the revocation": a note (1 to 500 characters, no names of people), sent with C4-M1 `confirmRevocation`. */
export function ConfirmRevocationDialog({ credential, form }: { credential: CredentialDetailAnemic; form: ConfirmRevocationForm }) {
  const { t } = useTranslation(WALLETS_NS);
  const company = useCompanyLine(credential);
  const localError = form.problem?.status === 'invalid' && !form.problem.error ? t(form.problem.key) : null;

  return (
    <Dialog open={form.open} onClose={form.close} aria-labelledby="confirm-revocation-title" fullWidth maxWidth="sm">
      <DialogTitle id="confirm-revocation-title" sx={{ fontWeight: 700 }}>
        {t('confirm.title')}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography color="text.secondary">
            {t('confirm.lead', { credential: t(`credentialType.${credential.credentialType}`), company })}
          </Typography>
          {form.problem && <ConfirmProblem problem={form.problem} />}
          <Box>
            <TextField
              label={t('confirm.noteLabel')}
              placeholder={t('confirm.notePlaceholder')}
              value={form.note}
              onChange={(event) => form.setNote(event.target.value)}
              multiline
              minRows={4}
              fullWidth
              error={Boolean(localError)}
              helperText={localError ?? t('confirm.noteHelp')}
              slotProps={{ htmlInput: { maxLength: REVOCATION_NOTE_MAX_LENGTH } }}
              sx={{ mt: 1 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', fontSize: '0.8125rem' }}>
              {t('confirm.count', { length: form.note.length, max: REVOCATION_NOTE_MAX_LENGTH })}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button variant="outlined" onClick={form.close}>
          {t('confirm.cancel')}
        </Button>
        <Button onClick={() => void form.submit()} disabled={form.submitting}>
          {t('confirm.button')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
