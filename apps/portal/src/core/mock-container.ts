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
 * to the project's license. The human contributor has reviewed and verified
 * that the code is correct.
 *
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: Claude Code (claude-opus-5-5)
 ********************************************************************************/

import {
  createMockC1M2Module,
  ERIKA_SESSION,
  HANS_SESSION,
  LIESCHEN_SESSION,
  MAX_SESSION,
  OTTO_SESSION,
  ROLF_SESSION,
} from '@dataspace-mgm/c1-m2-core/testing';
import { createInMemoryC3M1Module } from '@dataspace-mgm/c3-m1-core/testing';
import { CSP_REGISTRATIONS, InMemoryCspRegistrationRepository } from '@dataspace-mgm/c3-m2-core/testing';
import { GetCspRegistrationUseCase } from '@dataspace-mgm/c3-m2-core';
import { createC11M1ModuleFrom } from '@dataspace-mgm/c11-m1-core';
import { InMemoryInboxEventSource, InMemoryNotificationRepository, MOCK_INBOX } from '@dataspace-mgm/c11-m1-core/testing';
import {
  AcceptInvitationUseCase,
  CreateInvitationUseCase,
  GetCompanyAppRolesUseCase,
  GetCompanyUserUseCase,
  ListCompanyUsersUseCase,
  ListInvitationsUseCase,
  RemoveCompanyUserUseCase,
  RevokeInvitationUseCase,
  SetCompanyUserPortalRolesUseCase,
  SetUserAppRolesUseCase,
} from '@dataspace-mgm/c2-m2-core';
import { InMemoryCompanyUserRepository, InMemoryInvitationRepository, COMPANY_USERS, COMPANY_APP_ROLES } from '@dataspace-mgm/c2-m2-core/testing';
import { ListTechnicalUsersUseCase, GetTechnicalUserUseCase, ListAssignableRolesUseCase, CreateTechnicalUserUseCase, UpdateTechnicalUserUseCase, RotateCredentialsUseCase, DeleteTechnicalUserUseCase } from '@dataspace-mgm/c2-m3-core';
import { InMemoryTechnicalUserRepository, TECHNICAL_USERS, FIXTURE_COMPANY_ID } from '@dataspace-mgm/c2-m3-core/testing';
import { C4M1_TEST_COMPANY_IDS, COMPANY_CREDENTIALS, createInMemoryC4M1Module } from '@dataspace-mgm/c4-m1-core/testing';
import { createInMemoryC4M2Module } from '@dataspace-mgm/c4-m2-core/testing';
import { createIdentityModule, type RedirectPort, type SessionAnemic, type SessionRepository } from '@dataspace-mgm/identity-core';
import { InMemorySessionRepository, PIA_SESSION } from '@dataspace-mgm/identity-core/testing';
import type { CoreModules } from './container';
import { C3_MOCK_PERSONS } from './mock-persons';

/** The person signed in when VITE_MOCK_PERSON is not set. */
export const DEFAULT_MOCK_PERSON = 'pia';

/** The same person in two features: the permission keys of both, the company binding of the participant management. */
const both = (onboarding: SessionAnemic, participants: SessionAnemic): SessionAnemic => ({
  ...participants,
  permissions: [...new Set([...onboarding.permissions, ...participants.permissions])],
});
export const MOCK_PERSON_KEY = 'portal.mock.person';
export const MOCK_LOGIN_PATH = '/mock-eudi-sign-in';
export const LOGIN_MODE_KEY = 'portal.login.mode';
export const LOGIN_SPEC_RESPONSE_KEY = 'portal.login.specResponse';

export type LoginMode = 'normal' | 'eudi';

/** Wire response format of GET /me derived from C2-M5 PersonAccessTokenClaims. */
export interface SpecMeResponse {
  id: string;
  name: string;
  username: string;
  company_id: string | null;
  bpn: string | null;
  permissions: readonly string[];
  csrf_token: string;
}

