/* Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra */
import { describe, expect, it } from 'vitest';
import { InMemoryTechnicalUserRepository, FIXTURE_COMPANY_ID, TECHNICAL_USERS } from '../../domain/testing/in-memory-technical-user.repository';
import { ListTechnicalUsersUseCase, GetTechnicalUserUseCase, ListAssignableRolesUseCase, CreateTechnicalUserUseCase, UpdateTechnicalUserUseCase, RotateCredentialsUseCase, DeleteTechnicalUserUseCase } from './technical-users.use-case';

describe('technical user use cases', () => {
  it('lists filtered summaries, pages, and roles', async () => {
    const repo = new InMemoryTechnicalUserRepository();
    expect(await new ListTechnicalUsersUseCase(repo).execute(FIXTURE_COMPANY_ID, { origin: 'SUBSCRIPTION' })).toMatchObject({ status: 'success', data: { total: 1, items: [{ iamClientId: 'sa125' }] } });
    expect(await new ListAssignableRolesUseCase(repo).execute(FIXTURE_COMPANY_ID, 'en')).toMatchObject({ status: 'success', data: expect.arrayContaining([{ name: 'Dataspace Discovery', grantsWalletAccess: false, providerOnly: false }]) });
    const list = await repo.listTechnicalUsers(FIXTURE_COMPANY_ID, { page: 1, size: 1 });
    expect(list.items).toHaveLength(1);
    expect(list.items[0]).not.toHaveProperty('roles');
  });
  it('gets, updates, rotates, and deletes without retaining credentials', async () => {
    const repo = new InMemoryTechnicalUserRepository();
    const id = TECHNICAL_USERS[0].id;
    expect(await new GetTechnicalUserUseCase(repo).execute(FIXTURE_COMPANY_ID, id)).toMatchObject({ status: 'success', data: { id } });
    expect(await new UpdateTechnicalUserUseCase(repo).execute(FIXTURE_COMPANY_ID, id, { name: 'Updated' })).toMatchObject({ status: 'success', data: { name: 'Updated' } });
    expect(await new RotateCredentialsUseCase(repo).execute(FIXTURE_COMPANY_ID, id)).toMatchObject({ status: 'success', data: { credentials: { iamClientId: 'sa123', secret: expect.any(String), tokenUrl: expect.stringContaining('/protocol/openid-connect/token') } } });
    expect(await new DeleteTechnicalUserUseCase(repo).execute(FIXTURE_COMPANY_ID, id)).toEqual({ status: 'success', data: { status: 'deleted' } });
    expect(await new GetTechnicalUserUseCase(repo).execute(FIXTURE_COMPANY_ID, id)).toEqual({ status: 'not-found' });
    expect(await new RotateCredentialsUseCase(repo).execute(FIXTURE_COMPANY_ID, id)).toEqual({ status: 'not-found' });
    expect(await new UpdateTechnicalUserUseCase(repo).execute(FIXTURE_COMPANY_ID, id, {})).toEqual({ status: 'not-found' });
    expect(await new DeleteTechnicalUserUseCase(repo).execute(FIXTURE_COMPANY_ID, id)).toEqual({ status: 'not-found' });
  });
  it('creates a wallet account and models asynchronous deletion', async () => {
    const repo = new InMemoryTechnicalUserRepository();
    expect(await new CreateTechnicalUserUseCase(repo).execute(FIXTURE_COMPANY_ID, { name: 'New', roles: [{ name: 'Identity Wallet Management' }] })).toMatchObject({ status: 'success', data: { user: { status: 'PENDING', walletAccess: 'REQUESTED', iamClientId: 'sa100' }, credentials: { iamClientId: 'sa100', secret: expect.any(String) } } });
    expect(await new DeleteTechnicalUserUseCase(repo).execute(FIXTURE_COMPANY_ID, TECHNICAL_USERS[2].id)).toMatchObject({ status: 'success', data: { status: 'pending', user: { status: 'PENDING_DELETION', walletAccess: 'REMOVING' } } });
  });
  it('allows a co-viewer to delete but not update or rotate', async () => {
    const repo = new InMemoryTechnicalUserRepository();
    const id = TECHNICAL_USERS[2].id;
    expect(await new UpdateTechnicalUserUseCase(repo).execute(FIXTURE_COMPANY_ID, id, { name: 'Changed' })).toEqual({ status: 'forbidden' });
    expect(await new RotateCredentialsUseCase(repo).execute(FIXTURE_COMPANY_ID, id)).toEqual({ status: 'forbidden' });
    expect(await new GetTechnicalUserUseCase(repo).execute(FIXTURE_COMPANY_ID, id)).toMatchObject({ status: 'success', data: { name: TECHNICAL_USERS[2].name } });
    expect(await new DeleteTechnicalUserUseCase(repo).execute(FIXTURE_COMPANY_ID, id)).toMatchObject({ status: 'success', data: { status: 'pending' } });
  });
  it('requires roles and rejects changes to wallet roles without mutating the user', async () => {
    const repo = new InMemoryTechnicalUserRepository();
    const create = new CreateTechnicalUserUseCase(repo);
    const update = new UpdateTechnicalUserUseCase(repo);
    const get = new GetTechnicalUserUseCase(repo);
    const noRoles = await create.execute(FIXTURE_COMPANY_ID, { name: 'Example', roles: [] });
    expect(noRoles).toMatchObject({ status: 'failed', error: { status: 400 } });
    const id = TECHNICAL_USERS[0].id;
    expect(await update.execute(FIXTURE_COMPANY_ID, id, { roles: [] })).toMatchObject({ status: 'failed', error: { status: 400 } });
    expect(await update.execute(FIXTURE_COMPANY_ID, id, { roles: [{ name: 'Dataspace Discovery' }, { name: 'Identity Wallet Management' }] })).toEqual({ status: 'conflict' });
    expect(await get.execute(FIXTURE_COMPANY_ID, id)).toMatchObject({ status: 'success', data: { roles: [{ name: 'Dataspace Discovery' }] } });
    const walletId = TECHNICAL_USERS[1].id;
    expect(await update.execute(FIXTURE_COMPANY_ID, walletId, { roles: [{ name: 'Dataspace Discovery' }] })).toEqual({ status: 'conflict' });
    expect(await update.execute(FIXTURE_COMPANY_ID, walletId, { roles: [{ name: 'Identity Wallet Management' }, { name: 'Dataspace Discovery' }] })).toMatchObject({ status: 'success' });
  });
  it('returns failures instead of throwing', async () => {
    const repo = new InMemoryTechnicalUserRepository([], new Error('offline'));
    const cases = [new ListTechnicalUsersUseCase(repo).execute(FIXTURE_COMPANY_ID), new GetTechnicalUserUseCase(repo).execute(FIXTURE_COMPANY_ID, 'x'), new ListAssignableRolesUseCase(repo).execute(FIXTURE_COMPANY_ID), new CreateTechnicalUserUseCase(repo).execute(FIXTURE_COMPANY_ID, { name: 'x', roles: [] }), new UpdateTechnicalUserUseCase(repo).execute(FIXTURE_COMPANY_ID, 'x', {}), new RotateCredentialsUseCase(repo).execute(FIXTURE_COMPANY_ID, 'x'), new DeleteTechnicalUserUseCase(repo).execute(FIXTURE_COMPANY_ID, 'x')];
    expect((await Promise.all(cases)).every((result) => result.status === 'failed')).toBe(true);
  });
});
