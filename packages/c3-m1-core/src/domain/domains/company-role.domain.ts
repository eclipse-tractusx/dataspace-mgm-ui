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

import type { CompanyRoleStateAnemic } from '../anemics/company-role-state.anemic';
import type { AgreementRefData } from '../data/c3-m1-commands.data';

/**
 * UX pre-checks of company roles (C3-M1 README 7.8, 7.9). A company adds and removes only roles with `assignableBy`
 * COMPANY; the API answers 409 `role-not-assignable` or `last-role` otherwise.
 */
export class CompanyRoleDomain {
  public static canAdd(role: CompanyRoleStateAnemic): boolean {
    return role.assignableBy === 'COMPANY' && (role.status === 'NONE' || role.status === 'INACTIVE');
  }

  public static canRemove(role: CompanyRoleStateAnemic): boolean {
    return role.assignableBy === 'COMPANY' && role.status === 'ACTIVE';
  }

  /** The consents to send when adding: every term of the role in its active version (README 7.8). */
  public static consentsFor(role: CompanyRoleStateAnemic): AgreementRefData[] {
    return role.agreements.map(({ agreementKey, version }) => ({ agreementKey, version }));
  }
}