const APPLICANT_PERMISSIONS = ['register_company', 'accept_invitation', 'view_notifications'] as const;
const MEMBER_PERMISSIONS = [...APPLICANT_PERMISSIONS, 'view_company', 'view_app_roles', 'view_marketplace'] as const;
const IT_ADMIN_PERMISSIONS = [
  ...MEMBER_PERMISSIONS,
  'view_company_users',
  'view_technical_users',
  'manage_technical_users',
  'delete_technical_users',
  'view_credentials',
  'view_dataspace_wallet',
  'retrieve_wallet_credentials',
  'view_connectors',
  'manage_connectors',
  'view_subscriptions',
] as const;
const COMPANY_ADMIN_PERMISSIONS = [
  ...IT_ADMIN_PERMISSIONS,
  'edit_company',
  'edit_company_roles',
  'manage_company_users',
  'assign_app_roles',
  'manage_subscriptions',
  'view_offers',
  'manage_offers',
] as const;
const OSP_REVIEWER_PERMISSIONS = [
  ...APPLICANT_PERMISSIONS,
  'view_applications',
  'view_reviews',
  'review_application',
  'view_companies',
  'review_company_changes',
  'view_users',
  'view_all_technical_users',
] as const;
const OSP_ADMIN_PERMISSIONS = [
  ...APPLICANT_PERMISSIONS,
  'view_applications',
  'manage_agreements',
  'view_reviews',
  'view_companies',
  'manage_companies',
  'review_company_changes',
  'view_users',
  'manage_users',
  'manage_osp_staff',
  'view_all_technical_users',
  'view_csp_registration',
  'manage_credentials',
  'approve_offers',
  'view_processes',
  'retrigger_process_steps',
] as const;

export const SPEC_ME_RESPONSES: Readonly<Record<string, SpecMeResponse>> = {
  pia: {
    id: PIA_SESSION.user.id,
    name: PIA_SESSION.user.name,
    username: PIA_SESSION.user.username,
    company_id: PIA_SESSION.companyId,
    bpn: PIA_SESSION.bpn,
    permissions: COMPANY_ADMIN_PERMISSIONS,
    csrf_token: PIA_SESSION.csrfToken ?? 'csrf-test',
  },
  erika: {
    id: '5a1c0001-0000-4000-8000-000000000001',
    name: 'Erika Mustermann',
    username: 'erika',
    company_id: FIXTURE_COMPANY_ID,
    bpn: 'BPNL00000003AYRE',
    permissions: COMPANY_ADMIN_PERMISSIONS,
    csrf_token: 'csrf-test',
  },
  max: {
    id: '5a1c0002-0000-4000-8000-000000000002',
    name: 'Max Mustermann',
    username: 'max',
    company_id: null,
    bpn: null,
    permissions: APPLICANT_PERMISSIONS,
    csrf_token: 'csrf-test',
  },
  hans: {
    id: '5a1c0003-0000-4000-8000-000000000003',
    name: 'Hans Beispiel',
    username: 'hans',
    company_id: null,
    bpn: null,
    permissions: APPLICANT_PERMISSIONS,
    csrf_token: 'csrf-test',
  },
  lieschen: {
    id: '5a1c0004-0000-4000-8000-000000000004',
    name: 'Lieschen Müller',
    username: 'lieschen',
    company_id: null,
    bpn: null,
    permissions: APPLICANT_PERMISSIONS,
    csrf_token: 'csrf-test',
  },
  otto: {
    id: '5a1c0012-0000-4000-8000-000000000012',
    name: 'Otto Normalverbraucher',
    username: 'otto',
    company_id: null,
    bpn: null,
    permissions: OSP_ADMIN_PERMISSIONS,
    csrf_token: 'csrf-test',
  },
  rolf: {
    id: 'bbede0f3-fbc4-433b-b7ca-1982e8724912',
    name: 'Rolf Prüfer',
    username: 'rolf',
    company_id: null,
    bpn: null,
    permissions: OSP_REVIEWER_PERMISSIONS,
    csrf_token: 'csrf-test',
  },
  renate: {
    id: 'ed9d901d-cdc3-4a86-8ab4-0b477318506c',
    name: 'Renate Prüfer',
    username: 'renate',
    company_id: null,
    bpn: null,
    permissions: OSP_REVIEWER_PERMISSIONS,
    csrf_token: 'csrf-test',
  },
};

function toSessionAnemic(dto: SpecMeResponse): SessionAnemic {
  return {
    user: { id: dto.id, name: dto.name, username: dto.username },
    companyId: dto.company_id,
    bpn: dto.bpn,
    permissions: [...dto.permissions],
    csrfToken: dto.csrf_token,
  };
}

export function getLoginMode(defaultMode: LoginMode = import.meta.env.VITE_USE_MOCKS === 'true' ? 'eudi' : 'normal'): LoginMode {
  const stored = window.sessionStorage.getItem(LOGIN_MODE_KEY);
  return stored === 'normal' || stored === 'eudi' ? stored : defaultMode;
}

export function setLoginMode(mode: LoginMode): void {
  window.sessionStorage.setItem(LOGIN_MODE_KEY, mode);
}

export function isSpecLoginResponseEnabled(): boolean {
  return window.sessionStorage.getItem(LOGIN_SPEC_RESPONSE_KEY) === 'true';
}

export function setSpecLoginResponseEnabled(enabled: boolean): void {
  window.sessionStorage.setItem(LOGIN_SPEC_RESPONSE_KEY, enabled ? 'true' : 'false');
}

