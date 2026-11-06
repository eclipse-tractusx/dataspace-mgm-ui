/********************************************************************************
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The AI-generated portions
 * are made available under CC0-1.0. The human contributor has reviewed it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra
 ********************************************************************************/

import type { ListCompanyUsersUseCase } from "../application/useCases/list-company-users.use-case";
import type { GetCompanyUserUseCase } from "../application/useCases/get-company-user.use-case";
import type { SetCompanyUserPortalRolesUseCase } from "../application/useCases/set-company-user-portal-roles.use-case";
import type { RemoveCompanyUserUseCase } from "../application/useCases/remove-company-user.use-case";
import type { ListInvitationsUseCase } from '../application/useCases/list-invitations.use-case';
import type { CreateInvitationUseCase } from '../application/useCases/create-invitation.use-case';
import type { RevokeInvitationUseCase } from '../application/useCases/revoke-invitation.use-case';
import type { AcceptInvitationUseCase } from '../application/useCases/accept-invitation.use-case';
import type { GetCompanyAppRolesUseCase } from '../application/useCases/get-company-app-roles.use-case';
import type { SetUserAppRolesUseCase } from '../application/useCases/set-user-app-roles.use-case';

export interface C2M2Module {
  listCompanyUsers: ListCompanyUsersUseCase;
  getCompanyUser: GetCompanyUserUseCase;
  setCompanyUserPortalRoles: SetCompanyUserPortalRolesUseCase;
  removeCompanyUser: RemoveCompanyUserUseCase;
  listInvitations: ListInvitationsUseCase;
  createInvitation: CreateInvitationUseCase;
  revokeInvitation: RevokeInvitationUseCase;
  acceptInvitation?: AcceptInvitationUseCase;
  getCompanyAppRoles: GetCompanyAppRolesUseCase;
  setUserAppRoles: SetUserAppRolesUseCase;
}
