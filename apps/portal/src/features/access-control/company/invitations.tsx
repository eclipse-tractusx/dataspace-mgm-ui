/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 * Assisted-By: Claude Code (claude-opus-5-5)
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Invitation } from '@dataspace-mgm/c2-m2-core';
import {
  Alert,
  Box,
  Button,
  Card,
  DataTable,
  MailOutlineOutlinedIcon,
  Stack,
  TextField,
  Typography,
  type GridColDef,
  type GridRenderCellParams,
} from '@dataspace-mgm/ui-mui';
import {
  useAcceptInvitationMutation,
  useCreateInvitationMutation,
  useListInvitationsQuery,
  useRevokeInvitationMutation,
} from './company.api';
import { COMPANY_NS } from './i18n';
import { cardGridSx, DotChip, Identity, ListToolbar, Tag, toneOf, useTableLocale, useViewMode } from '../people/display';

const INVITATION_CODE_PATTERN = /^[A-Za-z0-9_-]{43}$/;

const cardSx = { p: { xs: 3, md: 3.5 }, mt: 3, '&:hover': { boxShadow: 'none' } } as const;

export function AcceptInvitationSection({ onAccepted }: { onAccepted?: () => void }) {
  const { t } = useTranslation(COMPANY_NS);
  const [codeInput, setCodeInput] = useState('');
  const [accept, acceptance] = useAcceptInvitationMutation();
  const trimmedCode = codeInput.trim();
  const validCode = INVITATION_CODE_PATTERN.test(trimmedCode);

  return (
    <Card component="section" aria-label={t('acceptInvitationTitle')} sx={cardSx}>
      <Identity name={t('acceptInvitationTitle')} secondary={t('acceptInvitationIntro')} icon={<MailOutlineOutlinedIcon />} size={44} wrap />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3, alignItems: { xs: 'stretch', sm: 'flex-start' } }}>
        <TextField
          size="small"
          label={t('invitationCodeLabel')}
          value={codeInput}
          onChange={(event) => setCodeInput(event.target.value)}
          error={Boolean(trimmedCode) && !validCode}
          slotProps={{ htmlInput: { spellCheck: false, autoComplete: 'off' } }}
          sx={{ flex: 1, maxWidth: { sm: 520 }, '& input': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } }}
        />
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
          sx={{ px: 2.5, height: 40 }}
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
  const { t, i18n } = useTranslation(COMPANY_NS);
  const locale = useTableLocale();
  const [mode, setMode] = useViewMode('invitations');
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
  const date = (value: string) => new Intl.DateTimeFormat(i18n.resolvedLanguage ?? 'en', { dateStyle: 'medium' }).format(new Date(value));
  const person = (invitation: Invitation) => [invitation.givenName, invitation.familyName].filter(Boolean).join(' ') || '—';
  const state = (invitation: Invitation) => <DotChip tone={toneOf(invitation.status)} label={t(`invitationStates.${invitation.status}`, { defaultValue: invitation.status })} />;
  const roleTags = (invitation: Invitation) => (
    <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 0.75 }}>
      {invitation.roles.map((role) => <Tag key={role}>{role}</Tag>)}
    </Stack>
  );
  const revokeButton = (invitation: Invitation) => (
    <Button
      size="small"
      variant="text"
      color="error"
      disabled={revocation.isLoading}
      aria-label={`${t('revokeInvitation')}: ${person(invitation)}`}
      onClick={() => { void revoke({ companyId, invitationId: invitation.id }); }}
    >
      {t('revokeInvitation')}
    </Button>
  );
  const columns: GridColDef<Invitation>[] = [
    { field: 'person', headerName: t('invitee'), flex: 1.3, minWidth: 200, valueGetter: (_, row) => person(row), renderCell: ({ row }: GridRenderCellParams<Invitation>) => <Identity name={person(row)} /> },
    { field: 'roles', headerName: t('portalRoles'), flex: 1, minWidth: 160, sortable: false, renderCell: ({ row }: GridRenderCellParams<Invitation>) => roleTags(row) },
    { field: 'status', headerName: t('invitationStatus'), width: 130, renderCell: ({ row }: GridRenderCellParams<Invitation>) => state(row) },
    { field: 'createdAt', headerName: t('created'), width: 130, valueFormatter: (value: string) => date(value) },
    { field: 'expiresAt', headerName: t('expires'), width: 130, valueFormatter: (value: string) => date(value) },
    { field: 'actions', headerName: '', width: 180, sortable: false, align: 'right', renderCell: ({ row }: GridRenderCellParams<Invitation>) => revokeButton(row) },
  ];
  const invitations = list.data?.status === 'success' ? list.data.data : [];
  return (
    <Card component="section" aria-labelledby="invitations-title" sx={cardSx}>
      <Typography id="invitations-title" variant="h2" sx={{ fontSize: '1.375rem', fontWeight: 700 }}>
        {t('invitations')}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5 }}>{t('invitationMockNotice')}</Typography>
      <Box
        component="form"
        aria-label={t('newInvitation')}
        onSubmit={(event: React.FormEvent) => event.preventDefault()}
        sx={{ mt: 2.5, p: 2, borderRadius: '10px', border: 1, borderColor: 'divider', display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1.4fr auto' }, alignItems: 'start' }}
      >
        <TextField size="small" label={t('givenName')} value={givenName} onChange={(event) => setGivenName(event.target.value)} />
        <TextField size="small" label={t('familyName')} value={familyName} onChange={(event) => setFamilyName(event.target.value)} />
        <TextField size="small" label={t('invitationRoles')} placeholder={t('invitationRolesHint')} value={roles} onChange={(event) => setRoles(event.target.value)} />
        <Button
          type="submit"
          variant="contained"
          disabled={!valid || creation.isLoading}
          sx={{ height: 40, px: 2.5, whiteSpace: 'nowrap' }}
          onClick={() => {
            setError(false); setCode(null);
            void create({ companyId, input: { givenName: givenName.trim(), familyName: familyName.trim(), portalRoles: roleList }, onCode: setCode }).then((response) => {
              if ('data' in response && response.data?.status === 'success') {
                setGivenName(''); setFamilyName(''); setRoles('');
              } else { setError(true); }
              creation.reset();
            });
          }}
        >
          {t('createInvitation')}
        </Button>
      </Box>
      {code && (
        <Alert severity="info" sx={{ mt: 2 }} action={<Button color="inherit" onClick={() => setCode(null)}>{t('dismissCode')}</Button>}>
          {t('oneTimeCode')} <Box component="strong" sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', overflowWrap: 'anywhere' }}>{code}</Box>
        </Alert>
      )}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{t('invitationError')}</Alert>}
      {(list.isError || (list.data && list.data.status !== 'success')) && <Alert severity="error" sx={{ mt: 2 }}>{t('invitationListError')}</Alert>}
      {list.data?.status === 'success' && (
        <Box sx={{ mt: 3 }}>
          <ListToolbar
            filters={<Typography sx={{ fontWeight: 700 }}>{t('openInvitations')}</Typography>}
            count={t('invitationCount', { count: invitations.length })}
            mode={mode}
            onMode={setMode}
          />
          {invitations.length === 0 ? (
            <Typography color="text.secondary">{t('noInvitations')}</Typography>
          ) : mode === 'table' ? (
            <DataTable<Invitation> aria-label={t('openInvitations')} rows={invitations} columns={columns} locale={locale} hideFooter={invitations.length <= 10} />
          ) : (
            <Box sx={cardGridSx} component="ul" aria-label={t('openInvitations')} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {invitations.map((invitation) => (
                <Card component="li" key={invitation.id} sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Identity name={person(invitation)} secondary={`${t('expires')} ${date(invitation.expiresAt)}`} size={44} />
                    {state(invitation)}
                  </Stack>
                  {roleTags(invitation)}
                  <Box sx={{ mt: 'auto', ml: -1 }}>{revokeButton(invitation)}</Box>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      )}
      {(revocation.isError || (revocation.data && revocation.data.status !== 'success')) && <Alert severity="error" sx={{ mt: 2 }}>{t('revokeError')}</Alert>}
    </Card>
  );
}
