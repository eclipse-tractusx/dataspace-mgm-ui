/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Card, Stack, Typography } from '@dataspace-mgm/ui-mui';
import {
  useAcceptInvitationMutation,
  useCreateInvitationMutation,
  useListInvitationsQuery,
  useRevokeInvitationMutation,
} from './company.api';
import { COMPANY_NS } from './i18n';
import { inputSx, labelSx } from '../input-styles';

const INVITATION_CODE_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export function AcceptInvitationSection({ onAccepted }: { onAccepted?: () => void }) {
  const { t } = useTranslation(COMPANY_NS);
  const [codeInput, setCodeInput] = useState('');
  const [accept, acceptance] = useAcceptInvitationMutation();
  const trimmedCode = codeInput.trim();
  const validCode = INVITATION_CODE_PATTERN.test(trimmedCode);

  return (
    <Card sx={{ p: 3, mt: 3 }}>
      <Typography variant="h3">{t('acceptInvitationTitle')}</Typography>
      <Stack spacing={2} sx={{ mt: 2, alignItems: 'flex-start', '& > label': { width: '100%', maxWidth: 480 } }}>
        <Box component="label" sx={labelSx}>
          {t('invitationCodeLabel')}
          <Box
            component="input"
            sx={inputSx}
            value={codeInput}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCodeInput(event.target.value)}
          />
        </Box>
        <Button
          variant="contained"
          disabled={!validCode || acceptance.isLoading}
          onClick={() => {
            void accept(trimmedCode).then((response) => {
              if ('data' in response && response.data?.status === 'success') {
                setCodeInput('');
              }
            });
          }}
        >
          {t('acceptInvitationButton')}
        </Button>
      </Stack>
      {acceptance.data?.status === 'success' && (
        <Alert
          severity="success"
          sx={{ mt: 2 }}
          action={onAccepted ? <Button color="inherit" onClick={onAccepted}>{t('refreshSession')}</Button> : undefined}
        >
          {t('acceptInvitationSuccess')}
        </Alert>
      )}
      {(acceptance.isError || (acceptance.data && acceptance.data.status !== 'success')) && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {t('acceptInvitationError')}
        </Alert>
      )}
    </Card>
  );
}

export function Invitations({ companyId }: { companyId: string }) {
  const { t } = useTranslation(COMPANY_NS);
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [roles, setRoles] = useState('');
  // A one-time invitation code is kept only in transient component state and never placed in a URL.
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const list = useListInvitationsQuery(companyId);
  const [create, creation] = useCreateInvitationMutation();
  const [revoke, revocation] = useRevokeInvitationMutation();
  const roleList = roles.split(',').map((role) => role.trim()).filter(Boolean);
  const valid = givenName.trim() && familyName.trim() && roleList.length > 0 && roleList.length === new Set(roleList).size;
  return (
    <Card sx={{ p: 3, mt: 3 }}>
      <Typography variant="h3">{t('invitations')}</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5 }}>{t('invitationMockNotice')}</Typography>
      <Stack spacing={2} sx={{ mt: 2, alignItems: 'flex-start', '& > label': { width: '100%', maxWidth: 480 } }}>
        <Box component="label" sx={labelSx}>{t('givenName')} <Box component="input" sx={inputSx} value={givenName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setGivenName(event.target.value)} /></Box>
        <Box component="label" sx={labelSx}>{t('familyName')} <Box component="input" sx={inputSx} value={familyName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFamilyName(event.target.value)} /></Box>
        <Box component="label" sx={labelSx}>{t('invitationRoles')} <Box component="input" sx={inputSx} value={roles} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRoles(event.target.value)} /></Box>
        <Button disabled={!valid || creation.isLoading} onClick={() => {
          setError(false); setCode(null);
          void create({ companyId, input: { givenName: givenName.trim(), familyName: familyName.trim(), portalRoles: roleList }, onCode: setCode }).then((response) => {
            if ('data' in response && response.data?.status === 'success') {
              setGivenName(''); setFamilyName(''); setRoles('');
            } else { setError(true); }
            creation.reset();
          });
        }}>{t('createInvitation')}</Button>
      </Stack>
      {code && (
        <Alert severity="info" sx={{ mt: 2 }} action={<Button color="inherit" onClick={() => setCode(null)}>{t('dismissCode')}</Button>}>
          {t('oneTimeCode')} <strong>{code}</strong>
        </Alert>
      )}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{t('invitationError')}</Alert>}
      {(list.isError || (list.data && list.data.status !== 'success')) && <Alert severity="error" sx={{ mt: 2 }}>{t('invitationListError')}</Alert>}
      {list.data?.status === 'success' && (
        <Box sx={{ mt: 2 }}>
          {list.data.data.length ? (
            list.data.data.map((invitation) => (
              <Stack
                key={invitation.id}
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                  py: 1.5,
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography>{invitation.givenName} {invitation.familyName} — {invitation.roles.join(', ')}</Typography>
                <Button variant="outlined" disabled={revocation.isLoading} onClick={() => { void revoke({ companyId, invitationId: invitation.id }); }}>{t('revokeInvitation')}</Button>
              </Stack>
            ))
          ) : (
            <Typography color="text.secondary">{t('noInvitations')}</Typography>
          )}
        </Box>
      )}
      {(revocation.isError || (revocation.data && revocation.data.status !== 'success')) && <Alert severity="error" sx={{ mt: 2 }}>{t('revokeError')}</Alert>}
    </Card>
  );
}
