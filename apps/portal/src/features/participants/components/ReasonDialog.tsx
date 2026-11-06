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

import { useState, type ReactNode } from 'react';
import type { ValidationErrorData } from '@dataspace-mgm/c3-m1-core';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../i18n';
import { fieldError } from './problems';

interface ReasonDialogProps {
  open: boolean;
  title: string;
  body: ReactNode;
  confirmLabel: string;
  /** A text input (reason or comment) with its label, help and limit; no input when absent. */
  input?: { label: string; help: string; maxLength: number; field: string; required: boolean };
  danger?: boolean;
  busy: boolean;
  errors: ReadonlyArray<ValidationErrorData>;
  /** Shown above the actions, e.g. the alert of a rejected answer. */
  outcome?: ReactNode;
  onCancel: () => void;
  onConfirm: (text: string) => void;
}

/** A confirmation dialog for one write, optionally with a reason; local errors come from the use case's validation. */
export function ReasonDialog({ open, title, body, confirmLabel, input, danger, busy, errors, outcome, onCancel, onConfirm }: ReasonDialogProps) {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const [text, setText] = useState('');
  const error = input ? fieldError(t, errors, input.field) : undefined;
  const close = () => {
    setText('');
    onCancel();
  };
  return (
    <Dialog open={open} onClose={busy ? undefined : close} aria-labelledby="reason-dialog-title" fullWidth maxWidth="sm">
      <DialogTitle id="reason-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText component="div">{body}</DialogContentText>
        {input && (
          <TextField
            label={input.label}
            value={text}
            onChange={(event) => setText(event.target.value)}
            required={input.required}
            multiline
            minRows={3}
            fullWidth
            margin="normal"
            error={Boolean(error)}
            helperText={error ?? `${input.help} ${text.length} / ${input.maxLength}`}
            slotProps={{ htmlInput: { maxLength: input.maxLength } }}
          />
        )}
        {outcome}
      </DialogContent>
      <DialogActions>
        <Button onClick={close} disabled={busy}>
          {t('actions.cancel')}
        </Button>
        <Button variant="contained" color={danger ? 'error' : 'primary'} disabled={busy} onClick={() => onConfirm(text)}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
