/* Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra */
import type { TechnicalUserRepository } from '../repositories/technical-user.repository';
import type { AssignableRole, Credentials, TechnicalUser, TechnicalUserCreate, TechnicalUserFilters, TechnicalUserUpdate } from '../data/technical-user.data';
import type { DeleteOutcome } from '../data/result.data';
import { CoreHttpException } from '@dataspace-mgm/core-http';

export const FIXTURE_COMPANY_ID = 'c0000001-0000-4000-8000-000000000001';
const DEFAULT_TOKEN_URL = 'https://iam.osp-a.example.org/auth/realms/CX-Central/protocol/openid-connect/token';
export const ASSIGNABLE_ROLES: readonly AssignableRole[] = [
  { name: 'Dataspace Discovery', grantsWalletAccess: false, providerOnly: false },
  { name: 'Identity Wallet Management', grantsWalletAccess: true, providerOnly: false },
  { name: 'Semantic Model Management', grantsWalletAccess: false, providerOnly: false },
];
export const TECHNICAL_USERS: readonly TechnicalUser[] = [
  { id: '00000000-0000-4000-8000-000000000001', companyId: FIXTURE_COMPANY_ID, name: 'Dataspace Discovery', iamClientId: 'sa123', status: 'ACTIVE', walletAccess: 'NONE', origin: 'OWN', viewerRole: 'OWNER', disabled: false, description: '', authMethod: 'SECRET', roles: [{ name: 'Dataspace Discovery' }] },
  { id: '00000000-0000-4000-8000-000000000002', companyId: FIXTURE_COMPANY_ID, name: 'Wallet access', iamClientId: 'sa124', status: 'PENDING', walletAccess: 'REQUESTED', origin: 'OWN', viewerRole: 'OWNER', disabled: false, description: '', authMethod: 'SECRET', roles: [{ name: 'Identity Wallet Management' }] },
  { id: '00000000-0000-4000-8000-000000000003', companyId: 'c0000002-0000-4000-8000-000000000002', coViewerCompanyId: FIXTURE_COMPANY_ID, name: 'Subscription account', iamClientId: 'sa125', status: 'ACTIVE', walletAccess: 'ACTIVE', origin: 'SUBSCRIPTION', viewerRole: 'CO_VIEWER', disabled: false, description: '', authMethod: 'SECRET', roles: [{ name: 'Dataspace Discovery' }, { name: 'Identity Wallet Management' }] },
];

