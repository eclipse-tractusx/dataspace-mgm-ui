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
import type { CompanyAnemic } from '@dataspace-mgm/c3-m1-core';
import {
  Alert,
  Box,
  BusinessOutlinedIcon,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  LoginIcon,
  Stack,
  Typography,
  VerifiedUserOutlinedIcon,
  alpha,
  tractusx,
} from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useCoreModules } from '../../../core/CoreModulesContext';
import { useOwnCompany } from '../hooks/useOwnCompany';
import { PARTICIPANTS_NS } from '../i18n';

const STATUS_COLOR = { ACTIVE: 'success', REQUESTED: 'warning', REJECTED: 'error', INACTIVE: 'default' } as const;

/** A value of the API without a translation yet (a new company role), readable: ACTIVE_PARTICIPANT → Active participant. */
const readable = (value: string) => value.charAt(0) + value.slice(1).toLowerCase().replaceAll('_', ' ');

function Field({ name, children }: { name: string; children: ReactNode }) {
  return (
    <Box component="div" role="group" aria-label={name}>
      <Typography variant="overline" color="text.secondary" component="div">
        {name}
      </Typography>
      <Typography component="div">{children}</Typography>
    </Box>
  );
}

function CompanyCard({ company }: { company: CompanyAnemic }) {
  const { t } = useTranslation(PARTICIPANTS_NS);
  return (
    <Card sx={{ borderRadius: '10px', boxShadow: `0 0 32px ${alpha(tractusx.orange, 0.12)}` }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' }, mb: 4 }}>
          <Box
            aria-hidden
            sx={{ width: 52, height: 52, borderRadius: '10px', display: 'grid', placeItems: 'center', color: tractusx.orange, bgcolor: alpha(tractusx.orange, 0.15) }}
          >
            <BusinessOutlinedIcon />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography id="company-name" variant="h2" component="h2" sx={{ fontSize: 28 }}>
              {company.name}
            </Typography>
            {company.dataspaceName && (
              <Typography color="text.secondary">{t('participantOf', { dataspace: company.dataspaceName })}</Typography>
            )}
          </Box>
          <Chip label={t(`status.${company.status}`)} color={STATUS_COLOR[company.status]} variant="outlined" sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }} />
        </Stack>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Field name={t('fields.bpn')}>{company.bpn ?? t('bpnNotAssigned')}</Field>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Field name={t('fields.address')}>
              {company.address.street}
              <br />
              {company.address.city}, {company.address.countryCode}
            </Field>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Field name={t('fields.coreData')}>{t(`coreDataSource.${company.coreDataSource}`)}</Field>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field name={t('fields.identifiers')}>
              <Stack component="ul" spacing={0.5} sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {company.identifiers.map((identifier) => (
                  <Stack component="li" key={`${identifier.type}-${identifier.value}`} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <span>
                      {t('identifier', {
                        type: t(`identifierTypes.${identifier.type}`, { defaultValue: identifier.type.replaceAll('_', ' ') }),
                        value: identifier.value,
                      })}
                    </span>
                    {identifier.verified && <VerifiedUserOutlinedIcon fontSize="small" titleAccess={t('verified')} />}
                  </Stack>
                ))}
              </Stack>
            </Field>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field name={t('fields.roles')}>
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', pt: 0.5 }}>
                {company.companyRoles.map((role) => (
                  <Chip key={role} label={t(`roles.${role}`, { defaultValue: readable(role) })} size="small" />
                ))}
              </Stack>
            </Field>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

/**
 * Participant management, first page: the company of the signed-in person, read from C3-M1 Company Profile
 * (GET /api/c3-m1/companies/{companyId}). The example for the hackathon: docs/developers/integrate-a-backend-module.md.
 */
export default function CompanyProfile() {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const state = useOwnCompany();
  const { identity } = useCoreModules();

  let body: ReactNode;
  switch (state.status) {
    case 'loading':
      body = (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }} role="status">
          <CircularProgress size={24} />
          <Typography>{t('loading')}</Typography>
        </Stack>
      );
      break;
    case 'signed-out':
      body = (
        <Alert
          severity="info"
          action={
            <Button color="inherit" startIcon={<LoginIcon />} onClick={() => identity.login.execute('/participants')}>
              {t('signIn')}
            </Button>
          }
        >
          {t('signInPrompt')}
        </Alert>
      );
      break;
    case 'no-company':
      body = <Alert severity="info">{t('noCompany')}</Alert>;
      break;
    case 'not-found':
      body = <Alert severity="warning">{t('notFound')}</Alert>;
      break;
    case 'failed':
      body = (
        <Alert severity="error">
          {state.error.status
            ? t('failedWithStatus', { status: state.error.status, message: state.error.message })
            : t('failed', { message: state.error.message })}
          {state.error.problemType && (
            <Typography variant="body2" component="div" sx={{ fontFamily: 'monospace', mt: 0.5 }}>
              {state.error.problemType}
            </Typography>
          )}
        </Alert>
      );
      break;
    default:
      body = <CompanyCard company={state.company} />;
  }

  return (
    <Container component="article" maxWidth="lg" aria-labelledby="participants-title" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="overline" color="text.secondary">
        {t('overline')}
      </Typography>
      <Typography id="participants-title" variant="h1" component="h1" sx={{ fontSize: 'clamp(2rem, 2vw + 1rem, 2.75rem)', mb: 4 }}>
        {t('title')}
      </Typography>
      {body}
    </Container>
  );
}
