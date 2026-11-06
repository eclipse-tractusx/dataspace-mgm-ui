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

import type { CredentialStatusAnemic } from '../anemics/credential-status.anemic';
import type { DataspaceRefAnemic } from '../anemics/dataspace-ref.anemic';
import type { CredentialType } from '../valueObjects/credential-type.value-object';
import type { CredentialViewStatus } from '../valueObjects/credential-view-status.value-object';
import { CATENA_X_DATASPACE, SEMICONDUCTOR_DATASPACE } from './dataspace.fixtures';

const view = (
  credentialType: CredentialType,
  status: CredentialViewStatus,
  requestedAt: string | null = null,
  issuedAt: string | null = null,
  revokedAt: string | null = null,
  dataspace: DataspaceRefAnemic = CATENA_X_DATASPACE,
): CredentialStatusAnemic => ({ credentialType, status, requestedAt, issuedAt, revokedAt, dataspace });

const BPN_ISSUED = view('BPN', 'ISSUED', '2026-11-03T09:59:40Z', '2026-11-03T10:00:12Z');
const MEMBERSHIP_ISSUED = view('MEMBERSHIP', 'ISSUED', '2026-11-03T09:59:40Z', '2026-11-03T10:00:15Z');

/**
 * C4-M1 `CredentialStatusView[]` of Beispiel Maschinenbau GmbH (`GET /companies/{companyId}/credentials`), one list
 * per state of the views "Your dataspace wallet" and "Your credentials" (mockups/wallets/shared/data.js).
 */
export const COMPANY_CREDENTIALS = {
  issued: [BPN_ISSUED, MEMBERSHIP_ISSUED],
  /** The membership credential is being issued. */
  requested: [BPN_ISSUED, view('MEMBERSHIP', 'REQUESTED', '2026-11-03T09:59:40Z')],
  failed: [BPN_ISSUED, view('MEMBERSHIP', 'FAILED', '2026-11-03T09:59:40Z')],
  /** Company deactivated: membership revoked, the BPN credential stays. */
  revoked: [
    BPN_ISSUED,
    view('MEMBERSHIP', 'REVOKED', '2026-11-03T09:59:40Z', '2026-11-03T10:00:15Z', '2026-11-06T09:30:02Z'),
  ],
  /** No order yet for either type. */
  none: [view('BPN', 'NONE'), view('MEMBERSHIP', 'NONE')],
  /** Outlook: a membership credential of a second dataspace next to the Catena-X ones (logo slot). */
  twoDataspaces: [
    BPN_ISSUED,
    MEMBERSHIP_ISSUED,
    view('MEMBERSHIP', 'ISSUED', '2026-11-05T08:30:00Z', '2026-11-05T08:31:10Z', null, SEMICONDUCTOR_DATASPACE),
  ],
} as const satisfies Readonly<Record<string, ReadonlyArray<CredentialStatusAnemic>>>;
