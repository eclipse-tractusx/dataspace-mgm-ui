/* Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra */
import type { AssignableRole, CreatedTechnicalUser, Credentials, TechnicalUser, TechnicalUserCreate, TechnicalUserFilters, TechnicalUserPage, TechnicalUserUpdate } from '../data/technical-user.data';
import type { DeleteOutcome } from '../data/result.data';
export interface TechnicalUserRepository {
  listTechnicalUsers(companyId: string, filters?: TechnicalUserFilters): Promise<TechnicalUserPage>;
  getTechnicalUser(companyId: string, id: string): Promise<TechnicalUser | null>;
  listAssignableRoles(companyId: string, lang?: string): Promise<readonly AssignableRole[]>;
  createTechnicalUser(companyId: string, input: TechnicalUserCreate): Promise<CreatedTechnicalUser>;
  updateTechnicalUser(companyId: string, id: string, input: TechnicalUserUpdate): Promise<TechnicalUser | null>;
  rotateCredentials(companyId: string, id: string): Promise<Credentials | null | undefined>;
  deleteTechnicalUser(companyId: string, id: string): Promise<DeleteOutcome | null>;
}
