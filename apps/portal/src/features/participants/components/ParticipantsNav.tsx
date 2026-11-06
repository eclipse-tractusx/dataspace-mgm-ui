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

import { Tab, Tabs } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useParticipantSession } from '../hooks/useParticipantSession';
import { PARTICIPANTS_NS } from '../i18n';
import { participantsPath } from '../paths';

/**
 * The areas of participant management the person may open (by the permission keys of GET /me): the own company, the
 * companies of the OSP and the review of change requests. Shown only when there is more than one.
 */
export function ParticipantsNav() {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const { session, can } = useParticipantSession();
  const { pathname } = useLocation();
  const areas = [
    { key: 'company', to: participantsPath.company(), show: can('view_company') && Boolean(session?.companyId), active: !pathname.startsWith(participantsPath.companies()) && !pathname.startsWith(participantsPath.reviewQueue()) },
    { key: 'companies', to: participantsPath.companies(), show: can('view_companies'), active: pathname.startsWith(participantsPath.companies()) },
    { key: 'review', to: participantsPath.reviewQueue(), show: can('review_company_changes'), active: pathname.startsWith(participantsPath.reviewQueue()) },
  ].filter((area) => area.show);
  if (areas.length < 2) {
    return null;
  }
  const active = areas.find((area) => area.active)?.key ?? false;
  return (
    <Tabs component="nav" aria-label={t('nav.label')} value={active} variant="scrollable" allowScrollButtonsMobile sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
      {areas.map((area) => (
        <Tab key={area.key} value={area.key} label={t(`nav.${area.key}`)} component={RouterLink} to={area.to} />
      ))}
    </Tabs>
  );
}
