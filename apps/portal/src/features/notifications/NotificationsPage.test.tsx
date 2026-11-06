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

import { MOCK_INBOX, OFFER_APPROVED_INFO, SUBSCRIPTION_REQUESTED_TASK } from '@dataspace-mgm/c11-m1-core/testing';
import { PIA_SESSION } from '@dataspace-mgm/identity-core/testing';
import { ColorModeProvider } from '@dataspace-mgm/ui-mui';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, describe, expect, it } from 'vitest';
import { TestCoreModules, testCoreModules } from '../../core/testing';
import { features } from '../main';
import { readableField } from './components/NotificationDetails';
import { notificationsTranslations } from './i18n';
import NotificationsPage from './pages/NotificationsPage';

beforeAll(() => notificationsTranslations.load());

const show = (options: Parameters<typeof testCoreModules>[0]) => {
  const test = testCoreModules(options);
  render(
    <ColorModeProvider>
      <MemoryRouter initialEntries={['/notifications']}>
        <TestCoreModules modules={test.modules}>
          <NotificationsPage />
        </TestCoreModules>
      </MemoryRouter>
    </ColorModeProvider>,
  );
  return test;
};

/** The notification open on the right. */
const detail = () => screen.getByRole('region', { name: (name) => name.length > 0 });
const open = (title: string) => fireEvent.click(screen.getByRole('button', { name: new RegExp(title) }));
/** The line of a notification in the list; its actions sit on it. */
const row = (title: string) => {
  const line = screen.getAllByTestId('notification-row').find((item) => within(item).queryByText(title));
  if (!line) {
    throw new Error(`No line for ${title}`);
  }
  return line;
};

describe('Notifications page (C11-M1), laid out like a mail client', () => {
  it('is in the left menu', () => {
    expect(features.find((feature) => feature.id === 'notifications')).toMatchObject({
      path: '/notifications',
      disabled: false,
    });
  });

  it('lists the inbox on the left and opens the newest notification on the right', async () => {
    show({ session: PIA_SESSION, notifications: MOCK_INBOX });
    expect(await screen.findAllByTestId('notification-row')).toHaveLength(3);
    expect(screen.getByText(/Live · 2 unread of 3/)).toBeInTheDocument();
    expect(within(detail()).getByRole('heading', { level: 2, name: 'New subscription request' })).toBeInTheDocument();
    expect(within(detail()).getByText('Open')).toBeInTheDocument();
    expect(
      within(row('New subscription request')).getByRole('button', { name: /New subscription request/ }),
    ).toHaveAttribute('aria-current', 'true');
  });

  it('opens the notification chosen in the list, with its content as labelled details', async () => {
    show({ session: PIA_SESSION, notifications: MOCK_INBOX });
    await screen.findAllByTestId('notification-row');
    open('New subscription request');
    expect(within(detail()).getByText('Customer company')).toBeInTheDocument();
    expect(within(detail()).getByText('c0000001-0000-4000-8000-000000000001')).toBeInTheDocument();
    open('New application to review');
    expect(within(detail()).getByRole('heading', { level: 2, name: 'New application to review' })).toBeInTheDocument();
    expect(within(detail()).getByText('Done')).toBeInTheDocument();
    expect(within(detail()).getByText('For OSP staff')).toBeInTheDocument();
  });

  it('marks as read and unread again with the icons on its line in the list', async () => {
    const { notificationRepository } = show({ session: PIA_SESSION, notifications: MOCK_INBOX });
    await screen.findAllByTestId('notification-row');
    fireEvent.click(within(row('Your offer was approved')).getByRole('button', { name: 'Mark as read' }));
    expect(await screen.findByText('Marked as read.')).toBeInTheDocument();
    expect((await notificationRepository.get(OFFER_APPROVED_INFO.id))?.read).toBe(true);
    fireEvent.click(await within(row('Your offer was approved')).findByRole('button', { name: 'Mark as unread' }));
    expect(await screen.findByText('Marked as unread.')).toBeInTheDocument();
    expect((await notificationRepository.get(OFFER_APPROVED_INFO.id))?.read).toBe(false);
  });

  it('hides information, and shows the answer of the module for an open task', async () => {
    show({ session: PIA_SESSION, notifications: MOCK_INBOX });
    await screen.findAllByTestId('notification-row');
    fireEvent.click(within(row('New subscription request')).getByRole('button', { name: 'Hide' }));
    expect(await screen.findByText(/An open task cannot be hidden/)).toBeInTheDocument();
    fireEvent.click(within(row('Your offer was approved')).getByRole('button', { name: 'Hide' }));
    expect(await screen.findByText('The notification is hidden.')).toBeInTheDocument();
    expect(screen.getAllByTestId('notification-row')).toHaveLength(2);
    expect(screen.queryByRole('button', { name: /Your offer was approved/ })).toBeNull();
    expect(within(detail()).getByRole('heading', { level: 2, name: 'New subscription request' })).toBeInTheDocument();
  });

  it('keeps the actions out of the reading pane', async () => {
    show({ session: PIA_SESSION, notifications: MOCK_INBOX });
    await screen.findAllByTestId('notification-row');
    expect(within(detail()).queryByRole('button', { name: 'Hide' })).toBeNull();
    expect(
      within(row('Your offer was approved')).getByRole('group', { name: 'Actions for Your offer was approved' }),
    ).toBeInTheDocument();
  });

  it('filters by view through the module', async () => {
    const { notificationRepository } = show({ session: PIA_SESSION, notifications: MOCK_INBOX });
    await screen.findAllByTestId('notification-row');
    fireEvent.click(screen.getByRole('button', { name: 'Information' }));
    expect(await screen.findByRole('button', { name: /Your offer was approved/ })).toBeInTheDocument();
    expect(screen.getAllByTestId('notification-row')).toHaveLength(1);
    expect(notificationRepository.calls.filter((call) => call === 'list').length).toBeGreaterThan(1);
  });

  it('shows a new notification as it arrives', async () => {
    const { notificationRepository, inboxEvents } = show({ session: PIA_SESSION, notifications: [] });
    expect(await screen.findByText('You have no notifications.')).toBeInTheDocument();
    notificationRepository.add({ ...SUBSCRIPTION_REQUESTED_TASK, id: 'live-1' });
    inboxEvents.emit({
      kind: 'created',
      notificationId: 'live-1',
      type: 'SUBSCRIPTION_REQUESTED',
      topic: 'ACTION',
      forStaff: false,
      done: false,
      createdAt: SUBSCRIPTION_REQUESTED_TASK.createdAt,
    });
    expect(await screen.findByRole('button', { name: /New subscription request/ })).toBeInTheDocument();
    expect(within(detail()).getByText('New')).toBeInTheDocument();
  });

  it('labels a field without a translation readably', () => {
    expect(readableField('offerSubscriptionId')).toBe('Offer subscription');
    expect(readableField('instanceKind')).toBe('Instance kind');
  });

  it('asks to sign in without a session', async () => {
    show({ session: null });
    expect(await screen.findByText('Sign in to see your notifications.')).toBeInTheDocument();
  });
});
