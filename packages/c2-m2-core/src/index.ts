/********************************************************************************
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The AI-generated portions
 * are made available under CC0-1.0. The human contributor has reviewed it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra
 ********************************************************************************/

import { createCoreClient, type CoreModuleConfig } from '@dataspace-mgm/core-http';
import type { paths } from './generated/c2-m2-api';
import type { C2M2Module } from './data/c2-m2-module.data';
import { C2M2HttpRepository } from './infrastructure/repositories/c2-m2-http.repository';
import { InvitationHttpRepository } from './infrastructure/repositories/invitation-http.repository';
import { ListCompanyUsersUseCase } from './application/useCases/list-company-users.use-case';
import { GetCompanyUserUseCase } from './application/useCases/get-company-user.use-case';
import { SetCompanyUserPortalRolesUseCase } from './application/useCases/set-company-user-portal-roles.use-case';
import { RemoveCompanyUserUseCase } from './application/useCases/remove-company-user.use-case';
import { ListInvitationsUseCase } from './application/useCases/list-invitations.use-case';
import { CreateInvitationUseCase } from './application/useCases/create-invitation.use-case';
import { RevokeInvitationUseCase } from './application/useCases/revoke-invitation.use-case';
import { AcceptInvitationUseCase } from './application/useCases/accept-invitation.use-case';
import { AcceptInvitationWithMandateUseCase } from './application/useCases/accept-invitation-with-mandate.use-case';
import type { MandateStepOptions } from './infrastructure/data/mandate-step.data';
import { MandateAttestationBffRepository } from './infrastructure/repositories/mandate-attestation-bff.repository';
import { GetCompanyAppRolesUseCase } from './application/useCases/get-company-app-roles.use-case';
import { SetUserAppRolesUseCase } from './application/useCases/set-user-app-roles.use-case';

/**
 * Creates the module once per app (composition root); `config.baseUrl` is the module's base URL. `wallet` places the
 * wallet step of the BFF (`/ebw/**`); by default the BFF is the origin of the portal.
 */
export function createC2M2Module(config: CoreModuleConfig, wallet: Partial<MandateStepOptions> = {}): C2M2Module {
  const client = createCoreClient<paths>(config);
  const users = new C2M2HttpRepository(client);
  const invitations = new InvitationHttpRepository(client);
  const mandates = new MandateAttestationBffRepository({
    bffBaseUrl: '',
    getCsrfToken: config.getCsrfToken,
    onUnauthorized: config.onUnauthorized,
    fetch: config.fetch,
    ...wallet,
  });
  return {
    listCompanyUsers: new ListCompanyUsersUseCase(users),
    getCompanyUser: new GetCompanyUserUseCase(users),
    setCompanyUserPortalRoles: new SetCompanyUserPortalRolesUseCase(users),
    removeCompanyUser: new RemoveCompanyUserUseCase(users),
    listInvitations: new ListInvitationsUseCase(invitations),
    createInvitation: new CreateInvitationUseCase(invitations),
    revokeInvitation: new RevokeInvitationUseCase(invitations),
    acceptInvitation: new AcceptInvitationUseCase(invitations),
    acceptInvitationWithMandate: new AcceptInvitationWithMandateUseCase(invitations, mandates),
    getCompanyAppRoles: new GetCompanyAppRolesUseCase(users),
    setUserAppRoles: new SetUserAppRolesUseCase(users),
  };
}

export const C2_M2_BASE_PATH = "/app-access";
export type { CompanyUserAnemic } from "./domain/anemics/company-user.anemic";
export type { CompanyUserDetailAnemic } from "./domain/anemics/company-user-detail.anemic";
export type { CompanyUserRepository } from "./domain/repositories/company-user.repository";
export type { OperationResult } from "./domain/data/operation-result.data";
export { ListCompanyUsersUseCase } from "./application/useCases/list-company-users.use-case";
export { GetCompanyUserUseCase } from "./application/useCases/get-company-user.use-case";
export { SetCompanyUserPortalRolesUseCase } from "./application/useCases/set-company-user-portal-roles.use-case";
export { RemoveCompanyUserUseCase } from "./application/useCases/remove-company-user.use-case";
export type { C2M2Module } from "./data/c2-m2-module.data";
export type {
  AcceptInvitationResult,
  Invitation,
  InvitationEndReason,
  InvitationInput,
  InvitationKind,
  InvitationStatus,
  InvitationWithCode,
} from './domain/data/invitation.data';
export type { InvitationRepository } from './domain/repositories/invitation.repository';
export { ListInvitationsUseCase } from './application/useCases/list-invitations.use-case';
export { CreateInvitationUseCase } from './application/useCases/create-invitation.use-case';
export { RevokeInvitationUseCase } from './application/useCases/revoke-invitation.use-case';
export { AcceptInvitationUseCase } from './application/useCases/accept-invitation.use-case';
export { AcceptInvitationWithMandateUseCase } from './application/useCases/accept-invitation-with-mandate.use-case';
export type { MandateJoinRefusal, MandateJoinResult, MandateRefusalCause } from './domain/data/mandate-join.data';
export { MandateNotConfirmedException } from './domain/mandate-not-confirmed.exception';
export type { MandateAttestationRepository } from './domain/repositories/mandate-attestation.repository';
export type { MandateStepOptions } from './infrastructure/data/mandate-step.data';
export type { CompanyAppRoles, AppRolesResult, InstanceClientRef } from './domain/data/company-app-roles.data';
export type { CompanyAppRolesRepository } from './domain/repositories/company-app-roles.repository';
export { GetCompanyAppRolesUseCase } from './application/useCases/get-company-app-roles.use-case';
export { SetUserAppRolesUseCase } from './application/useCases/set-user-app-roles.use-case';
