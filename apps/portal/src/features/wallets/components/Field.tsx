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

/** A read-only field: the label in small capitals, the value below (a `dt`/`dd` pair inside a `dl`). */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography component="dt" variant="overline" color="text.secondary" sx={{ display: 'block', fontWeight: 700, letterSpacing: '0.2em', lineHeight: 1.6, mb: 0.5 }}>
        {label}
      </Typography>
      <Box component="dd" sx={{ m: 0, overflowWrap: 'anywhere' }}>
        {children}
      </Box>
    </Box>
  );
}

/** The fields of a card in one or two columns (one on phones). */
export function Fields({ columns = 1, children }: { columns?: 1 | 2; children: ReactNode }) {
  return (
    <Box component="dl" sx={{ m: 0, display: 'grid', gap: '24px 32px', gridTemplateColumns: { xs: '1fr', md: `repeat(${columns}, minmax(0, 1fr))` } }}>
      {children}
    </Box>
  );
}
