/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import type { CompanyAppRolesRepository } from '../../domain/repositories/company-app-roles.repository';
import { result } from './result';
export class GetCompanyAppRolesUseCase {
  constructor(private readonly repository: CompanyAppRolesRepository) {}
  execute(companyId: string, appId: string, lang?: string) { return result(() => this.repository.getCompanyAppRoles(companyId, appId, lang)); }
}
