/********************************************************************************
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The AI-generated portions
 * are made available under CC0-1.0. The human contributor has reviewed it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra
 ********************************************************************************/

import type { CompanyUserAnemic } from "../anemics/company-user.anemic";
import type { CompanyUserDetailAnemic } from "../anemics/company-user-detail.anemic";

export interface CompanyUserRepository {
  listCompanyUsers(
    companyId: string,
    options?: {
      status?: readonly CompanyUserAnemic["status"][];
      page?: number;
      size?: number;
    },
  ): Promise<{
    items: readonly CompanyUserAnemic[];
    page: number;
    size: number;
    total: number;
  } | null>;
  getCompanyUser(
    companyId: string,
    userId: string,
  ): Promise<CompanyUserDetailAnemic | null>;
  setCompanyUserPortalRoles(
    companyId: string,
    userId: string,
    roles: readonly string[],
  ): Promise<CompanyUserAnemic | null>;
  removeCompanyUser(companyId: string, userId: string): Promise<boolean>;
}
