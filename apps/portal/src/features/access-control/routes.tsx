/* Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra */
import type { ReactElement } from 'react';
import { Box, Button, Container, Stack, VerifiedUserOutlinedIcon } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import type { FeatureTranslations } from '../../i18n/lazyFeatureTranslations';
import type { FeatureConfig } from '../../types/routing';
import { CompanyUsersPage } from './company';
import { companyTranslations } from './company/i18n';
import { IamConfiguration, IAM_NAMESPACE, iamTranslations } from './iam';
import { PEOPLE_NS, peopleTranslations } from './people';
import { TechnicalUsersPage, technicalTranslations } from './technical';

const bundles = [peopleTranslations, companyTranslations, iamTranslations, technicalTranslations];
const translations: FeatureTranslations = {
  namespace: PEOPLE_NS,
  isLoaded: () => bundles.every((bundle) => bundle.isLoaded()),
  load: async () => { await Promise.all(bundles.map((bundle) => bundle.load())); },
};

function AccessControlView({ children }: { children: ReactElement }) {
  const { t } = useTranslation([PEOPLE_NS, IAM_NAMESPACE]);
  const { pathname } = useLocation();
  const links = [
    { path: '/access-control', label: t('users', { ns: PEOPLE_NS }) },
    { path: '/access-control/technical-users', label: t('technicalUsers', { ns: PEOPLE_NS }) },
    { path: '/access-control/iam', label: t('title', { ns: IAM_NAMESPACE }) },
  ];
  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Stack component="nav" aria-label={t('overline', { ns: PEOPLE_NS })} direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1, py: 2 }}>
            {links.map(({ path, label }) => (
              <Button key={path} component={RouterLink} to={path} variant={pathname === path ? 'contained' : 'text'} aria-current={pathname === path ? 'page' : undefined}>
                {label}
              </Button>
            ))}
          </Stack>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {children}
      </Container>
    </Box>
  );
}

export const accessControlFeature: FeatureConfig = {
  id: 'access-control',
  version: '0.2.0',
  category: 'participants',
  icon: <VerifiedUserOutlinedIcon />,
  navigationPath: '/access-control',
  disabled: false,
  translations,
  routes: [
    { path: 'access-control', element: <AccessControlView><CompanyUsersPage /></AccessControlView> },
    { path: 'access-control/technical-users', element: <AccessControlView><TechnicalUsersPage /></AccessControlView> },
    { path: 'access-control/iam', element: <AccessControlView><IamConfiguration /></AccessControlView> },
  ],
};
