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

import { useState, type ReactNode } from 'react';
import type { NotificationAnemic } from '@dataspace-mgm/c11-m1-core';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircleIcon,
  CircularProgress,
  Container,
  Divider,
  LoginIcon,
  Stack,
  Typography,
  alpha,
  tractusx,
} from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useCoreModules } from '../../../core/CoreModulesContext';
import {
  PAGE_SIZE,
  useNotificationList,
  type ActionOutcome,
  type NotificationView,
} from '../hooks/useNotificationList';
import { NOTIFICATIONS_NS } from '../i18n';

const VIEWS: ReadonlyArray<NotificationView> = ['all', 'unread', 'tasks', 'info'];

/** The i18n key of the answer to an action; Problem Details are mapped by status and type, never shown as keys. */
function outcomeKey({ action, result }: ActionOutcome): {
  key: string;
  severity: 'success' | 'info' | 'warning' | 'error';
} {
  switch (result.status) {
    case 'changed':
      return { key: `outcome.changed.${action}`, severity: 'success' };
    case 'not-found':
      return { key: 'outcome.notFound', severity: 'info' };
    case 'task-open':
      return { key: 'outcome.taskOpen', severity: 'warning' };
    default:
      // 501: the backend module does not have the operation yet (stand-in).
      return result.error.status === 501
        ? { key: 'outcome.notAvailable', severity: 'info' }
        : { key: 'outcome.failed', severity: 'error' };
  }
}

