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

import type { NotificationCountAnemic } from '../anemics/notification-count.anemic';
import type { NotificationAnemic } from '../anemics/notification.anemic';
import type { NotificationChangeOutcome } from '../data/notification-change.data';
import type { NotificationFilter, NotificationPage } from '../data/notification-filter.data';
import type { NotificationRepository } from '../repositories/notification.repository';

const DEFAULT_PAGE_SIZE = 20;

/** In-memory adapter of the port: one person's inbox, with the rules of README 7.1 to 7.5. For tests and mock mode. */
export class InMemoryNotificationRepository implements NotificationRepository {
  public readonly calls: string[] = [];
  private readonly entries: NotificationAnemic[];
  private readonly hidden = new Set<string>();

  constructor(
    notifications: ReadonlyArray<NotificationAnemic> = [],
    private readonly failure: Error | null = null,
  ) {
    this.entries = notifications.map((notification) => ({ ...notification }));
  }

  /** Adds a notification, as C11-M1 does when an event arrives (pair it with InMemoryInboxEventSource.emit). */
  public add(notification: NotificationAnemic): void {
    this.entries.push({ ...notification });
  }

  /** Closes a task, as C11-M1 does on its closing event. */
  public close(notificationId: string, doneAt: string): void {
    this.replace(notificationId, { done: true, doneAt });
  }

  public async list(filter: NotificationFilter): Promise<NotificationPage> {
    this.record('list');
    const page = filter.page ?? 0;
    const size = filter.size ?? DEFAULT_PAGE_SIZE;
    const matching = this.visible()
      .filter((n) => filter.topic === undefined || n.topic === filter.topic)
      .filter((n) => filter.type === undefined || n.type === filter.type)
      .filter((n) => filter.read === undefined || n.read === filter.read)
      .filter((n) => filter.done === undefined || (n.topic === 'ACTION' && n.done === filter.done))
      .filter((n) => filter.createdSince === undefined || n.createdAt >= filter.createdSince)
      .sort((a, b) => (filter.order === 'oldest-first' ? 1 : -1) * a.createdAt.localeCompare(b.createdAt));
    const items = matching.slice(page * size, (page + 1) * size);
    return { items, page, size: items.length, total: matching.length };
  }

  public async count(): Promise<NotificationCountAnemic> {
    this.record('count');
    const visible = this.visible();
    return {
      total: visible.length,
      unread: visible.filter((n) => !n.read).length,
      openTasks: visible.filter((n) => n.topic === 'ACTION' && n.done === false).length,
      unreadInfo: visible.filter((n) => n.topic === 'INFO' && !n.read).length,
    };
  }

  public async get(notificationId: string): Promise<NotificationAnemic | null> {
    this.record(`get ${notificationId}`);
    return this.entries.find((n) => n.id === notificationId) ?? null;
  }

  public async markRead(notificationId: string): Promise<NotificationChangeOutcome> {
    this.record(`read ${notificationId}`);
    return this.replace(notificationId, { read: true });
  }

  public async markUnread(notificationId: string): Promise<NotificationChangeOutcome> {
    this.record(`unread ${notificationId}`);
    return this.replace(notificationId, { read: false });
  }

  public async hide(notificationId: string): Promise<NotificationChangeOutcome> {
    this.record(`hide ${notificationId}`);
    const notification = this.entries.find((n) => n.id === notificationId);
    if (!notification) {
      return 'not-found';
    }
    if (notification.topic === 'ACTION' && notification.done === false) {
      return 'task-open';
    }
    this.hidden.add(notificationId);
    return 'changed';
  }

  private record(call: string): void {
    this.calls.push(call);
    if (this.failure) {
      throw this.failure;
    }
  }

  private visible(): NotificationAnemic[] {
    return this.entries.filter((n) => !this.hidden.has(n.id));
  }

  private replace(notificationId: string, change: Partial<NotificationAnemic>): NotificationChangeOutcome {
    const index = this.entries.findIndex((n) => n.id === notificationId);
    if (index === -1) {
      return 'not-found';
    }
    this.entries[index] = { ...this.entries[index], ...change };
    return 'changed';
  }
}
