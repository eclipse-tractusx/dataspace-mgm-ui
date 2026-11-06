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
import { Box, Card, Typography, type SxProps, type Theme } from '@dataspace-mgm/ui-mui';

/** A card of the credential page with its heading. */
export function SectionCard({ id, title, children, sx }: { id: string; title?: string; children: ReactNode; sx?: SxProps<Theme> }) {
  return (
    <Card component="section" aria-labelledby={title ? id : undefined} sx={[{ p: { xs: 3, md: 3.5 }, '&:hover': { boxShadow: 'none' } }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {title && (
        <Typography id={id} variant="h2" sx={{ fontSize: '1.375rem', fontWeight: 700, mb: 2.5 }}>
          {title}
        </Typography>
      )}
      <Box>{children}</Box>
    </Card>
  );
}
