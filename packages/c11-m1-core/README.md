<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation

 AI Disclosure: This file was entirely AI-generated.
 The AI-generated portions are made available under CC0-1.0 and not subject
 to the project's license. The human contributor has reviewed and verified
 that the content is correct.

 SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-opus-5-5)
-->

# @dataspace-mgm/c11-m1-core

Framework-free core package of the backend module **C11-M1 Notifications**
([spec](../../specs/c11-m1/openapi.yaml), copied from
[portal-backend-spec](https://github.com/tx-arena-events/portal-backend-spec/tree/main/C11-M1-Notifications)):
the inbox of the signed-in person, and its live updates as Server-Sent Events.

**Status:** core package complete; wired in the app's container, mock mode and `testCoreModules()`. No page yet.
As of 6 Nov 2026 the backend has `listNotifications` and the stream; the other operations answer 501 until C11-M1
has them, and the use cases return that as `failed` with `status: 501`.

## Use cases

| Use case | Operation | Result |
|---|---|---|
| `listNotifications.execute(filter?)` | `GET /notifications` | `found` with a page, or `failed` |
| `countNotifications.execute()` | `GET /notifications/count` | `found` with `total`, `unread`, `openTasks`, `unreadInfo`, or `failed` |
| `getNotification.execute(id)` | `GET /notifications/{notificationId}` | `found`, `not-found`, `failed` |
| `markNotificationRead.execute(id)`, `markNotificationUnread.execute(id)` | `POST …/read`, `…/unread` | `changed`, `not-found`, `failed` |
| `hideNotification.execute(id)` | `POST …/hide` | `changed`, `not-found`, `task-open` (409), `failed` |
| `followInbox.execute(listener, signal)` | `GET /notifications/events` (SSE) | runs until `signal` aborts (`closed`) or a 4xx (`stopped`) |

### Following the inbox

```ts
const abort = new AbortController();
void c11m1.followInbox.execute(
  {
    onEvent: (event) => {
      // 'resync': (re)read list and counters. Sent once the stream is open, so read them only then.
      // 'created': a new notification (no content; getNotification if needed). 'done': a task was closed.
    },
    onConnectionLost: (error) => { /* optional: show "reconnecting"; the use case reconnects by itself */ },
  },
  abort.signal,
);
// later: abort.abort();
```

The stream is read with `fetch`, not `EventSource`: the browser has only the session cookie, and the BFF adds the
token in the `Authorization` header. After a broken connection the use case waits for the server's `retry` (3 s) and
reconnects with `Last-Event-ID`; C11-M1 replays what was missed or sends `resync`.

### Differences between the backend stand-in and the spec (6 Nov 2026)

- List items carry `id` instead of `notificationId`, `userId` and `sourceEventId`, and no `forStaff`. The mapper
  accepts `id` until the stand-in follows the spec (`infrastructure/mappers/notification.mapper.ts`).
- Information (`INFO`) carries `done: false`; the spec has `done` for tasks only. The mapper gives `null` for `INFO`.

## Operations of the module

All with permission `view_notifications`, scope `own`.

| Operation | `operationId` | Notes |
|---|---|---|
| `GET /notifications` | `listNotifications` | filters `topic`, `type`, `read`, `done`, `createdSince`; paged |
| `GET /notifications/count` | `countNotifications` | `total`, `unread`, `openTasks`, `unreadInfo` |
| `GET /notifications/{notificationId}` | `getNotification` | |
| `POST /notifications/{notificationId}/read`, `/unread` | `markRead`, `markUnread` | 204, idempotent |
| `POST /notifications/{notificationId}/hide` | `hideNotification` | 204; an open task gives 409 `urn:c11-m1:problem:task-open` |
| `GET /notifications/events` | `streamNotificationEvents` | SSE: `notification-created`, `notification-done`, `resync` (README 7.6) |

The stream carries no `content`: read the notification by ID when it is needed. Open the stream **before** reading the
list and the counters (without `Last-Event-ID` it sends only new events), and read both again on `resync`.

## Update the spec

```bash
cp ../portal-backend/spec/C11-M1-Notifications/openapi.yaml specs/c11-m1/openapi.yaml
npx nx run c11-m1-core:generate-api     # rewrites src/generated/, never edit it by hand
npx nx run c11-m1-core:check-api        # fails when the generated types are not up to date
```

## Create the module

```ts
import { C11M1_BASE_PATH, createC11M1Module } from '@dataspace-mgm/c11-m1-core';

const c11m1 = createC11M1Module({ baseUrl: `${apiBaseUrl}${C11M1_BASE_PATH}`, getCsrfToken, onUnauthorized });
```

Tests and mock mode use `createC11M1ModuleFrom(repository, eventSource)` with the adapters of
`@dataspace-mgm/c11-m1-core/testing`: `InMemoryNotificationRepository`, `InMemoryInboxEventSource` (`emit`, `drop`,
`failNextConnect`) and the fixtures `MOCK_INBOX`, `SUBSCRIPTION_REQUESTED_TASK`, `OFFER_APPROVED_INFO`,
`REVIEW_CASE_DONE_TASK`.

## Layout

`domain/` (anemics, ports, in-memory adapters) ← `application/` (use cases) and `infrastructure/` (generated client,
mappers incl. the `text/event-stream` parser, HTTP and SSE adapters); only `index.ts` imports `infrastructure/`.
