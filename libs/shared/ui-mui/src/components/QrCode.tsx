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

import Box from '@mui/material/Box';
import { QRCodeSVG } from 'qrcode.react';
import { tractusx } from '../theme/palette';

/**
 * A QR code of a value (for example the DID of a dataspace wallet), drawn as SVG by qrcode.react (ISC). Always dark
 * modules on a white tile, in light and dark mode, so every scanner reads it. `label` is the translated text
 * alternative: the library has no texts.
 */
export function QrCode({ value, label, size = 84 }: { value: string; label: string; size?: number }) {
  return (
    <Box
      role="img"
      aria-label={label}
      sx={{ p: '6px', borderRadius: '8px', backgroundColor: tractusx.white, lineHeight: 0, flexShrink: 0, width: 'fit-content' }}
    >
      <QRCodeSVG value={value} size={size - 12} level="M" bgColor={tractusx.white} fgColor={tractusx.black} aria-hidden="true" />
    </Box>
  );
}
