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
import { Box, Typography } from '@dataspace-mgm/ui-mui';

/** Rows of a label, a value and an optional note at the right (the mockup's ob-dl). */
export function DataRows({ rows }: { rows: ReadonlyArray<{ label: string; value: ReactNode; note?: ReactNode }> }) {
  return (
    <Box component="dl" sx={{ m: 0, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'minmax(140px, 220px) minmax(0, 1fr) auto' } }}>
      {rows.map((row) => (
        <Box key={row.label} sx={{ display: 'contents', '& > *': { py: 1.5, m: 0, borderBottom: '1px solid', borderColor: 'ui.subtleBorder' } }}>
          <Typography component="dt" color="text.secondary" variant="body2">
            {row.label}
          </Typography>
          <Typography component="dd" sx={{ fontWeight: 500, overflowWrap: 'anywhere' }}>
            {row.value}
          </Typography>
          <Box component="dd" sx={{ textAlign: { sm: 'right' } }}>
            {row.note}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
