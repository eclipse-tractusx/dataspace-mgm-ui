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
import { Box, ButtonBase, Typography, tractusx } from '@dataspace-mgm/ui-mui';
import { IconTile } from './IconTile';

/** A selectable card with an icon, a title and a text (mockup: ob-choice). */
export function ChoiceCard({ icon, title, text, selected, onSelect }: { icon: ReactNode; title: string; text: string; selected: boolean; onSelect: () => void }) {
  return (
    <ButtonBase
      onClick={onSelect}
      aria-pressed={selected}
      sx={{
        display: 'flex', gap: 2, alignItems: 'flex-start', justifyContent: 'flex-start', textAlign: 'left', p: 2.5, borderRadius: '10px',
        border: '1px solid', borderColor: selected ? tractusx.orange : 'ui.cardBorder', boxShadow: selected ? `inset 0 0 0 1px ${tractusx.orange}` : 'none',
        bgcolor: 'background.paper', width: '100%', '&:hover': { boxShadow: (theme) => theme.palette.ui.glow },
      }}
    >
      <IconTile>{icon}</IconTile>
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
      </Box>
    </ButtonBase>
  );
}
