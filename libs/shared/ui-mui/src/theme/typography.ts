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

/**
 * Manrope, as in the Eclipse Tractus-X Design Guidelines (slide 9): 400 body, 500 subheads,
 * 700 labels, 800 titles; headings bold and tight; fallback Inter, Arial, sans-serif.
 */
export const fontFamily = '"Manrope Variable", Manrope, Inter, Arial, sans-serif';

export const typography: TypographyVariantsOptions = {
  fontFamily,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: { fontWeight: 800, fontSize: 'clamp(2.5rem, 4vw + 1rem, 4.5rem)', lineHeight: 1.05, letterSpacing: '-0.02em' },
  h2: { fontWeight: 800, fontSize: 'clamp(1.75rem, 2vw + 1rem, 2.5rem)', lineHeight: 1.15, letterSpacing: '-0.01em' },
  h3: { fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.3 },
  subtitle1: { fontWeight: 500, fontSize: '1.125rem', lineHeight: 1.45 },
  body1: { fontWeight: 400, fontSize: '1rem', lineHeight: 1.6 },
  body2: { fontWeight: 400, fontSize: '0.9375rem', lineHeight: 1.6 },
  overline: { fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', lineHeight: 1.6 },
  button: { fontWeight: 500, fontSize: '1rem', textTransform: 'none', letterSpacing: 0 },
};
