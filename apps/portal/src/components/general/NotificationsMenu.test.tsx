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

import { ColorModeProvider } from '@dataspace-mgm/ui-mui';
import { MOCK_INBOX } from '@dataspace-mgm/c11-m1-core/testing';
import { PIA_SESSION } from '@dataspace-mgm/identity-core/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { TestCoreModules, testCoreModules } from '../../core/testing';
import { NotificationsMenu } from './HeaderMenus';

function renderBell(options: Parameters<typeof testCoreModules>[0]) {
  const test = testCoreModules(options);
  render(
    <ColorModeProvider>
      <MemoryRouter>
        <TestCoreModules modules={test.modules}>
          <NotificationsMenu />
        </TestCoreModules>
      </MemoryRouter>
    </ColorModeProvider>,
  );
  return test;
}

describe('NotificationsMenu', () => {
  it('shows the unread count once the stream is open, and the newest notifications in the menu', async () => {
    renderBell({ session: PIA_SESSION, notifications: MOCK_INBOX });
    await waitFor(() => expect(screen.getByTestId('notifications-badge').textContent).toBe('2'));
    fireEvent.click(screen.getByRole('button', { name: 'Notifications, 2 unread' }));
    expect(screen.getAllByTestId('notification-item')).toHaveLength(3);
    expect(screen.getByText('New subscription request')).toBeTruthy();
    expect(screen.getByText(/Task open/)).toBeTruthy();
  });

  it('updates live when C11-M1 sends notification-created', async () => {
    const { notificationRepository, inboxEvents } = renderBell({
      session: PIA_SESSION,
      notifications: [],
    });
    await waitFor(() => expect(inboxEvents.openConnections).toBe(1));
    expect(screen.queryByTestId('notifications-badge')).toBeNull();
    notificationRepository.add({ ...MOCK_INBOX[1], id: 'live-1' });
    inboxEvents.emit({
      kind: 'created',
      notificationId: 'live-1',
      type: 'OFFER_APPROVED',
      topic: 'INFO',
      forStaff: false,
      done: null,
      createdAt: MOCK_INBOX[1].createdAt,
    });
    await waitFor(() => expect(screen.getByTestId('notifications-badge').textContent).toBe('1'));
    fireEvent.click(screen.getByRole('button', { name: 'Notifications, 1 unread' }));
    expect(screen.getByText('Your offer was approved')).toBeTruthy();
    expect(screen.getByText(/New$/)).toBeTruthy();
  });

  it('asks to sign in without a session and opens no stream', async () => {
    const { inboxEvents } = renderBell({ session: null });
    fireEvent.click(await screen.findByRole('button', { name: 'Notifications' }));
    expect(await screen.findByText('Sign in to see your notifications')).toBeTruthy();
    expect(inboxEvents.connects).toEqual([]);
  });
});