export class InMemoryTechnicalUserRepository implements TechnicalUserRepository {
  private users: TechnicalUser[];
  private sequence = 100;
  readonly calls: { method: string; args: readonly unknown[] }[] = [];
  constructor(users: readonly TechnicalUser[] = TECHNICAL_USERS, private readonly failure?: unknown, private readonly roles: readonly AssignableRole[] = ASSIGNABLE_ROLES) { this.users = structuredClone([...users]); }
  private record(method: string, ...args: unknown[]) { this.calls.push({ method, args }); if (this.failure !== undefined) { throw this.failure; } }
  private find(companyId: string, id: string) { return this.users.find((user) => user.id === id && (user.companyId === companyId || user.coViewerCompanyId === companyId)); }
  async listTechnicalUsers(companyId: string, filters: TechnicalUserFilters = {}) {
    this.record('listTechnicalUsers', companyId, filters);
    const statuses = filters.status ?? ['ACTIVE', 'PENDING', 'PENDING_DELETION'];
    const items = this.users.filter((u) => (u.companyId === companyId || u.coViewerCompanyId === companyId) && statuses.includes(u.status) && (!filters.origin || filters.origin === u.origin) && (!filters.walletAccess || filters.walletAccess === u.walletAccess));
    const page = filters.page ?? 0, size = filters.size ?? 20;
    return { items: items.slice(page * size, (page + 1) * size).map((u) => ({ id: u.id, companyId: u.companyId, name: u.name, description: u.description, origin: u.origin, viewerRole: u.viewerRole, status: u.status, iamClientId: u.iamClientId, walletAccess: u.walletAccess, disabled: u.disabled, createdAt: u.createdAt, changedAt: u.changedAt, offerSubscriptionId: u.offerSubscriptionId, subscriptionParty: u.subscriptionParty, coViewerCompanyId: u.coViewerCompanyId })), page, size, total: items.length };
  }
  async getTechnicalUser(companyId: string, id: string) { this.record('getTechnicalUser', companyId, id); return structuredClone(this.find(companyId, id) ?? null); }
  async listAssignableRoles(companyId: string, lang?: string) { this.record('listAssignableRoles', companyId, lang); return structuredClone(this.roles); }
  private createCredentials(iamClientId: string): Credentials {
    const bytes = crypto.getRandomValues(new Uint8Array(24));
    const secret = btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return { iamClientId, secret, tokenUrl: DEFAULT_TOKEN_URL };
  }
  async createTechnicalUser(companyId: string, input: TechnicalUserCreate) {
    this.record('createTechnicalUser', companyId, input);
    if (input.roles.length === 0) { throw new CoreHttpException(400, 'urn:c2-m3:problem:validation', 'At least one role is required'); }
    const wallet = input.roles.some((role) => this.roles.some((r) => r.name === role.name && r.grantsWalletAccess));
    const number = this.sequence++;
    const iamClientId = `sa${number}`;
    const user: TechnicalUser = { id: `00000000-0000-4000-8000-${String(number).padStart(12, '0')}`, companyId, name: input.name, description: input.description, roles: structuredClone(input.roles), authMethod: 'SECRET', iamClientId, origin: 'OWN', viewerRole: 'OWNER', status: wallet ? 'PENDING' : 'ACTIVE', walletAccess: wallet ? 'REQUESTED' : 'NONE', disabled: false };
    this.users.unshift(user);
    return { user: structuredClone(user), credentials: this.createCredentials(iamClientId) };
  }
  async updateTechnicalUser(companyId: string, id: string, input: TechnicalUserUpdate) {
    this.record('updateTechnicalUser', companyId, id, input);
    const user = this.find(companyId, id);
    if (!user) { return null; }
    if (user.companyId !== companyId) { throw new CoreHttpException(403, 'urn:c2-m3:problem:not-owner', 'Only the owner can update a technical user'); }
    if (input.roles) {
      if (input.roles.length === 0) { throw new CoreHttpException(400, 'urn:c2-m3:problem:validation', 'At least one role is required'); }
      const walletRoles = new Set(this.roles.filter((role) => role.grantsWalletAccess).map((role) => role.name));
      const before = new Set(user.roles.filter((role) => walletRoles.has(role.name)).map((role) => role.name));
      const after = new Set(input.roles.filter((role) => walletRoles.has(role.name)).map((role) => role.name));
      if (before.size !== after.size || [...before].some((role) => !after.has(role))) {
        throw new CoreHttpException(409, 'urn:c2-m3:problem:wallet-role-unchangeable', 'Wallet roles cannot be changed');
      }
    }
    const updated = { ...user, ...structuredClone(input) };
    this.users = this.users.map((item) => item.id === id ? updated : item);
    return structuredClone(updated);
  }
  async rotateCredentials(companyId: string, id: string) {
    this.record('rotateCredentials', companyId, id);
    const user = this.find(companyId, id);
    if (!user) { return undefined; }
    if (user.companyId !== companyId) { throw new CoreHttpException(403, 'urn:c2-m3:problem:not-owner', 'Only the owner can rotate credentials'); }
    return this.createCredentials(user.iamClientId);
  }
  async deleteTechnicalUser(companyId: string, id: string): Promise<DeleteOutcome | null> {
    this.record('deleteTechnicalUser', companyId, id);
    const user = this.find(companyId, id);
    if (!user) { return null; }
    if (user.walletAccess === 'ACTIVE') {
      const pending: TechnicalUser = { ...user, status: 'PENDING_DELETION', walletAccess: 'REMOVING' };
      this.users = this.users.map((item) => item.id === id ? pending : item);
      return { status: 'pending', user: structuredClone(pending) };
    }
    this.users = this.users.filter((item) => item.id !== id);
    return { status: 'deleted' };
  }
}
