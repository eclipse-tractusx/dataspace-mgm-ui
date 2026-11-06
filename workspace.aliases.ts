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

import { fileURLToPath } from 'node:url';

const at = (path: string) => fileURLToPath(new URL(path, import.meta.url));

/**
 * Import aliases of the workspace libraries and core packages, for Vite and Vitest. Keep in sync with `paths` in
 * tsconfig.base.json. More specific entries first (`…/testing` before the package).
 */
export const workspaceAliases = [
  { find: '@dataspace-mgm/c1-m3-state', replacement: at('./libs/c1-m3/state/src/index.ts') },
  { find: '@dataspace-mgm/c1-m3-feature', replacement: at('./libs/c1-m3/feature/src/index.ts') },
  { find: '@dataspace-mgm/c1-m3-core/testing', replacement: at('./packages/c1-m3-core/src/testing.ts') },
  { find: '@dataspace-mgm/c1-m3-core', replacement: at('./packages/c1-m3-core/src/index.ts') },

  { find: '@dataspace-mgm/ui-mui', replacement: at('./libs/shared/ui-mui/src/index.ts') },
  { find: '@dataspace-mgm/core-http', replacement: at('./packages/core-http/src/index.ts') },
  { find: '@dataspace-mgm/identity-core/testing', replacement: at('./packages/identity-core/src/testing.ts') },
  { find: '@dataspace-mgm/identity-core', replacement: at('./packages/identity-core/src/index.ts') },
  { find: '@dataspace-mgm/c2-m2-core/testing', replacement: at('./packages/c2-m2-core/src/testing.ts') },
  { find: '@dataspace-mgm/c2-m2-core', replacement: at('./packages/c2-m2-core/src/index.ts') },
  { find: '@dataspace-mgm/c2-m3-core/testing', replacement: at('./packages/c2-m3-core/src/testing.ts') },
  { find: '@dataspace-mgm/c2-m3-core', replacement: at('./packages/c2-m3-core/src/index.ts') },
  { find: '@dataspace-mgm/c3-m1-core/testing', replacement: at('./packages/c3-m1-core/src/testing.ts') },
  { find: '@dataspace-mgm/c3-m1-core', replacement: at('./packages/c3-m1-core/src/index.ts') },
  { find: '@dataspace-mgm/c1-m2-core/testing', replacement: at('./packages/c1-m2-core/src/testing.ts') },
  { find: '@dataspace-mgm/c1-m2-core', replacement: at('./packages/c1-m2-core/src/index.ts') },
];
