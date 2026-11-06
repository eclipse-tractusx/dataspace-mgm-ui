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

import { useEffect, useRef, useState } from "react";
import type { NotificationAnemic } from "@dataspace-mgm/c11-m1-core";
import { useCoreModules, useSession } from "../../core/CoreModulesContext";

/** How many notifications the bell menu shows. */
export const INBOX_MENU_SIZE = 8;

export type InboxState =
  | { status: "signed-out" }
  | { status: "loading" }
  | { status: "failed"; message: string }
  | {
      status: "ready";
      items: ReadonlyArray<NotificationAnemic>;
      unread: number;
      total: number;
    };

export interface Inbox {
  state: InboxState;
  /** The live stream (C11-M1 `GET /notifications/events`) is connected. */
  live: boolean;
  /** Notifications that arrived through the stream while the page was open. */
  arrivedLive: ReadonlySet<string>;
}

/**
 * The inbox of the signed-in person, kept up to date by Server-Sent Events: the hook calls the use cases of
 * @dataspace-mgm/c11-m1-core, never HTTP. `followInbox` opens the stream first and says `resync` once it is open; the
 * hook then reads the list and the counters, and reads them again on every change of the inbox. (Redux Toolkit / RTK
 * Query takes this place once the portal has a store: frontend architecture 06.)
 */
export function useInbox(): Inbox {
  const { c11m1 } = useCoreModules();
  const session = useSession();
  const personId =
    session.status === "signed-in" ? session.session.user.id : null;
  // Kept per person, so that a change of person shows `loading` instead of the inbox of the one before.
  const [inbox, setInbox] = useState<{
    personId: string;
    state: InboxState;
    arrivedLive: ReadonlySet<string>;
  } | null>(null);
  const [live, setLive] = useState(false);
  const loads = useRef(0);

  useEffect(() => {
    if (personId === null) {
      return;
    }
    const abort = new AbortController();
    const update = (
      change: (arrived: ReadonlySet<string>) => {
        state?: InboxState;
        arrivedLive?: ReadonlySet<string>;
      },
    ) =>
      setInbox((previous) => {
        const current =
          previous?.personId === personId
            ? previous
            : {
                personId,
                state: { status: "loading" } as InboxState,
                arrivedLive: new Set<string>(),
              };
        return { ...current, ...change(current.arrivedLive) };
      });

    const reload = async () => {
      const run = ++loads.current;
      const [list, count] = await Promise.all([
        c11m1.listNotifications.execute({ size: INBOX_MENU_SIZE }),
        c11m1.countNotifications.execute(),
      ]);
      if (abort.signal.aborted || run !== loads.current) {
        return;
      }
      if (list.status === "failed") {
        update(() => ({
          state: { status: "failed", message: list.error.message },
        }));
        return;
      }
      // Until C11-M1 has GET /notifications/count (501 today), count the unread ones of the loaded page.
      const unread =
        count.status === "found"
          ? count.count.unread
          : list.page.items.filter((n) => !n.read).length;
      update(() => ({
        state: {
          status: "ready",
          items: list.page.items,
          unread,
          total: list.page.total,
        },
      }));
    };

    void c11m1.followInbox
      .execute(
        {
          onEvent: (event) => {
            setLive(true);
            if (event.kind === "created") {
              update((arrived) => ({
                arrivedLive: new Set(arrived).add(event.notificationId),
              }));
            }
            void reload();
          },
          onConnectionLost: () => setLive(false),
        },
        abort.signal,
      )
      .then((end) => {
        setLive(false);
        if (end.status === "stopped" && !abort.signal.aborted) {
          update(() => ({
            state: { status: "failed", message: end.error.message },
          }));
        }
      });
    return () => abort.abort();
  }, [c11m1, personId]);

  const none: ReadonlySet<string> = new Set();
  if (session.status === "loading") {
    return { state: { status: "loading" }, live: false, arrivedLive: none };
  }
  if (personId === null) {
    return { state: { status: "signed-out" }, live: false, arrivedLive: none };
  }
  if (inbox?.personId !== personId) {
    return { state: { status: "loading" }, live, arrivedLive: none };
  }
  return { state: inbox.state, live, arrivedLive: inbox.arrivedLive };
}
