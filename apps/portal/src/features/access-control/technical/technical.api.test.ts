/* Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra */
import { describe, expect, it, vi } from 'vitest';
import { createMockCoreModules } from '../../../core/mock-container';
import { createAppStore } from '../state/store';
import { technicalApi } from './technical.api';

describe('technical users queries', () => {
  it('lists the signed-in company fixtures and loads a detail through core', async () => {
    const modules = createMockCoreModules();
    const session = await modules.identity.getCurrentSession.execute();
    expect(session?.companyId).toBeTruthy();
    const companyId = session!.companyId!;
    const store = createAppStore(modules);
    const list = store.dispatch(technicalApi.endpoints.listTechnicalUsers.initiate({ companyId, filters: {} }));
    const result = await list.unwrap();
    expect(result.status).toBe('success');
    if (result.status !== 'success') { throw new Error('Expected users'); }
    expect(result.data.items).toHaveLength(3);
    const detail = store.dispatch(technicalApi.endpoints.getTechnicalUser.initiate({ companyId, id: result.data.items[0].id }));
    expect((await detail.unwrap()).status).toBe('success');
    list.unsubscribe();
    detail.unsubscribe();
    store.dispatch(technicalApi.util.resetApiState());
  });
  it('runs create, edit, rotation and deletion through core', async () => {
    const modules = createMockCoreModules();
    const session = await modules.identity.getCurrentSession.execute();
    const companyId = session!.companyId!;
    const store = createAppStore(modules);
    const roles = await store.dispatch(technicalApi.endpoints.listAssignableTechnicalRoles.initiate({ companyId, lang: 'en' })).unwrap();
    expect(roles.status).toBe('success');
    const onCredentials = vi.fn();
    const created = await store.dispatch(technicalApi.endpoints.createTechnicalUser.initiate({ companyId, input: { name: 'Example', roles: [{ name: 'Dataspace Discovery' }] }, onCredentials })).unwrap();
    expect(created.status).toBe('success');
    if (created.status !== 'success') { throw new Error('Expected created user'); }
    expect(onCredentials).toHaveBeenCalledWith(expect.objectContaining({ iamClientId: 'sa100', secret: expect.any(String) }));
    const id = created.data.user.id;
    expect(await store.dispatch(technicalApi.endpoints.updateTechnicalUser.initiate({ companyId, id, input: { name: 'Changed' } })).unwrap()).toMatchObject({ status: 'success', data: { name: 'Changed' } });
    expect(await store.dispatch(technicalApi.endpoints.rotateTechnicalCredentials.initiate({ companyId, id, onCredentials })).unwrap()).toEqual({ status: 'success', data: {} });
    expect(await store.dispatch(technicalApi.endpoints.deleteTechnicalUser.initiate({ companyId, id })).unwrap()).toEqual({ status: 'success', data: { status: 'deleted' } });
    expect(await store.dispatch(technicalApi.endpoints.getTechnicalUser.initiate({ companyId, id }, { forceRefetch: true })).unwrap()).toEqual({ status: 'not-found' });
    store.dispatch(technicalApi.util.resetApiState());
  });
  it('delivers one-time credentials without putting them in mutation results or Redux', async () => {
    const modules = createMockCoreModules();
    const session = await modules.identity.getCurrentSession.execute();
    const companyId = session!.companyId!;
    const credentials = { iamClientId: 'client', secret: crypto.randomUUID(), tokenUrl: 'https://example.test/token' };
    const create = modules.c2m3!.createTechnicalUser.execute.bind(modules.c2m3!.createTechnicalUser);
    vi.spyOn(modules.c2m3!.createTechnicalUser, 'execute').mockImplementation(async (...args) => {
      const result = await create(...args);
      return result.status === 'success' ? { ...result, data: { ...result.data, credentials } } : result;
    });
    vi.spyOn(modules.c2m3!.rotateCredentials, 'execute').mockResolvedValue({ status: 'success', data: { credentials } });
    const store = createAppStore(modules);
    const onCredentials = vi.fn();
    const result = await store.dispatch(technicalApi.endpoints.createTechnicalUser.initiate({ companyId, input: { name: 'Example', roles: [{ name: 'Dataspace Discovery' }] }, onCredentials })).unwrap();
    expect(result.status).toBe('success');
    expect(onCredentials).toHaveBeenCalledWith(credentials);
    expect(JSON.stringify(result)).not.toContain(credentials.secret);
    expect(JSON.stringify(store.getState())).not.toContain(credentials.secret);
    onCredentials.mockClear();
    const rotated = await store.dispatch(technicalApi.endpoints.rotateTechnicalCredentials.initiate({ companyId, id: 'id', onCredentials })).unwrap();
    expect(onCredentials).toHaveBeenCalledWith(credentials);
    expect(JSON.stringify(rotated)).not.toContain(credentials.secret);
    expect(JSON.stringify(store.getState())).not.toContain(credentials.secret);
    store.dispatch(technicalApi.util.resetApiState());
  });
});
