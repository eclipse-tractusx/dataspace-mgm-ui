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
  useMediaQuery,
  useTheme,
} from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useCoreModules } from '../../../core/CoreModulesContext';
import { NotificationDetailPane } from '../components/NotificationDetailPane';
import { NotificationListItem } from '../components/NotificationListItem';
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

/**
 * Notifications, laid out like a mail client: the inbox on the left, the selected notification on the right (the
 * first one until another is chosen), its actions as icons at the top right. On phones the list and the notification
 * take turns. Read (list, views, pages), update (mark as read or unread) and delete (hide, per person) through
 * C11-M1; notifications are created only by C11-M1 from events, there is no operation to create one (README 6.3).
 */
export default function NotificationsPage() {
  const { t } = useTranslation(NOTIFICATIONS_NS);
  const { identity } = useCoreModules();
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('md'));
  const [view, setView] = useState<NotificationView>('all');
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);
  const list = useNotificationList(view, page);
  const { state } = list;

  const choose = (next: NotificationView) => {
    setView(next);
    setPage(0);
    setSelectedId(null);
    setOpened(false);
  };

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
            ? t('failedWithStatus', { status: state.httpStatus, message: state.message })
            : t('failed', { message: state.message })}
        </Alert>
      );
      break;
    default: {
      if (state.items.length === 0) {
        body = <Alert severity="info">{t(`empty.${view}`)}</Alert>;
        break;
      }
      // The selected notification; the first one until another is chosen, or after the selected one was hidden.
      const selected = state.items.find((n) => n.id === selectedId) ?? state.items[0];
      const pages = Math.max(1, Math.ceil(state.total / PAGE_SIZE));
      const showList = !compact || !opened;
      const showDetail = !compact || opened;
      body = (
        <Card
          sx={{
            // A quiet frame like a mail client: square corners, the divider colour, no glow on hover.
            borderRadius: 0,
            borderColor: 'divider',
            '&:hover': { boxShadow: 'none' },
            display: 'grid',
            gridTemplateColumns: compact ? '1fr' : 'minmax(280px, 380px) minmax(0, 1fr)',
            minHeight: { md: 480 },
          }}
        >
          {showList && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                borderRight: compact ? 0 : 1,
                borderColor: 'divider',
              }}
            >
              <Box
                component="ul"
                aria-label={t('listLabel')}
                sx={{ m: 0, p: 0, flexGrow: 1, overflowY: 'auto', maxHeight: { md: 'calc(100vh - 340px)' } }}
              >
                {state.items.map((notification, index) => (
                  <Box key={notification.id} component="div" sx={{ display: 'contents' }}>
                    {index > 0 && <Divider component="div" />}
                    <NotificationListItem
                      notification={notification}
                      selected={!compact && notification.id === selected.id}
                      isNew={list.arrivedLive.has(notification.id)}
                      onSelect={() => {
                        setSelectedId(notification.id);
                        setOpened(true);
                      }}
                      busy={list.pending === notification.id}
                      alwaysShowActions={compact}
                      onAction={(action) => void list.run(action, notification.id)}
                    />
                  </Box>
                ))}
              </Box>
              {pages > 1 && (
                <>
                  <Divider />
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ justifyContent: 'space-between', alignItems: 'center', px: 1, py: 0.5 }}
                  >
                    <Button size="small" disabled={page === 0} onClick={() => setPage(page - 1)}>
                      {t('paging.previous')}
                    </Button>
                    <Typography variant="caption" color="text.secondary">
                      {t('paging.page', { page: page + 1, pages })}
                    </Typography>
                    <Button size="small" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>
                      {t('paging.next')}
                    </Button>
                  </Stack>
                </>
              )}
            </Box>
          )}
          {showDetail && (
            <Box sx={{ minWidth: 0, overflowY: 'auto', maxHeight: { md: 'calc(100vh - 340px)' } }}>
              <NotificationDetailPane
                key={selected.id}
                notification={selected}
                isNew={list.arrivedLive.has(selected.id)}
                onBack={compact ? () => setOpened(false) : undefined}
              />
            </Box>
          )}
        </Card>
      );
    }
  }

  const outcome = list.outcome ? outcomeKey(list.outcome) : null;
  return (
    <Container component="article" maxWidth="xl" aria-labelledby="notifications-title" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="overline" color="text.secondary">
        {t('overline')}
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between', mb: 3 }}
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
            <CircleIcon sx={{ fontSize: 10, color: list.live ? 'success.main' : 'text.disabled' }} />
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
          sx={{ flexWrap: 'wrap', mb: 2 }}
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
              onClick={() => choose(candidate)}
            />
          ))}
        </Stack>
      )}
      {outcome && (
        <Alert severity={outcome.severity} onClose={list.clearOutcome} sx={{ mb: 2 }}>
          {t(outcome.key, { status: list.outcome?.result.status === 'failed' ? list.outcome.result.error.status : '' })}
        </Alert>
      )}
      {body}
    </Container>
  );
}
