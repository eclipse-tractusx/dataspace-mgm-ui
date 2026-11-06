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

import { Alert, Stack, Typography } from '@dataspace-mgm/ui-mui';
import type { ReviewProblem } from '@dataspace-mgm/c1-m3-core';
import { useReviewTranslation } from '../use-review-translation';
export function ReviewError({ error }: { error: unknown }) {
  const { t } = useReviewTranslation();
  const problem = error as Partial<ReviewProblem> | undefined;
  const key = problem?.type?.split(':').at(-1) ?? 'unknownError';
  return (
    <Alert severity="error" role="alert">
      <Stack spacing={1}>
        <Typography>{t(key)}</Typography>
        {problem?.pendingChecks?.map((v) => (
          <Typography key={v}>{t(v)}</Typography>
        ))}
        {problem?.failedChecks?.map((v) => (
          <Typography key={v}>{t(v)}</Typography>
        ))}
        {problem?.cspOutcome && <Typography>{t(problem.cspOutcome)}</Typography>}
        {problem?.errors?.map((v) => (
          <Typography key={v.field}>
            {v.field}: {t(v.message)}
          </Typography>
        ))}
      </Stack>
    </Alert>
  );
}
