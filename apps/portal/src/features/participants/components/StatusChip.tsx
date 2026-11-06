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

import { Chip } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../i18n';

type Tone = 'success' | 'warning' | 'error' | 'info' | 'default';

/** The tone of each status value of the API, per kind of status (C3-M1, C3-M2). */
const TONES: Record<string, Record<string, Tone>> = {
  status: { ACTIVE: 'success', REQUESTED: 'warning', REJECTED: 'error', INACTIVE: 'default' },
  changeRequestStatus: { OPEN: 'info', APPROVED: 'success', DECLINED: 'error', WITHDRAWN: 'default' },
  roleStatus: { ACTIVE: 'success', REQUESTED: 'warning', INACTIVE: 'default', NONE: 'default' },
  cspStatus: { PENDING: 'warning', REGISTERED: 'success', FAILED: 'error', TRANSFERRED_AWAY: 'default' },
  membership: { NONE: 'default', REGISTERED: 'success', DEREGISTERED: 'default' },
};

export type StatusKind = keyof typeof TONES;

/** A status of the API as an outlined chip; its text is the i18n key `<kind>.<value>`. */
export function StatusChip({ kind, value }: { kind: StatusKind; value: string }) {
  const { t } = useTranslation(PARTICIPANTS_NS);
  return <Chip size="small" variant="outlined" color={TONES[kind][value] ?? 'default'} label={t(`${kind}.${value}`)} />;
}