export function buildBackendLoginUrl(returnTo: string, person?: string, bffBaseUrl = ''): string {
  const params = new URLSearchParams();
  if (person) {
    params.set('person', person);
  }
  params.set('return_to', returnTo);
  return `${bffBaseUrl}/auth/login?${params.toString()}`;
}

/** An in-memory session that remembers a sign-out across reloads (the selected person becomes `none`). */
function persistentSessionRepository(session: SessionAnemic | null): SessionRepository {
  return new (class extends InMemorySessionRepository {
    public override async logout(): Promise<void> {
      await super.logout();
      window.sessionStorage.setItem(MOCK_PERSON_KEY, 'none');
    }
  })(session);
}

export function createSpecSessionRepository(defaultPerson: string = DEFAULT_MOCK_PERSON): SessionRepository {
  const selectedPerson = window.sessionStorage.getItem(MOCK_PERSON_KEY) ?? defaultPerson;
  const dto = SPEC_ME_RESPONSES[selectedPerson] ?? null;
  return persistentSessionRepository(dto ? toSessionAnemic(dto) : null);
}

/** Redirects either to the BFF `/auth/login` or to the EUDI Wallet sign-in view depending on the active login mode. */
export class ConfigurableRedirect implements RedirectPort {
  constructor(
    private readonly bffBaseUrl = '',
    private readonly defaultMode: LoginMode = import.meta.env.VITE_USE_MOCKS === 'true' ? 'eudi' : 'normal',
  ) {}

  public toLogin(returnTo: string): void {
    if (getLoginMode(this.defaultMode) === 'normal' && !isSpecLoginResponseEnabled()) {
      const selected = window.sessionStorage.getItem(MOCK_PERSON_KEY);
      const person = selected && selected !== 'none' ? selected : undefined;
      window.location.assign(buildBackendLoginUrl(returnTo, person, this.bffBaseUrl));
      return;
    }
    window.location.assign(`${MOCK_LOGIN_PATH}?returnTo=${encodeURIComponent(returnTo)}`);
  }
}

/**
 * The test persons of mock mode, by their key in test data or a feature-specific alias. VITE_MOCK_PERSON picks one; a
 * key that is not here (e.g. `none`) starts signed out. Add a person when a page needs other permissions.
 * Pia is the Company Admin of OSP A with the permission keys of the spec's /me response (SPEC_ME_RESPONSES).
 * Erika, Max and Hans are applicants (C1-M2 Registration); `erika-c3`, `max-c3`, `hans-c3` are the same persons after
 * onboarding, bound to their companies (participant management, C3-M1); `wallets-*` are the persons of C4-M1.
 */
export const MOCK_PERSONS: Readonly<Record<string, SessionAnemic>> = {
  pia: toSessionAnemic(SPEC_ME_RESPONSES.pia),
  /** Applicants without a company (C1-M2 Registration): Erika (EBW), Max, Hans (DOCUMENTS), Lieschen. */
  erika: ERIKA_SESSION,
  max: MAX_SESSION,
  hans: HANS_SESSION,
  lieschen: LIESCHEN_SESSION,
  /** OSP staff: Rolf is OSP Reviewer, Otto OSP Admin (and Company Admin of the OSP company); Renate a second reviewer. */
  rolf: both(ROLF_SESSION, C3_MOCK_PERSONS.rolf),
  otto: both(OTTO_SESSION, C3_MOCK_PERSONS.otto),
  renate: C3_MOCK_PERSONS.renate,
  /** People of an onboarded company (C3-M1): Erika and Hans Company Admin, Max Member. */
  'erika-c3': C3_MOCK_PERSONS.erika,
  'max-c3': C3_MOCK_PERSONS.max,
  'hans-c3': C3_MOCK_PERSONS.hans,
  /**
   * Test persons of Wallets as a service (C4-M1, C4-M2), kept separate where C1-M2 uses the same names for different
   * identities. Erika Mustermann is Company Admin of Beispiel Maschinenbau GmbH (FRAMEWORK 7a; C4-M1 test person P1):
   * her credentials (C4-M1), the dataspace wallet and the retrieval of the access data of wallet accounts (C4-M2).
   */
  'wallets-erika': {
    user: { id: '5a1c0001-0000-4000-8000-000000000001', name: 'Erika Mustermann', username: 'erika' },
    companyId: 'c0000001-0000-4000-8000-000000000001',
    bpn: 'BPNLIUK2REMLK3F4',
    permissions: ['view_credentials', 'view_dataspace_wallet', 'retrieve_wallet_credentials'],
    csrfToken: 'csrf-test',
  },
  'wallets-max': {
    user: { id: '5a1c0002-0000-4000-8000-000000000002', name: 'Max Mustermann', username: 'max' },
    companyId: 'c0000001-0000-4000-8000-000000000001',
    bpn: 'BPNLIUK2REMLK3F4',
    permissions: [],
    csrfToken: 'csrf-test',
  },
  'wallets-otto': {
    user: { id: '5a1c0012-0000-4000-8000-000000000012', name: 'Otto Normalverbraucher', username: 'otto' },
    companyId: null,
    bpn: null,
    permissions: ['manage_credentials'],
    csrfToken: 'csrf-test',
  },
  'wallets-rolf': {
    user: { id: 'bbede0f3-fbc4-433b-b7ca-1982e8724912', name: 'Rolf Prüfer', username: 'rolf' },
    companyId: null,
    bpn: null,
    permissions: [],
    csrfToken: 'csrf-test',
  },
};

