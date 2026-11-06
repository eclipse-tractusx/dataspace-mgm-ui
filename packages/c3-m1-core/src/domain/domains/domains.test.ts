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
import { BEISPIEL_LOGISTIK, BEISPIEL_MASCHINENBAU, CHANGE_REQUESTS, COMPANY_ROLE_STATES } from '../testing/participants.fixtures';
import { ChangeRequestDomain } from './change-request.domain';
import { CompanyDomain } from './company.domain';
import { CompanyRoleDomain } from './company-role.domain';
import { IdentifierDomain } from './identifier.domain';
import { TextDomain } from './text.domain';

const pdf = (sizeBytes = 1000, mediaType = 'application/pdf') => ({ fileName: 'a.pdf', mediaType, sizeBytes, content: new Blob(['x']) });

describe('CompanyDomain (UX pre-checks)', () => {
  it('allows edits and deactivation only for ACTIVE, corrections also for REQUESTED', () => {
    expect(CompanyDomain.canEdit({ status: 'ACTIVE' })).toBe(true);
    expect(CompanyDomain.canEdit({ status: 'INACTIVE' })).toBe(false);
    expect(CompanyDomain.canDeactivate({ status: 'REQUESTED' })).toBe(false);
    expect(CompanyDomain.canCorrect({ status: 'REQUESTED' })).toBe(true);
    expect(CompanyDomain.canCorrect({ status: 'REJECTED' })).toBe(false);
  });

  it('lets a company request name and address changes only without a Business Wallet', () => {
    expect(CompanyDomain.canRequestCoreDataChange(BEISPIEL_MASCHINENBAU)).toBe(false);
    expect(CompanyDomain.canRequestCoreDataChange(BEISPIEL_LOGISTIK)).toBe(true);
  });

  it('validates a correction: reason required, limits of the spec, identifiers once per type', () => {
    expect(CompanyDomain.validateCorrection({ reason: ' ' })).toEqual([{ field: 'reason', key: 'required' }]);
    expect(CompanyDomain.validateCorrection({ reason: 'x'.repeat(501) })).toEqual([{ field: 'reason', key: 'tooLong', params: { max: 500 } }]);
    const errors = CompanyDomain.validateCorrection({
      reason: 'register extract',
      name: '',
      shortName: 'x'.repeat(101),
      address: { ...BEISPIEL_LOGISTIK.postalAddress, street: '', city: 'Mannheim' },
      identifiers: [
        { type: 'VAT_ID', value: 'DE1' },
        { type: 'VAT_ID', value: '' },
      ],
    });
    expect(errors.map((error) => `${error.field}:${error.key}`)).toEqual([
      'name:required',
      'shortName:tooLong',
      'address.street:required',
      'identifiers.1:required',
      'identifiers.1:duplicate',
    ]);
  });
});

describe('ChangeRequestDomain', () => {
  it('knows open requests and the changed fields', () => {
    expect(ChangeRequestDomain.isOpen(CHANGE_REQUESTS[0])).toBe(true);
    expect(ChangeRequestDomain.isOpen(CHANGE_REQUESTS[2])).toBe(false);
    expect(ChangeRequestDomain.changedFields(CHANGE_REQUESTS[0])).toEqual(['identifiers']);
    expect(ChangeRequestDomain.changedFields(CHANGE_REQUESTS[1])).toEqual(['name']);
  });

  it('needs a comment, a change and 1 to 3 documents of the allowed types and size', () => {
    expect(ChangeRequestDomain.validateDraft({ comment: '', documents: [] }).map((error) => error.key)).toEqual(['required', 'nothingChanged', 'tooFew']);
    const tooMany = ChangeRequestDomain.validateDraft({ name: 'X SE', comment: 'c', documents: [pdf(), pdf(), pdf(), pdf()] });
    expect(tooMany).toEqual([{ field: 'documents', key: 'tooMany', params: { max: 3 } }]);
    const wrong = ChangeRequestDomain.validateDraft({ name: 'X SE', comment: 'c', documents: [pdf(1, 'text/html'), pdf(10 * 1024 * 1024 + 1)] });
    expect(wrong.map((error) => error.key)).toEqual(['fileType', 'fileTooLarge']);
    expect(ChangeRequestDomain.validateDraft({ identifiers: [{ type: 'LEI_CODE', value: '5299' }], comment: 'c', documents: [pdf()] })).toEqual([]);
  });

  it('needs a decline reason and limits the approval comment', () => {
    expect(ChangeRequestDomain.validateDeclineReason('  ')).toEqual([{ field: 'reason', key: 'required' }]);
    expect(ChangeRequestDomain.validateApprovalComment(undefined)).toEqual([]);
    expect(ChangeRequestDomain.validateApprovalComment('x'.repeat(1001))).toHaveLength(1);
    expect(ChangeRequestDomain.isDocumentMediaType('image/png')).toBe(true);
  });
});

describe('CompanyRoleDomain and IdentifierDomain', () => {
  it('adds roles a company may assign and does not hold, removes active ones', () => {
    const [active, appProvider] = COMPANY_ROLE_STATES;
    expect(CompanyRoleDomain.canAdd(appProvider)).toBe(true);
    expect(CompanyRoleDomain.canRemove(appProvider)).toBe(false);
    expect(CompanyRoleDomain.canRemove(active)).toBe(true);
    expect(CompanyRoleDomain.canAdd({ ...appProvider, assignableBy: 'SEED' })).toBe(false);
    expect(CompanyRoleDomain.consentsFor(appProvider)).toEqual([{ agreementKey: 'terms-app-provider', version: '1.0' }]);
  });

  it('keeps only declared identifiers and compares lists regardless of order', () => {
    expect(IdentifierDomain.declared(BEISPIEL_MASCHINENBAU.identifiers)).toEqual([{ type: 'VAT_ID', value: 'DE123456789' }]);
    expect(
      IdentifierDomain.sameList(
        [
          { type: 'VAT_ID', value: 'A' },
          { type: 'EORI', value: 'B' },
        ],
        [
          { type: 'EORI', value: 'B ' },
          { type: 'VAT_ID', value: 'A' },
        ],
      ),
    ).toBe(true);
    expect(TextDomain.orNull('  ')).toBeNull();
  });
});
