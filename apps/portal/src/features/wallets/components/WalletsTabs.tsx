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

import { Box, Tab, Tabs } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useSession } from '../../../core/CoreModulesContext';
import { WALLETS_NS } from '../i18n';
import { visibleTabs } from '../tabs';

/** The feature tabs under the page title: the views the person's permission keys show (WALLETS_TABS). */
export function WalletsTabs() {
  const { t } = useTranslation(WALLETS_NS);
  const { pathname } = useLocation();
  const session = useSession();
  const tabs = session.status === 'signed-in' ? visibleTabs(session.session.permissions) : [];
  if (!tabs.length) {
    return null;
  }
  const active = tabs
    .map((tab) => tab.path)
    .filter((path) => pathname === path || pathname.startsWith(`${path}/`))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <Box component="nav" aria-label={t('tabs.label')} sx={{ mt: -1, mb: 3.5, borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={active ?? false} variant="scrollable" scrollButtons={false} aria-label={t('tabs.label')}>
      {tabs.map((tab) => (
        <Tab
          key={tab.path}
          value={tab.path}
          label={t(tab.label)}
          component={Link}
          to={tab.path}
          aria-current={tab.path === active ? 'page' : undefined}
          sx={{ textTransform: 'none', fontWeight: 500, fontSize: '1rem', px: 2, color: 'text.secondary', '&.Mui-selected': { color: 'text.primary' } }}
        />
      ))}
      </Tabs>
    </Box>
  );
}
