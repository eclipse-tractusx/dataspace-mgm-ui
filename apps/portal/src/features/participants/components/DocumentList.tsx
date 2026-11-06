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
import type { DocumentInfoAnemic } from '@dataspace-mgm/c3-m1-core';
import { Box, DescriptionOutlinedIcon, Stack, Typography } from '@dataspace-mgm/ui-mui';
import { formatBytes } from '../utils/format';

/** The supporting documents of a change request (name, type and size); `action` adds e.g. a download button. */
export function DocumentList({ documents, label, action }: { documents: ReadonlyArray<DocumentInfoAnemic>; label: string; action?: (document: DocumentInfoAnemic) => ReactNode }) {
  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', p: 0, m: 0 }} aria-label={label}>
      {documents.map((document) => (
        <Stack component="li" key={document.id} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <DescriptionOutlinedIcon color="action" aria-hidden />
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography sx={{ wordBreak: 'break-all' }}>{document.fileName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {document.mediaType.split('/')[1].toUpperCase()} · {formatBytes(document.sizeBytes)}
            </Typography>
          </Box>
          {action?.(document)}
        </Stack>
      ))}
    </Stack>
  );
}
