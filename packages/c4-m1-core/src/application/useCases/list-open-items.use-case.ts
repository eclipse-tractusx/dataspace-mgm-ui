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

import { CoreHttpErrorFactory } from '@dataspace-mgm/core-http';
import type { CredentialDetailAnemic } from '../../domain/anemics/credential-detail.anemic';
import { CREDENTIAL_PAGE_MAX_SIZE } from '../../domain/data/credential-page-limits.data';
import type { CredentialQuery } from '../../domain/data/credential-query.data';
import type { ListOpenItemsOptions } from '../../domain/data/list-open-items-options.data';
import type { ListOpenItemsFound, ListOpenItemsResult } from '../../domain/data/list-open-items-result.data';
import { DEFAULT_OPEN_ORDER_HOURS } from '../../domain/data/open-order-hours.data';
import type { CredentialRepository } from '../../domain/repositories/credential.repository';
import { C4M1_HTTP_STATUS } from '../constants/c4-m1-http-status.constant';

const HOUR_MS = 3_600_000;

/**
 * "Needs attention" for OSP staff (permission `manage_credentials`): FAILED, REVOCATION_PENDING, and REQUESTED orders
 * sent more than `openOrderHours` ago. Three `listCredentials` queries with the filters of the API (README 7.2); the
 * use case only joins their pages, it decides nothing about a credential.
 */
export class ListOpenItemsUseCase {
  private readonly clock: () => Date;
  private readonly openOrderHours: number;

  constructor(
    private readonly credentials: CredentialRepository,
    options: ListOpenItemsOptions = {},
  ) {
    this.clock = options.clock ?? (() => new Date());
    this.openOrderHours = options.openOrderHours ?? DEFAULT_OPEN_ORDER_HOURS;
  }

  public async execute(): Promise<ListOpenItemsResult> {
    const requestedBefore = new Date(this.clock().getTime() - this.openOrderHours * HOUR_MS).toISOString();
    const openOrders: ListOpenItemsFound['openOrders'] = { status: ['REQUESTED'], requestedBefore };
    const page = { page: 0, size: CREDENTIAL_PAGE_MAX_SIZE };
    const queries: CredentialQuery[] = [
      { ...page, status: ['FAILED'] },
      { ...page, status: ['REVOCATION_PENDING'] },
      { ...page, ...openOrders },
    ];
    try {
      const pages = await Promise.all(queries.map((query) => this.credentials.listCredentials(query)));
      const items: CredentialDetailAnemic[] = pages.flatMap((result) => result.items);
      items.sort((a, b) => Date.parse(b.changedAt) - Date.parse(a.changedAt));
      const total = pages.reduce((sum, result) => sum + result.total, 0);
      return { status: 'found', items, total, requestedBefore, openOrderHours: this.openOrderHours, openOrders };
    } catch (failure) {
      const error = CoreHttpErrorFactory.from(failure);
      if (error.status === C4M1_HTTP_STATUS.FORBIDDEN) {
        return { status: 'forbidden' };
      }
      return { status: 'failed', error };
    }
  }
}
