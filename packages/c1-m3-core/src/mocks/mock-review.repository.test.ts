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
 * to the project's license. Human review is required before committing.
 *
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: Codex (GPT-6)
 ********************************************************************************/

import { describe, expect, it } from 'vitest';
import { createReviewModule } from '../index';
import { MockReviewRepository } from './mock-review.repository';
import { reviewFixtures, REVIEW_ACTORS, DOCUMENT_ID } from './review-fixtures';
import type { LinkedApplication, MockRegistrationLink } from './mock-registration-link';
const id = (n: number) => reviewFixtures()[n - 1].id;
const error = (name: string) => ({
  error: expect.objectContaining({ type: `urn:c1-m3:problem:${name}` }),
});

describe('Review simulated server contract', () => {
  it('filters the queue, oldest first, pages, and includes application summaries', async () => {
    const server = new MockReviewRepository();
    const module = createReviewModule(server);
    const result = await module.list.execute({ size: 2 });
    expect('data' in result && result.data.items.map((v) => v.id)).toEqual([id(1), id(2)]);
    const page = await module.list.execute({ size: 2, page: 1 });
    expect('data' in page && page.data.items[0].id).toBe(id(3));
    const transfer = await module.list.execute({
      kind: ['TRANSFER'],
      verification: ['EBW'],
    });
    expect('data' in transfer && transfer.data.items.map((v) => v.id)).toEqual([id(6), id(12)]);
    const archive = await module.list.execute({
      status: ['APPROVED', 'DECLINED', 'CLOSED'],
    });
    expect('data' in archive && archive.data.total).toBe(4);
    expect(await module.list.execute({ size: 101 })).toEqual(error('validation'));
  });
  it('approves a clean application, omits application in mutations, preserves it in GET, and is idempotent', async () => {
    const module = createReviewModule(new MockReviewRepository());
    const result = await module.approve.execute({ id: id(1) });
    expect(result).toMatchObject({ data: { status: 'APPROVED' } });
    expect('data' in result && result.data.application).toBeUndefined();
    expect(await module.approve.execute({ id: id(1) })).toEqual(result);
    expect(await module.get.execute(id(1))).toMatchObject({
      data: {
        application: {
          companyData: { legalName: 'Beispiel Maschinenbau GmbH' },
        },
      },
    });
    expect(await module.decline.execute({ id: id(1), reason: 'No' })).toEqual(error('invalid-state'));
  });
  it('enforces a comment, then two distinct reviewers', async () => {
    const server = new MockReviewRepository();
    const module = createReviewModule(server);
    expect(await module.approve.execute({ id: id(2) })).toEqual(error('comment-required'));
    const first = await module.approve.execute({
      id: id(2),
      comment: 'Reviewed evidence',
    });
    expect(first).toMatchObject({
      data: {
        status: 'AWAITING_SECOND_APPROVAL',
        firstApproval: { fourEyesReasons: ['CHECK_FAILED'] },
      },
    });
    expect(await module.approve.execute({ id: id(2) })).toEqual(first);
    server.setActor(REVIEW_ACTORS[1]);
    expect(await module.approve.execute({ id: id(2) })).toMatchObject({
      data: {
        status: 'APPROVED',
        firstApproval: { approvedBy: REVIEW_ACTORS[0].id },
        decision: { decidedBy: REVIEW_ACTORS[1].id },
      },
    });
  });
  it('requires a second person for documents and permits the first reviewer to decline', async () => {
    const module = createReviewModule(new MockReviewRepository());
    expect(await module.approve.execute({ id: id(3) })).toMatchObject({
      data: {
        status: 'AWAITING_SECOND_APPROVAL',
        firstApproval: { fourEyesReasons: ['DOCUMENTS'] },
      },
    });
    expect(await module.decline.execute({ id: id(3), reason: 'Not sufficient' })).toMatchObject({
      data: { status: 'DECLINED' },
    });
  });
  it('blocks own applications and enforces permissions', async () => {
    const server = new MockReviewRepository();
    const module = createReviewModule(server);
    expect(await module.approve.execute({ id: id(8) })).toEqual(error('own-application'));
    expect(await module.decline.execute({ id: id(8), reason: 'No' })).toEqual(error('own-application'));
    server.setActor(REVIEW_ACTORS[2]);
    expect(await module.get.execute(id(1))).toHaveProperty('data');
    expect(await module.approve.execute({ id: id(1) })).toEqual(error('forbidden'));
    server.setActor(REVIEW_ACTORS[3]);
    expect(await module.list.execute({})).toEqual(error('forbidden'));
    expect(await module.get.execute(id(1))).toEqual(error('forbidden'));
  });
  it('enforces incomplete checks, expected CSP match, withdrawal, and terminal states', async () => {
    const module = createReviewModule(new MockReviewRepository());
    expect(await module.approve.execute({ id: id(5) })).toEqual(error('checks-incomplete'));
    expect(await module.approve.execute({ id: id(12), comment: 'Override' })).toEqual(error('csp-match-required'));
    expect(await module.approve.execute({ id: id(14) })).toEqual(error('application-withdrawn'));
    expect(await module.approve.execute({ id: id(11) })).toEqual(error('invalid-state'));
    expect(await module.approve.execute({ id: id(6) })).toMatchObject({
      data: { status: 'APPROVED', cspBpn: 'BPNL00000000002B' },
    });
    expect(await module.approve.execute({ id: id(7) })).toMatchObject({
      data: { status: 'APPROVED' },
    });
    expect(await module.decline.execute({ id: id(5), reason: 'Unable to verify' })).toMatchObject({
      data: { status: 'DECLINED' },
    });
  });
  it('validates decisions and preserves the original decline reason on repeats', async () => {
    const module = createReviewModule(new MockReviewRepository());
    expect(await module.decline.execute({ id: id(1) })).toEqual(error('validation'));
    expect(await module.approve.execute({ id: id(1), comment: '' })).toEqual(error('validation'));
    expect(await module.approve.execute({ id: id(1), comment: 'x'.repeat(1001) })).toEqual(error('validation'));
    const first = await module.decline.execute({
      id: id(1),
      reason: 'Original',
    });
    expect(await module.decline.execute({ id: id(1), reason: 'Different' })).toEqual(first);
    expect(await module.get.execute('missing')).toEqual(error('not-found'));
  });
  it('simulates outages and resets decisions', async () => {
    const server = new MockReviewRepository();
    const module = createReviewModule(server);
    await module.approve.execute({ id: id(1) });
    server.unavailable = true;
    expect(await module.get.execute(id(1))).toEqual(error('upstream-error'));
    server.reset();
    expect(await module.get.execute(id(1))).toMatchObject({
      data: { status: 'OPEN' },
    });
  });
  it('downloads only documents of the specified application with permission', async () => {
    const server = new MockReviewRepository();
    const module = createReviewModule(server);
    expect(
      await module.document.execute({
        applicationId: id(3),
        documentId: DOCUMENT_ID,
      }),
    ).toMatchObject({ data: { fileName: 'mock-register-extract.png' } });
    expect(
      await module.document.execute({
        applicationId: id(1),
        documentId: DOCUMENT_ID,
      }),
    ).toEqual(error('not-found'));
    server.setActor({ ...REVIEW_ACTORS[0], permissions: ['view_reviews'] });
    expect(
      await module.document.execute({
        applicationId: id(3),
        documentId: DOCUMENT_ID,
      }),
    ).toEqual(error('forbidden'));
  });
});

