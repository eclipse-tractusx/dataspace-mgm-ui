/********************************************************************************
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

import type { AcceptInvitationResult } from './invitation.data';

/**
 * Why the backend refused to accept an invitation with a mandate: the names of its Problem Details
 * (`urn:c2-m2:problem:<name>`, C2-M2 section 12) that a person can do something about.
 */
export type MandateJoinRefusal =
  | 'attestation-invalid'
  | 'representation-not-confirmed'
  | 'name-mismatch'
  | 'invitation-not-found'
  | 'company-not-active'
  | 'user-already-bound'
  | 'staff-company-conflict';

/**
 * Why the EBW-Connector did not confirm a mandate (C5-M1 6.5): the `reasons` of the refusal
 * `representation-not-confirmed` that the page has words for.
 */
export type MandateRefusalCause = 'EXPIRED' | 'PERSON_MISMATCH' | 'COMPANY_MISMATCH' | 'TYPE_NOT_ACCEPTED' | 'ISSUER_NOT_TRUSTED';

/**
 * How joining a company with a mandate ended. `wallet-failed` carries the reason of the wallet step. `causes` of a
 * refusal is empty unless the backend said why the mandate was not confirmed.
 */
export type MandateJoinResult =
  | { status: 'joined'; data: AcceptInvitationResult }
  | { status: 'cancelled' }
  | { status: 'refused'; reason: MandateJoinRefusal; causes: MandateRefusalCause[] }
  | { status: 'wallet-failed'; message: string }
  | { status: 'failed'; message: string };
