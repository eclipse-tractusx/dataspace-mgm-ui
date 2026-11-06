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

import { useCallback, useRef, useState } from 'react';
import type { ConfirmRevocationResult } from '@dataspace-mgm/c4-m1-core';

export interface ConfirmRevocationForm {
  open: boolean;
  note: string;
  submitting: boolean;
  /** The last answer other than `confirmed` (validation key, 409, 403 …), shown in the dialog. */
  problem: Exclude<ConfirmRevocationResult, { status: 'confirmed' }> | null;
  /** Set once the revocation is confirmed, for the "Revocation confirmed" message. */
  done: boolean;
  setNote: (note: string) => void;
  openDialog: () => void;
  /** Ignored while the confirmation is being sent. */
  close: () => void;
  /** Ignored while an earlier confirmation is still being sent. */
  submit: () => Promise<void>;
  dismissDone: () => void;
}

/** The state of the "Confirm revocation" dialog. The use case checks the note and the API decides; nothing here does. */
export function useConfirmRevocation(
  confirm: (note: string) => Promise<ConfirmRevocationResult>,
  initiallyOpen = false,
): ConfirmRevocationForm {
  const [open, setOpen] = useState(initiallyOpen);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [problem, setProblem] = useState<ConfirmRevocationForm['problem']>(null);
  const [done, setDone] = useState(false);
  const sending = useRef(false);

  const openDialog = useCallback(() => {
    setProblem(null);
    setOpen(true);
  }, []);
  const close = useCallback(() => {
    if (!sending.current) {
      setOpen(false);
    }
  }, []);
  const dismissDone = useCallback(() => setDone(false), []);

  const submit = useCallback(async () => {
    if (sending.current) {
      return;
    }
    sending.current = true;
    setSubmitting(true);
    const outcome = await confirm(note).finally(() => {
      sending.current = false;
      setSubmitting(false);
    });
    if (outcome.status === 'confirmed') {
      setProblem(null);
      setNote('');
      setOpen(false);
      setDone(true);
      return;
    }
    setProblem(outcome);
  }, [confirm, note]);

  return { open, note, submitting, problem, done, setNote, openDialog, close, submit, dismissDone };
}
