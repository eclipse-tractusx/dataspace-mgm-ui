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

import type { CoreHttpErrorData } from '@dataspace-mgm/core-http';
import type { ValidationErrorData } from '@dataspace-mgm/c3-m1-core';
import type { TFunction } from 'i18next';

/**
 * The Problem Details types of C3-M1 (README 12) and C3-M2 the pages explain, each mapped explicitly to the i18n key
 * `problems.<name>`. A type that is not listed shows a general text with its status; the `title` of the answer is never
 * used as a text.
 */
const KNOWN_PROBLEMS = [
  'validation',
  'attestation-invalid',
  'document-invalid',
  'consent-missing',
  'invalid-state',
  'conflict',
  'field-locked',
  'role-not-assignable',
  'last-role',
  'company-mismatch',
  'attestation-used',
  'attestation-outdated',
  'representation-not-confirmed',
  'attestation-required',
  'change-request-open',
  'change-requests-disabled',
  'same-person',
  'upstream-error',
] as const;

export function problemKey(problem: string): string | null {
  return (KNOWN_PROBLEMS as ReadonlyArray<string>).includes(problem) ? `problems.${problem}` : null;
}

/** The text of an error that is not an expected answer: by HTTP status (501 stand-in, 502 BFF, 401 session, network). */
export function failureText(t: TFunction, error: CoreHttpErrorData): string {
  switch (error.status) {
    case null:
      return t('errors.network');
    case 401:
      return t('errors.unauthorized');
    case 501:
      return t('errors.notImplemented');
    case 502:
      return t('errors.upstream');
    case 503:
    case 504:
      return t('errors.unavailable', { status: error.status });
    default:
      return t('errors.failed', { status: error.status });
  }
}

export function rejectionText(t: TFunction, problem: string, error: CoreHttpErrorData): string {
  const key = problemKey(problem);
  return key ? t(key) : t('errors.rejected', { status: error.status ?? '–' });
}

/** A local validation error as text: `validation.<key>` with its values. */
export function validationText(t: TFunction, error: ValidationErrorData): string {
  return t(`validation.${error.key}`, error.params ?? {});
}

/** The first error of a field (or of a field's prefix, e.g. `identifiers.1`), as text, for helperText. */
export function fieldError(t: TFunction, errors: ReadonlyArray<ValidationErrorData>, field: string): string | undefined {
  const error = errors.find((item) => item.field === field);
  return error ? validationText(t, error) : undefined;
}
