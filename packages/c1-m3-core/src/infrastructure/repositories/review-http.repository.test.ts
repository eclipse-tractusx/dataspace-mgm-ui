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

import { describe, expect, it, vi } from 'vitest';
import { createHttpReviewModule } from '../../index';
import { reviewFixtures } from '../../mocks/review-fixtures';
describe('real HTTP adapter', () => {
  const review = reviewFixtures()[0];
  it('uses repeated filters, session cookies and CSRF for mutations', async () => {
    const requests: Request[] = [];
    const fetcher = vi.fn(async (input: RequestInfo | URL) => {
      requests.push(new Request(input));
      return Response.json(review);
    });
    const config = {
      baseUrl: 'https://portal.test/api/c1-m3',
      fetch: fetcher,
      getCsrfToken: () => 'test-csrf',
    };
    const module = createHttpReviewModule(config, {
      ...config,
      baseUrl: 'https://portal.test/api/c1-m2',
    });
    await module.list.execute({
      status: ['APPROVED', 'DECLINED'],
      kind: ['TRANSFER'],
      page: 0,
      size: 5,
    });
    expect(new URL(requests[0].url).searchParams.getAll('status')).toEqual(['APPROVED', 'DECLINED']);
    expect(requests[0].credentials).toBe('include');
    expect(requests[0].headers.has('Authorization')).toBe(false);
    expect(await module.get.execute(review.id)).toMatchObject({
      data: { id: review.id },
    });
    await module.approve.execute({ id: review.id, comment: 'Checked' });
    expect(requests[2].url).toBe(`https://portal.test/api/c1-m3/review-cases/${review.id}/approve`);
    expect(requests[2].headers.get('X-CSRF-Token')).toBe('test-csrf');
    expect(await requests[2].json()).toEqual({ comment: 'Checked' });
    await module.decline.execute({ id: review.id, reason: 'Not sufficient' });
    expect(await requests[3].json()).toEqual({ reason: 'Not sufficient' });
  });
  it('keeps problem extensions and converts connection failures into plain outcomes', async () => {
    const problem = {
      status: 409,
      type: 'urn:c1-m3:problem:checks-incomplete',
      pendingChecks: ['NO_DUPLICATE'],
    };
    const config = {
      baseUrl: 'https://portal.test/api/c1-m3',
      fetch: vi.fn(async () => Response.json(problem, { status: 409 })),
    };
    expect(
      await createHttpReviewModule(config, config).approve.execute({
        id: review.id,
      }),
    ).toEqual({ error: problem });
    config.fetch.mockRejectedValueOnce(new TypeError('Network down'));
    expect(await createHttpReviewModule(config, config).get.execute(review.id)).toMatchObject({
      error: { status: 502 },
    });
  });
  it('downloads document bytes through the C1-M2 adapter', async () => {
    const requests: Request[] = [];
    const config = {
      baseUrl: 'https://portal.test/api/c1-m3',
      fetch: vi.fn(async (r: RequestInfo | URL) => {
        requests.push(new Request(r));
        return new Response(new Blob(['document'], { type: 'application/pdf' }));
      }),
    };
    const module = createHttpReviewModule(config, {
      ...config,
      baseUrl: 'https://portal.test/api/c1-m2',
    });
    const reply = await module.document.execute({
      applicationId: review.applicationId,
      documentId: 'document-id',
    });
    expect('data' in reply && (await reply.data.content.text())).toBe('document');
    expect(requests[0].url).toBe(
      `https://portal.test/api/c1-m2/osp/applications/${review.applicationId}/documents/document-id`,
    );
  });
});
