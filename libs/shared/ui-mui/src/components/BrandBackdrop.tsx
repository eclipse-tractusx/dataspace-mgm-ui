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
import Box from '@mui/material/Box';
import gradient from '../assets/tractusx-gradient.jpg';
import { tractusx } from '../theme/palette';

/**
 * The brand gradient for title pages, section dividers and banners (Design Guidelines, slide 7, option 1).
 * Text sits on the dark left field, never over the bloom (slide 25); the scrim keeps it there on narrow screens.
 */
export function BrandBackdrop({ children, minHeight = '72vh' }: { children: ReactNode; minHeight?: string }) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: tractusx.black,
        color: tractusx.white,
        minHeight: { xs: 'auto', md: minHeight },
        display: 'flex',
        alignItems: 'center',
        backgroundImage: {
          xs: `linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.8) 35%, rgba(0,0,0,0.92) 100%), url(${gradient})`,
          md: `linear-gradient(90deg, #000 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0) 65%), url(${gradient})`,
        },
        backgroundSize: 'cover',
        backgroundPosition: { xs: '80% top', md: 'right center' },
        backgroundRepeat: 'no-repeat',
      }}
    >
      {children}
    </Box>
  );
}
