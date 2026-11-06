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
import { ArrowBackIcon, Box, Chip, Divider, IconButton, Stack, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { NOTIFICATIONS_NS } from '../i18n';
import { NotificationDetails } from './NotificationDetails';
import { useNotificationText } from './useNotificationText';

/**
 * The selected notification, like an opened mail in the reading pane: title, time, kind and state, then the content.
 * Its actions sit on its line in the list. On phones it starts with the way back to the list.
 */
export function NotificationDetailPane({
  notification,
  isNew,
  onBack,
}: {
  notification: NotificationAnemic;
  isNew: boolean;
  onBack?: () => void;
}) {
  const { t } = useTranslation(NOTIFICATIONS_NS);
  const text = useNotificationText();
  return (
    <Box component="section" aria-labelledby="notification-detail-title" sx={{ p: { xs: 2, md: 3 } }}>
      {onBack && (
        <IconButton onClick={onBack} aria-label={t('backToList')} sx={{ ml: -1, mt: -1, mb: 1 }}>
          <ArrowBackIcon />
        </IconButton>
      )}
      <Typography
        id="notification-detail-title"
        variant="h2"
        component="h2"
        sx={{ fontSize: { xs: 20, md: 24 }, lineHeight: 1.3 }}
      >
        {text.title(notification.type)}
      </Typography>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center', mt: 1, mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {text.fullTime(notification.createdAt)}
        </Typography>
        <Chip size="small" variant="outlined" label={t(`topic.${notification.topic}`)} />
        {notification.done !== null && (
          <Chip
            size="small"
            variant="outlined"
            color={notification.done ? 'success' : 'warning'}
            label={notification.done ? t('task.done') : t('task.open')}
          />
        )}
        {notification.forStaff && <Chip size="small" variant="outlined" label={t('forStaff')} />}
        {isNew && <Chip size="small" color="primary" label={t('new')} />}
      </Stack>
      <Divider sx={{ mb: 2 }} />
      {Object.keys(notification.content).length > 0 ? (
        <NotificationDetails content={notification.content} />
      ) : (
        <Typography color="text.secondary">{t('details.none')}</Typography>
      )}
    </Box>
  );
}
