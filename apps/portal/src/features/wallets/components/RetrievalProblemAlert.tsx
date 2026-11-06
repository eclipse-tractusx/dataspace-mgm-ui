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

import { C4M2_PROBLEM } from '@dataspace-mgm/c4-m2-core';
import { useTranslation } from 'react-i18next';
import type { RetrievalProblem } from '../hooks/useRetrieveAccessData';
import { WALLETS_NS } from '../i18n';
import { ProblemAlert } from './ProblemAlert';

const PROBLEM_TYPE: Readonly<Record<Exclude<RetrievalProblem['status'], 'failed'>, string>> = {
  'already-retrieved': C4M2_PROBLEM.alreadyRetrieved,
  expired: C4M2_PROBLEM.credentialsExpired,
  'no-credentials': C4M2_PROBLEM.noCredentials,
  'invalid-state': C4M2_PROBLEM.invalidState,
  forbidden: C4M2_PROBLEM.forbidden,
  'not-found': C4M2_PROBLEM.notFound,
};

/** An answer of the retrieval without access data (410, 409, 403, 404 or another error), with its Problem Details type. */
export function RetrievalProblemAlert({ problem, name }: { problem: RetrievalProblem; name: string }) {
  const { t } = useTranslation(WALLETS_NS);
  if (problem.status === 'failed') {
    const { error } = problem;
    return (
      <ProblemAlert severity="error" problemType={error.problemType}>
        {error.status
          ? t('walletAccounts.problem.failedWithStatus', { name, status: error.status, message: error.message })
          : t('walletAccounts.problem.failed', { name, message: error.message })}
      </ProblemAlert>
    );
  }
  return (
    <ProblemAlert severity={problem.status === 'forbidden' ? 'error' : 'warning'} problemType={PROBLEM_TYPE[problem.status]}>
      {t(`walletAccounts.problem.${problem.status}`, { name })}
    </ProblemAlert>
  );
}
