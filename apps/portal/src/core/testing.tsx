/********************************************************************************
 * Copyright (c) 2026 Catena-X Automotive Network e.V.
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

import type { ReactNode } from 'react';
import { GetOwnCompanyUseCase, type CompanyAnemic } from '@dataspace-mgm/c3-m1-core';
import { InMemoryCompanyRepository } from '@dataspace-mgm/c3-m1-core/testing';
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
import { COMPANY_APP_ROLES, COMPANY_USERS, InMemoryCompanyUserRepository, InMemoryInvitationRepository } from '@dataspace-mgm/c2-m2-core/testing';
import {
  CreateTechnicalUserUseCase,
  DeleteTechnicalUserUseCase,
  GetTechnicalUserUseCase,
  ListAssignableRolesUseCase,
  ListTechnicalUsersUseCase,
  RotateCredentialsUseCase,
  UpdateTechnicalUserUseCase,
} from '@dataspace-mgm/c2-m3-core';
import { FIXTURE_COMPANY_ID, InMemoryTechnicalUserRepository, TECHNICAL_USERS } from '@dataspace-mgm/c2-m3-core/testing';
import { createIdentityModule, type SessionAnemic } from '@dataspace-mgm/identity-core';
import { InMemorySessionRepository, RecordingRedirect } from '@dataspace-mgm/identity-core/testing';
import { CoreModulesProvider } from './CoreModulesContext';
import type { CoreModules } from './container';

interface TestModulesOptions {
  session?: SessionAnemic | null;
  companies?: ReadonlyArray<CompanyAnemic>;
  companyFailure?: Error;
}

/** The core packages with in-memory adapters: pages are tested against the use cases, without HTTP. */
export function testCoreModules({ session = null, companies = [], companyFailure }: TestModulesOptions = {}) {
  const redirect = new RecordingRedirect();
  const companyRepository = new InMemoryCompanyRepository(companies, companyFailure ?? null);
  const companyId = session?.companyId ?? FIXTURE_COMPANY_ID;
  const companyUsers = new InMemoryCompanyUserRepository(
    COMPANY_USERS.map((user) => ({ ...user, companyId })),
    null,
    [companyId],
    COMPANY_APP_ROLES.map((app) => ({ ...app, companyId })),
  );
  const invitations = new InMemoryInvitationRepository([companyId], undefined, session?.user.id);
  const technicalUsers = new InMemoryTechnicalUserRepository(
    TECHNICAL_USERS.map((user) => ({
      ...user,
      companyId: user.companyId === FIXTURE_COMPANY_ID ? companyId : user.companyId,
      coViewerCompanyId: user.coViewerCompanyId === FIXTURE_COMPANY_ID ? companyId : user.coViewerCompanyId,
    })),
  );
  const modules: CoreModules = {
    identity: createIdentityModule({ bffBaseUrl: '', sessions: new InMemorySessionRepository(session), redirect }),
    c3m1: { getOwnCompany: new GetOwnCompanyUseCase(companyRepository) },
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
      listTechnicalUsers: new ListTechnicalUsersUseCase(technicalUsers),
      getTechnicalUser: new GetTechnicalUserUseCase(technicalUsers),
      listAssignableRoles: new ListAssignableRolesUseCase(technicalUsers),
      createTechnicalUser: new CreateTechnicalUserUseCase(technicalUsers),
      updateTechnicalUser: new UpdateTechnicalUserUseCase(technicalUsers),
      rotateCredentials: new RotateCredentialsUseCase(technicalUsers),
      deleteTechnicalUser: new DeleteTechnicalUserUseCase(technicalUsers),
    },
  };
  return { modules, redirect, companyRepository, companyUsers, invitations, technicalUsers };
}

export function TestCoreModules({ modules, children }: { modules?: CoreModules; children: ReactNode }) {
  return <CoreModulesProvider modules={modules ?? testCoreModules().modules}>{children}</CoreModulesProvider>;
}
