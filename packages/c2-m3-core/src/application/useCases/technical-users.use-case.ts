/* Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra */
import { CoreHttpErrorFactory } from '@dataspace-mgm/core-http';
import type { TechnicalUserRepository } from '../../domain/repositories/technical-user.repository';
import type { TechnicalUserCreate, TechnicalUserFilters, TechnicalUserUpdate } from '../../domain/data/technical-user.data';
import type { Result } from '../../domain/data/result.data';

async function run<T>(action: () => Promise<T | null>): Promise<Result<T>> {
  try {
    const data = await action();
    return data === null ? { status: 'not-found' } : { status: 'success', data };
  } catch (error) {
    const mapped = CoreHttpErrorFactory.from(error);
    if (mapped.status === 403) { return { status: 'forbidden' }; }
    if (mapped.status === 404) { return { status: 'not-found' }; }
    if (mapped.status === 409) { return { status: 'conflict' }; }
    return { status: 'failed', error: mapped };
  }
}
export class ListTechnicalUsersUseCase {
  constructor(private readonly repository: TechnicalUserRepository) {}
  execute(companyId: string, filters?: TechnicalUserFilters) { return run(() => this.repository.listTechnicalUsers(companyId, filters)); }
}
export class GetTechnicalUserUseCase {
  constructor(private readonly repository: TechnicalUserRepository) {}
  execute(companyId: string, id: string) { return run(() => this.repository.getTechnicalUser(companyId, id)); }
}
export class ListAssignableRolesUseCase {
  constructor(private readonly repository: TechnicalUserRepository) {}
  execute(companyId: string, lang?: string) { return run(() => this.repository.listAssignableRoles(companyId, lang)); }
}
export class CreateTechnicalUserUseCase {
  constructor(private readonly repository: TechnicalUserRepository) {}
  execute(companyId: string, input: TechnicalUserCreate) { return run(() => this.repository.createTechnicalUser(companyId, input)); }
}
export class UpdateTechnicalUserUseCase {
  constructor(private readonly repository: TechnicalUserRepository) {}
  execute(companyId: string, id: string, input: TechnicalUserUpdate) { return run(() => this.repository.updateTechnicalUser(companyId, id, input)); }
}
export class RotateCredentialsUseCase {
  constructor(private readonly repository: TechnicalUserRepository) {}
  execute(companyId: string, id: string) { return run(async () => { const value = await this.repository.rotateCredentials(companyId, id); return value === undefined ? null : { credentials: value }; }); }
}
export class DeleteTechnicalUserUseCase {
  constructor(private readonly repository: TechnicalUserRepository) {}
  execute(companyId: string, id: string) { return run(() => this.repository.deleteTechnicalUser(companyId, id)); }
}
