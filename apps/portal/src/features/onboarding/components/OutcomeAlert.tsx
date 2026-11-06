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
import type { FailedOutcome, ProblemOutcome } from '@dataspace-mgm/c1-m2-core';
import { Alert, Box, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { ONBOARDING_NS } from '../i18n';

/**
 * An expected outcome of C1-M2 (its Problem Details `type`, README 12) or a failure, as an alert. The `type` maps to an
 * i18n key here; the Problem Details `title` or `detail` is never shown as a text (AGENTS.md rule 8).
 */
export function OutcomeAlert({ outcome, action, severity }: { outcome: ProblemOutcome | FailedOutcome; action?: ReactNode; severity?: 'error' | 'warning' | 'info' }) {
  const { t } = useTranslation(ONBOARDING_NS);
  if (outcome.status === 'failed') {
    const { error } = outcome;
    return (
      <Alert severity="error" action={action}>
        {error.status ? t('failedWithStatus', { status: error.status, message: error.message }) : t('failed', { message: error.message })}
        {error.problemType && <Code>{error.problemType}</Code>}
      </Alert>
    );
  }
  const values = {
    reason: 'reason' in outcome && outcome.reason ? t(`enum.reason.${outcome.reason}`) : '',
    fields: 'fields' in outcome ? outcome.fields.map((field) => t(`enum.field.${field}`)).join(', ') : '',
  };
  return (
    <Alert severity={severity ?? (outcome.status === 'open-application-exists' ? 'info' : 'warning')} action={action}>
      {t(`problems.${outcome.status}`, values)}
      {outcome.status === 'validation' && outcome.errors.length > 0 && (
        <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
          {outcome.errors.map((error) => (
            <li key={`${error.field}-${error.message}`}>
              <Code inline>{error.field}</Code> {error.message}
            </li>
          ))}
        </Box>
      )}
      <Code>{`urn:c1-m2:problem:${outcome.status}`}</Code>
    </Alert>
  );
}

function Code({ children, inline }: { children: ReactNode; inline?: boolean }) {
  return (
    <Typography variant="body2" component={inline ? 'code' : 'div'} sx={{ fontFamily: 'monospace', mt: inline ? 0 : 0.5 }}>
      {children}
    </Typography>
  );
}
