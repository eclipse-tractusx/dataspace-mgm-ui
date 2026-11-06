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

import type { DataspaceRefAnemic } from '@dataspace-mgm/c4-m1-core';
import { Box } from '@dataspace-mgm/ui-mui';

/** The 44 px logo slot of the dataspace a credential belongs to: its logo when known, else its mark ("CX"). */
export function DataspaceLogo({ dataspace }: { dataspace: DataspaceRefAnemic }) {
  return (
    <Box
      role="img"
      aria-label={dataspace.name}
      title={dataspace.name}
      sx={{
        width: 44,
        height: 44,
        borderRadius: '12px',
        flex: '0 0 auto',
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        fontWeight: 800,
        fontSize: '0.9375rem',
        letterSpacing: '0.04em',
        color: 'var(--pass-fg)',
        bgcolor: 'color-mix(in srgb, var(--pass-fg) 12%, transparent)',
        border: '1px solid var(--pass-line)',
      }}
    >
      {dataspace.logoUrl ? (
        <Box component="img" src={dataspace.logoUrl} alt="" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      ) : (
        <span aria-hidden>{dataspace.mark}</span>
      )}
    </Box>
  );
}
