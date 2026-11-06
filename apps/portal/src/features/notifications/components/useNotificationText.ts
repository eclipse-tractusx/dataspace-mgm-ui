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

import type { NotificationAnemic } from '@dataspace-mgm/c11-m1-core';
import { useTranslation } from 'react-i18next';
import { NOTIFICATIONS_NS } from '../i18n';

/** The texts of a notification, shared by the list and the detail pane: title, kind and state, times. */
export function useNotificationText() {
  const { t, i18n } = useTranslation(NOTIFICATIONS_NS);
  const { t: tCommon } = useTranslation();
  const time = new Intl.DateTimeFormat(i18n.language, { timeStyle: 'short' });
  const date = new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short' });
  const full = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'full', timeStyle: 'short' });
  return {
    title: (type: string) =>
      tCommon(`notifications.types.${type}`, { defaultValue: tCommon('notifications.unknownType', { type }) }),
    /** "Information", "Task · Open", "Task · Done". */
    kind: (notification: NotificationAnemic) =>
      notification.done === null
        ? t(`topic.${notification.topic}`)
        : `${t('topic.ACTION')} · ${notification.done ? t('task.done') : t('task.open')}`,
    /** The time for today, the day otherwise, as in a mail list. */
    shortTime: (iso: string) => {
      const value = new Date(iso);
      return value.toDateString() === new Date().toDateString() ? time.format(value) : date.format(value);
    },
    fullTime: (iso: string) => full.format(new Date(iso)),
  };
}
