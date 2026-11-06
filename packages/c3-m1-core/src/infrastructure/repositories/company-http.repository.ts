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

import { CoreHttpException, HTTP, ensureData } from '@dataspace-mgm/core-http';
import type { CompanyAnemic } from '../../domain/anemics/company.anemic';
import type { CompanyRepository } from '../../domain/repositories/company.repository';
import type { C3M1Client } from '../data/c3-m1-infrastructure.data';
import { CompanyMapper } from '../mappers/company.mapper';

/** Adapter of the port over HTTP: the generated client checks path, parameters and response against openapi.yaml. */
export class CompanyHttpRepository implements CompanyRepository {
  constructor(private readonly client: C3M1Client) {}

  public async getCompany(companyId: string): Promise<CompanyAnemic | null> {
    try {
      const dto = await ensureData(this.client.GET('/companies/{companyId}', { params: { path: { companyId } } }));
      return CompanyMapper.toAnemic(dto);
    } catch (error) {
      if (error instanceof CoreHttpException && error.status === HTTP.NOT_FOUND) {
        return null;
      }
      throw error;
    }
  }

  public async updateShortName(companyId: string, shortName: string | null): Promise<CompanyAnemic> {
    const dto = await ensureData(this.client.PATCH('/companies/{companyId}', { params: { path: { companyId } }, body: { shortName } }));
    return CompanyMapper.toAnemic(dto);
  }
}
