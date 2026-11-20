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
 * Assisted-By: Claude Code (claude-fable-5-2)
 ********************************************************************************/

import type { CompanyRoleInfoAnemic } from '../../domain/anemics/company-role-info.anemic';
import type { CountryAnemic } from '../../domain/anemics/country.anemic';
import type { IdentifierTypeInfoAnemic } from '../../domain/anemics/identifier-type-info.anemic';
import type { CompanyRoleInfoDto, CountryDto, IdentifierTypeInfoDto } from '../data/c1-m2-infrastructure.data';

/** The reference data of C1-M2 (DTOs `Country`, `IdentifierTypeInfo`, `CompanyRoleInfo`) → the anemics of the UI. */
export class ReferenceDataMapper {
  public static countryToAnemic(dto: CountryDto): CountryAnemic {
    return { code: dto.code, name: dto.name };
  }

  public static identifierTypeToAnemic(dto: IdentifierTypeInfoDto): IdentifierTypeInfoAnemic {
    return { type: dto.type, name: dto.name, pattern: dto.pattern };
  }

  public static companyRoleToAnemic(dto: CompanyRoleInfoDto): CompanyRoleInfoAnemic {
    return { role: dto.role, name: dto.name, description: dto.description, agreementKeys: dto.agreementKeys };
  }
}
