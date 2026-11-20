/********************************************************************************
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
 * Assisted-By: Claude Code (claude-fable-5-2)
 ********************************************************************************/

import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import type { BffContext } from '../data/bff-context.data.ts';
import { sendProblem } from '../http/respond.ts';

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.map': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.wasm': 'application/wasm',
};

const IMMUTABLE = 'public, max-age=31536000, immutable';

/**
 * The file below `root` a URL path names, or null when the path must not be served: it cannot be decoded, contains
 * a NUL or a backslash, has a "." or ".." segment after decoding (an encoded slash included), names a hidden file,
 * or ends up outside `root`.
 */
export function resolveStaticPath(root: string, pathname: string): string | null {
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  if (!decoded.startsWith('/') || decoded.includes('\0') || decoded.includes('\\')) {
    return null;
  }
  if (decoded.split('/').some((segment) => segment.startsWith('.'))) {
    return null;
  }
  const file = resolve(root, `.${decoded}`);
  return file === root || file.startsWith(root + sep) ? file : null;
}

/** A regular file inside the static directory, also after following links; a directory is never listed. */
async function regularFile(root: string, file: string): Promise<{ file: string; size: number } | null> {
  try {
    const real = await realpath(file);
    if (!real.startsWith(root + sep)) {
      return null;
    }
    const info = await stat(real);
    return info.isFile() ? { file: real, size: info.size } : null;
  } catch {
    return null;
  }
}

function sendFile(req: IncomingMessage, res: ServerResponse, found: { file: string; size: number }, contentType: string, cacheControl: string): void {
  res.statusCode = 200;
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', found.size);
  res.setHeader('Cache-Control', cacheControl);
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  const stream = createReadStream(found.file);
  stream.on('error', () => res.destroy());
  res.on('close', () => stream.destroy());
  stream.pipe(res);
}

/** GET /config.json: the runtime configuration of the portal, from the configured file (mounted per environment). */
export async function serveConfig(context: BffContext, req: IncomingMessage, res: ServerResponse): Promise<void> {
  const { configFile } = context.config;
  let found: { file: string; size: number } | null = null;
  if (configFile) {
    const info = await stat(configFile).catch(() => null);
    found = info?.isFile() ? { file: configFile, size: info.size } : null;
  }
  if (!found) {
    return sendProblem(res, 404, 'not-found', 'No runtime configuration is mounted.');
  }
  sendFile(req, res, found, 'application/json', 'no-store');
}

/**
 * The built portal: a file of the static directory, or index.html for every other path (the routes of the single
 * page app). A missing file under /assets/ is a 404, not the app, so a stale chunk does not load HTML as a script.
 */
export async function serveStatic(context: BffContext, req: IncomingMessage, res: ServerResponse, pathname: string): Promise<void> {
  const root = context.staticRoot;
  const requested = resolveStaticPath(root, pathname);
  if (requested === null) {
    return sendProblem(res, 404, 'not-found', 'Not found.');
  }
  const found = await regularFile(root, requested);
  if (found) {
    const cacheControl = pathname.startsWith('/assets/') ? IMMUTABLE : 'no-cache';
    return sendFile(req, res, found, CONTENT_TYPES[extname(found.file).toLowerCase()] ?? 'application/octet-stream', cacheControl);
  }
  const index = pathname.startsWith('/assets/') ? null : await regularFile(root, resolve(root, 'index.html'));
  if (!index) {
    return sendProblem(res, 404, 'not-found', 'Not found.');
  }
  sendFile(req, res, index, CONTENT_TYPES['.html'], 'no-cache');
}
