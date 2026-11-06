/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import { describe, expect, it } from 'vitest';
import { GetCompanyAppRolesUseCase, GetCompanyUserUseCase, SetUserAppRolesUseCase } from './index';
import { COMPANY_APP_ROLES, COMPANY_USERS, InMemoryCompanyUserRepository } from './testing';

const app = COMPANY_APP_ROLES[0];
const user = COMPANY_USERS[0];
describe('company app roles', () => {
  it('reads localized roles, replaces them on every target and removes them with an empty list', async () => {
    const secondClient = { appInstanceClientId: 'second', iamClientId: 'second' };
    const repo = new InMemoryCompanyUserRepository(COMPANY_USERS, null, [user.companyId], [{ ...app, instanceClients: [...app.instanceClients, secondClient] }]);
    const get = new GetCompanyAppRolesUseCase(repo);
    const set = new SetUserAppRolesUseCase(repo);
    expect(await get.execute(user.companyId, app.appId, 'de')).toMatchObject({ status: 'success', data: { roles: [{ description: 'Beispieldaten lesen' }, { description: 'Beispieldaten bearbeiten' }] } });
    expect(await set.execute(user.companyId, user.userId, app.appId, ['Reader'])).toMatchObject({ status: 'success', data: { addedRoles: ['Reader'], removedRoles: [], instanceClients: [app.instanceClients[0], secondClient] } });
    expect(await new GetCompanyUserUseCase(repo).execute(user.companyId, user.userId)).toMatchObject({ data: { appRoles: [{ roles: ['Reader'] }, { roles: ['Reader'] }] } });
    expect(await set.execute(user.companyId, user.userId, app.appId, ['Writer'])).toMatchObject({ data: { addedRoles: ['Writer'], removedRoles: ['Reader'] } });
    expect(await set.execute(user.companyId, user.userId, app.appId, [])).toMatchObject({ data: { roles: [], removedRoles: ['Writer'] } });
    expect(await set.execute('other', user.userId, app.appId, [])).toEqual({ status: 'not-found' });
    expect(await set.execute(user.companyId, user.userId, app.appId, ['Unknown'])).toMatchObject({ status: 'failed', error: { problemType: 'urn:c2-m2:problem:unknown-app-role' } });
  });
  it('rejects assignment when there are no active target clients', async () => {
    const repo = new InMemoryCompanyUserRepository(COMPANY_USERS, null, [user.companyId], [{ ...app, assignable: false, instanceClients: [] }]);
    expect(await new SetUserAppRolesUseCase(repo).execute(user.companyId, user.userId, app.appId, [])).toMatchObject({ status: 'conflict', error: { problemType: 'urn:c2-m2:problem:no-active-subscription' } });
  });
  it('rejects disabled users and missing templates', async () => {
    const repo = new InMemoryCompanyUserRepository([{ ...user, status: 'DISABLED' }], null, [user.companyId], [app]);
    expect(await new SetUserAppRolesUseCase(repo).execute(user.companyId, user.userId, app.appId, [])).toMatchObject({ status: 'conflict', error: { problemType: 'urn:c2-m2:problem:invalid-state' } });
    const noTemplate = new InMemoryCompanyUserRepository(COMPANY_USERS, null, [user.companyId], [{ ...app, templateExists: false }]);
    expect(await new GetCompanyAppRolesUseCase(noTemplate).execute(user.companyId, app.appId)).toEqual({ status: 'not-found' });
    expect(await new SetUserAppRolesUseCase(noTemplate).execute(user.companyId, user.userId, app.appId, [])).toMatchObject({ status: 'conflict', error: { problemType: 'urn:c2-m2:problem:template-missing' } });
  });
});
