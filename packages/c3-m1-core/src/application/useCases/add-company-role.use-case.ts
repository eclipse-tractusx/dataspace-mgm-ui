/********************************************************************************
 * Copyright (c) 2026 Catena-X Automotive Network e.V.
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * AI Disclosure: This file was entirely AI-generated.
 * The AI-generated portions are made available under CC0-1.0 and not subject
 * to the project's license. The human contributor has reviewed and verified
 * that the code is correct.
 *
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: Claude Code (claude-opus-5-5)
 ********************************************************************************/

import type { CompanyRoleStateAnemic } from '../../domain/anemics/company-role-state.anemic';
import type { OperationResult } from '../../domain/data/operation-result.data';
import { CompanyRoleDomain } from '../../domain/domains/company-role.domain';
import type { CompanyRoleRepository } from '../../domain/repositories/company-role.repository';
import { executeOperation } from '../helpers/execute-operation.helper';

/**
 * "Add the role" with the consent to all of its terms (C3-M1 `addCompanyRole`, README 7.8). The page calls it only
 * after the person ticked every term; the consents sent are the terms of the role as the API listed them.
 */
export class AddCompanyRoleUseCase {
  constructor(private readonly roles: CompanyRoleRepository) {}

  public execute(companyId: string, role: CompanyRoleStateAnemic, lang: string): Promise<OperationResult<ReadonlyArray<CompanyRoleStateAnemic>>> {
    return executeOperation(() => this.roles.add(companyId, role.companyRole, CompanyRoleDomain.consentsFor(role), lang));
  }
}
