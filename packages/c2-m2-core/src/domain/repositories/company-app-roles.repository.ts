/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import type { AppRolesResult, CompanyAppRoles } from '../data/company-app-roles.data';
export interface CompanyAppRolesRepository {
  getCompanyAppRoles(companyId: string, appId: string, lang?: string): Promise<CompanyAppRoles | null>;
  setUserAppRoles(companyId: string, userId: string, appId: string, roles: readonly string[]): Promise<AppRolesResult | null>;
}
