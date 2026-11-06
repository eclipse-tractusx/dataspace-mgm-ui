/* Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra */
import { createCoreClient } from '@dataspace-mgm/core-http';
import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import type { paths } from '../../generated/c2-m3-api';
import { TechnicalUserHttpRepository } from './technical-user-http.repository';

const user = { id: 'user', companyId: 'company', name: 'Account', origin: 'OWN', status: 'ACTIVE', iamClientId: 'client', walletAccess: 'NONE', disabled: false, viewerRole: 'OWNER', authMethod: 'SECRET', roles: [{ name: 'role' }] };
const credentials = { iamClientId: 'client', secret: randomUUID(), tokenUrl: 'https://example.test/token' };
function setup(status: number, body?: unknown) {
  const requests: Request[] = [];
  const fetch = async (request: Request) => {
    requests.push(request);
    return new Response(status === 204 ? null : JSON.stringify(body), { status, headers: { 'content-type': status >= 400 ? 'application/problem+json' : 'application/json' } });
  };
  return { requests, repository: new TechnicalUserHttpRepository(createCoreClient<paths>({ baseUrl: 'http://ui.test/api/c2-m3', fetch: fetch as unknown as typeof globalThis.fetch })) };
}
describe('TechnicalUserHttpRepository', () => {
  it('lists with repeated status filters and maps the page', async () => {
    const { repository, requests } = setup(200, { items: [user], page: 0, size: 20, total: 1 });
    expect((await repository.listTechnicalUsers('company', { status: ['ACTIVE', 'PENDING'] })).total).toBe(1);
    const url = new URL(requests[0].url);
    expect(url.pathname).toBe('/api/c2-m3/companies/company/technical-users');
    expect(url.searchParams.getAll('status')).toEqual(['ACTIVE', 'PENDING']);
  });
  it('creates with wire roles and returns credentials separately', async () => {
    const { repository, requests } = setup(201, { ...user, credentials });
    expect(await repository.createTechnicalUser('company', { name: 'Account', roles: [{ name: 'role' }] })).toEqual({ user, credentials });
    expect(requests[0].method).toBe('POST');
    expect(await requests[0].json()).toEqual({ name: 'Account', roles: [{ name: 'role' }] });
  });
  it('supports detail, roles, update and one-time rotation', async () => {
    const detail = setup(200, user);
    expect(await detail.repository.getTechnicalUser('company', 'user')).toEqual(user);
    expect(await detail.repository.updateTechnicalUser('company', 'user', { roles: [{ name: 'role' }] })).toEqual(user);
    expect(detail.requests[1].method).toBe('PATCH');
    expect(await detail.requests[1].json()).toEqual({ roles: [{ name: 'role' }] });
    const roles = setup(200, [{ name: 'role', grantsWalletAccess: false, providerOnly: false }]);
    expect(await roles.repository.listAssignableRoles('company', 'en')).toHaveLength(1);
    expect(new URL(roles.requests[0].url).searchParams.get('lang')).toBe('en');
    const rotation = setup(200, credentials);
    expect(await rotation.repository.rotateCredentials('company', 'user')).toEqual(credentials);
    expect(new URL(rotation.requests[0].url).pathname).toBe('/api/c2-m3/companies/company/technical-users/user/credentials/rotate');
  });
  it('distinguishes immediate and pending deletion', async () => {
    expect(await setup(204).repository.deleteTechnicalUser('company', 'user')).toEqual({ status: 'deleted' });
    expect(await setup(202, user).repository.deleteTechnicalUser('company', 'user')).toEqual({ status: 'pending', user });
  });
  it('maps missing records and preserves other Problem Details', async () => {
    const missing = setup(404, { type: 'urn:c2-m3:problem:not-found', title: 'missing', status: 404 });
    expect(await missing.repository.getTechnicalUser('company', 'user')).toBeNull();
    expect(await missing.repository.rotateCredentials('company', 'user')).toBeUndefined();
    const failed = setup(400, { type: 'urn:c2-m3:problem:invalid', title: 'invalid', status: 400 });
    await expect(failed.repository.listTechnicalUsers('company')).rejects.toMatchObject({ status: 400, problemType: 'urn:c2-m3:problem:invalid' });
  });
});
