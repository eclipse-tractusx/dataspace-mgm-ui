/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import { describe, expect, it } from 'vitest';
import { AcceptInvitationUseCase, CreateInvitationUseCase, ListInvitationsUseCase, RevokeInvitationUseCase } from './index';
import { InMemoryInvitationRepository } from './testing';

describe('company invitations', () => {
  it('creates a random one-time code, never lists it, accepts or revokes idempotently', async () => {
    const repo = new InMemoryInvitationRepository(['company'], ['Company Admin', 'IT Admin', 'Member'], 'user-max');
    const create = new CreateInvitationUseCase(repo);
    const list = new ListInvitationsUseCase(repo);
    const revoke = new RevokeInvitationUseCase(repo);
    const accept = new AcceptInvitationUseCase(repo);
    const input = { givenName: 'Alex', familyName: 'Example', portalRoles: ['Member'] };
    const first = await create.execute('company', input);
    const second = await create.execute('company', input);
    if (first.status !== 'success' || second.status !== 'success') { throw new Error('Expected success'); }
    expect(first.data.code).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(first.data.code).not.toBe(second.data.code);
    const listed = await list.execute('company');
    expect(JSON.stringify(listed)).not.toContain(first.data.code);
    expect(listed).toMatchObject({ status: 'success', data: [{ id: second.data.id }, { id: first.data.id }] });
    expect(await revoke.execute('other', first.data.id)).toEqual({ status: 'not-found' });
    expect(await revoke.execute('company', first.data.id)).toEqual({ status: 'success', data: true });
    expect(await revoke.execute('company', first.data.id)).toEqual({ status: 'success', data: true });
    expect(await accept.execute(first.data.code)).toMatchObject({ status: 'conflict' });
    expect(await accept.execute(second.data.code)).toEqual({
      status: 'success',
      data: {
        invitationId: second.data.id,
        kind: 'COMPANY',
        userId: 'user-max',
        companyId: 'company',
        roles: ['Member'],
      },
    });
    expect(await accept.execute(second.data.code)).toEqual({
      status: 'success',
      data: {
        invitationId: second.data.id,
        kind: 'COMPANY',
        userId: 'user-max',
        companyId: 'company',
        roles: ['Member'],
      },
    });
    expect(await list.execute('company')).toMatchObject({ data: [] });
  });
  it('rejects empty roles, invalid codes, and unknown companies', async () => {
    const repo = new InMemoryInvitationRepository(['company']);
    const create = new CreateInvitationUseCase(repo);
    const accept = new AcceptInvitationUseCase(repo);
    expect(await create.execute('missing', { givenName: 'A', familyName: 'B', portalRoles: ['Member'] })).toEqual({ status: 'not-found' });
    expect(await create.execute('company', { givenName: 'A', familyName: 'B', portalRoles: [] })).toMatchObject({ status: 'failed' });
    expect(await create.execute('company', { givenName: 'A', familyName: 'B', portalRoles: ['Unknown'] })).toMatchObject({ status: 'failed' });
    expect(await accept.execute('short')).toMatchObject({ status: 'failed' });
    expect(await accept.execute('A'.repeat(43))).toEqual({ status: 'not-found' });
  });
});
