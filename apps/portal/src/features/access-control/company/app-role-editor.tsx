/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 * Assisted-By: Claude Code (claude-opus-5-5)
 */
import { useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Card, Checkbox, FormControlLabel, Stack, TextField, Typography } from '@dataspace-mgm/ui-mui';
import type { CompanyUserDetailAnemic } from '@dataspace-mgm/c2-m2-core';
import { useGetCompanyAppRolesQuery, useSetUserAppRolesMutation } from './company.api';
import { COMPANY_NS } from './i18n';

export function AppRoleEditor({ companyId, user, canAssign }: { companyId: string; user: CompanyUserDetailAnemic; canAssign: boolean }) {
  const { t, i18n } = useTranslation(COMPANY_NS);
  const [appInput, setAppInput] = useState('');
  const [appId, setAppId] = useState('');
  const [draft, setDraft] = useState<string[] | null>(null);
  const query = useGetCompanyAppRolesQuery(appId ? { companyId, appId, lang: i18n.resolvedLanguage?.slice(0, 2) ?? 'en' } : skipToken);
  const [save, mutation] = useSetUserAppRolesMutation();
  const app = query.currentData?.status === 'success' ? query.currentData.data : null;
  return (
    <Card component="section" aria-label={t('manageAppRoles')} sx={{ p: { xs: 3, md: 3.5 }, mt: 3, '&:hover': { boxShadow: 'none' } }}>
      <Typography variant="h3" sx={{ fontSize: '1.125rem', fontWeight: 700 }}>{t('manageAppRoles')}</Typography>
      <Stack direction="row" sx={{ mt: 2, alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <TextField
          size="small"
          label={t('appId')}
          value={appInput}
          onChange={(event) => setAppInput(event.target.value)}
          sx={{ flexGrow: 1, maxWidth: 480 }}
        />
        <Button
          sx={{ height: 40 }}
          variant="outlined"
          disabled={!appInput.trim()}
          onClick={() => {
            setDraft(null);
            mutation.reset();
            setAppId(appInput.trim());
          }}
        >
          {t('loadAppRoles')}
        </Button>
      </Stack>
      {query.isFetching && <Typography sx={{ mt: 2 }}>{t('loadingAppRoles')}</Typography>}
      {(query.isError || (query.currentData && query.currentData.status !== 'success')) && (
        <Alert severity="error" sx={{ mt: 2 }}>{t('appRolesLoadError')}</Alert>
      )}
      {app && (
        <Stack spacing={1.5} sx={{ mt: 2, alignItems: 'flex-start' }}>
          {!app.templateExists && <Typography color="text.secondary">{t('noAppTemplate')}</Typography>}
          {!app.assignable && <Typography color="text.secondary">{t('appNotAssignable')}</Typography>}
          <Stack spacing={0.5}>
            {app.roles.map((role) => (
              <Box key={role.name}>
                {draft !== null ? (
                  <FormControlLabel
                    sx={{ overflowWrap: 'anywhere' }}
                    control={
                      <Checkbox
                        size="small"
                        checked={draft.includes(role.name)}
                        onChange={(event) =>
                          setDraft(event.target.checked ? [...draft, role.name] : draft.filter((name) => name !== role.name))
                        }
                      />
                    }
                    label={`${role.name} ${role.description ?? ''}`.trim()}
                  />
                ) : (
                  <Typography>{role.name} {role.description}</Typography>
                )}
              </Box>
            ))}
          </Stack>
          {canAssign && app.assignable && app.templateExists && (
            draft === null ? (
              <Button
                variant="outlined"
                onClick={() => {
                  const targetIds = new Set(app.instanceClients.map((client) => client.appInstanceClientId));
                  setDraft([...new Set(user.appRoles.filter((item) => item.appId === appId && targetIds.has(item.appInstanceClientId)).flatMap((item) => item.roles))]);
                  mutation.reset();
                }}
              >
                {t('editAppRoles')}
              </Button>
            ) : (
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  disabled={mutation.isLoading}
                  onClick={() => {
                    void save({ companyId, userId: user.userId, appId, roles: draft }).then((response) => {
                      if ('data' in response && response.data?.status === 'success') {
                        setDraft(null);
                      }
                    });
                  }}
                >
                  {t('saveAppRoles')}
                </Button>
                <Button variant="outlined" disabled={mutation.isLoading} onClick={() => setDraft(null)}>
                  {t('cancel')}
                </Button>
              </Stack>
            )
          )}
          {(mutation.isError || (mutation.data && mutation.data.status !== 'success')) && (
            <Alert severity="error" sx={{ width: '100%' }}>{t('appRolesSaveError')}</Alert>
          )}
        </Stack>
      )}
    </Card>
  );
}