function NotificationRow({
  notification,
  isNew,
  busy,
  onAction,
}: {
  notification: NotificationAnemic;
  isNew: boolean;
  busy: boolean;
  onAction: (action: 'read' | 'unread' | 'hide') => void;
}) {
  const { t, i18n } = useTranslation(NOTIFICATIONS_NS);
  const { t: tCommon } = useTranslation();
  const created = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(notification.createdAt));
  const details = Object.entries(notification.content).map(([name, value]) => `${name}: ${String(value)}`);
  return (
    <Box
      component="li"
      data-testid="notification-row"
      aria-label={tCommon(`notifications.types.${notification.type}`, {
        defaultValue: notification.type,
      })}
      sx={{
        listStyle: 'none',
        px: { xs: 2, md: 3 },
        py: 2,
        bgcolor: isNew ? alpha(tractusx.orange, 0.08) : undefined,
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { md: 'center' } }}>
        <Stack direction="row" spacing={1.5} sx={{ flexGrow: 1, minWidth: 0 }}>
          <CircleIcon
            aria-label={notification.read ? t('read') : t('unread')}
            sx={{
              fontSize: 10,
              mt: 0.9,
              color: notification.read ? 'transparent' : tractusx.orange,
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: notification.read ? 400 : 700 }}>
              {tCommon(`notifications.types.${notification.type}`, {
                defaultValue: tCommon('notifications.unknownType', {
                  type: notification.type,
                }),
              })}
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center', mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {created}
              </Typography>
              <Chip
                size="small"
                variant="outlined"
                label={notification.topic === 'ACTION' ? t('topic.ACTION') : t('topic.INFO')}
              />
              {notification.done !== null && (
                <Chip
                  size="small"
                  color={notification.done ? 'success' : 'warning'}
                  variant="outlined"
                  label={notification.done ? t('task.done') : t('task.open')}
                />
              )}
              {notification.forStaff && <Chip size="small" variant="outlined" label={t('forStaff')} />}
              {isNew && <Chip size="small" color="primary" label={t('new')} />}
            </Stack>
            {details.length > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                component="div"
                sx={{
                  fontFamily: 'monospace',
                  mt: 0.5,
                  wordBreak: 'break-all',
                }}
              >
                {details.join(' · ')}
              </Typography>
            )}
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <Button
            size="small"
            variant="outlined"
            disabled={busy}
            onClick={() => onAction(notification.read ? 'unread' : 'read')}
          >
            {notification.read ? t('actions.markUnread') : t('actions.markRead')}
          </Button>
          <Button size="small" variant="outlined" color="error" disabled={busy} onClick={() => onAction('hide')}>
            {t('actions.hide')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

/**
 * Notifications: the inbox of the signed-in person from C11-M1, live through the inbox stream. Read (list, filters,
 * pages), update (mark as read or unread) and delete (hide, per person). Notifications are created only by C11-M1 from
 * the events of the other modules; there is no operation to create one (README 6.3).
 */
export default function NotificationsPage() {
  const { t } = useTranslation(NOTIFICATIONS_NS);
  const { identity } = useCoreModules();
  const [view, setView] = useState<NotificationView>('all');
  const [page, setPage] = useState(0);
  const list = useNotificationList(view, page);
  const { state } = list;

  let body: ReactNode;
  switch (state.status) {
    case 'loading':
      body = (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }} role="status">
          <CircularProgress size={24} />
          <Typography>{t('loading')}</Typography>
        </Stack>
      );
      break;
    case 'signed-out':
      body = (
        <Alert
          severity="info"
          action={
            <Button color="inherit" startIcon={<LoginIcon />} onClick={() => identity.login.execute('/notifications')}>
              {t('signIn')}
            </Button>
          }
        >
          {t('signInPrompt')}
        </Alert>
      );
      break;
    case 'failed':
      body = (
        <Alert severity="error">
          {state.httpStatus
            ? t('failedWithStatus', {
                status: state.httpStatus,
                message: state.message,
              })
            : t('failed', { message: state.message })}
        </Alert>
      );
      break;
    default: {
      const pages = Math.max(1, Math.ceil(state.total / PAGE_SIZE));
      body =
        state.items.length === 0 ? (
          <Alert severity="info">{t(`empty.${view}`)}</Alert>
        ) : (
          <>
            <Card sx={{ borderRadius: '10px' }}>
              <Box component="ul" aria-label={t('listLabel')} sx={{ m: 0, p: 0 }}>
                {state.items.map((notification, index) => (
                  <Box key={notification.id}>
                    {index > 0 && <Divider component="div" />}
                    <NotificationRow
                      notification={notification}
                      isNew={list.arrivedLive.has(notification.id)}
                      busy={list.pending === notification.id}
                      onAction={(action) => void list.run(action, notification.id)}
                    />
                  </Box>
                ))}
              </Box>
            </Card>
            {pages > 1 && (
              <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
                <Button disabled={page === 0} onClick={() => setPage(page - 1)}>
                  {t('paging.previous')}
                </Button>
                <Typography variant="body2">{t('paging.page', { page: page + 1, pages })}</Typography>
                <Button disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>
                  {t('paging.next')}
                </Button>
              </Stack>
            )}
          </>
        );
    }
  }

  const outcome = list.outcome ? outcomeKey(list.outcome) : null;
  return (
    <Container component="article" maxWidth="lg" aria-labelledby="notifications-title" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="overline" color="text.secondary">
        {t('overline')}
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          alignItems: { sm: 'center' },
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography
          id="notifications-title"
          variant="h1"
          component="h1"
          sx={{ fontSize: 'clamp(2rem, 2vw + 1rem, 2.75rem)' }}
        >
          {t('title')}
        </Typography>
        {state.status !== 'signed-out' && (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }} role="status">
            <CircleIcon
              sx={{
                fontSize: 10,
                color: list.live ? 'success.main' : 'text.disabled',
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {list.live ? t('live') : t('connecting')}
              {state.status === 'ready' &&
                ` · ${state.unread === null ? t('summaryTotal', { count: state.total }) : t('summary', { unread: state.unread, count: state.total })}`}
            </Typography>
          </Stack>
        )}
      </Stack>
      {state.status !== 'signed-out' && (
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ flexWrap: 'wrap', mb: 3 }}
          role="group"
          aria-label={t('views.label')}
        >
          {VIEWS.map((candidate) => (
            <Chip
              key={candidate}
              label={t(`views.${candidate}`)}
              color={candidate === view ? 'primary' : 'default'}
              variant={candidate === view ? 'filled' : 'outlined'}
              aria-pressed={candidate === view}
              onClick={() => {
                setView(candidate);
                setPage(0);
              }}
            />
          ))}
        </Stack>
      )}
      {outcome && (
        <Alert severity={outcome.severity} onClose={list.clearOutcome} sx={{ mb: 2 }}>
          {t(outcome.key, {
            status: list.outcome?.result.status === 'failed' ? list.outcome.result.error.status : '',
          })}
        </Alert>
      )}
      {body}
    </Container>
  );
}
