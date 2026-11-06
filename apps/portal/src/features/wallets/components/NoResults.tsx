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

import { Box, Button, Card, SearchOffOutlinedIcon, Typography, alpha, tractusx } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { WALLETS_NS } from '../i18n';

/** The list is empty for the filters: say so and offer to reset them. */
export function NoResults({ onReset }: { onReset: () => void }) {
  const { t } = useTranslation(WALLETS_NS);
  return (
    <Card sx={{ p: { xs: 4, md: 6 }, display: 'grid', justifyItems: 'center', textAlign: 'center', gap: 1.5 }}>
      <Box aria-hidden sx={{ width: 52, height: 52, borderRadius: '10px', display: 'grid', placeItems: 'center', color: tractusx.orange, bgcolor: alpha(tractusx.orange, 0.15) }}>
        <SearchOffOutlinedIcon />
      </Box>
      <Typography variant="h2" sx={{ fontSize: '1.375rem', fontWeight: 700 }}>
        {t('noResults.title')}
      </Typography>
      <Typography color="text.secondary">{t('noResults.text')}</Typography>
      <Button variant="outlined" onClick={onReset} sx={{ mt: 1 }}>
        {t('noResults.reset')}
      </Button>
    </Card>
  );
}
