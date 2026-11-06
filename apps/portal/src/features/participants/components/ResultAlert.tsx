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

import type { ReactNode } from 'react';
import type { OperationResult } from '@dataspace-mgm/c3-m1-core';
import { Alert, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../i18n';
import { failureText, rejectionText, validationText } from './problems';

type Outcome = Exclude<OperationResult<unknown>, { status: 'success' }>;

interface ResultAlertProps {
  result: Outcome;
  /** The page's own texts for 403 and 404, e.g. "Only staff of the onboarding service provider see all companies." */
  forbiddenText?: string;
  notFoundText?: string;
  action?: ReactNode;
}

/** Every outcome of a use case other than success, as an alert with a text of the feature and the Problem Details type. */
export function ResultAlert({ result, forbiddenText, notFoundText, action }: ResultAlertProps) {
  const { t } = useTranslation(PARTICIPANTS_NS);
  let severity: 'error' | 'warning' | 'info' = 'error';
  let text: string;
  let problemType: string | null = null;
  switch (result.status) {
    case 'forbidden':
      text = forbiddenText ?? t('errors.forbidden');
      problemType = null;
      break;
    case 'not-found':
      severity = 'warning';
      text = notFoundText ?? t('errors.notFound');
      break;
    case 'invalid':
      severity = 'warning';
      text = result.errors.map((error) => validationText(t, error)).join(' ');
      break;
    case 'rejected':
      severity = 'warning';
      text = rejectionText(t, result.problem, result.error);
      problemType = result.error.problemType;
      break;
    default:
      text = failureText(t, result.error);
      problemType = result.error.problemType;
  }
  return (
    <Alert severity={severity} action={action} role="alert">
      {text}
      {problemType && (
        <Typography variant="body2" component="div" sx={{ fontFamily: 'monospace', mt: 0.5, opacity: 0.8 }}>
          {problemType}
        </Typography>
      )}
    </Alert>
  );
}
