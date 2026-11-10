/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 * Assisted-By: Claude Code (claude-opus-5-5)
 */
import { skipToken } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Card, Stack, TextField, Typography } from '@dataspace-mgm/ui-mui';
import { useCoreModules, useSession } from '../../../core/CoreModulesContext';
import { Users, type CompanyUser, type PeopleStatus } from '../people';
import { useGetCompanyUserQuery, useListCompanyUsersQuery, useRemoveCompanyUserMutation, useSetCompanyUserPortalRolesMutation } from './company.api';
import { companyUsersSlice } from './company.slice';
import { COMPANY_NS } from './i18n';
import { AcceptInvitationSection, Invitations } from './invitations';
import { AppRoleEditor } from './app-role-editor';
import { Tag } from '../people/display';

const sectionSx = { p: { xs: 3, md: 3.5 }, mt: 3, '&:hover': { boxShadow: 'none' } } as const;
const sectionTitleSx = { fontSize: '1.125rem', fontWeight: 700 } as const;

type CompanyState = { companyUsersUi: ReturnType<typeof companyUsersSlice.reducer> };
const actions = companyUsersSlice.actions;

export function CompanyUsers() {
  const { identity, c2m2 } = useCoreModules();
  const session = useSession();
  const companyId = session.status === 'signed-in' ? session.session.companyId : null;
  const canView = session.status === 'signed-in' && session.session.permissions.includes('view_company_users');
  const canManage = session.status === 'signed-in' && session.session.permissions.includes('manage_company_users');
  const canInvite = Boolean(companyId && canManage && c2m2.listInvitations && c2m2.createInvitation && c2m2.revokeInvitation);
  const canAcceptInvitation = Boolean(
    session.status === 'signed-in' &&
      !companyId &&
      session.session.permissions.includes('accept_invitation') &&
      c2m2.acceptInvitation,
  );
  const canViewAppRoles = session.status === 'signed-in' && session.session.permissions.includes('view_app_roles');
  const canAssignAppRoles = session.status === 'signed-in' && session.session.permissions.includes('assign_app_roles');
  const ui = useSelector((state: CompanyState) => state.companyUsersUi);
  const dispatch = useDispatch();
  const { t } = useTranslation(COMPANY_NS);
  const list = useListCompanyUsersQuery(companyId && canView ? { companyId, page: ui.page, filter: ui.filter } : skipToken);
  const detail = useGetCompanyUserQuery(companyId && canView && ui.selectedUserId ? { companyId, userId: ui.selectedUserId } : skipToken);
  const [remove, removal] = useRemoveCompanyUserMutation();
  const [setRoles, roleUpdate] = useSetCompanyUserPortalRolesMutation();
  const result = list.currentData;
  let status: PeopleStatus = 'loading';
  if (session.status === 'signed-out') { status = 'signed-out'; }
  else if (session.status === 'failed' || list.isError) { status = 'error'; }
  else if (session.status === 'signed-in' && !companyId) { status = 'not-connected'; }
  else if (session.status === 'signed-in' && !canView) { status = 'forbidden'; }
  else if (result?.status === 'forbidden' || result?.status === 'not-found' || result?.status === 'conflict') { status = result.status; }
  else if (result?.status === 'failed') { status = 'error'; }
  else if (result?.status === 'success') { status = result.data.total === 0 && !ui.filter ? 'empty' : 'loaded'; }
  const users: CompanyUser[] = result?.status === 'success' ? result.data.items.map((user) => ({ ...user, givenName: user.givenName ?? '', familyName: user.familyName ?? '' })) : [];
  const selected = detail.currentData?.status === 'success' ? detail.currentData.data : null;
  const selectedUser = selected ? { ...selected, givenName: selected.givenName ?? '', familyName: selected.familyName ?? '' } : null;
  const mutationFailed = removal.isError || (removal.data && removal.data.status !== 'success');
  const draftRoles = ui.roleDraft.split(',').map((role) => role.trim()).filter(Boolean);
  const validRoleDraft = draftRoles.length > 0 && new Set(draftRoles).size === draftRoles.length;
  return (
    <Box>
      <Users status={status} users={users} filter={ui.filter} onFilterChange={(value) => dispatch(actions.setFilter(value))}
        onInvite={canInvite ? () => dispatch(actions.toggleInvitations()) : undefined}
        onView={(user) => { removal.reset(); dispatch(actions.selectUser(user.userId)); }}
        selectedUser={selectedUser} onCloseDetails={() => dispatch(actions.selectUser(null))}
        onRemove={selectedUser && canManage ? () => { removal.reset(); dispatch(actions.setConfirming(true)); } : undefined}
        onRetry={() => { if (companyId) { void list.refetch(); } }}
        onSignIn={() => identity.login.execute(window.location.pathname)} />
      {canAcceptInvitation && <AcceptInvitationSection onAccepted={() => identity.login.execute(window.location.pathname)} />}
      {result?.status === 'success' && result.data.total > result.data.size && (
        <Stack direction="row" spacing={1} sx={{ mt: 2, alignItems: 'center', justifyContent: 'flex-end' }}>
          <Button size="small" variant="outlined" disabled={ui.page === 0} onClick={() => dispatch(actions.setPage(ui.page - 1))}>{t('previous')}</Button>
          <Typography variant="body2" color="text.secondary">{t('page', { page: ui.page + 1 })}</Typography>
          <Button size="small" variant="outlined" disabled={(ui.page + 1) * result.data.size >= result.data.total} onClick={() => dispatch(actions.setPage(ui.page + 1))}>{t('next')}</Button>
        </Stack>
      )}
      {ui.selectedUserId && detail.isFetching && <Alert severity="info" sx={{ mt: 2 }}>{t('detailLoading')}</Alert>}
      {ui.selectedUserId && (detail.isError || (detail.currentData && detail.currentData.status !== 'success')) && <Alert severity="error" sx={{ mt: 2 }}>{t('detailError')}</Alert>}
      {selected && canManage && (
        <Card component="section" aria-label={t('portalRoles')} sx={sectionSx}>
          <Typography variant="h3" sx={sectionTitleSx}>{t('portalRoles')}</Typography>
          {!ui.editingRoles ? (
            <Box sx={{ mt: 1.5 }}>
              <Button variant="outlined" onClick={() => { roleUpdate.reset(); dispatch(actions.editRoles([...selected.portalRoles])); }}>{t('editRoles')}</Button>
            </Box>
          ) : (
            <Stack spacing={2} sx={{ mt: 1.5, alignItems: 'flex-start' }}>
              <TextField
                id="company-role-draft"
                size="small"
                label={t('roleInput')}
                value={ui.roleDraft}
                onChange={(event) => dispatch(actions.setRoleDraft(event.target.value))}
                sx={{ width: '100%', maxWidth: 520 }}
              />
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                <Button variant="contained" disabled={roleUpdate.isLoading || !validRoleDraft} onClick={() => {
                  if (companyId) {
                    void setRoles({ companyId, userId: selected.userId, roles: draftRoles }).then((response) => { if ('data' in response && response.data?.status === 'success') { dispatch(actions.cancelRoleEdit()); } });
                  }
                }}>{t('saveRoles')}</Button>
                <Button variant="outlined" disabled={roleUpdate.isLoading} onClick={() => dispatch(actions.cancelRoleEdit())}>{t('cancel')}</Button>
              </Stack>
              {(roleUpdate.isError || (roleUpdate.data && roleUpdate.data.status !== 'success')) && (
                <Alert severity="error" sx={{ width: '100%' }}>
                  {t(roleUpdate.data?.status === 'conflict' && roleUpdate.data.error.problemType === 'urn:c2-m2:problem:last-company-admin' ? 'lastAdmin' : 'roleError')}
                </Alert>
              )}
            </Stack>
          )}
        </Card>
      )}
      {selected && (
        <Card component="section" aria-label={t('appRoles')} sx={sectionSx}>
          <Typography variant="h3" sx={sectionTitleSx}>{t('appRoles')}</Typography>
          <Stack spacing={1.25} sx={{ mt: 1.5 }}>
            {selected.appRoles.length ? selected.appRoles.map((app) => (
              <Stack key={`${app.appId}:${app.appInstanceClientId}:${app.iamClientId}`} direction="row" useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Typography sx={{ fontWeight: 600, minWidth: 140 }}>{app.appId}</Typography>
                {app.roles.map((role) => <Tag key={role}>{role}</Tag>)}
              </Stack>
            )) : <Typography color="text.secondary">{t('noAppRoles')}</Typography>}
          </Stack>
        </Card>
      )}
      {selected && companyId && canViewAppRoles && <AppRoleEditor key={`${companyId}:${selected.userId}`} companyId={companyId} user={selected} canAssign={canAssignAppRoles} />}
      {ui.confirming && companyId && ui.selectedUserId && (
        <Card component="section" aria-label={t('confirmRemove')} sx={{ ...sectionSx, borderColor: 'error.main' }}>
          <Typography sx={{ mb: 2, fontWeight: 600 }}>{t('confirmRemove')}</Typography>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Button variant="contained" color="error" disabled={removal.isLoading} onClick={() => { void remove({ companyId, userId: ui.selectedUserId! }).then((response) => { if ('data' in response && response.data?.status === 'success') { dispatch(actions.selectUser(null)); } }); }}>{t('confirm')}</Button>
            <Button variant="outlined" disabled={removal.isLoading} onClick={() => dispatch(actions.setConfirming(false))}>{t('cancel')}</Button>
          </Stack>
        </Card>
      )}
      {mutationFailed && <Alert severity="error" sx={{ mt: 2 }}>{t(removal.data?.status === 'conflict' && removal.data.error.problemType === 'urn:c2-m2:problem:last-company-admin' ? 'lastAdmin' : 'actionError')}</Alert>}
      {canInvite && companyId && ui.invitationsOpen && <Invitations key={companyId} companyId={companyId} />}
    </Box>
  );
}