describe('Review simulated server linked to the registration mock (mock mode)', () => {
  const linked = (overrides: Partial<LinkedApplication> = {}): LinkedApplication => {
    const { application } = reviewFixtures()[0];
    return {
      id: 'a1b2c3d4-0000-4000-8000-000000000099',
      companyId: application!.companyId,
      kind: 'ONBOARDING',
      existingCompany: false,
      verification: 'EBW',
      applicant: { sub: REVIEW_ACTORS[3].id, givenName: 'Erika', familyName: 'Mustermann' },
      companyData: application!.companyData,
      companyRoles: ['ACTIVE_PARTICIPANT'],
      consents: application!.consents,
      requiredAgreements: application!.requiredAgreements,
      createdAt: '2026-11-10T09:00:00Z',
      submittedAt: '2026-11-10T09:05:00Z',
      ...overrides,
    };
  };
  const linkOf = (applications: LinkedApplication[]) => {
    const decisions: Array<[string, boolean, string | null]> = [];
    const link: MockRegistrationLink = {
      submitted: () => applications,
      decided: (applicationId, approved, reason) => {
        decisions.push([applicationId, approved, reason]);
        applications.splice(applications.findIndex((application) => application.id === applicationId), 1);
      },
    };
    return { link, decisions };
  };

  it('opens a case with passed checks for an application submitted in onboarding, and approval reaches it', async () => {
    const { link, decisions } = linkOf([linked()]);
    const module = createReviewModule(new MockReviewRepository(link));
    const queue = await module.list.execute({ size: 100 });
    expect('data' in queue && queue.data.items.at(-1)).toMatchObject({ id: linked().id, checkCounts: { passed: 6, failed: 0, error: 0 } });
    expect(await module.approve.execute({ id: linked().id })).toMatchObject({ data: { status: 'APPROVED' } });
    expect(decisions).toEqual([[linked().id, true, null]]);
  });

  it('passes the reason of a decline to the registration mock', async () => {
    const { link, decisions } = linkOf([linked()]);
    const module = createReviewModule(new MockReviewRepository(link));
    expect(await module.decline.execute({ id: linked().id, reason: 'Register extract is missing' })).toMatchObject({ data: { status: 'DECLINED' } });
    expect(decisions).toEqual([[linked().id, false, 'Register extract is missing']]);
  });

  it('reaches the applicant only with the final decision (four eyes for supporting documents)', async () => {
    const { link, decisions } = linkOf([linked({ verification: 'DOCUMENTS' })]);
    const server = new MockReviewRepository(link);
    const module = createReviewModule(server);
    expect(await module.approve.execute({ id: linked().id })).toMatchObject({ data: { status: 'AWAITING_SECOND_APPROVAL' } });
    expect(decisions).toEqual([]);
    server.setActor(REVIEW_ACTORS[1]);
    expect(await module.approve.execute({ id: linked().id })).toMatchObject({ data: { status: 'APPROVED' } });
    expect(decisions).toEqual([[linked().id, true, null]]);
  });
});
