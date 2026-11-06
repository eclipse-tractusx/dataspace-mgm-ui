/* Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra */
import { createCoreClient, type CoreModuleConfig } from '@dataspace-mgm/core-http';
import { ListTechnicalUsersUseCase, GetTechnicalUserUseCase, ListAssignableRolesUseCase, CreateTechnicalUserUseCase, UpdateTechnicalUserUseCase, RotateCredentialsUseCase, DeleteTechnicalUserUseCase } from './application/useCases/technical-users.use-case';
import type { C2M3Module } from './data/c2-m3-module.data';
import type { paths } from './generated/c2-m3-api';
import { TechnicalUserHttpRepository } from './infrastructure/repositories/technical-user-http.repository';

export const C2_M3_BASE_PATH = '/c2-m3';
export function createC2M3Module(config: CoreModuleConfig): C2M3Module {
  const repository = new TechnicalUserHttpRepository(createCoreClient<paths>(config));
  return {
    listTechnicalUsers: new ListTechnicalUsersUseCase(repository),
    getTechnicalUser: new GetTechnicalUserUseCase(repository),
    listAssignableRoles: new ListAssignableRolesUseCase(repository),
    createTechnicalUser: new CreateTechnicalUserUseCase(repository),
    updateTechnicalUser: new UpdateTechnicalUserUseCase(repository),
    rotateCredentials: new RotateCredentialsUseCase(repository),
    deleteTechnicalUser: new DeleteTechnicalUserUseCase(repository),
  };
}
export * from './application/useCases/technical-users.use-case';
export type * from './domain/data/technical-user.data';
export type * from './domain/data/result.data';
export type * from './domain/repositories/technical-user.repository';
export type * from './data/c2-m3-module.data';
