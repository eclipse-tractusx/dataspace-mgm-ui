/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import { useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Card, Stack, Typography } from '@dataspace-mgm/ui-mui';
import type { CompanyUserDetailAnemic } from '@dataspace-mgm/c2-m2-core';
import { useGetCompanyAppRolesQuery, useSetUserAppRolesMutation } from './company.api';
import { COMPANY_NS } from './i18n';
import { checkboxSx, inputSx, labelSx } from '../input-styles';

export function AppRoleEditor({ companyId, user, canAssign }: { companyId: string; user: CompanyUserDetailAnemic; canAssign: boolean }) {
  const { t, i18n } = useTranslation(COMPANY_NS);
  const [appInput, setAppInput] = useState('');
  const [appId, setAppId] = useState('');
  const [draft, setDraft] = useState<string[] | null>(null);
  const query = useGetCompanyAppRolesQuery(appId ? { companyId, appId, lang: i18n.resolvedLanguage?.slice(0, 2) ?? 'en' } : skipToken);
  const [save, mutation] = useSetUserAppRolesMutation();
  const app = query.currentData?.status === 'success' ? query.currentData.data : null;
  return (
    <Card sx={{ p: 3, mt: 2 }}>
      <Typography variant="h3">{t('manageAppRoles')}</Typography>
      <Stack direction="row" sx={{ mt: 1.5, alignItems: 'flex-end', flexWrap: 'wrap', gap: 1.5 }}>
        <Box component="label" sx={{ ...labelSx, flexGrow: 1, maxWidth: 480 }}>
          {t('appId')}{' '}
          <Box
            component="input"
            sx={inputSx}
            value={appInput}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAppInput(event.target.value)}
          />
        </Box>
        <Button
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
                  <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5, overflowWrap: 'anywhere' }}>
                    <Box
                      component="input"
                      type="checkbox"
                      sx={checkboxSx}
                      checked={draft.includes(role.name)}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setDraft(event.target.checked ? [...draft, role.name] : draft.filter((name) => name !== role.name))
                      }
                    />{' '}
                    {role.name} {role.description}
                  </Box>
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
