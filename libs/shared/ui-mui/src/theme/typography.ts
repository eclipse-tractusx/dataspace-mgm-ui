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

import type { TypographyVariantsOptions } from '@mui/material/styles';

/** Libre Franklin is the font of the Tractus-X styleguide; the stack falls back to system fonts. */
export const typography: TypographyVariantsOptions = {
  fontFamily: '"Libre Franklin", "Helvetica Neue", Helvetica, Arial, sans-serif',
  h1: { fontWeight: 700, fontSize: 'clamp(2rem, 4vw + 1rem, 3.5rem)', lineHeight: 1.1, letterSpacing: '-0.02em' },
  h2: { fontWeight: 700, fontSize: 'clamp(1.5rem, 2vw + 1rem, 2.25rem)', lineHeight: 1.2 },
  h3: { fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.3 },
  overline: { fontWeight: 700, letterSpacing: '0.14em', lineHeight: 1.6 },
  button: { fontWeight: 600, textTransform: 'none' },
};