/**
 * The core packages on in-memory adapters with the fixtures of their `testing` entry points.
 * main.tsx loads this file in mock mode (`VITE_USE_MOCKS=true`).
 */
export function createMockCoreModules(person: string = DEFAULT_MOCK_PERSON): CoreModules {
  const selectedPerson = window.sessionStorage.getItem(MOCK_PERSON_KEY) ?? person;
  const session = MOCK_PERSONS[selectedPerson] ?? null;
  const companyId = session?.companyId ?? FIXTURE_COMPANY_ID;
  const companyUsers = new InMemoryCompanyUserRepository(
    COMPANY_USERS.map((user) => ({ ...user, companyId })), null, [companyId],
    COMPANY_APP_ROLES.map((app) => ({ ...app, companyId })),
  );
  const invitations = new InMemoryInvitationRepository([companyId], undefined, session?.user.id);
  const repository = new InMemoryTechnicalUserRepository(TECHNICAL_USERS.map((user) => ({
    ...user,
    companyId: user.companyId === FIXTURE_COMPANY_ID ? companyId : user.companyId,
    coViewerCompanyId: user.coViewerCompanyId === FIXTURE_COMPANY_ID ? companyId : user.coViewerCompanyId,
  })));
  return {
    identity: createIdentityModule({
      bffBaseUrl: '',
      sessions: persistentSessionRepository(session),
      redirect: new ConfigurableRedirect('', 'eudi'),
    }),
    // C3-M1 and C3-M2 on fixtures (the mockup's data). The rules stay the modules': mock mode shows success paths only.
    c3m1: createInMemoryC3M1Module({ actorId: session?.user.id }).module,
    c3m2: { getCspRegistration: new GetCspRegistrationUseCase(new InMemoryCspRegistrationRepository(CSP_REGISTRATIONS)) },
    c1m2: createMockC1M2Module(session),
    c2m2: {
      listCompanyUsers: new ListCompanyUsersUseCase(companyUsers),
      getCompanyUser: new GetCompanyUserUseCase(companyUsers),
      setCompanyUserPortalRoles: new SetCompanyUserPortalRolesUseCase(companyUsers),
      removeCompanyUser: new RemoveCompanyUserUseCase(companyUsers),
      listInvitations: new ListInvitationsUseCase(invitations),
      createInvitation: new CreateInvitationUseCase(invitations),
      revokeInvitation: new RevokeInvitationUseCase(invitations),
      acceptInvitation: new AcceptInvitationUseCase(invitations),
      getCompanyAppRoles: new GetCompanyAppRolesUseCase(companyUsers),
      setUserAppRoles: new SetUserAppRolesUseCase(companyUsers),
    },
    c2m3: {
      listTechnicalUsers: new ListTechnicalUsersUseCase(repository),
      getTechnicalUser: new GetTechnicalUserUseCase(repository),
      listAssignableRoles: new ListAssignableRolesUseCase(repository),
      createTechnicalUser: new CreateTechnicalUserUseCase(repository),
      updateTechnicalUser: new UpdateTechnicalUserUseCase(repository),
      rotateCredentials: new RotateCredentialsUseCase(repository),
      deleteTechnicalUser: new DeleteTechnicalUserUseCase(repository),
    },
    // Proof of concept: the fixtures of mockups/wallets/. Beispiel Maschinenbau GmbH holds the credentials of Catena-X
    // and of a second dataspace (state two-dataspaces), so the logo slot of the passes shows two dataspaces.
    c4m1: createInMemoryC4M1Module({
      companyCredentials: { [C4M1_TEST_COMPANY_IDS.beispielMaschinenbau]: COMPANY_CREDENTIALS.twoDataspaces },
    }),
    c11m1: createC11M1ModuleFrom(new InMemoryNotificationRepository(session ? MOCK_INBOX : []), new InMemoryInboxEventSource()),
    // Proof of concept: the dataspace wallet of the CSP and the wallet accounts of sa201 (access data ready to retrieve
    // once) and sa202 (retrieved), from mockups/wallets/shared/data.js.
    c4m2: createInMemoryC4M2Module(),
  };
}
