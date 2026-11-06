/********************************************************************************
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The AI-generated portions
 * are made available under CC0-1.0. The human contributor has reviewed it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra
 ********************************************************************************/

import type { CompanyUserDetailAnemic } from "../anemics/company-user-detail.anemic";
import type { CompanyUserAnemic } from "../anemics/company-user.anemic";
import type { CompanyUserRepository } from "../repositories/company-user.repository";
import { CoreHttpException } from "@dataspace-mgm/core-http";
import type { CompanyAppRoles } from '../data/company-app-roles.data';
import type { CompanyAppRolesRepository } from '../repositories/company-app-roles.repository';

export class InMemoryCompanyUserRepository implements CompanyUserRepository, CompanyAppRolesRepository {
  public readonly calls: Array<{
    operation: string;
    companyId: string;
    userId?: string;
  }> = [];
  private users: CompanyUserDetailAnemic[];
  constructor(
    users: readonly CompanyUserDetailAnemic[] = [],
    private readonly failure: Error | null = null,
    private readonly companyIds: readonly string[] = [
      ...new Set(users.map((u) => u.companyId)),
    ],
    private readonly apps: readonly CompanyAppRoles[] = [],
  ) {
    this.users = structuredClone([...users]);
  }
  private check(operation: string, companyId: string, userId?: string): void {
    this.calls.push({ operation, companyId, userId });
    if (this.failure) {
      throw this.failure;
    }
  }
  private checkLastAdmin(user: CompanyUserDetailAnemic): void {
    if (user.status === "ACTIVE" && user.portalRoles.includes("Company Admin") &&
      this.users.filter((candidate) => candidate.companyId === user.companyId && candidate.status === "ACTIVE" && candidate.portalRoles.includes("Company Admin")).length === 1) {
      throw new CoreHttpException(409, "urn:c2-m2:problem:last-company-admin", "Last Company Admin");
    }
  }
  public async listCompanyUsers(
    companyId: string,
    options?: {
      status?: readonly CompanyUserAnemic["status"][];
      page?: number;
      size?: number;
    },
  ) {
    this.check("listCompanyUsers", companyId);
    if (!this.companyIds.includes(companyId)) {
      return null;
    }
    const page = options?.page ?? 0;
    const size = options?.size ?? 20;
    const statuses = options?.status ?? ["ACTIVE", "DISABLED"];
    const filtered = this.users
      .filter((u) => u.companyId === companyId && statuses.includes(u.status))
      .sort(
        (a, b) =>
          (a.familyName ?? "").localeCompare(b.familyName ?? "") ||
          (a.givenName ?? "").localeCompare(b.givenName ?? ""),
      );
    return {
      items: structuredClone(filtered.slice(page * size, (page + 1) * size)),
      page,
      size,
      total: filtered.length,
    };
  }
  public async getCompanyUser(companyId: string, userId: string) {
    this.check("getCompanyUser", companyId, userId);
    return structuredClone(
      this.users.find(
        (u) =>
          u.companyId === companyId &&
          u.userId === userId &&
          u.status !== "REMOVED",
      ) ?? null,
    );
  }
  public async setCompanyUserPortalRoles(
    companyId: string,
    userId: string,
    roles: readonly string[],
  ) {
    this.check("setCompanyUserPortalRoles", companyId, userId);
    const index = this.users.findIndex(
      (u) =>
        u.companyId === companyId &&
        u.userId === userId &&
        u.status !== "REMOVED",
    );
    if (index < 0) {
      return null;
    }
    if (!roles.includes("Company Admin")) {
      this.checkLastAdmin(this.users[index]);
    }
    this.users[index] = { ...this.users[index], portalRoles: [...roles] };
    return structuredClone(this.users[index]);
  }
  public async removeCompanyUser(companyId: string, userId: string) {
    this.check("removeCompanyUser", companyId, userId);
    const index = this.users.findIndex(
      (u) => u.companyId === companyId && u.userId === userId,
    );
    if (index < 0) {
      return false;
    }
    this.checkLastAdmin(this.users[index]);
    this.users[index] = {
      ...this.users[index],
      status: "REMOVED",
      givenName: null,
      familyName: null,
      portalRoles: [],
      appRoles: [],
    };
    return true;
  }
  public async getCompanyAppRoles(companyId: string, appId: string, lang = 'en') {
    this.check('getCompanyAppRoles', companyId);
    const app = this.apps.find((item) => item.companyId === companyId && item.appId === appId);
    if (!app || !app.templateExists || !this.companyIds.includes(companyId)) { return null; }
    return structuredClone({ ...app, roles: [...app.roles].sort((a, b) => a.name.localeCompare(b.name)).map((role) => ({ ...role, description: role.descriptions.find((item) => item.lang === lang)?.text ?? role.descriptions.find((item) => item.lang === 'en')?.text ?? role.descriptions[0]?.text ?? null })) });
  }
  public async setUserAppRoles(companyId: string, userId: string, appId: string, roles: readonly string[]) {
    this.check('setUserAppRoles', companyId, userId);
    const index = this.users.findIndex((user) => user.companyId === companyId && user.userId === userId && user.status !== 'REMOVED');
    const app = this.apps.find((item) => item.companyId === companyId && item.appId === appId);
    if (index < 0 || !app) { return null; }
    if (this.users[index].status === 'DISABLED') { throw new CoreHttpException(409, 'urn:c2-m2:problem:invalid-state', 'User disabled'); }
    if (!app.templateExists) { throw new CoreHttpException(409, 'urn:c2-m2:problem:template-missing', 'Template missing'); }
    if (new Set(roles).size !== roles.length) {
      throw new CoreHttpException(400, 'urn:c2-m2:problem:validation', 'Invalid app roles');
    }
    if (roles.some((role) => !app.roles.some((candidate) => candidate.name === role))) { throw new CoreHttpException(400, 'urn:c2-m2:problem:unknown-app-role', 'Unknown app role'); }
    if (!app.assignable || !app.instanceClients.length) {
      throw new CoreHttpException(409, 'urn:c2-m2:problem:no-active-subscription', 'No active subscription');
    }
    const current = this.users[index];
    const targetIds = new Set(app.instanceClients.map((client) => client.appInstanceClientId));
    const existing = current.appRoles.filter((item) => item.appId === appId && targetIds.has(item.appInstanceClientId));
    const addedRoles = roles.filter((role) => app.instanceClients.some((client) => !existing.find((item) => item.appInstanceClientId === client.appInstanceClientId)?.roles.includes(role)));
    const removedRoles = [...new Set(existing.flatMap((item) => item.roles.filter((role) => !roles.includes(role))))];
    const appRoles = [...current.appRoles.filter((item) => item.appId !== appId || !targetIds.has(item.appInstanceClientId)), ...app.instanceClients.map((client) => ({ ...client, appId, instanceClientStatus: 'ACTIVE' as const, roles: [...roles] }))];
    this.users[index] = { ...current, appRoles };
    return structuredClone({ userId, appId, roles: [...roles], addedRoles, removedRoles, instanceClients: app.instanceClients });
  }
}

