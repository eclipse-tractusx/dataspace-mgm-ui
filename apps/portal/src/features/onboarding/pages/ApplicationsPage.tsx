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

import { useState } from 'react';
import { ArrowBackIcon, Box, Button, Card, CardContent, Stack, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { ApplicationsFilter, type StaffFilter } from '../components/ApplicationsFilter';
import { ApplicationsTable } from '../components/ApplicationsTable';
import { PageFrame } from '../components/PageFrame';
import { StaffApplicationDetail } from '../components/StaffApplicationDetail';
import { StateView } from '../components/StateView';
import { StatusChip } from '../components/StatusChip';
import { useAllApplications, useAnyApplication, useCompanyRoles, useStaffDocuments } from '../hooks/useApplications';
import { ONBOARDING_NS } from '../i18n';

const NO_FILTER: StaffFilter = { status: [], kind: [], verification: [] };

/** Applications for OSP staff (mockup view 6, decided: filters=side · layout=table · details in the same card). */
export default function ApplicationsPage() {
  const { t } = useTranslation(ONBOARDING_NS);
  const [filter, setFilter] = useState<StaffFilter>(NO_FILTER);
  const [selected, setSelected] = useState<string | null>(null);
  const list = useAllApplications(filter).state;
  const everything = useAllApplications(NO_FILTER).state;
  const detail = useAnyApplication(selected).state;
  const roles = useCompanyRoles().state;
  const documents = useStaffDocuments();

  if (list.status !== 'found') {
    return (
      <PageFrame titleKey="staff.title">
        <StateView state={list} returnTo="/onboarding" />
      </PageFrame>
    );
  }
  const roleName = (role: string) => (roles.status === 'found' ? roles.companyRoles.find((r) => r.role === role)?.name : undefined) ?? role;
  const total = everything.status === 'found' ? everything.page.total : list.page.total;
  return (
    <PageFrame titleKey="staff.title">
      <Card component="section" aria-labelledby="onboarding-title">
        <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
          {selected ? (
            <Stack spacing={2}>
              <Box>
                <Button variant="text" startIcon={<ArrowBackIcon />} onClick={() => setSelected(null)} sx={{ ml: -1.5 }}>
                  {t('staff.backToList')}
                </Button>
              </Box>
              {detail.status === 'found' ? (
                <>
                  <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h2" component="h2" sx={{ fontSize: 28 }}>
                      {detail.application.companyData.legalName}
                    </Typography>
                    <StatusChip status={detail.application.status} />
                  </Stack>
                  <StaffApplicationDetail application={detail.application} roleName={roleName} onOpenDocument={(documentId) => documents?.open(selected, documentId)} />
                </>
              ) : (
                <StateView state={detail} returnTo="/onboarding" />
              )}
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'flex-end' }} role="status">
                {t('staff.count', { shown: list.page.total, total })}
              </Typography>
              <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '220px minmax(0, 1fr)' }, alignItems: 'start' }}>
                <ApplicationsFilter filter={filter} onChange={setFilter} />
                <Box sx={{ minWidth: 0 }}>
                  {list.page.items.length ? (
                    <ApplicationsTable items={list.page.items} onOpen={setSelected} />
                  ) : (
                    <Stack spacing={2} sx={{ alignItems: 'center', py: 4 }}>
                      <Typography sx={{ fontWeight: 700 }}>{t('staff.empty')}</Typography>
                      <Button variant="outlined" onClick={() => setFilter(NO_FILTER)}>
                        {t('staff.reset')}
                      </Button>
                    </Stack>
                  )}
                </Box>
              </Box>
            </Stack>
          )}
        </CardContent>
      </Card>
    </PageFrame>
  );
}
