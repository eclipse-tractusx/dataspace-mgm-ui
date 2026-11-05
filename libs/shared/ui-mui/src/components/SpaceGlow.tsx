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
import { useTheme } from '@mui/material/styles';

/**
 * Soft light behind a section, for the "space feeling" of the Eclipse Tractus-X Design Guidelines (slide 6):
 * a faint orange bloom and a white haze, never an orange-to-green gradient. Decorative only; it sits behind the
 * content of its positioned parent and ignores the pointer.
 */
export function SpaceGlow({ placement = 'top' }: { placement?: 'top' | 'center' }) {
  const { palette } = useTheme();
  const dark = palette.mode === 'dark';
  const y = placement === 'top' ? '0%' : '50%';
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        background: [
          `radial-gradient(40% 50% at 78% ${y}, rgba(250, 160, 35, ${dark ? 0.16 : 0.12}) 0%, transparent 70%)`,
          `radial-gradient(35% 40% at 15% ${y}, rgba(255, 255, 255, ${dark ? 0.06 : 0}) 0%, transparent 70%)`,
        ].join(', '),
      }}
    />
  );
}