/** Synthetic mock data; replace companyId with the mock session's company. */
export const COMPANY_APP_ROLES: readonly CompanyAppRoles[] = [{
  companyId: 'c0000001-0000-4000-8000-000000000001', appId: 'a0000001-0000-4000-8000-000000000001', templateExists: true, assignable: true,
  roles: [
    { name: 'Reader', description: 'Read example data', descriptions: [{ lang: 'en', text: 'Read example data' }, { lang: 'de', text: 'Beispieldaten lesen' }] },
    { name: 'Writer', description: 'Edit example data', descriptions: [{ lang: 'en', text: 'Edit example data' }, { lang: 'de', text: 'Beispieldaten bearbeiten' }] },
  ],
  instanceClients: [{ appInstanceClientId: 'b0000001-0000-4000-8000-000000000001', iamClientId: 'app-example-01' }],
}];

/** Fallback bindings from the decided mockup. createdAt is illustrative, not supplied by the mockup. */
export const COMPANY_USERS: readonly CompanyUserDetailAnemic[] = [
  {
    userId: "5a1c0001-0000-4000-8000-000000000001",
    companyId: "c0000001-0000-4000-8000-000000000001",
    givenName: "Erika",
    familyName: "Mustermann",
    status: "ACTIVE",
    joinedVia: "ONBOARDING",
    portalRoles: ["Company Admin"],
    createdAt: "2026-11-06T00:00:00Z",
    appRoles: [],
  },
  {
    userId: "5a1c0002-0000-4000-8000-000000000002",
    companyId: "c0000001-0000-4000-8000-000000000001",
    givenName: "Max",
    familyName: "Mustermann",
    status: "ACTIVE",
    joinedVia: "INVITATION",
    portalRoles: ["Member"],
    createdAt: "2026-11-06T00:00:00Z",
    appRoles: [],
  },
];
