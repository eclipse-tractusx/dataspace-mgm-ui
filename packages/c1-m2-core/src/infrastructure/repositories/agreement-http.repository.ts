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

import type { AgreementVersionAnemic } from '../../domain/anemics/agreement-version.anemic';
import type { AgreementVersionCreateInput } from '../../domain/data/agreement-version-create-input.data';
import type { AgreementVersionsFilter } from '../../domain/data/list-filters.data';
import type { PageData } from '../../domain/data/page.data';
import type { AgreementRepository } from '../../domain/repositories/agreement.repository';
import type { C1M2Client } from '../data/c1-m2-infrastructure.data';
import { C1M2Response } from '../helpers/c1-m2-response.helper';
import { AgreementMapper } from '../mappers/agreement.mapper';

/** Adapter over HTTP of the versions of the terms for OSP staff (paths under /osp/agreements, README 7.15, 7.16). */
export class AgreementHttpRepository implements AgreementRepository {
  constructor(private readonly client: C1M2Client) {}

  public async listVersions(filter: AgreementVersionsFilter): Promise<PageData<AgreementVersionAnemic>> {
    const dto = await C1M2Response.data(
      this.client.GET('/osp/agreements', {
        params: { query: { agreementKey: filter.agreementKey, status: filter.status, page: filter.page, size: filter.size } },
      }),
    );
    return AgreementMapper.versionPageToAnemic(dto);
  }

  public async createVersion(input: AgreementVersionCreateInput): Promise<AgreementVersionAnemic> {
    const dto = await C1M2Response.data(this.client.POST('/osp/agreements', { body: AgreementMapper.versionCreateToDto(input) }));
    return AgreementMapper.versionToAnemic(dto);
  }
}
