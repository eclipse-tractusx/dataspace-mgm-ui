/* Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra */
import { defineConfig } from 'vitest/config';
import { workspaceAliases } from '../../workspace.aliases';
export default defineConfig({ resolve: { alias: workspaceAliases }, test: { environment: 'node', include: ['src/**/*.test.ts'] } });
