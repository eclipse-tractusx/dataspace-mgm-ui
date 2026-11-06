/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import { describe, expect, it } from 'vitest';
import { createC2M2Module } from '../../index';

describe('C2-M2 HTTP module', () => {
  it('sends the portal role replacement with contract casing', async () => {
    let request: Request | undefined;
    const fetch = async (input: Request) => {
      request = input;
      return Response.json({ userId: 'u', companyId: 'c', status: 'ACTIVE', joinedVia: 'INVITATION', portalRoles: ['Member'], createdAt: '2026-01-01T00:00:00Z' });
    };
    const module = createC2M2Module({ baseUrl: 'http://ui.test/api/c2-m2', fetch: fetch as unknown as typeof globalThis.fetch });
    expect((await module.setCompanyUserPortalRoles.execute('c', 'u', ['Member'])).status).toBe('success');
    expect(request?.method).toBe('PUT');
    expect(new URL(request!.url).pathname).toBe('/api/c2-m2/companies/c/users/u/portal-roles');
    expect(await request!.json()).toEqual({ portalRoles: ['Member'] });
  });

  it('preserves problem types in conflict results', async () => {
    const fetch = async () => new Response(JSON.stringify({ type: 'urn:c2-m2:problem:last-company-admin', status: 409, title: 'Conflict' }), { status: 409, headers: { 'content-type': 'application/problem+json' } });
    const module = createC2M2Module({ baseUrl: 'http://ui.test/api/c2-m2', fetch: fetch as typeof globalThis.fetch });
    expect(await module.removeCompanyUser.execute('c', 'u')).toMatchObject({ status: 'conflict', error: { problemType: 'urn:c2-m2:problem:last-company-admin' } });
  });

  it('maps a scoped 404 to not-found', async () => {
    const fetch = async () => new Response(JSON.stringify({ type: 'urn:c2-m2:problem:not-found', status: 404, title: 'Not found' }), { status: 404, headers: { 'content-type': 'application/problem+json' } });
    const module = createC2M2Module({ baseUrl: 'http://ui.test/api/c2-m2', fetch: fetch as typeof globalThis.fetch });
    expect(await module.getCompanyUser.execute('c', 'u')).toEqual({ status: 'not-found' });
  });

  it('reads every page of open invitations', async () => {
    const requests: string[] = [];
    const fetch = async (request: Request) => {
      requests.push(request.url);
      const page = Number(new URL(request.url).searchParams.get('page'));
      return Response.json({ items: [{ id: String(page), kind: 'COMPANY', companyId: 'c', roles: ['Member'], status: 'OPEN', createdAt: '2026-01-01T00:00:00Z', expiresAt: '2026-01-02T00:00:00Z' }], page, size: 100, total: 2 });
    };
    const module = createC2M2Module({ baseUrl: 'http://ui.test/api/c2-m2', fetch: fetch as unknown as typeof globalThis.fetch });
    const result = await module.listInvitations.execute('c');
    expect(result).toMatchObject({ status: 'success', data: [{ id: '0', givenName: null }, { id: '1' }] });
    expect(requests).toHaveLength(2);
  });

  it('posts invitation acceptance to /invitations/accept', async () => {
    let request: Request | undefined;
    const code = 'A'.repeat(43);
    const fetch = async (input: Request) => {
      request = input;
      return Response.json({
        invitationId: 'inv-1',
        kind: 'COMPANY',
        userId: 'u-1',
        companyId: 'c-1',
        roles: ['Member'],
      });
    };
    const module = createC2M2Module({ baseUrl: 'http://ui.test/api/c2-m2', fetch: fetch as unknown as typeof globalThis.fetch });
    const result = await module.acceptInvitation!.execute(code);
    expect(result).toEqual({
      status: 'success',
      data: {
        invitationId: 'inv-1',
        kind: 'COMPANY',
        userId: 'u-1',
        companyId: 'c-1',
        roles: ['Member'],
      },
    });
    expect(request?.method).toBe('POST');
    expect(new URL(request!.url).pathname).toBe('/api/c2-m2/invitations/accept');
    expect(await request!.json()).toEqual({ code });
  });
});
