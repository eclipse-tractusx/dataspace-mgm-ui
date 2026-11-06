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

import type { WalletAccountAnemic, WalletAnemic } from '@dataspace-mgm/c4-m2-core';
import type { StatusTone } from './statusTone';

// The colours of the C4-M2 statuses (pills, chips): display only, they decide nothing.

export const WALLET_STATUS_TONE: Readonly<Record<WalletAnemic['status'], StatusTone>> = {
  REQUESTED: 'warning',
  VALIDATING: 'info',
  ACTIVE: 'success',
  FAILED: 'error',
};

export const ACCOUNT_STATUS_TONE: Readonly<Record<WalletAccountAnemic['status'], StatusTone>> = {
  REQUESTED: 'warning',
  ACTIVE: 'success',
  FAILED: 'error',
  DELETING: 'warning',
  DELETED: 'default',
};

export const CREDENTIALS_STATE_TONE: Readonly<Record<WalletAccountAnemic['credentialsState'], StatusTone>> = {
  NONE: 'default',
  AVAILABLE: 'info',
  RETRIEVED: 'success',
  EXPIRED: 'default',
};
