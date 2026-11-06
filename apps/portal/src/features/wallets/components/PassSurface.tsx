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
import { Box, alpha, tractusx, type SxProps, type Theme } from '@dataspace-mgm/ui-mui';

/** The look of a pass: carbon (black with an orange glow) or Eclipse Tractus-X orange. Never orange and green. */
export type PassSkin = 'carbon' | 'orange';

// CSS custom properties of a skin, read by the parts of a pass (var(--pass-fg) …); only theme tokens.
const SKINS: Readonly<Record<PassSkin, Record<string, string>>> = {
  carbon: {
    '--pass-bg': `linear-gradient(145deg, color-mix(in srgb, ${tractusx.gray} 60%, ${tractusx.black}) 0%, ${tractusx.black} 72%)`,
    '--pass-fg': tractusx.white,
    '--pass-muted': alpha(tractusx.white, 0.6),
    '--pass-border': alpha(tractusx.white, 0.14),
    '--pass-line': alpha(tractusx.white, 0.12),
    '--pass-light': alpha(tractusx.orange, 0.32),
  },
  orange: {
    '--pass-bg': `linear-gradient(145deg, ${tractusx.orange} 0%, color-mix(in srgb, ${tractusx.orange} 58%, ${tractusx.black}) 100%)`,
    '--pass-fg': tractusx.black,
    '--pass-muted': alpha(tractusx.black, 0.62),
    '--pass-border': 'transparent',
    '--pass-line': alpha(tractusx.black, 0.16),
    '--pass-light': alpha(tractusx.white, 0.3),
  },
};

interface PassSurfaceProps {
  skin: PassSkin;
  /** Greyed out (a credential that is not valid, or not there yet). */
  muted?: boolean;
  label: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
  /** A button (e.g. the peeking header of a pass in a stack) instead of an article; `label` is its name. */
  onClick?: () => void;
}

/** The card of a pass, like a card in a phone wallet: radius 18 px, the skin's background and a soft corner light. */
export function PassSurface({ skin, muted = false, label, children, sx, onClick }: PassSurfaceProps) {
  const button = onClick ? { component: 'button' as const, type: 'button' as const, onClick } : { component: 'article' as const };
  return (
    <Box
      {...button}
      aria-label={label}
      sx={[
        {
          ...SKINS[skin],
          position: 'relative',
          isolation: 'isolate',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          p: '22px 24px',
          borderRadius: '18px',
          color: 'var(--pass-fg)',
          background: 'var(--pass-bg)',
          border: '1px solid var(--pass-border)',
          boxShadow: `0 22px 44px -24px ${alpha(tractusx.black, 0.8)}`,
          filter: muted ? 'saturate(0.35)' : 'none',
          opacity: muted ? 0.85 : 1,
          transition: 'transform 0.35s ease, box-shadow 0.35s ease, opacity 0.35s ease',
          '&::after': {
            content: '""',
            position: 'absolute',
            zIndex: -1,
            right: -80,
            top: -90,
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--pass-light) 0%, transparent 68%)',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
