/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it, vi } from 'vitest';
import { accessControlApi } from '../state/access-control.api';
import { companyUsersApi } from './company.api';
import { companyUsersSlice } from './company.slice';

describe('company users integration', () => {
  it('passes the company and filter to the use case and preserves result unions', async () => {
    const execute = vi.fn().mockResolvedValue({ status: 'forbidden' });
    const store = configureStore({
      reducer: { [accessControlApi.reducerPath]: accessControlApi.reducer },
      middleware: (defaults) => defaults({ thunk: { extraArgument: { c2m2: { listCompanyUsers: { execute } } } } }).concat(accessControlApi.middleware),
    });
    const response = await store.dispatch(companyUsersApi.endpoints.listCompanyUsers.initiate({ companyId: 'company', page: 2, filter: 'REMOVED' }));
    expect(execute).toHaveBeenCalledWith('company', { page: 2, status: ['REMOVED'] });
    expect(response.data).toEqual({ status: 'forbidden' });
    store.dispatch(accessControlApi.util.resetApiState());
  });
  it('resets page and selection when the filter changes', () => {
    let state = companyUsersSlice.reducer(undefined, companyUsersSlice.actions.setPage(2));
    state = companyUsersSlice.reducer(state, companyUsersSlice.actions.selectUser('user'));
    state = companyUsersSlice.reducer(state, companyUsersSlice.actions.setFilter('ACTIVE'));
    expect(state).toMatchObject({ filter: 'ACTIVE', page: 0, selectedUserId: null });
  });
  it('toggles invitation visibility', () => {
    const open = companyUsersSlice.reducer(undefined, companyUsersSlice.actions.toggleInvitations());
    expect(open.invitationsOpen).toBe(true);
    expect(companyUsersSlice.reducer(open, companyUsersSlice.actions.toggleInvitations()).invitationsOpen).toBe(false);
  });
  it('replaces portal roles through the use case and clears the draft on selection', async () => {
    const execute = vi.fn().mockResolvedValue({ status: 'success', data: {} });
    const store = configureStore({
      reducer: { [accessControlApi.reducerPath]: accessControlApi.reducer },
      middleware: (defaults) => defaults({ thunk: { extraArgument: { c2m2: { setCompanyUserPortalRoles: { execute } } } } }).concat(accessControlApi.middleware),
    });
    await store.dispatch(companyUsersApi.endpoints.setCompanyUserPortalRoles.initiate({ companyId: 'company', userId: 'user', roles: ['Member'] }));
    expect(execute).toHaveBeenCalledWith('company', 'user', ['Member']);
    let state = companyUsersSlice.reducer(undefined, companyUsersSlice.actions.editRoles(['Member']));
    state = companyUsersSlice.reducer(state, companyUsersSlice.actions.selectUser('other'));
    expect(state).toMatchObject({ editingRoles: false, roleDraft: '' });
    store.dispatch(accessControlApi.util.resetApiState());
  });
  it('preserves last-admin conflicts for both role updates and removal', async () => {
    const conflict = { status: 'conflict', error: { problemType: 'urn:c2-m2:problem:last-company-admin' } };
    const execute = vi.fn().mockResolvedValue(conflict);
    const store = configureStore({
      reducer: { [accessControlApi.reducerPath]: accessControlApi.reducer },
      middleware: (defaults) => defaults({ thunk: { extraArgument: { c2m2: { setCompanyUserPortalRoles: { execute }, removeCompanyUser: { execute } } } } }).concat(accessControlApi.middleware),
    });
    const roles = await store.dispatch(companyUsersApi.endpoints.setCompanyUserPortalRoles.initiate({ companyId: 'company', userId: 'admin', roles: ['Member'] }));
    const removal = await store.dispatch(companyUsersApi.endpoints.removeCompanyUser.initiate({ companyId: 'company', userId: 'admin' }));
    expect(roles).toMatchObject({ data: conflict });
    expect(removal).toMatchObject({ data: conflict });
    store.dispatch(accessControlApi.util.resetApiState());
  });
  it('delivers the invitation code without putting it in the mutation result or store', async () => {
    const onCode = vi.fn();
    const execute = vi.fn().mockResolvedValue({ status: 'success', data: { id: 'invitation', code: 'ephemeral-test-value' } });
    const store = configureStore({
      reducer: { [accessControlApi.reducerPath]: accessControlApi.reducer },
      middleware: (defaults) => defaults({ thunk: { extraArgument: { c2m2: { createInvitation: { execute } } } } }).concat(accessControlApi.middleware),
    });
    const response = await store.dispatch(companyUsersApi.endpoints.createInvitation.initiate({ companyId: 'company', input: { givenName: 'A', familyName: 'B', portalRoles: ['Member'] }, onCode }));
    expect(onCode).toHaveBeenCalledWith('ephemeral-test-value');
    expect(JSON.stringify(response)).not.toContain('ephemeral-test-value');
    expect(JSON.stringify(store.getState())).not.toContain('ephemeral-test-value');
    store.dispatch(accessControlApi.util.resetApiState());
  });
  it('routes app role reads and replacements to the core use cases', async () => {
    const get = vi.fn().mockResolvedValue({ status: 'success', data: {} });
    const set = vi.fn().mockResolvedValue({ status: 'success', data: {} });
    const store = configureStore({
      reducer: { [accessControlApi.reducerPath]: accessControlApi.reducer },
      middleware: (defaults) => defaults({ thunk: { extraArgument: { c2m2: { getCompanyAppRoles: { execute: get }, setUserAppRoles: { execute: set } } } } }).concat(accessControlApi.middleware),
    });
    await store.dispatch(companyUsersApi.endpoints.getCompanyAppRoles.initiate({ companyId: 'company', appId: 'app', lang: 'de' }));
    await store.dispatch(companyUsersApi.endpoints.setUserAppRoles.initiate({ companyId: 'company', userId: 'user', appId: 'app', roles: [] }));
    expect(get).toHaveBeenCalledWith('company', 'app', 'de');
    expect(set).toHaveBeenCalledWith('company', 'user', 'app', []);
    store.dispatch(accessControlApi.util.resetApiState());
  });
});
