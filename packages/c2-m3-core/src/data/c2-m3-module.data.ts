/* Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra */
import type { ListTechnicalUsersUseCase, GetTechnicalUserUseCase, ListAssignableRolesUseCase, CreateTechnicalUserUseCase, UpdateTechnicalUserUseCase, RotateCredentialsUseCase, DeleteTechnicalUserUseCase } from '../application/useCases/technical-users.use-case';
export interface C2M3Module {
  listTechnicalUsers: ListTechnicalUsersUseCase;
  getTechnicalUser: GetTechnicalUserUseCase;
  listAssignableRoles: ListAssignableRolesUseCase;
  createTechnicalUser: CreateTechnicalUserUseCase;
  updateTechnicalUser: UpdateTechnicalUserUseCase;
  rotateCredentials: RotateCredentialsUseCase;
  deleteTechnicalUser: DeleteTechnicalUserUseCase;
}
