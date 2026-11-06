/* Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra */
import type { CoreHttpErrorData } from '@dataspace-mgm/core-http';
export type Result<T> = { status: 'success'; data: T } | { status: 'not-found' } | { status: 'forbidden'; error?: CoreHttpErrorData } | { status: 'conflict'; error?: CoreHttpErrorData } | { status: 'failed'; error: CoreHttpErrorData };
export type DeleteOutcome = { status: 'deleted' } | { status: 'pending'; user: import('./technical-user.data').TechnicalUser };
