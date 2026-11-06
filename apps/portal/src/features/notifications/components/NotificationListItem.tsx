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
import {
  Box,
  CheckIcon,
  CircleIcon,
  CloseIcon,
  IconButton,
  ListItemButton,
  Stack,
  Tooltip,
  Typography,
  alpha,
  tractusx,
} from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import type { NotificationAction } from '../hooks/useNotificationList';
import { NOTIFICATIONS_NS } from '../i18n';
import { useNotificationText } from './useNotificationText';

/**
 * One line of the inbox list, like a mail in Outlook: unread dot and title, with the actions (mark as read or unread,
 * hide) on the right of the first line; under it the kind and state, with the time on the right. The actions show on the selected line, on hover and on keyboard focus, and
 * always on touch screens (`alwaysShowActions`). They sit next to the line's button, never inside it.
 */
export function NotificationListItem({
  notification,
  selected,
  isNew,
  busy,
  alwaysShowActions,
  onSelect,
  onAction,
}: {
  notification: NotificationAnemic;
  selected: boolean;
  isNew: boolean;
  busy: boolean;
  alwaysShowActions: boolean;
  onSelect: () => void;
  onAction: (action: NotificationAction) => void;
}) {
  const { t } = useTranslation(NOTIFICATIONS_NS);
  const text = useNotificationText();
  const toggle = notification.read
    ? { action: 'unread' as const, label: t('actions.markUnread'), icon: <CircleIcon sx={{ fontSize: 12 }} /> }
    : { action: 'read' as const, label: t('actions.markRead'), icon: <CheckIcon sx={{ fontSize: 20 }} /> };
  const title = text.title(notification.type);
  const actionSx = {
    color: 'text.primary',
    '&:hover, &:focus-visible': { color: tractusx.orange, bgcolor: alpha(tractusx.orange, 0.12) },
  } as const;
  return (
    <Box
      component="li"
      data-testid="notification-row"
      sx={{
        listStyle: 'none',
        position: 'relative',
        '& .row-actions': { opacity: selected || alwaysShowActions ? 1 : 0, transition: 'opacity 120ms' },
        '&:hover .row-actions, &:focus-within .row-actions': { opacity: 1 },
      }}
    >
      <ListItemButton
        selected={selected}
        aria-current={selected ? 'true' : undefined}
        onClick={onSelect}
        sx={{
          alignItems: 'flex-start',
          gap: 1.5,
          borderRadius: 0,
          px: 2,
          py: 1.5,
          borderLeft: '3px solid',
          borderLeftColor: selected ? tractusx.orange : 'transparent',
          bgcolor: isNew && !selected ? alpha(tractusx.orange, 0.06) : undefined,
        }}
      >
        <CircleIcon
          aria-label={notification.read ? t('read') : t('unread')}
          sx={{ fontSize: 8, mt: 0.9, flexShrink: 0, color: notification.read ? 'transparent' : tractusx.orange }}
        />
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography noWrap sx={{ pr: 9, fontWeight: notification.read ? 400 : 700, fontSize: '0.9375rem' }}>
            {title}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
            <Typography variant="body2" color="text.secondary" noWrap sx={{ flexGrow: 1 }}>
              {[text.kind(notification), isNew ? t('new') : null].filter(Boolean).join(' · ')}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
              {text.shortTime(notification.createdAt)}
            </Typography>
          </Stack>
        </Box>
      </ListItemButton>
      <Stack
        direction="row"
        className="row-actions"
        role="group"
        aria-label={t('actions.labelFor', { title })}
        sx={{ position: 'absolute', right: 8, top: 6 }}
      >
        <Tooltip title={toggle.label}>
          <span>
            <IconButton
              size="small"
              sx={actionSx}
              aria-label={toggle.label}
              disabled={busy}
              onClick={() => onAction(toggle.action)}
            >
              {toggle.icon}
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={t('actions.hide')}>
          <span>
            <IconButton
              size="small"
              sx={actionSx}
              aria-label={t('actions.hide')}
              disabled={busy}
              onClick={() => onAction('hide')}
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Box>
  );
}
