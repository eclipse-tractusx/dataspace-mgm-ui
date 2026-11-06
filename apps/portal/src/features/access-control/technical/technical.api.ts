/* Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra */
import type { AssignableRole, Result, TechnicalUser, TechnicalUserCreate, TechnicalUserFilters, TechnicalUserPage, TechnicalUserUpdate } from '@dataspace-mgm/c2-m3-core';
import { accessControlApi, getCoreModules, toQueryResult } from '../state/access-control.api';

type Credentials = Readonly<{ iamClientId: string; secret: string; tokenUrl: string }>;

export const technicalApi = accessControlApi.injectEndpoints({
  endpoints: (build) => ({
    listTechnicalUsers: build.query<Result<TechnicalUserPage>, { companyId: string; filters: TechnicalUserFilters }>({
      queryFn: ({ companyId, filters }, api) => toQueryResult(() => {
        const module = getCoreModules(api).c2m3;
        if (!module) { throw new Error('C2-M3 unavailable'); }
        return module.listTechnicalUsers.execute(companyId, filters);
      }),
      providesTags: ['AccessControl'],
    }),
    getTechnicalUser: build.query<Result<TechnicalUser>, { companyId: string; id: string }>({
      queryFn: ({ companyId, id }, api) => toQueryResult(() => {
        const module = getCoreModules(api).c2m3;
        if (!module) { throw new Error('C2-M3 unavailable'); }
        return module.getTechnicalUser.execute(companyId, id);
      }),
      providesTags: ['AccessControl'],
    }),
    listAssignableTechnicalRoles: build.query<Result<readonly AssignableRole[]>, { companyId: string; lang: string }>({
      queryFn: ({ companyId, lang }, api) => toQueryResult(() => {
        const module = getCoreModules(api).c2m3;
        if (!module) { throw new Error('C2-M3 unavailable'); }
        return module.listAssignableRoles.execute(companyId, lang);
      }),
    }),
    createTechnicalUser: build.mutation<Result<{ user: TechnicalUser }>, { companyId: string; input: TechnicalUserCreate; onCredentials: (credentials: Credentials | null) => void }>({
      queryFn: ({ companyId, input, onCredentials }, api) => toQueryResult(async () => {
        const module = getCoreModules(api).c2m3;
        if (!module) { throw new Error('C2-M3 unavailable'); }
        const result = await module.createTechnicalUser.execute(companyId, input);
        if (result.status !== 'success') { return result; }
        onCredentials(result.data.credentials);
        return { status: 'success' as const, data: { user: result.data.user } };
      }),
      invalidatesTags: ['AccessControl'],
    }),
    updateTechnicalUser: build.mutation<Result<TechnicalUser>, { companyId: string; id: string; input: TechnicalUserUpdate }>({
      queryFn: ({ companyId, id, input }, api) => toQueryResult(() => {
        const module = getCoreModules(api).c2m3;
        if (!module) { throw new Error('C2-M3 unavailable'); }
        return module.updateTechnicalUser.execute(companyId, id, input);
      }),
      invalidatesTags: ['AccessControl'],
    }),
    rotateTechnicalCredentials: build.mutation<Result<Record<string, never>>, { companyId: string; id: string; onCredentials: (credentials: Credentials | null) => void }>({
      queryFn: ({ companyId, id, onCredentials }, api) => toQueryResult(async () => {
        const module = getCoreModules(api).c2m3;
        if (!module) { throw new Error('C2-M3 unavailable'); }
        const result = await module.rotateCredentials.execute(companyId, id);
        if (result.status !== 'success') { return result; }
        onCredentials(result.data.credentials);
        return { status: 'success' as const, data: {} };
      }),
      invalidatesTags: ['AccessControl'],
    }),
    deleteTechnicalUser: build.mutation<Awaited<ReturnType<NonNullable<ReturnType<typeof getCoreModules>['c2m3']>['deleteTechnicalUser']['execute']>>, { companyId: string; id: string }>({
      queryFn: ({ companyId, id }, api) => toQueryResult(() => {
        const module = getCoreModules(api).c2m3;
        if (!module) { throw new Error('C2-M3 unavailable'); }
        return module.deleteTechnicalUser.execute(companyId, id);
      }),
      invalidatesTags: ['AccessControl'],
    }),
  }),
});

export const { useListTechnicalUsersQuery, useGetTechnicalUserQuery, useListAssignableTechnicalRolesQuery, useCreateTechnicalUserMutation, useUpdateTechnicalUserMutation, useRotateTechnicalCredentialsMutation, useDeleteTechnicalUserMutation } = technicalApi;
