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

import type { ReviewRepository } from '../domain/repositories/review.repository';
import type {
  DecisionInput,
  DocumentInput,
  Outcome,
  ReviewActor,
  ReviewCase,
  ReviewDocument,
  ReviewFilters,
  ReviewPage,
  ReviewProblem,
} from '../domain/data/review.data';
import { type MockRegistrationLink, reviewCaseOf } from './mock-registration-link';
import { DOCUMENT_ID, reviewFixtures, REVIEW_ACTORS } from './review-fixtures';

/** Simulated server. Business transitions deliberately live here, never in React or Redux. */
export class MockReviewRepository implements ReviewRepository {
  private cases = reviewFixtures();
  actor = REVIEW_ACTORS[0];
  unavailable = false;
  /** Mock mode: the applications submitted in onboarding get a case here, and their decision goes back (link). */
  constructor(private readonly link?: MockRegistrationLink) {}
  /** The cases opened for linked applications (the demo cases), shown first in the queue. */
  private readonly linked = new Set<string>();
  /** Opens a case for every linked application that has none yet. */
  private sync() {
    for (const linked of this.link?.submitted() ?? []) {
      if (!this.cases.some((c) => c.applicationId === linked.id)) {
        this.cases.push(reviewCaseOf(linked, linked.submittedAt ?? new Date().toISOString()));
        this.linked.add(linked.id);
      }
    }
  }
  reset() {
    this.cases = reviewFixtures();
    this.linked.clear();
    this.unavailable = false;
  }
  setActor(actor: ReviewActor) {
    this.actor = actor;
  }
  private failure<T>(status: number, name: string, extra: Partial<ReviewProblem> = {}): Outcome<T> {
    return { error: { status, type: `urn:c1-m3:problem:${name}`, ...extra } };
  }
  private denied<T>(permission: string): Outcome<T> | null {
    if (!this.actor.permissions.includes(permission)) {
      return this.failure(403, 'forbidden');
    }
    if (this.unavailable) {
      return this.failure(502, 'upstream-error');
    }
    return null;
  }
  async list(filters: ReviewFilters): Promise<Outcome<ReviewPage>> {
    this.sync();
    const denied = this.denied<ReviewPage>('view_reviews');
    if (denied) {
      return denied;
    }
    const page = filters.page ?? 0;
    const size = filters.size ?? 20;
    if (page < 0 || size < 1 || size > 100) {
      return this.failure(400, 'validation');
    }
    const statuses = filters.status?.length ? filters.status : ['OPEN', 'AWAITING_SECOND_APPROVAL'];
    const all = this.cases
      .filter(
        (c) =>
          statuses.includes(c.status) &&
          (!filters.kind?.length || filters.kind.includes(c.kind)) &&
          (!filters.verification?.length || filters.verification.includes(c.verification)) &&
          (!filters.applicationId || c.applicationId === filters.applicationId),
      )
      // Oldest first; the demo cases of this session lead, so the application just submitted is easy to find.
      .sort((a, b) => Number(this.linked.has(b.id)) - Number(this.linked.has(a.id)) || a.openedAt.localeCompare(b.openedAt));
    const items = all.slice(page * size, (page + 1) * size).map((c) => ({
      id: c.id,
      applicationId: c.applicationId,
      companyId: c.companyId,
      kind: c.kind,
      verification: c.verification,
      status: c.status,
      openedAt: c.openedAt,
      decidedAt: c.decision?.decidedAt ?? null,
      ...(this.linked.has(c.id) ? { demo: true } : {}),
      checkCounts: {
        passed: c.checks.filter((v) => v.result === 'PASSED').length,
        failed: c.checks.filter((v) => v.result === 'FAILED').length,
        notApplicable: c.checks.filter((v) => v.result === 'NOT_APPLICABLE').length,
        error: c.checks.filter((v) => v.result === 'ERROR').length,
      },
      application: c.application
        ? {
            legalName: c.application.companyData.legalName,
            countryCode: c.application.companyData.address.countryCode,
            companyRoles: c.application.companyRoles,
            submittedAt: c.application.submittedAt,
          }
        : undefined,
    }));
    return { data: structuredClone({ items, page, size, total: all.length }) };
  }
  async get(id: string): Promise<Outcome<ReviewCase>> {
    this.sync();
    const denied = this.denied<ReviewCase>('view_reviews');
    if (denied) {
      return denied;
    }
    const review = this.cases.find((c) => c.id === id);
    return review ? { data: { ...structuredClone(review), ...this.demoMark(review) } } : this.failure(404, 'not-found');
  }
  async approve(input: DecisionInput): Promise<Outcome<ReviewCase>> {
    return this.decide(input, true);
  }
  async decline(input: DecisionInput): Promise<Outcome<ReviewCase>> {
    return this.decide(input, false);
  }
  private decide(input: DecisionInput, approve: boolean): Outcome<ReviewCase> {
    this.sync();
    const denied = this.denied<ReviewCase>('review_application');
    if (denied) {
      return denied;
    }
    const c = this.cases.find((item) => item.id === input.id);
    if (!c) {
      return this.failure(404, 'not-found');
    }
    const text = approve ? input.comment : input.reason;
    if ((!approve && !text?.trim()) || (text !== undefined && (text.trim().length < 1 || text.length > 1000))) {
      return this.failure(400, 'validation');
    }
    if (c.application?.status === 'WITHDRAWN') {
      return this.failure(409, 'application-withdrawn');
    }
    const target = approve ? 'APPROVED' : 'DECLINED';
    if (c.status === target) {
      return this.reply(c);
    }
    if (['APPROVED', 'DECLINED', 'CLOSED'].includes(c.status)) {
      return this.failure(409, 'invalid-state');
    }
    if (c.applicantSub === this.actor.id) {
      return this.failure(403, 'own-application');
    }
    if (approve && c.status === 'AWAITING_SECOND_APPROVAL' && c.firstApproval?.approvedBy === this.actor.id) {
      return this.reply(c);
    }
    const now = new Date().toISOString();
    if (approve) {
      const pending = c.checks.filter((v) => v.result === 'ERROR').map((v) => v.checkKey);
      if (pending.length || !c.checks.length) {
        return this.failure(409, 'checks-incomplete', {
          pendingChecks: pending,
        });
      }
      if (
        c.kind !== 'ONBOARDING' &&
        !c.checks.some((v) => v.checkKey === 'CSP_MATCH_EXPECTED' && v.result === 'PASSED')
      ) {
        return this.failure(409, 'csp-match-required', {
          cspOutcome: c.checks.find((v) => v.checkKey === 'CSP_MATCH_EXPECTED')?.details?.cspOutcome,
        });
      }
      const failed = c.checks.filter((v) => v.result === 'FAILED');
      if (c.status === 'OPEN' && failed.length && !text?.trim()) {
        return this.failure(400, 'comment-required', {
          failedChecks: failed.map((v) => v.checkKey),
        });
      }
      const reasons: ('CHECK_FAILED' | 'DOCUMENTS')[] = [];
      if (failed.length) {
        reasons.push('CHECK_FAILED');
      }
      if (c.verification === 'DOCUMENTS') {
        reasons.push('DOCUMENTS');
      }
      if (c.status === 'OPEN' && reasons.length) {
        c.status = 'AWAITING_SECOND_APPROVAL';
        c.firstApproval = {
          approvedBy: this.actor.id,
          approvedAt: now,
          comment: text ?? null,
          fourEyesReasons: reasons,
        };
        return this.reply(c);
      }
    }
    c.status = target;
    c.decision = {
      decidedAt: now,
      decidedBy: this.actor.id,
      comment: text ?? null,
      autoApproved: false,
    };
    if (this.link?.submitted().some((linked) => linked.id === c.applicationId)) {
      this.link.decided(c.applicationId, approve, text?.trim() || null);
    }
    return this.reply(c);
  }
  private demoMark(c: ReviewCase): Partial<ReviewCase> {
    return this.linked.has(c.id) ? { demo: true } : {};
  }
  private reply(c: ReviewCase): Outcome<ReviewCase> {
    const copy = { ...structuredClone(c), ...this.demoMark(c) };
    delete copy.application;
    return { data: copy };
  }
  async document(input: DocumentInput): Promise<Outcome<ReviewDocument>> {
    const denied = this.denied<ReviewDocument>('view_applications');
    if (denied) {
      return denied;
    }
    const c = this.cases.find((v) => v.applicationId === input.applicationId);
    if (input.documentId !== DOCUMENT_ID || !c?.application?.documents.some((v) => v.documentId === input.documentId)) {
      return this.failure(404, 'not-found');
    }
    // A harmless, valid PNG fixture, not an actual register extract.
    const bytes = Uint8Array.from(
      atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII='),
      (c) => c.charCodeAt(0),
    );
    return {
      data: {
        content: new Blob([bytes], { type: 'image/png' }),
        fileName: 'mock-register-extract.png',
      },
    };
  }
}
