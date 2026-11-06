/* Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra */
import { CoreHttpException, HTTP, ensureData } from '@dataspace-mgm/core-http';
import type { TechnicalUserCreate, TechnicalUserFilters, TechnicalUserUpdate } from '../../domain/data/technical-user.data';
import type { TechnicalUserRepository } from '../../domain/repositories/technical-user.repository';
import type { C2M3Client } from '../data/c2-m3-infrastructure.data';
import { TechnicalUserMapper as mapper } from '../mappers/technical-user.mapper';

async function nullable<T>(action: () => Promise<T>): Promise<T | null> {
  try { return await action(); } catch (error) {
    if (error instanceof CoreHttpException && error.status === HTTP.NOT_FOUND) { return null; }
    throw error;
  }
}
export class TechnicalUserHttpRepository implements TechnicalUserRepository {
  constructor(private readonly client: C2M3Client) {}
  async listTechnicalUsers(companyId: string, filters?: TechnicalUserFilters) {
    const query = filters ? { ...filters, status: filters.status ? [...filters.status] : undefined } : undefined;
    const dto = await ensureData(this.client.GET('/companies/{companyId}/technical-users', { params: { path: { companyId }, query } }));
    return { ...dto, items: dto.items.map(mapper.summary) };
  }
  getTechnicalUser(companyId: string, id: string) {
    return nullable(async () => mapper.user(await ensureData(this.client.GET('/companies/{companyId}/technical-users/{id}', { params: { path: { companyId, id } } }))));
  }
  async listAssignableRoles(companyId: string, lang?: string) {
    return ensureData(this.client.GET('/companies/{companyId}/technical-users/assignable-roles', { params: { path: { companyId }, query: { lang } } }));
  }
  async createTechnicalUser(companyId: string, input: TechnicalUserCreate) {
    const dto = await ensureData(this.client.POST('/companies/{companyId}/technical-users', { params: { path: { companyId } }, body: mapper.create(input) }));
    const { credentials, ...user } = dto;
    return { user: mapper.user(user), credentials };
  }
  updateTechnicalUser(companyId: string, id: string, input: TechnicalUserUpdate) {
    return nullable(async () => mapper.user(await ensureData(this.client.PATCH('/companies/{companyId}/technical-users/{id}', { params: { path: { companyId, id } }, body: mapper.update(input) }))));
  }
  async rotateCredentials(companyId: string, id: string) {
    const result = await nullable(() => ensureData(this.client.POST('/companies/{companyId}/technical-users/{id}/credentials/rotate', { params: { path: { companyId, id } } })));
    return result === null ? undefined : result;
  }
  deleteTechnicalUser(companyId: string, id: string) {
    return nullable(async () => {
      const result = await this.client.DELETE('/companies/{companyId}/technical-users/{id}', { params: { path: { companyId, id } } });
      const data = await ensureData(Promise.resolve(result));
      if (result.response.status === 204) { return { status: 'deleted' as const }; }
      if (!data) { throw new Error('Missing pending deletion response'); }
      return { status: 'pending' as const, user: mapper.user(data) };
    });
  }
}
