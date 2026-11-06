/* Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra */
import { skipToken } from '@reduxjs/toolkit/query';
import { useState, type FormEvent } from 'react';
import { Alert, Box, Button, Card, Stack, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import type { Origin, Status, TechnicalUserFilters, WalletAccess } from '@dataspace-mgm/c2-m3-core';
import { useCoreModules, useSession } from '../../../core/CoreModulesContext';
import { checkboxSx, inputSx, labelSx } from '../input-styles';
import { TechnicalUsers, type PeopleStatus, type TechnicalFilters } from '../people';
import { useCreateTechnicalUserMutation, useDeleteTechnicalUserMutation, useGetTechnicalUserQuery, useListAssignableTechnicalRolesQuery, useListTechnicalUsersQuery, useRotateTechnicalCredentialsMutation, useUpdateTechnicalUserMutation } from './technical.api';
import { TECHNICAL_NS } from './i18n';

const statuses = ['ACTIVE', 'PENDING', 'INACTIVE', 'PENDING_DELETION', 'DELETED'];
const origins = ['OWN', 'SUBSCRIPTION'];
const wallets = ['NONE', 'REQUESTED', 'ACTIVE', 'FAILED', 'REMOVING'];

export function TechnicalUsersPage() {
  const [credentials, setCredentials] = useState<Readonly<{ iamClientId: string; secret: string; tokenUrl: string }> | null>(null);
  const [noCredentials, setNoCredentials] = useState(false);
  const { identity } = useCoreModules();
  const session = useSession();
  const { t, i18n } = useTranslation(TECHNICAL_NS);
  const text = (key: string) => t(key);
  const [params, setParams] = useSearchParams();
  const companyId = session.status === 'signed-in' ? session.session.companyId : null;
  const canView = session.status === 'signed-in' && session.session.permissions.includes('view_technical_users');
  const canManage = canView && session.status === 'signed-in' && session.session.permissions.includes('manage_technical_users');
  const canDelete = canView && session.status === 'signed-in' && session.session.permissions.includes('delete_technical_users');
  const action = params.get('action');
  const validAction = action === 'create' || action === 'edit' || action === 'rotate' || action === 'delete' ? action : null;
  const status = params.get('status') ?? '';
  const origin = params.get('origin') ?? '';
  const walletAccess = params.get('walletAccess') ?? '';
  const rawPage = params.get('page') ?? '0';
  const page = /^\d+$/.test(rawPage) && Number.isSafeInteger(Number(rawPage)) ? Number(rawPage) : 0;
  const filters: TechnicalFilters = {
    status: statuses.includes(status) ? status : '',
    origin: origins.includes(origin) ? origin : '',
    walletAccess: wallets.includes(walletAccess) ? walletAccess : '',
  };
  const queryFilters: TechnicalUserFilters = {
    page,
    ...(filters.status && { status: [filters.status as Status] }),
    ...(filters.origin && { origin: filters.origin as Origin }),
    ...(filters.walletAccess && { walletAccess: filters.walletAccess as WalletAccess }),
  };
  const list = useListTechnicalUsersQuery(companyId && canView ? { companyId, filters: queryFilters } : skipToken);
  const id = params.get('technicalUser');
  const detail = useGetTechnicalUserQuery(companyId && canView && id ? { companyId, id } : skipToken);
  const roles = useListAssignableTechnicalRolesQuery(companyId && canManage && (validAction === 'create' || validAction === 'edit') ? { companyId, lang: i18n.resolvedLanguage ?? 'en' } : skipToken);
  const [create, creating] = useCreateTechnicalUserMutation();
  const [update, updating] = useUpdateTechnicalUserMutation();
  const [rotate, rotating] = useRotateTechnicalCredentialsMutation();
  const [remove, removing] = useDeleteTechnicalUserMutation();
  const listResult = list.currentData;
  let state: PeopleStatus = 'loading';
  if (session.status === 'signed-out') { state = 'signed-out'; }
  else if (session.status === 'failed' || list.isError) { state = 'error'; }
  else if (session.status === 'signed-in' && !companyId) { state = 'not-connected'; }
  else if (session.status === 'signed-in' && !canView) { state = 'forbidden'; }
  else if (listResult?.status === 'success') { state = listResult.data.total === 0 && !filters.status && !filters.origin && !filters.walletAccess ? 'empty' : 'loaded'; }
  else if (listResult?.status === 'forbidden') { state = 'forbidden'; }
  else if (listResult?.status === 'not-found') { state = 'not-found'; }
  else if (listResult?.status === 'conflict') { state = 'conflict'; }
  else if (listResult?.status === 'failed') { state = 'error'; }

  const items = listResult?.status === 'success' ? listResult.data.items : [];
  const selected = detail.currentData?.status === 'success' ? detail.currentData.data : null;
  const setAction = (next: string | null, result?: string) => setParams((previous) => {
    const updated = new URLSearchParams(previous);
    if (next) { updated.set('action', next); } else { updated.delete('action'); }
    if (result) { updated.set('result', result); } else { updated.delete('result'); }
    return updated;
  });
  const permitted = validAction === 'delete' ? canDelete : canManage;
  const active = permitted && (validAction === 'create' || (validAction && selected)) ? validAction : null;
  const busy = creating.isLoading || updating.isLoading || rotating.isLoading || removing.isLoading;
  const resultKey = params.get('result');
  const allowedResults = ['success', 'pending', 'forbidden', 'not-found', 'conflict', 'failed'] as const;
  const result = allowedResults.find((value) => value === resultKey);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!companyId || !active || busy) { return; }
    setCredentials(null);
    setNoCredentials(false);
    const onCredentials = (value: typeof credentials) => {
      setCredentials(value);
      setNoCredentials(value === null);
    };
    try {
      let outcome;
      if (active === 'create' || active === 'edit') {
        if (roles.currentData?.status !== 'success') { return; }
        const form = new FormData(event.currentTarget);
        const input = { name: String(form.get('name') ?? '').trim(), description: String(form.get('description') ?? ''), roles: form.getAll('roles').map((name) => ({ name: String(name) })) };
        if (!input.name) { return; }
        outcome = active === 'create' ? await create({ companyId, input, onCredentials }).unwrap() : await update({ companyId, id: selected!.id, input }).unwrap();
      } else {
        outcome = active === 'rotate' ? await rotate({ companyId, id: selected!.id, onCredentials }).unwrap() : await remove({ companyId, id: selected!.id }).unwrap();
      }
      if (outcome.status !== 'success') { setAction(active, outcome.status); return; }
      const pending = active === 'delete' && 'status' in outcome.data && outcome.data.status === 'pending';
      setAction(null, pending ? 'pending' : 'success');
    } catch {
      setAction(active, 'failed');
    }
  }
  return <>
  {credentials && <Card sx={{ p: 3, mb: 3 }} role="region" aria-label={text('credentialsTitle')}>
    <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
      <Typography variant="h2">{text('credentialsTitle')}</Typography>
      <Alert severity="warning" sx={{ width: '100%' }}>{text('credentialsOnce')}</Alert>
      <Stack spacing={1} sx={{ width: '100%' }}>
        <Typography sx={{ overflowWrap: 'anywhere' }}>{text('clientId')}: {credentials.iamClientId}</Typography>
        <Typography sx={{ overflowWrap: 'anywhere' }}>{text('secret')}: {credentials.secret}</Typography>
        <Typography sx={{ overflowWrap: 'anywhere' }}>{text('tokenUrl')}: {credentials.tokenUrl}</Typography>
      </Stack>
      <Button variant="outlined" onClick={() => setCredentials(null)}>{text('dismissCredentials')}</Button>
    </Stack>
  </Card>}
  {noCredentials && <Alert severity="info" sx={{ mb: 2 }} onClose={() => setNoCredentials(false)}>{text('noCredentials')}</Alert>}
  {result && <Alert severity={result === 'success' || result === 'pending' ? 'success' : 'error'} sx={{ mb: 2 }}>{text(result)}</Alert>}
  <TechnicalUsers
    status={state}
    users={items.map((user) => ({ ...user, description: user.description ?? undefined }))}
    filters={filters}
    onFiltersChange={(next) => setParams((previous) => {
      const updated = new URLSearchParams(previous);
      for (const key of ['status', 'origin', 'walletAccess'] as const) {
        if (next[key]) { updated.set(key, next[key]); } else { updated.delete(key); }
      }
      updated.delete('technicalUser');
      updated.delete('page');
      return updated;
    })}
    onView={(user) => {
      const item = items.find((candidate) => candidate.iamClientId === user.iamClientId);
      if (item) { setParams((previous) => { const updated = new URLSearchParams(previous); updated.set('technicalUser', item.id); return updated; }); }
    }}
    selectedUser={selected ? { ...selected, description: selected.description ?? undefined, roles: selected.roles.map((role) => role.name) } : null}
    onCloseDetails={() => setParams((previous) => { const updated = new URLSearchParams(previous); updated.delete('technicalUser'); return updated; })}
    onCreate={canManage ? () => setAction('create') : undefined}
    onEdit={canManage && (!selected || (selected.viewerRole === 'OWNER' && !selected.disabled)) ? () => setAction('edit') : undefined}
    onRotate={canManage && (!selected || (selected.viewerRole === 'OWNER' && !selected.disabled)) ? () => setAction('rotate') : undefined}
    onDelete={canDelete ? () => setAction('delete') : undefined}
    onRetry={() => { void list.refetch(); }}
    onSignIn={() => identity.login.execute(window.location.pathname)}
  />
  {listResult?.status === 'success' && <Stack direction="row" sx={{ gap: 1, mt: 2, alignItems: 'center' }}>
    <Button disabled={page === 0 || list.isFetching} onClick={() => setParams((previous) => { const updated = new URLSearchParams(previous); updated.set('page', String(page - 1)); updated.delete('technicalUser'); return updated; })}>{text('previous')}</Button>
    <Typography>{t('page', { page: page + 1 })}</Typography>
    <Button disabled={(page + 1) * listResult.data.size >= listResult.data.total || list.isFetching} onClick={() => setParams((previous) => { const updated = new URLSearchParams(previous); updated.set('page', String(page + 1)); updated.delete('technicalUser'); return updated; })}>{text('next')}</Button>
  </Stack>}
  {id && detail.isFetching && <Typography role="status" sx={{ mt: 2 }}>{text('detailLoading')}</Typography>}
  {id && !detail.isFetching && (detail.isError || (detail.currentData && detail.currentData.status !== 'success')) && <Alert severity="error" sx={{ mt: 2 }}>{detail.currentData && detail.currentData.status !== 'success' && detail.currentData.status !== 'failed' ? text(detail.currentData.status) : text('detailError')} <Button onClick={() => { void detail.refetch(); }}>{text('retry')}</Button></Alert>}
  {active && <Card sx={{ p: 3, mt: 3 }}>
    <Typography variant="h2">{text(active === 'create' ? 'createTitle' : active === 'edit' ? 'editTitle' : active === 'rotate' ? 'rotateTitle' : 'deleteTitle')}</Typography>
    <Box component="form" onSubmit={submit}>
      {(active === 'create' || active === 'edit') && <Stack sx={{ gap: 2, my: 2.5 }}>
        <Box component="label" sx={labelSx}>{text('name')}<Box component="input" name="name" required defaultValue={active === 'edit' ? selected?.name : ''} sx={inputSx} /></Box>
        <Box component="label" sx={labelSx}>{text('description')}<Box component="textarea" name="description" rows={3} defaultValue={active === 'edit' ? selected?.description ?? '' : ''} sx={inputSx} /></Box>
        <Box component="fieldset" sx={{ minWidth: 0, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}><legend>{text('roles')}</legend>
          {roles.isFetching && <Typography role="status">{text('rolesLoading')}</Typography>}
          {(roles.isError || (roles.currentData && roles.currentData.status !== 'success')) && <Alert severity="error">{text('rolesError')} <Button onClick={() => { void roles.refetch(); }}>{text('roles')}</Button></Alert>}
          {roles.currentData?.status === 'success' && roles.currentData.data.map((role) => <Box component="label" key={role.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}><Box component="input" type="checkbox" name="roles" value={role.name} defaultChecked={active === 'edit' && selected?.roles.some((item) => item.name === role.name)} sx={checkboxSx} /> {role.name}</Box>)}
        </Box>
      </Stack>}
      <Stack direction="row" sx={{ gap: 1, mt: 2.5, flexWrap: 'wrap' }}><Button type="submit" variant="contained" disabled={busy || ((active === 'create' || active === 'edit') && roles.currentData?.status !== 'success')}>{busy ? text('working') : text(active === 'create' || active === 'edit' ? 'save' : 'confirm')}</Button><Button variant="outlined" onClick={() => setAction(null)} disabled={busy}>{text('cancel')}</Button></Stack>
    </Box>
  </Card>}
  </>;
}
