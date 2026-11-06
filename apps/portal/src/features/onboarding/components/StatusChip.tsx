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

import type { ApplicationStatus } from '@dataspace-mgm/c1-m2-core';
import { Chip } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { ONBOARDING_NS } from '../i18n';

const STATUS_COLOR = { CREATED: 'info', SUBMITTED: 'warning', COMPLETED: 'success', DECLINED: 'error', WITHDRAWN: 'default' } as const;

/** The status of an application as a chip. */
export function StatusChip({ status }: { status: ApplicationStatus }) {
  const { t } = useTranslation(ONBOARDING_NS);
  return <Chip label={t(`enum.status.${status}`)} color={STATUS_COLOR[status]} variant="outlined" size="small" />;
}
