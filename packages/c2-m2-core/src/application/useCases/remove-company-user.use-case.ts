/********************************************************************************
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The AI-generated portions
 * are made available under CC0-1.0. The human contributor has reviewed it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra
 ********************************************************************************/

import type { CompanyUserRepository } from "../../domain/repositories/company-user.repository";
import type { OperationResult } from "../../domain/data/operation-result.data";
import { result } from "./result";

export class RemoveCompanyUserUseCase {
  constructor(private readonly repository: CompanyUserRepository) {}
  public execute(
    companyId: string,
    userId: string,
  ): Promise<OperationResult<boolean>> {
    return result(() =>
      this.repository
        .removeCompanyUser(companyId, userId)
        .then((found) => (found ? true : null)),
    );
  }
}
