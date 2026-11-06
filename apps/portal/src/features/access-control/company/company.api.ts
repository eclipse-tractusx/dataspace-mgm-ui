/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import type { C2M2Module, Invitation, InvitationInput, OperationResult } from '@dataspace-mgm/c2-m2-core';
import { accessControlApi, getCoreModules, toQueryResult } from '../state/access-control.api';
import type { BaseQueryApi } from '@reduxjs/toolkit/query';
import type { UserFilter } from '../people';

type Modules = { c2m2?: C2M2Module };
type UserKey = { companyId: string; userId: string };
function moduleFrom(api: BaseQueryApi): C2M2Module {
  const module = (getCoreModules(api) as Modules).c2m2;
  if (!module) {
    throw new Error('C2-M2 module is not connected');
  }
  return module;
}

export const companyUsersApi = accessControlApi.injectEndpoints({
  endpoints: (builder) => ({
    listCompanyUsers: builder.query<Awaited<ReturnType<C2M2Module['listCompanyUsers']['execute']>>, { companyId: string; page: number; filter: UserFilter }>({
      queryFn: ({ companyId, page, filter }, api) => toQueryResult(() => moduleFrom(api).listCompanyUsers.execute(companyId, { page, ...(filter ? { status: [filter] } : {}) })),
      providesTags: ['AccessControl'],
    }),
    getCompanyUser: builder.query<Awaited<ReturnType<C2M2Module['getCompanyUser']['execute']>>, UserKey>({
      queryFn: ({ companyId, userId }, api) => toQueryResult(() => moduleFrom(api).getCompanyUser.execute(companyId, userId)),
      providesTags: ['AccessControl'],
    }),
    removeCompanyUser: builder.mutation<Awaited<ReturnType<C2M2Module['removeCompanyUser']['execute']>>, UserKey>({
      queryFn: ({ companyId, userId }, api) => toQueryResult(() => moduleFrom(api).removeCompanyUser.execute(companyId, userId)),
      invalidatesTags: (result) => result?.status === 'success' ? ['AccessControl'] : [],
    }),
    setCompanyUserPortalRoles: builder.mutation<Awaited<ReturnType<C2M2Module['setCompanyUserPortalRoles']['execute']>>, UserKey & { roles: readonly string[] }>({
      queryFn: ({ companyId, userId, roles }, api) => toQueryResult(() => moduleFrom(api).setCompanyUserPortalRoles.execute(companyId, userId, roles)),
      invalidatesTags: (result) => result?.status === 'success' ? ['AccessControl'] : [],
    }),
    listInvitations: builder.query<Awaited<ReturnType<NonNullable<C2M2Module['listInvitations']>['execute']>>, string>({
      queryFn: (companyId, api) => toQueryResult(() => {
        const useCase = moduleFrom(api).listInvitations;
        if (!useCase) { throw new Error('C2-M2 module is not connected'); }
        return useCase.execute(companyId);
      }),
      providesTags: ['AccessControl'],
    }),
    createInvitation: builder.mutation<OperationResult<Invitation>, { companyId: string; input: InvitationInput; onCode: (code: string) => void }>({
      queryFn: ({ companyId, input, onCode }, api) => toQueryResult(async () => {
        const useCase = moduleFrom(api).createInvitation;
        if (!useCase) { throw new Error('C2-M2 module is not connected'); }
        const result = await useCase.execute(companyId, input);
        if (result.status !== 'success') { return result; }
        const { code, ...invitation } = result.data;
        onCode(code);
        return { status: 'success' as const, data: invitation };
      }),
      invalidatesTags: (result) => result?.status === 'success' ? ['AccessControl'] : [],
    }),
    revokeInvitation: builder.mutation<Awaited<ReturnType<NonNullable<C2M2Module['revokeInvitation']>['execute']>>, { companyId: string; invitationId: string }>({
      queryFn: ({ companyId, invitationId }, api) => toQueryResult(() => {
        const useCase = moduleFrom(api).revokeInvitation;
        if (!useCase) { throw new Error('C2-M2 module is not connected'); }
        return useCase.execute(companyId, invitationId);
      }),
      invalidatesTags: (result) => result?.status === 'success' ? ['AccessControl'] : [],
    }),
    acceptInvitation: builder.mutation<Awaited<ReturnType<NonNullable<C2M2Module['acceptInvitation']>['execute']>>, string>({
      queryFn: (code, api) => toQueryResult(() => {
        const useCase = moduleFrom(api).acceptInvitation;
        if (!useCase) { throw new Error('C2-M2 module is not connected'); }
        return useCase.execute(code);
      }),
      invalidatesTags: (result) => result?.status === 'success' ? ['AccessControl'] : [],
    }),
    getCompanyAppRoles: builder.query<Awaited<ReturnType<NonNullable<C2M2Module['getCompanyAppRoles']>['execute']>>, { companyId: string; appId: string; lang: string }>({
      queryFn: ({ companyId, appId, lang }, api) => toQueryResult(() => {
        const useCase = moduleFrom(api).getCompanyAppRoles;
        if (!useCase) { throw new Error('C2-M2 module is not connected'); }
        return useCase.execute(companyId, appId, lang);
      }),
      providesTags: ['AccessControl'],
    }),
    setUserAppRoles: builder.mutation<Awaited<ReturnType<NonNullable<C2M2Module['setUserAppRoles']>['execute']>>, UserKey & { appId: string; roles: readonly string[] }>({
      queryFn: ({ companyId, userId, appId, roles }, api) => toQueryResult(() => {
        const useCase = moduleFrom(api).setUserAppRoles;
        if (!useCase) { throw new Error('C2-M2 module is not connected'); }
        return useCase.execute(companyId, userId, appId, roles);
      }),
      invalidatesTags: (result) => result?.status === 'success' ? ['AccessControl'] : [],
    }),
  }),
});

export const {
  useListCompanyUsersQuery,
  useGetCompanyUserQuery,
  useRemoveCompanyUserMutation,
  useSetCompanyUserPortalRolesMutation,
  useListInvitationsQuery,
  useCreateInvitationMutation,
  useRevokeInvitationMutation,
  useAcceptInvitationMutation,
  useGetCompanyAppRolesQuery,
  useSetUserAppRolesMutation,
} = companyUsersApi;
