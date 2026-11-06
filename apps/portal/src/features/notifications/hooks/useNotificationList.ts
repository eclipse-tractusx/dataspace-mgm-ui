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

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeNotificationResult, NotificationAnemic, NotificationFilter } from '@dataspace-mgm/c11-m1-core';
import { useCoreModules, useSession } from '../../../core/CoreModulesContext';

/** The views of the page; each one is a filter of C11-M1 `listNotifications` (README 7.1), not a rule of the UI. */
export type NotificationView = 'all' | 'unread' | 'tasks' | 'info';

export const VIEW_FILTERS: Readonly<Record<NotificationView, NotificationFilter>> = {
  all: {},
  unread: { read: false },
  tasks: { topic: 'ACTION' },
  info: { topic: 'INFO' },
};

export const PAGE_SIZE = 10;

export type NotificationAction = 'read' | 'unread' | 'hide';

export type NotificationListState =
  | { status: 'loading' }
  | { status: 'signed-out' }
  | { status: 'failed'; message: string; httpStatus: number | null }
  | {
      status: 'ready';
      items: ReadonlyArray<NotificationAnemic>;
      total: number;
      /** null while C11-M1 has no GET /notifications/count (501). */
      unread: number | null;
    };

export interface ActionOutcome {
  action: NotificationAction;
  notificationId: string;
  result: ChangeNotificationResult;
}

export interface NotificationList {
  state: NotificationListState;
  live: boolean;
  /** Notifications that arrived through the stream while the page was open. */
  arrivedLive: ReadonlySet<string>;
  /** The notification whose action is running; its buttons are disabled (no double submission). */
  pending: string | null;
  outcome: ActionOutcome | null;
  clearOutcome: () => void;
  run: (action: NotificationAction, notificationId: string) => Promise<void>;
}

/**
 * The inbox page: one page of the own notifications for a view, kept up to date by the inbox stream, and the actions
 * read, unread and hide. Calls only use cases of @dataspace-mgm/c11-m1-core. Marking and hiding send no stream event
 * (README 7.6), so the list is read again after an action.
 */
export function useNotificationList(view: NotificationView, page: number): NotificationList {
  const { c11m1 } = useCoreModules();
  const session = useSession();
  const personId = session.status === 'signed-in' ? session.session.user.id : null;
  const key = `${personId ?? ''}|${view}|${page}`;
  const [loaded, setLoaded] = useState<{
    key: string;
    state: NotificationListState;
  } | null>(null);
  const [live, setLive] = useState(false);
  const [arrivedLive, setArrivedLive] = useState<ReadonlySet<string>>(new Set());
  const [pending, setPending] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<ActionOutcome | null>(null);
  const reloadRef = useRef<() => Promise<void>>(async () => undefined);
  const loads = useRef(0);

  useEffect(() => {
    if (personId === null) {
      return;
    }
    const abort = new AbortController();
    const reload = async () => {
      const run = ++loads.current;
      const [list, count] = await Promise.all([
        c11m1.listNotifications.execute({
          ...VIEW_FILTERS[view],
          page,
          size: PAGE_SIZE,
        }),
        c11m1.countNotifications.execute(),
      ]);
      if (abort.signal.aborted || run !== loads.current) {
        return;
      }
      if (list.status === 'failed') {
        setLoaded({
          key,
          state: {
            status: 'failed',
            message: list.error.message,
            httpStatus: list.error.status,
          },
        });
        return;
      }
      setLoaded({
        key,
        state: {
          status: 'ready',
          items: list.page.items,
          total: list.page.total,
          unread: count.status === 'found' ? count.count.unread : null,
        },
      });
    };
    reloadRef.current = reload;
    void c11m1.followInbox
      .execute(
        {
          onEvent: (event) => {
            setLive(true);
            if (event.kind === 'created') {
              setArrivedLive((previous) => new Set(previous).add(event.notificationId));
            }
            void reload();
          },
          onConnectionLost: () => setLive(false),
        },
        abort.signal,
      )
      .then((end) => {
        setLive(false);
        if (end.status === 'stopped' && !abort.signal.aborted) {
          setLoaded({
            key,
            state: {
              status: 'failed',
              message: end.error.message,
              httpStatus: end.error.status,
            },
          });
        }
      });
    return () => abort.abort();
  }, [c11m1, personId, view, page, key]);

  const run = useCallback(
    async (action: NotificationAction, notificationId: string) => {
      setPending(notificationId);
      const useCase =
        action === 'read'
          ? c11m1.markNotificationRead
          : action === 'unread'
            ? c11m1.markNotificationUnread
            : c11m1.hideNotification;
      const result = await useCase.execute(notificationId);
      setOutcome({ action, notificationId, result });
      setPending(null);
      if (result.status === 'changed' || result.status === 'not-found') {
        await reloadRef.current();
      }
    },
    [c11m1],
  );

  const clearOutcome = useCallback(() => setOutcome(null), []);

  let state: NotificationListState;
  if (session.status === 'loading') {
    state = { status: 'loading' };
  } else if (personId === null) {
    state = { status: 'signed-out' };
  } else {
    state = loaded?.key === key ? loaded.state : { status: 'loading' };
  }
  return {
    state,
    live: personId !== null && live,
    arrivedLive,
    pending,
    outcome,
    clearOutcome,
    run,
  };
}
