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

import type { ServerSentMessage } from '../data/server-sent-event.data';

const LINE_END = /\r\n|\r|\n/;

/**
 * Parses a `text/event-stream` chunk by chunk, as the browser's EventSource does (HTML Living Standard, 9.2.6). Needed
 * because EventSource cannot be used here: it sends no `Last-Event-ID` on the first request and gives no access to the
 * status of a refused stream. Lines may be split across chunks; comment lines (`: keep-alive`) are ignored.
 */
export class ServerSentEventParser {
  private buffer = '';
  private started = false;
  private eventName = '';
  private data: string[] = [];
  private lastEventId = '';

  public push(chunk: string): ServerSentMessage[] {
    this.buffer += this.started ? chunk : chunk.replace(/^\uFEFF/, '');
    this.started = true;
    const messages: ServerSentMessage[] = [];
    for (;;) {
      const match = LINE_END.exec(this.buffer);
      // A trailing "\r" may be the first half of "\r\n": wait for the next chunk.
      if (!match || (match[0] === '\r' && match.index === this.buffer.length - 1)) {
        return messages;
      }
      const line = this.buffer.slice(0, match.index);
      this.buffer = this.buffer.slice(match.index + match[0].length);
      this.processLine(line, messages);
    }
  }

  private processLine(line: string, messages: ServerSentMessage[]): void {
    if (line === '') {
      this.dispatch(messages);
      return;
    }
    if (line.startsWith(':')) {
      return;
    }
    const colon = line.indexOf(':');
    const field = colon === -1 ? line : line.slice(0, colon);
    const raw = colon === -1 ? '' : line.slice(colon + 1);
    const value = raw.startsWith(' ') ? raw.slice(1) : raw;
    if (field === 'event') {
      this.eventName = value;
    } else if (field === 'data') {
      this.data.push(value);
    } else if (field === 'id') {
      if (!value.includes('\u0000')) {
        this.lastEventId = value;
      }
    } else if (field === 'retry') {
      if (/^\d+$/.test(value)) {
        messages.push({ kind: 'retry', milliseconds: Number(value) });
      }
    }
  }

  private dispatch(messages: ServerSentMessage[]): void {
    if (this.data.length > 0) {
      messages.push({
        kind: 'event',
        event: this.eventName === '' ? 'message' : this.eventName,
        data: this.data.join('\n'),
        id: this.lastEventId === '' ? null : this.lastEventId,
      });
    }
    this.data = [];
    this.eventName = '';
  }
}
