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

import { Box, CircularProgress, Skeleton, Stack, Typography } from '@dataspace-mgm/ui-mui';

/** A page or a part of it while its use case runs: a spinner with what is loading, and grey blocks. */
export function LoadingState({ label, blocks = 1 }: { label: string; blocks?: number }) {
  return (
    <Box role="status" aria-label={label}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
        <CircularProgress size={24} />
        <Typography>{label}</Typography>
      </Stack>
      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', md: `repeat(${blocks}, minmax(0, 1fr))` } }}>
        {Array.from({ length: blocks }, (_, index) => (
          <Box key={index} sx={{ display: 'grid', gap: 1.5 }}>
            <Skeleton variant="rounded" height={28} width="40%" />
            <Skeleton variant="rounded" height={16} width="70%" />
            <Skeleton variant="rounded" height={16} width="55%" />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
