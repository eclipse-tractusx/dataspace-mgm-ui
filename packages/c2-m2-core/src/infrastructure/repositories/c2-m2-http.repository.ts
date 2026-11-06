/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import { ensureData, ensureOk } from '@dataspace-mgm/core-http';
import type { Client } from 'openapi-fetch';
import type { paths } from '../../generated/c2-m2-api';
import type { CompanyUserRepository } from '../../domain/repositories/company-user.repository';
import type { CompanyAppRolesRepository } from '../../domain/repositories/company-app-roles.repository';

export class C2M2HttpRepository implements CompanyUserRepository, CompanyAppRolesRepository {
  constructor(private readonly client: Client<paths>) {}

  async listCompanyUsers(companyId: string, options?: { status?: readonly ('ACTIVE' | 'DISABLED' | 'REMOVED')[]; page?: number; size?: number }) {
    return ensureData(this.client.GET('/companies/{companyId}/users', { params: { path: { companyId }, query: { ...options, status: options?.status ? [...options.status] : undefined } } }));
  }

  async getCompanyUser(companyId: string, userId: string) {
    return ensureData(this.client.GET('/companies/{companyId}/users/{userId}', { params: { path: { companyId, userId } } }));
  }

  async setCompanyUserPortalRoles(companyId: string, userId: string, roles: readonly string[]) {
    return ensureData(this.client.PUT('/companies/{companyId}/users/{userId}/portal-roles', { params: { path: { companyId, userId } }, body: { portalRoles: [...roles] } }));
  }

  async removeCompanyUser(companyId: string, userId: string) {
    await ensureOk(this.client.DELETE('/companies/{companyId}/users/{userId}', { params: { path: { companyId, userId } } }));
    return true;
  }

  async getCompanyAppRoles(companyId: string, appId: string, lang?: string) {
    const data = await ensureData(this.client.GET('/companies/{companyId}/apps/{appId}/roles', { params: { path: { companyId, appId }, query: { lang } } }));
    return { ...data, roles: data.roles.map((role) => ({ ...role, description: role.description ?? null })) };
  }

  async setUserAppRoles(companyId: string, userId: string, appId: string, roles: readonly string[]) {
    return ensureData(this.client.PUT('/companies/{companyId}/users/{userId}/apps/{appId}/roles', { params: { path: { companyId, userId, appId } }, body: { roles: [...roles] } }));
  }
}
