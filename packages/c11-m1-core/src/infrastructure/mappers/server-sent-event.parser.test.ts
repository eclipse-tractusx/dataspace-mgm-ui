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

import { describe, expect, it } from 'vitest';
import { ServerSentEventParser } from './server-sent-event.parser';

describe('ServerSentEventParser', () => {
  it('reads the stream of the C11-M1 stand-in as it is on the wire (retry, then resync)', () => {
    const parser = new ServerSentEventParser();
    expect(parser.push('retry: 3000\n\nid: a76089c6895c-2\nevent: resync\ndata: {}\n\n')).toEqual([
      { kind: 'retry', milliseconds: 3000 },
      { kind: 'event', event: 'resync', data: '{}', id: 'a76089c6895c-2' },
    ]);
  });

  it('joins lines that arrive in several chunks, also a \\r\\n split between two chunks', () => {
    const parser = new ServerSentEventParser();
    expect(parser.push('id: 7\r\nevent: notification-done\r\ndata: {"notifica')).toEqual([]);
    expect(parser.push('tionId":"n1","doneAt":"t"}\r')).toEqual([]);
    expect(parser.push('\n\r\n')).toEqual([
      { kind: 'event', event: 'notification-done', data: '{"notificationId":"n1","doneAt":"t"}', id: '7' },
    ]);
  });

  it('ignores comments (keep-alive), joins several data lines, keeps the last id for later events', () => {
    const parser = new ServerSentEventParser();
    const messages = parser.push(': keep-alive\n\nid: 9\n\ndata: a\ndata: b\n\nretry: soon\n\n');
    expect(messages).toEqual([{ kind: 'event', event: 'message', data: 'a\nb', id: '9' }]);
  });

  it('does not dispatch an event without the blank line that ends it', () => {
    expect(new ServerSentEventParser().push('event: resync\ndata: {}\n')).toEqual([]);
  });
});
