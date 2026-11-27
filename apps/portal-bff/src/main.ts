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

import { statSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import process from 'node:process';
import { createBff } from './create-bff.ts';
import type { BffConfig } from './data/bff-config.data.ts';
import type { Bff } from './data/bff-context.data.ts';
import { jsonLog } from './log.ts';
import { loadConfig } from './load-config.ts';

const SHUTDOWN_GRACE_MS = 10_000;

function start(): void {
  let config: BffConfig;
  let bff: Bff;
  try {
    config = loadConfig(process.env);
    if (!statSync(join(config.staticDir, 'index.html'), { throwIfNoEntry: false })?.isFile()) {
      throw new Error('The BFF cannot start: BFF_STATIC_DIR does not contain index.html. Build the portal first (nx build portal).');
    }
    bff = createBff(config);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : 'The BFF cannot start.'}\n`);
    process.exit(1);
  }

  const server = createServer(bff.handler);
  server.listen(config.port, () => {
    jsonLog('info', 'started', {
      port: config.port,
      public_origin: config.publicOrigin,
      issuer: config.issuer,
      client_id: config.clientId,
      client_secret_set: config.clientSecret !== null,
      idp_hint: config.idpHint,
      backend: config.backendUrl,
      config_file_set: config.configFile !== null,
      session_idle_seconds: config.sessionIdleSeconds,
      session_max_seconds: config.sessionMaxSeconds,
      ebw_connector: config.ebw?.issuer ?? null,
      ebw_client_id: config.ebw?.clientId ?? null,
    });
  });

  // Fetch the discovery document now, so a wrong issuer shows in the log at start and not at the first sign-in.
  bff.context.oidc.metadata().then(
    () => jsonLog('info', 'identity_provider_ready'),
    () => jsonLog('warn', 'identity_provider_not_ready', { hint: 'discovery failed; it is tried again at the next sign-in' }),
  );
  bff.context.ebw?.client.endpoints().then(
    () => jsonLog('info', 'ebw_connector_ready'),
    () => jsonLog('warn', 'ebw_connector_not_ready', { hint: 'discovery failed; it is tried again at the next wallet step' }),
  );

  const stop = () => {
    jsonLog('info', 'stopping');
    bff.close();
    server.close(() => process.exit(0));
    server.closeIdleConnections();
    setTimeout(() => process.exit(0), SHUTDOWN_GRACE_MS).unref();
  };
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
}

start();
